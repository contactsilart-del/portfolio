import { NextResponse } from "next/server";
import { normaliseManifest } from "@/app/data/images";
import {
  CHEMIN_MANIFEST,
  DOSSIER_IMAGES,
  ERREUR_GITHUB,
  checkAuth,
  cheminRepoImage,
  lireManifest,
} from "../admin-utils";
import { commitFichiers, githubConfigured, type FichierCommit } from "../github-utils";

const EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"]);
// Corps de requête limité à 4,5 Mo par Vercel ; le panel compresse en WebP
// avant l'envoi et découpe en lots, donc on reste très en dessous
const MAX_BASE64 = 4 * 1024 * 1024;

type FichierRecu = { nom?: string; ext?: string; donneesBase64?: string };

/**
 * Publie une ou plusieurs images : UN commit GitHub contenant les fichiers
 * (public/images/…) + le manifeste mis à jour (app/data/images.json).
 * Vercel redéploie automatiquement (~1 min).
 */
export async function POST(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });
  if (!githubConfigured()) {
    return NextResponse.json({ error: ERREUR_GITHUB }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as {
    fichiers?: FichierRecu[];
    slot?: string;
    galerie?: string;
    base?: unknown;
  } | null;

  const slot = typeof body?.slot === "string" && body.slot ? body.slot : null;
  const galerie = typeof body?.galerie === "string" && body.galerie ? body.galerie : null;
  if (!body || (!slot && !galerie)) {
    return NextResponse.json({ error: "Cible manquante (slot ou galerie)." }, { status: 400 });
  }
  const fichiers = Array.isArray(body.fichiers) ? body.fichiers : [];
  if (fichiers.length === 0) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  // Validation
  for (const f of fichiers) {
    const ext = (f.ext ?? "").toLowerCase();
    if (!EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Format non supporté (${ext || "sans extension"}).` },
        { status: 400 }
      );
    }
    if (typeof f.donneesBase64 !== "string" || f.donneesBase64.length === 0) {
      return NextResponse.json({ error: "Fichier vide." }, { status: 400 });
    }
    if (f.donneesBase64.length > MAX_BASE64) {
      return NextResponse.json(
        { error: "Fichier trop lourd même compressé (max ~3 Mo)." },
        { status: 400 }
      );
    }
  }

  // Base : l'état courant du panel prime (issu de la dernière réponse serveur)
  const manifest = normaliseManifest(body.base) ?? (await lireManifest());
  const aCommiter: FichierCommit[] = [];

  const prefixe = (slot ?? `galerie-${galerie}`)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  fichiers.forEach((f, i) => {
    const nomFichier = `${prefixe}-${Date.now()}-${i}.${(f.ext as string).toLowerCase()}`;
    const src = `/images/${nomFichier}`;
    aCommiter.push({
      chemin: `${DOSSIER_IMAGES}/${nomFichier}`,
      contenuBase64: f.donneesBase64,
    });
    if (slot) {
      const ancienne = manifest.slots[slot];
      const cheminAncien = ancienne ? cheminRepoImage(ancienne) : null;
      if (cheminAncien) aCommiter.push({ chemin: cheminAncien, supprimer: true });
      manifest.slots[slot] = src;
    } else if (galerie) {
      manifest.galeries[galerie] = [...(manifest.galeries[galerie] ?? []), src];
    }
  });

  aCommiter.push({
    chemin: CHEMIN_MANIFEST,
    contenuTexte: JSON.stringify(manifest, null, 2) + "\n",
  });

  try {
    await commitFichiers(
      `contenu: ${fichiers.length} image(s) — ${slot ?? `galerie ${galerie}`}`,
      aCommiter
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Publication impossible." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, manifest });
}
