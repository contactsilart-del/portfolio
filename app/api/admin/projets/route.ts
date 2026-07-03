import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { poles, type Pole, type Projet } from "@/app/data/projets";
import {
  blobConfigured,
  checkAuth,
  ecrireManifest,
  ecrireProjets,
  estUrlBlob,
  genererSlug,
  lireManifest,
  lireProjets,
  revaliderSite,
} from "../admin-utils";

const ERREUR_BLOB =
  "Stockage Vercel Blob non configuré. Sur Vercel : Storage → Create → Blob, connecte le store au projet, puis redéploie.";

const polesValides = new Set<string>(poles.map((p) => p.id));

function texte(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Valide et nettoie le projet envoyé par le panel. */
function validerProjet(raw: unknown): Omit<Projet, "slug"> | { erreur: string } {
  const p = raw as Record<string, unknown> | null;
  if (!p || typeof p !== "object") return { erreur: "Projet manquant." };

  const titre = texte(p.titre, 120);
  if (!titre) return { erreur: "Le titre est obligatoire." };
  if (!polesValides.has(String(p.pole))) return { erreur: "Pôle invalide." };

  const description = Array.isArray(p.description)
    ? p.description.map((d) => texte(d, 4000)).filter(Boolean).slice(0, 20)
    : [];
  const tags = Array.isArray(p.tags)
    ? p.tags.map((t) => texte(t, 40)).filter(Boolean).slice(0, 12)
    : [];

  const lien = texte(p.lien, 500);
  if (lien && !/^https?:\/\//i.test(lien)) {
    return { erreur: "Le lien doit commencer par http:// ou https://." };
  }

  return {
    titre,
    pole: p.pole as Pole,
    type: texte(p.type, 120),
    resume: texte(p.resume, 600),
    description,
    tags,
    role: texte(p.role, 120) || undefined,
    annee: texte(p.annee, 20) || undefined,
    lien: lien || null,
    lienLabel: lien ? texte(p.lienLabel, 120) || null : null,
  };
}

/** Créer (sans slugOriginal) ou modifier (avec slugOriginal) un projet. */
export async function PUT(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  const body = (await req.json().catch(() => null)) as {
    projet?: unknown;
    slugOriginal?: string;
  } | null;

  const valide = validerProjet(body?.projet);
  if ("erreur" in valide) {
    return NextResponse.json({ error: valide.erreur }, { status: 400 });
  }
  if (!blobConfigured()) return NextResponse.json({ error: ERREUR_BLOB }, { status: 503 });

  const liste = await lireProjets();

  if (typeof body?.slugOriginal === "string") {
    // Modification : le slug (donc l'URL et les images liées) ne change pas
    const i = liste.findIndex((p) => p.slug === body.slugOriginal);
    if (i === -1) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }
    liste[i] = { slug: body.slugOriginal, ...valide };
  } else {
    const slug = genererSlug(valide.titre, new Set(liste.map((p) => p.slug)));
    liste.push({ slug, ...valide });
  }

  await ecrireProjets(liste);
  revaliderSite();
  return NextResponse.json({ ok: true, projets: liste });
}

/** Supprimer un projet + ses images (cover et galerie) sur le Blob. */
export async function DELETE(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });
  if (!blobConfigured()) return NextResponse.json({ error: ERREUR_BLOB }, { status: 503 });

  const body = (await req.json().catch(() => null)) as { slug?: string } | null;
  if (!body?.slug) {
    return NextResponse.json({ error: "Slug manquant." }, { status: 400 });
  }

  const liste = await lireProjets();
  const restants = liste.filter((p) => p.slug !== body.slug);
  if (restants.length === liste.length) {
    return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
  }

  // Nettoyage des images associées dans le manifeste + fichiers Blob
  const manifest = await lireManifest();
  const slotCover = `projet.${body.slug}.cover`;
  const aSupprimer = [
    manifest.slots[slotCover],
    ...(manifest.galeries[body.slug] ?? []),
  ].filter((src): src is string => Boolean(src && estUrlBlob(src)));
  delete manifest.slots[slotCover];
  delete manifest.galeries[body.slug];

  await ecrireProjets(restants);
  await ecrireManifest(manifest);
  for (const src of aSupprimer) {
    try {
      await del(src);
    } catch {
      // fichier déjà absent : sans impact
    }
  }

  revaliderSite();
  return NextResponse.json({ ok: true, projets: restants });
}
