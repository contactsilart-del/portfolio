import { list } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import donneesLocales from "./images.json";
import { manifestVide, normaliseManifest, type ImagesManifest } from "./images";

/**
 * Lecture réelle depuis le Blob : dernière version versionnée
 * (manifest/<timestamp>-….json), fallback sur l'ancien manifest.json racine.
 */
async function lireManifestBlob(): Promise<ImagesManifest> {
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
    const res = await fetch(cible.url, { cache: "no-store" });
    if (res.ok) return normaliseManifest(await res.json()) ?? manifestVide;
  } catch {
    // Blob momentanément inaccessible (ou store suspendu) : site sans images
  }
  return manifestVide;
}

/**
 * Cache partagé pour TOUTES les pages : list() n'est exécuté qu'une seule
 * fois par revalidation (le panel admin invalide le tag à chaque modif),
 * au lieu d'une fois par page rendue. Indispensable sur le plan Hobby :
 * list() est une « opération avancée » limitée à 10 000/mois.
 */
const lireManifestCache = unstable_cache(lireManifestBlob, ["images-manifest"], {
  tags: ["images-manifest"],
});

export async function getImagesManifest(): Promise<ImagesManifest> {
  if (process.env.BLOB_READ_WRITE_TOKEN) return lireManifestCache();
  // Dev local sans token : fallback sur app/data/images.json
  return normaliseManifest(donneesLocales) ?? manifestVide;
}
