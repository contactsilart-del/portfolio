import fs from "fs";
import path from "path";

export const ROOT = process.cwd();
export const MANIFEST_PATH = path.join(ROOT, "app", "data", "images.json");
export const IMAGES_DIR = path.join(ROOT, "public", "images");

export type Manifest = {
  slots: Record<string, string>;
  galeries: Record<string, string[]>;
};

/** Le panel admin n'existe qu'en développement local (jamais sur Vercel). */
export function adminForbidden(): boolean {
  return process.env.NODE_ENV === "production";
}

export function readManifest(): Manifest {
  try {
    const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    return { slots: raw.slots ?? {}, galeries: raw.galeries ?? {} };
  } catch {
    return { slots: {}, galeries: {} };
  }
}

export function writeManifest(m: Manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2) + "\n", "utf8");
}

/** Supprime un fichier uploadé — uniquement à l'intérieur de public/images. */
export function deleteLocalImage(src: string) {
  if (!src.startsWith("/images/")) return;
  const abs = path.join(ROOT, "public", ...src.split("/").filter(Boolean));
  if (!abs.startsWith(IMAGES_DIR)) return;
  try {
    fs.unlinkSync(abs);
  } catch {
    // fichier déjà absent : rien à faire
  }
}
