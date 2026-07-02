import manifest from "./images.json";

/**
 * Manifeste des images du site, géré via le panel /admin (en dev uniquement).
 * - slots : emplacements uniques ("hero.portrait", "projet.<slug>.cover")
 * - galeries : listes d'images par projet (pages dédiées)
 */
export type ImagesManifest = {
  slots: Record<string, string>;
  galeries: Record<string, string[]>;
};

const data = manifest as ImagesManifest;

export function imageSlot(id: string): string | null {
  return data.slots[id] ?? null;
}

export function galerieProjet(slug: string): string[] {
  return data.galeries[slug] ?? [];
}
