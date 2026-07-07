/**
 * Stockage du contenu (images + données) directement dans le dépôt GitHub.
 * Chaque modification du panel = un commit → Vercel redéploie (~1 min).
 * Remplace Vercel Blob (quota « opérations avancées » trop serré en Hobby).
 */

const REPO = process.env.GITHUB_REPO ?? "contactsilart-del/portfolio";
const BRANCHE = process.env.GITHUB_BRANCH ?? "main";
const API = "https://api.github.com";

export function githubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function gh(chemin: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}${chemin}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

/** Contenu brut d'un fichier du dépôt à HEAD (null si absent). */
export async function lireFichierRepo(chemin: string): Promise<string | null> {
  const res = await gh(`/repos/${REPO}/contents/${chemin}?ref=${BRANCHE}`, {
    headers: { Accept: "application/vnd.github.raw+json" },
  });
  if (!res.ok) return null;
  return res.text();
}

export type FichierCommit = {
  chemin: string;
  /** Contenu binaire encodé en base64 (images) */
  contenuBase64?: string;
  /** Contenu texte (JSON de données) */
  contenuTexte?: string;
  /** true : le fichier est supprimé du dépôt */
  supprimer?: boolean;
};

/**
 * Crée UN commit contenant toutes les modifications (ajouts, mises à jour,
 * suppressions) via l'API Git bas niveau : blobs → tree → commit → ref.
 * Un seul commit = un seul redéploiement Vercel, même pour 10 images.
 * Réessaie une fois si la branche a avancé entre-temps.
 */
export async function commitFichiers(
  message: string,
  fichiers: FichierCommit[]
): Promise<void> {
  let derniereErreur = "";
  for (let tentative = 0; tentative < 2; tentative++) {
    // 1. Pointe de la branche
    const refRes = await gh(`/repos/${REPO}/git/ref/heads/${BRANCHE}`);
    if (!refRes.ok) {
      throw new Error(
        refRes.status === 401 || refRes.status === 403
          ? "Jeton GitHub invalide ou permissions insuffisantes (Contents : Read and write)."
          : `GitHub : lecture de la branche impossible (${refRes.status}).`
      );
    }
    const headSha = (await refRes.json()).object.sha as string;
    const commitRes = await gh(`/repos/${REPO}/git/commits/${headSha}`);
    if (!commitRes.ok) throw new Error("GitHub : lecture du commit de base impossible.");
    const baseTreeSha = (await commitRes.json()).tree.sha as string;

    // 2. Un blob Git par fichier binaire
    const arbre: Array<{
      path: string;
      mode: "100644";
      type: "blob";
      sha?: string | null;
      content?: string;
    }> = [];
    for (const f of fichiers) {
      if (f.supprimer) {
        arbre.push({ path: f.chemin, mode: "100644", type: "blob", sha: null });
      } else if (typeof f.contenuTexte === "string") {
        arbre.push({ path: f.chemin, mode: "100644", type: "blob", content: f.contenuTexte });
      } else {
        const blobRes = await gh(`/repos/${REPO}/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: f.contenuBase64 ?? "", encoding: "base64" }),
        });
        if (!blobRes.ok) throw new Error(`GitHub : envoi d'un fichier impossible (${blobRes.status}).`);
        arbre.push({
          path: f.chemin,
          mode: "100644",
          type: "blob",
          sha: (await blobRes.json()).sha as string,
        });
      }
    }

    // 3. Nouvel arbre basé sur HEAD
    const treeRes = await gh(`/repos/${REPO}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: baseTreeSha, tree: arbre }),
    });
    if (!treeRes.ok) throw new Error(`GitHub : création de l'arborescence impossible (${treeRes.status}).`);
    const treeSha = (await treeRes.json()).sha as string;

    // 4. Commit
    const nouveauCommitRes = await gh(`/repos/${REPO}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message: `${message}\n\nPublié via le panel admin bysilart.fr/admin`,
        tree: treeSha,
        parents: [headSha],
        author: { name: "Panel admin SILART", email: "contact.silart@gmail.com" },
      }),
    });
    if (!nouveauCommitRes.ok) throw new Error("GitHub : création du commit impossible.");
    const nouveauSha = (await nouveauCommitRes.json()).sha as string;

    // 5. Avance de la branche (échoue si elle a bougé entre-temps → on refait)
    const majRes = await gh(`/repos/${REPO}/git/refs/heads/${BRANCHE}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: nouveauSha, force: false }),
    });
    if (majRes.ok) return;
    derniereErreur = `GitHub : la branche a avancé pendant la publication (${majRes.status}).`;
  }
  throw new Error(derniereErreur || "GitHub : publication impossible.");
}
