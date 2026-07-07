import { NextResponse } from "next/server";
import { poles, type Pole, type Projet } from "@/app/data/projets";
import { normaliseProjets } from "@/app/data/projets-server";
import { normaliseManifest } from "@/app/data/images";
import {
  CHEMIN_MANIFEST,
  CHEMIN_PROJETS,
  ERREUR_GITHUB,
  checkAuth,
  cheminRepoImage,
  genererSlug,
  lireManifest,
  lireProjets,
} from "../admin-utils";
import { commitFichiers, githubConfigured, type FichierCommit } from "../github-utils";

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

function jsonProjets(liste: Projet[]): string {
  return JSON.stringify({ projets: liste }, null, 2) + "\n";
}

/** Créer (sans slugOriginal) ou modifier (avec slugOriginal) un projet. */
export async function PUT(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  const body = (await req.json().catch(() => null)) as {
    projet?: unknown;
    slugOriginal?: string;
    base?: unknown;
  } | null;

  const valide = validerProjet(body?.projet);
  if ("erreur" in valide) {
    return NextResponse.json({ error: valide.erreur }, { status: 400 });
  }
  if (!githubConfigured()) return NextResponse.json({ error: ERREUR_GITHUB }, { status: 503 });

  // L'état courant du panel prime sur une relecture
  const base = Array.isArray(body?.base)
    ? normaliseProjets({ projets: body.base }) ?? []
    : null;
  const liste = base !== null && base.length > 0 ? base : await lireProjets();

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

  try {
    await commitFichiers(`contenu: projet « ${valide.titre} »`, [
      { chemin: CHEMIN_PROJETS, contenuTexte: jsonProjets(liste) },
    ]);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Publication impossible." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, projets: liste });
}

/** Supprimer un projet + ses images (cover et galerie) du dépôt. */
export async function DELETE(req: Request) {
  const err = checkAuth(req);
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });
  if (!githubConfigured()) return NextResponse.json({ error: ERREUR_GITHUB }, { status: 503 });

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    base?: unknown;
    baseManifest?: unknown;
  } | null;
  if (!body?.slug) {
    return NextResponse.json({ error: "Slug manquant." }, { status: 400 });
  }

  const base = Array.isArray(body.base)
    ? normaliseProjets({ projets: body.base }) ?? []
    : null;
  const liste = base !== null && base.length > 0 ? base : await lireProjets();
  const restants = liste.filter((p) => p.slug !== body.slug);
  if (restants.length === liste.length) {
    return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
  }

  // Nettoyage des images associées : manifeste + fichiers du dépôt
  const manifest = normaliseManifest(body.baseManifest) ?? (await lireManifest());
  const slotCover = `projet.${body.slug}.cover`;
  const sources = [manifest.slots[slotCover], ...(manifest.galeries[body.slug] ?? [])];
  const aCommiter: FichierCommit[] = [];
  for (const src of sources) {
    const chemin = src ? cheminRepoImage(src) : null;
    if (chemin) aCommiter.push({ chemin, supprimer: true });
  }
  delete manifest.slots[slotCover];
  delete manifest.galeries[body.slug];

  aCommiter.push({ chemin: CHEMIN_PROJETS, contenuTexte: jsonProjets(restants) });
  aCommiter.push({
    chemin: CHEMIN_MANIFEST,
    contenuTexte: JSON.stringify(manifest, null, 2) + "\n",
  });

  try {
    await commitFichiers(`contenu: suppression du projet ${body.slug}`, aCommiter);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Publication impossible." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, projets: restants, manifest });
}
