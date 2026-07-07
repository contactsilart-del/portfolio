import crypto from "crypto";
import { manifestVide, normaliseManifest, type ImagesManifest } from "@/app/data/images";
import { projetsDefaut, type Projet } from "@/app/data/projets";
import { normaliseProjets } from "@/app/data/projets-server";
import { githubConfigured, lireFichierRepo } from "./github-utils";

/** Chemins des données dans le dépôt (importées statiquement par le site). */
export const CHEMIN_MANIFEST = "app/data/images.json";
export const CHEMIN_PROJETS = "app/data/projets.json";
export const DOSSIER_IMAGES = "public/images";

export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function configuration() {
  return { password: passwordConfigured(), github: githubConfigured() };
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

export const ERREUR_GITHUB =
  "GITHUB_TOKEN n'est pas configuré. Crée un jeton GitHub (Contents : Read and write sur le dépôt portfolio) et ajoute-le dans Vercel → Settings → Environment Variables, puis redéploie.";

/**
 * Manifeste des images à HEAD du dépôt (peut être plus récent que le site
 * déployé : le panel voit toujours la dernière version publiée).
 */
export async function lireManifest(): Promise<ImagesManifest> {
  if (!githubConfigured()) return manifestVide;
  try {
    const brut = await lireFichierRepo(CHEMIN_MANIFEST);
    if (!brut) return manifestVide;
    return normaliseManifest(JSON.parse(brut)) ?? manifestVide;
  } catch {
    return manifestVide;
  }
}

/** Projets à HEAD du dépôt (liste par défaut tant que le panel n'a rien publié). */
export async function lireProjets(): Promise<Projet[]> {
  if (!githubConfigured()) return projetsDefaut;
  try {
    const brut = await lireFichierRepo(CHEMIN_PROJETS);
    if (!brut) return projetsDefaut;
    const liste = normaliseProjets(JSON.parse(brut));
    return liste && liste.length > 0 ? liste : projetsDefaut;
  } catch {
    return projetsDefaut;
  }
}

/** Chemin repo d'une image du site ("/images/x.webp" → "public/images/x.webp"). */
export function cheminRepoImage(src: string): string | null {
  if (!src.startsWith("/images/") || src.includes("..")) return null;
  return `public${src}`;
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
