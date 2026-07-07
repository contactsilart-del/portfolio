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
    slot?: string;
    galerie?: string;
    src?: string;
    base?: unknown;
  } | null;

  if (!body || (typeof body.slot !== "string" && typeof body.galerie !== "string")) {
    return NextResponse.json({ error: "Cible manquante." }, { status: 400 });
  }

  // L'état courant du panel prime sur une relecture (aucune course possible)
  const manifest = normaliseManifest(body.base) ?? (await lireManifest());

  if (typeof body.slot === "string") {
    const src = manifest.slots[body.slot];
    if (src && estUrlBlob(src)) {
      try {
        await del(src);
      } catch {
        // fichier déjà absent
      }
    }
    delete manifest.slots[body.slot];
  } else if (typeof body.galerie === "string" && typeof body.src === "string") {
    const liste = manifest.galeries[body.galerie] ?? [];
    if (liste.includes(body.src) && estUrlBlob(body.src)) {
      try {
        await del(body.src);
      } catch {
        // fichier déjà absent
      }
    }
    manifest.galeries[body.galerie] = liste.filter((s) => s !== body.src);
    if (manifest.galeries[body.galerie].length === 0) {
      delete manifest.galeries[body.galerie];
    }
  }

  await ecrireManifest(manifest);

  revaliderSite();
  return NextResponse.json({ ok: true, manifest });
}
