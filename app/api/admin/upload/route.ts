import { NextResponse } from "next/server";
import path from "path";
import { del, put } from "@vercel/blob";
import {
  blobConfigured,
  checkAuth,
  ecrireManifest,
  estUrlBlob,
  lireManifest,
  revaliderSite,
} from "../admin-utils";

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);
const MAX_SIZE = 15 * 1024 * 1024; // 15 Mo

export async function POST(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });
  if (!blobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stockage Vercel Blob non configuré. Sur Vercel : Storage → Create → Blob, connecte le store au projet, puis redéploie.",
      },
      { status: 503 }
    );
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
  const nom = `images/${base}-${Date.now()}${ext}`;

  const blob = await put(nom, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
    cacheControlMaxAge: 31536000, // les fichiers sont uniques : cache long
  });

  const manifest = await lireManifest();
  if (typeof slot === "string") {
    const ancienne = manifest.slots[slot];
    if (ancienne && estUrlBlob(ancienne)) {
      try {
        await del(ancienne);
      } catch {
        // l'ancien fichier restera orphelin, sans impact sur le site
      }
    }
    manifest.slots[slot] = blob.url;
  } else if (typeof galerie === "string") {
    manifest.galeries[galerie] = [...(manifest.galeries[galerie] ?? []), blob.url];
  }
  await ecrireManifest(manifest);

  revaliderSite();
  return NextResponse.json({ ok: true, src: blob.url });
}
