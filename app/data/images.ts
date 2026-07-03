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

export function slotImage(manifest: ImagesManifest, id: string): string | null {
  return manifest.slots[id] ?? null;
}

export function galerieImages(manifest: ImagesManifest, slug: string): string[] {
  return manifest.galeries[slug] ?? [];
}
