import crypto from "crypto";
import { del, list, put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { manifestVide, normaliseManifest, type ImagesManifest } from "@/app/data/images";
import { projetsDefaut, type Projet } from "@/app/data/projets";
import { normaliseProjets } from "@/app/data/projets-server";

/**
 * Les données (manifeste images, projets) sont stockées en fichiers
 * VERSIONNÉS : chaque écriture crée un nouveau fichier à l'URL unique
 * (manifest/<timestamp>-<aléa>.json). Jamais de réécriture au même
 * emplacement → jamais de copie périmée servie par le CDN du Blob
 * (l'écrasement d'un même fichier pouvait être caché ~60 s, ce qui
 * faisait « ressusciter » des images supprimées ou perdre des ajouts).
 * Les anciens fichiers racine (manifest.json / projets.json) restent
 * lus en fallback tant qu'aucune version n'existe.
 */
export const MANIFEST_PREFIX = "manifest/";
export const MANIFEST_LEGACY = "manifest.json";
export const PROJETS_PREFIX = "projets/";
export const PROJETS_LEGACY = "projets.json";
const VERSIONS_GARDEES = 4;

/** Régénère toutes les pages qui dépendent des images ou des projets. */
export function revaliderSite() {
  revalidateTag("images-manifest");
  revalidateTag("projets-data");
  revalidatePath("/");
  revalidatePath("/projets/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function configuration() {
  return { password: passwordConfigured(), blob: blobConfigured() };
}

/** Comparaison à temps constant (via hachage pour gérer les longueurs différentes). */
export function verifierMotDePasse(donne: unknown): boolean {
  if (!passwordConfigured() || typeof donne !== "string") return false;
  const attendu = process.env.ADMIN_PASSWORD as string;
  const a = crypto.createHash("sha256").update(donne).digest();
  const b = crypto.createHash("sha256").update(attendu).digest();
  return crypto.timingSafeEqual(a, b);
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
  if (!verifierMotDePasse(req.headers.get("x-admin-password") ?? "")) {
    return { status: 401, error: "Mot de passe incorrect." };
  }
  return null;
}

/** Dernière version d'un document versionné (fallback fichier racine hérité). */
export async function lireDernierJson(prefix: string, legacy: string): Promise<unknown> {
  try {
    const { blobs } = await list({ prefix });
    let cible =
      blobs.length > 0
        ? blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b))
        : null;
    if (!cible) {
      const l = await list({ prefix: legacy, limit: 1 });
      cible = l.blobs[0] ?? null;
    }
    if (!cible) return null;
    const res = await fetch(`${cible.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Écrit une nouvelle version (URL unique) puis purge les plus anciennes. */
export async function ecrireJsonVersionne(prefix: string, data: unknown): Promise<void> {
  // Timestamp 13 chiffres : l'ordre lexicographique = l'ordre chronologique
  const nom = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
  await put(nom, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  try {
    const { blobs } = await list({ prefix });
    const vieux = blobs
      .sort((a, b) => (a.pathname > b.pathname ? -1 : 1))
      .slice(VERSIONS_GARDEES);
    if (vieux.length > 0) await del(vieux.map((b) => b.url));
  } catch {
    // purge ratée : versions orphelines sans impact (re-purgées au prochain écrit)
  }
}

/** Lecture fraîche du manifeste depuis le Blob (sans cache). */
export async function lireManifest(): Promise<ImagesManifest> {
  if (!blobConfigured()) return manifestVide;
  return (
    normaliseManifest(await lireDernierJson(MANIFEST_PREFIX, MANIFEST_LEGACY)) ??
    manifestVide
  );
}

export async function ecrireManifest(m: ImagesManifest): Promise<void> {
  await ecrireJsonVersionne(MANIFEST_PREFIX, m);
}

/** Ne supprime que des fichiers hébergés sur Vercel Blob. */
export function estUrlBlob(src: string): boolean {
  return src.includes(".blob.vercel-storage.com/");
}

/* ── Projets ─────────────────────────────────────────────── */

/**
 * Lecture fraîche des projets depuis le Blob (sans cache).
 * Tant que le panel n'a jamais enregistré, renvoie la liste par défaut
 * (elle sert de base de départ à la première modification).
 */
export async function lireProjets(): Promise<Projet[]> {
  if (!blobConfigured()) return projetsDefaut;
  const raw = await lireDernierJson(PROJETS_PREFIX, PROJETS_LEGACY);
  return raw === null ? projetsDefaut : normaliseProjets(raw) ?? projetsDefaut;
}

export async function ecrireProjets(liste: Projet[]): Promise<void> {
  await ecrireJsonVersionne(PROJETS_PREFIX, { projets: liste });
}

/** Slug URL propre à partir d'un titre : accents retirés, unicité garantie. */
export function genererSlug(titre: string, existants: Set<string>): string {
  const base =
    titre
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "projet";
  let slug = base;
  let i = 2;
  while (existants.has(slug)) slug = `${base}-${i++}`;
  return slug;
}
