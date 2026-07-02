import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  adminForbidden,
  readManifest,
  writeManifest,
  deleteLocalImage,
  IMAGES_DIR,
} from "../admin-utils";

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);
const MAX_SIZE = 15 * 1024 * 1024; // 15 Mo

export async function POST(req: Request) {
  if (adminForbidden()) {
    return NextResponse.json({ error: "Panel admin désactivé en production." }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const slot = form.get("slot");
  const galerie = form.get("galerie");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (typeof slot !== "string" && typeof galerie !== "string") {
    return NextResponse.json({ error: "Cible manquante (slot ou galerie)." }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `Format non supporté (${ext || "sans extension"}). Utilise jpg, png, webp, gif, avif ou svg.` },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 15 Mo)." }, { status: 400 });
  }

  const base = (typeof slot === "string" ? slot : `galerie-${galerie}`)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const name = `${base}-${Date.now()}${ext}`;

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, name), Buffer.from(await file.arrayBuffer()));

  const src = `/images/${name}`;
  const manifest = readManifest();

  if (typeof slot === "string") {
    const ancienne = manifest.slots[slot];
    if (ancienne) deleteLocalImage(ancienne);
    manifest.slots[slot] = src;
  } else if (typeof galerie === "string") {
    manifest.galeries[galerie] = [...(manifest.galeries[galerie] ?? []), src];
  }

  writeManifest(manifest);
  return NextResponse.json({ ok: true, src });
}
