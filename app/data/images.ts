/**
 * Manifeste des images du site, géré via le panel /admin.
 * - slots : emplacements uniques ("hero.portrait", "projet.<slug>.cover")
 * - galeries : listes d'images par projet (pages dédiées)
 *
 * Ce module est volontairement « client-safe » (types + helpers purs).
 * La lecture du manifeste (Vercel Blob) est dans images-server.ts.
 */
export type ImagesManifest = {
  slots: Record<string, string>;
  galeries: Record<string, string[]>;
};

export const manifestVide: ImagesManifest = { slots: {}, galeries: {} };

/** Nettoie un manifeste venu de l'extérieur (Blob, panel) ; null si inexploitable. */
export function normaliseManifest(raw: unknown): ImagesManifest | null {
  const m = raw as Partial<ImagesManifest> | null;
  if (!m || typeof m !== "object" || Array.isArray(m)) return null;
  const slots: Record<string, string> = {};
  for (const [k, v] of Object.entries(m.slots ?? {})) {
    if (typeof v === "string" && v) slots[k] = v;
  }
  const galeries: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(m.galeries ?? {})) {
    if (Array.isArray(v)) {
      const propres = v.filter((s): s is string => typeof s === "string" && s.length > 0);
      if (propres.length > 0) galeries[k] = propres;
    }
  }
  return { slots, galeries };
}

export function slotImage(manifest: ImagesManifest, id: string): string | null {
  return manifest.slots[id] ?? null;
}

export function galerieImages(manifest: ImagesManifest, slug: string): string[] {
  return manifest.galeries[slug] ?? [];
}

/**
 * Galerie spéciale « Ils me font confiance » (bande de logos de l'accueil).
 * La clé contient un underscore : impossible à confondre avec un slug de
 * projet (les slugs générés n'en contiennent jamais).
 */
export const GALERIE_LOGOS = "logos_clients";

/** Logos d'exemple (fictifs, dessinés pour le site) affichés tant que
 *  le panel admin n'a aucun logo. */
export const logosClientsDefaut: string[] = [
  "/images/logos/logo-1.svg",
  "/images/logos/logo-2.svg",
  "/images/logos/logo-3.svg",
  "/images/logos/logo-4.svg",
  "/images/logos/logo-5.svg",
  "/images/logos/logo-6.svg",
  "/images/logos/logo-7.svg",
  "/images/logos/logo-8.svg",
];
