import crypto from "crypto";
import { list, put } from "@vercel/blob";
import { manifestVide, type ImagesManifest } from "@/app/data/images";

export const MANIFEST_BLOB = "manifest.json";

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function configuration() {
  return { password: passwordConfigured(), blob: blobConfigured() };
}

/**
 * Vérifie le mot de passe admin (en-tête x-admin-password).
 * Retourne null si OK, sinon { status, error }.
 */
export function checkAuth(req: Request): { status: number; error: string } | null {
  if (!passwordConfigured()) {
    return {
      status: 503,
      error:
        "ADMIN_PASSWORD n'est pas configuré. Sur Vercel : Settings → Environment Variables → ajoute ADMIN_PASSWORD, puis redéploie.",
    };
  }
  const donne = req.headers.get("x-admin-password") ?? "";
  const attendu = process.env.ADMIN_PASSWORD as string;
  // Comparaison à temps constant (via hachage pour gérer les longueurs différentes)
  const a = crypto.createHash("sha256").update(donne).digest();
  const b = crypto.createHash("sha256").update(attendu).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return { status: 401, error: "Mot de passe incorrect." };
  }
  return null;
}

/** Lecture fraîche du manifeste depuis le Blob (sans cache). */
export async function lireManifest(): Promise<ImagesManifest> {
  if (!blobConfigured()) return manifestVide;
  try {
    const { blobs } = await list({ prefix: MANIFEST_BLOB, limit: 1 });
    if (blobs.length === 0) return manifestVide;
    const res = await fetch(`${blobs[0].url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return manifestVide;
    const raw = (await res.json()) as Partial<ImagesManifest>;
    return { slots: raw.slots ?? {}, galeries: raw.galeries ?? {} };
  } catch {
    return manifestVide;
  }
}

export async function ecrireManifest(m: ImagesManifest): Promise<void> {
  await put(MANIFEST_BLOB, JSON.stringify(m, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

/** Ne supprime que des fichiers hébergés sur Vercel Blob. */
export function estUrlBlob(src: string): boolean {
  return src.includes(".blob.vercel-storage.com/");
}
