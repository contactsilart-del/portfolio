import donneesLocales from "./images.json";
import { manifestVide, normaliseManifest, type ImagesManifest } from "./images";

/**
 * Manifeste des images : app/data/images.json, versionné dans le dépôt et
 * mis à jour par le panel admin via des commits GitHub. Importé statiquement,
 * donc figé au build — chaque commit du panel déclenche un redéploiement
 * Vercel (~1 min) qui embarque la nouvelle version. Zéro requête au runtime.
 */
export async function getImagesManifest(): Promise<ImagesManifest> {
  return normaliseManifest(donneesLocales) ?? manifestVide;
}
