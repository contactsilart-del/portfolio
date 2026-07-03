import { list } from "@vercel/blob";
import donneesLocales from "./images.json";
import { manifestVide, type ImagesManifest } from "./images";

function normalise(raw: Partial<ImagesManifest> | null | undefined): ImagesManifest {
  return { slots: raw?.slots ?? {}, galeries: raw?.galeries ?? {} };
}

/**
 * Lit le manifeste des images.
 * - Avec Vercel Blob configuré (BLOB_READ_WRITE_TOKEN) : lecture depuis le Blob,
 *   avec cache Next taggé "images-manifest" — invalidé par le panel admin à
 *   chaque modification, donc mise à jour instantanée du site.
 * - Sans Blob (dev local sans token) : fallback sur app/data/images.json.
 */
export async function getImagesManifest(): Promise<ImagesManifest> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "manifest.json", limit: 1 });
      if (blobs.length === 0) return manifestVide;
      // ?v=… : contourne le cache CDN du Blob à chaque régénération
      const res = await fetch(`${blobs[0].url}?v=${Date.now()}`, {
        next: { tags: ["images-manifest"] },
      });
      if (res.ok) return normalise(await res.json());
    } catch {
      // Blob momentanément inaccessible : site sans images plutôt que erreur
    }
    return manifestVide;
  }
  return normalise(donneesLocales as Partial<ImagesManifest>);
}
