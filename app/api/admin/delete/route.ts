import { NextResponse } from "next/server";
import { normaliseManifest } from "@/app/data/images";
import {
  CHEMIN_MANIFEST,
  ERREUR_GITHUB,
  checkAuth,
  cheminRepoImage,
  lireManifest,
} from "../admin-utils";
import { commitFichiers, githubConfigured, type FichierCommit } from "../github-utils";

/** Supprime une image (slot ou entrée de galerie) : un commit GitHub. */
export async function POST(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });
  if (!githubConfigured()) {
    return NextResponse.json({ error: ERREUR_GITHUB }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as {
    slot?: string;
    galerie?: string;
    src?: string;
    base?: unknown;
  } | null;

  if (!body || (typeof body.slot !== "string" && typeof body.galerie !== "string")) {
    return NextResponse.json({ error: "Cible manquante." }, { status: 400 });
  }

  // L'état courant du panel prime sur une relecture
  const manifest = normaliseManifest(body.base) ?? (await lireManifest());
  const aCommiter: FichierCommit[] = [];

  if (typeof body.slot === "string") {
    const src = manifest.slots[body.slot];
    const chemin = src ? cheminRepoImage(src) : null;
    if (chemin) aCommiter.push({ chemin, supprimer: true });
    delete manifest.slots[body.slot];
  } else if (typeof body.galerie === "string" && typeof body.src === "string") {
    const liste = manifest.galeries[body.galerie] ?? [];
    if (liste.includes(body.src)) {
      const chemin = cheminRepoImage(body.src);
      if (chemin) aCommiter.push({ chemin, supprimer: true });
    }
    const restantes = liste.filter((s) => s !== body.src);
    if (restantes.length > 0) manifest.galeries[body.galerie] = restantes;
    else delete manifest.galeries[body.galerie];
  }

  aCommiter.push({
    chemin: CHEMIN_MANIFEST,
    contenuTexte: JSON.stringify(manifest, null, 2) + "\n",
  });

  try {
    await commitFichiers("contenu: suppression d'une image", aCommiter);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Publication impossible." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, manifest });
}
