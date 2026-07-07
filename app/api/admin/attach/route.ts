import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { normaliseManifest } from "@/app/data/images";
import {
  blobConfigured,
  checkAuth,
  ecrireManifest,
  estUrlBlob,
  lireManifest,
  revaliderSite,
} from "../admin-utils";

/**
 * Rattache au manifeste une image déjà uploadée sur le Blob
 * (appelé par le panel juste après l'upload direct navigateur → Blob).
 */
export async function POST(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });
  if (!blobConfigured()) {
    return NextResponse.json(
      { error: "Stockage Vercel Blob non configuré." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    url?: string;
    slot?: string;
    galerie?: string;
    base?: unknown;
  } | null;

  if (!body?.url || !estUrlBlob(body.url)) {
    return NextResponse.json({ error: "URL d'image invalide." }, { status: 400 });
  }
  const slot = typeof body.slot === "string" && body.slot ? body.slot : null;
  const galerie = typeof body.galerie === "string" && body.galerie ? body.galerie : null;
  if (!slot && !galerie) {
    return NextResponse.json({ error: "Cible manquante (slot ou galerie)." }, { status: 400 });
  }

  // Base : l'état courant du panel (toujours issu de la dernière réponse
  // serveur) prime sur une relecture, par définition sans course possible.
  const manifest = normaliseManifest(body.base) ?? (await lireManifest());
  if (slot) {
    const ancienne = manifest.slots[slot];
    if (ancienne && ancienne !== body.url && estUrlBlob(ancienne)) {
      try {
        await del(ancienne);
      } catch {
        // l'ancien fichier restera orphelin, sans impact sur le site
      }
    }
    manifest.slots[slot] = body.url;
  } else if (galerie) {
    const liste = manifest.galeries[galerie] ?? [];
    if (!liste.includes(body.url)) liste.push(body.url);
    manifest.galeries[galerie] = liste;
  }
  await ecrireManifest(manifest);

  revaliderSite();
  // Le manifeste à jour est renvoyé : le panel l'affiche sans re-lecture
  // (évite de retomber sur une copie pas encore propagée du Blob)
  return NextResponse.json({ ok: true, manifest });
}
