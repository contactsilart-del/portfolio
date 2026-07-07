import { list } from "@vercel/blob";
import { projetsDefaut, poles, type Projet } from "./projets";

const polesValides = new Set(poles.map((p) => p.id));

/** Garde uniquement les entrées exploitables (protège le site d'un JSON abîmé). */
export function normaliseProjets(raw: unknown): Projet[] | null {
  const liste = (raw as { projets?: unknown })?.projets;
  if (!Array.isArray(liste)) return null;
  const propres = liste.filter(
    (p): p is Projet =>
      p !== null &&
      typeof p === "object" &&
      typeof (p as Projet).slug === "string" &&
      typeof (p as Projet).titre === "string" &&
      polesValides.has((p as Projet).pole)
  );
  return propres.map((p) => ({
    slug: p.slug,
    titre: p.titre,
    pole: p.pole,
    type: typeof p.type === "string" ? p.type : "",
    resume: typeof p.resume === "string" ? p.resume : "",
    description: Array.isArray(p.description)
      ? p.description.filter((d): d is string => typeof d === "string")
      : [],
    tags: Array.isArray(p.tags)
      ? p.tags.filter((t): t is string => typeof t === "string")
      : [],
    role: typeof p.role === "string" ? p.role : undefined,
    annee: typeof p.annee === "string" ? p.annee : undefined,
    lien: typeof p.lien === "string" ? p.lien : null,
    lienLabel: typeof p.lienLabel === "string" ? p.lienLabel : null,
  }));
}

/**
 * Liste des projets affichée sur le site.
 * - Avec Vercel Blob configuré : lecture de projets.json sur le Blob, cache
 *   Next taggé "projets-data" — invalidé par le panel admin à chaque modif.
 * - Sans Blob (dev local) ou tant que le panel n'a rien enregistré :
 *   fallback sur la liste par défaut de app/data/projets.ts.
 */
export async function getProjets(): Promise<Projet[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      // Dernière version (projets/<timestamp>-….json : URL unique à chaque
      // écriture, donc jamais de copie périmée), fallback projets.json racine
      const { blobs } = await list({ prefix: "projets/" });
      let cible =
        blobs.length > 0
          ? blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b))
          : null;
      if (!cible) {
        const l = await list({ prefix: "projets.json", limit: 1 });
        cible = l.blobs[0] ?? null;
      }
      if (!cible) return projetsDefaut;
      const res = await fetch(cible.url, {
        next: { tags: ["projets-data"] },
      });
      if (res.ok) {
        const propres = normaliseProjets(await res.json());
        if (propres) return propres;
      }
    } catch {
      // Blob momentanément inaccessible : liste par défaut plutôt qu'une erreur
    }
    return projetsDefaut;
  }
  return projetsDefaut;
}
