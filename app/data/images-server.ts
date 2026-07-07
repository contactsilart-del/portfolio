import { list } from "@vercel/blob";
import donneesLocales from "./images.json";
import { manifestVide, normaliseManifest, type ImagesManifest } from "./images";

/**
 * Lit le manifeste des images.
 * - Avec Vercel Blob configuré : lecture de la DERNIÈRE version
 *   (manifest/<timestamp>-….json — chaque écriture crée un fichier à
 *   l'URL unique, donc jamais de copie périmée du CDN), fallback sur
 *   l'ancien manifest.json racine. Cache Next taggé "images-manifest",
 *   invalidé par le panel admin à chaque modification.
 * - Sans Blob (dev local sans token) : fallback sur app/data/images.json.
 */
export async function getImagesManifest(): Promise<ImagesManifest> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "manifest/" });
      let cible =
        blobs.length > 0
          ? blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b))
          : null;
      if (!cible) {
        const l = await list({ prefix: "manifest.json", limit: 1 });
        cible = l.blobs[0] ?? null;
      }
      if (!cible) return manifestVide;
      // URL unique par version : pas besoin de contournement de cache
      const res = await fetch(cible.url, {
        next: { tags: ["images-manifest"] },
      });
      if (res.ok) return normaliseManifest(await res.json()) ?? manifestVide;
    } catch {
      // Blob momentanément inaccessible : site sans images plutôt que erreur
    }
    return manifestVide;
  }
  return normaliseManifest(donneesLocales) ?? manifestVide;
}
