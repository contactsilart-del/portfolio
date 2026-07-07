import projetsJson from "./projets.json";
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
 * Liste des projets du site : app/data/projets.json, versionné dans le dépôt
 * et mis à jour par le panel admin via des commits GitHub (redéploiement auto).
 * Tant que le panel n'a jamais publié (fichier vide), la liste par défaut
 * de app/data/projets.ts fait foi.
 */
export async function getProjets(): Promise<Projet[]> {
  const liste = normaliseProjets(projetsJson);
  return liste && liste.length > 0 ? liste : projetsDefaut;
}
