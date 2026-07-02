import { NextResponse } from "next/server";
import {
  adminForbidden,
  readManifest,
  writeManifest,
  deleteLocalImage,
} from "../admin-utils";

export async function POST(req: Request) {
  if (adminForbidden()) {
    return NextResponse.json({ error: "Panel admin désactivé en production." }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as {
    slot?: string;
    galerie?: string;
    src?: string;
  } | null;

  if (!body || (typeof body.slot !== "string" && typeof body.galerie !== "string")) {
    return NextResponse.json({ error: "Cible manquante." }, { status: 400 });
  }

  const manifest = readManifest();

  if (typeof body.slot === "string") {
    const src = manifest.slots[body.slot];
    if (src) deleteLocalImage(src);
    delete manifest.slots[body.slot];
  } else if (typeof body.galerie === "string" && typeof body.src === "string") {
    const liste = manifest.galeries[body.galerie] ?? [];
    if (liste.includes(body.src)) deleteLocalImage(body.src);
    manifest.galeries[body.galerie] = liste.filter((s) => s !== body.src);
    if (manifest.galeries[body.galerie].length === 0) {
      delete manifest.galeries[body.galerie];
    }
  }

  writeManifest(manifest);
  return NextResponse.json({ ok: true });
}
