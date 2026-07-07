"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { upload as blobUpload } from "@vercel/blob/client";
import { poles, projetsDefaut, type Pole, type Projet } from "@/app/data/projets";
import { GALERIE_LOGOS, type ImagesManifest } from "@/app/data/images";
import ProjetForm, { type ProjetPayload } from "./ProjetForm";

const PWD_KEY = "silart-admin-pwd";
const EXTENSIONS_OK = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"]);
const MAX_UPLOAD = 25 * 1024 * 1024; // 25 Mo

type Configured = { password: boolean; blob: boolean };
type Statut = "chargement" | "login" | "config" | "ok";

const ONGLETS: { id: "accueil" | Pole; label: string }[] = [
  { id: "accueil", label: "Accueil" },
  ...poles.map((p) => ({ id: p.id, label: p.titre })),
];

/* Bouton qui ouvre un sélecteur de fichiers */
function BoutonFichier({
  label,
  multiple,
  disabled,
  onFiles,
}: {
  label: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: FileList | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => ref.current?.click()}
        className="rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-wider text-clair transition-colors hover:bg-white/10 disabled:opacity-40"
      >
        {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

/* Aperçu d'une image (ou placeholder) */
function Apercu({ src, large }: { src: string | null; large?: boolean }) {
  const taille = large ? "h-28 w-44" : "h-20 w-32";
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={`${taille} rounded-lg border border-white/10 object-cover`} />
  ) : (
    <div
      className={`${taille} flex items-center justify-center rounded-lg border border-dashed border-white/20 text-xs text-doux`}
    >
      Aucune image
    </div>
  );
}

/* Carte d'un projet : textes (formulaire) + image principale + galerie.
   Défini au niveau module (pas dans AdminClient) pour que le formulaire
   garde sa saisie quand le parent se re-rend. */
function EditeurProjet({
  projet,
  manifest,
  busy,
  ouvert,
  onToggleEdition,
  onUpload,
  onDeleteImage,
  onSave,
  onDeleteProjet,
}: {
  projet: Projet;
  manifest: ImagesManifest;
  busy: boolean;
  ouvert: boolean;
  onToggleEdition: () => void;
  onUpload: (cible: { slot?: string; galerie?: string }, files: FileList | null) => void;
  onDeleteImage: (payload: { slot?: string; galerie?: string; src?: string }) => void;
  onSave: (projet: ProjetPayload, slugOriginal: string) => void;
  onDeleteProjet: (projet: Projet) => void;
}) {
  const slotCover = `projet.${projet.slug}.cover`;
  const cover = manifest.slots[slotCover] ?? null;
  const galerie = manifest.galeries[projet.slug] ?? [];

  return (
    <div className="carte">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-clair">{projet.titre}</h3>
          <p className="text-xs uppercase tracking-wider text-doux">
            {projet.type || "—"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleEdition}
            className="text-xs uppercase tracking-wider text-accent hover:underline"
          >
            {ouvert ? "Fermer" : "Modifier le texte"}
          </button>
          <Link href={`/projets/${projet.slug}`} className="text-xs text-doux hover:text-clair">
            Voir la page →
          </Link>
        </div>
      </div>

      {/* Formulaire d'édition des textes */}
      {ouvert && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-nuit/60 p-5">
          <ProjetForm
            initial={projet}
            poleParDefaut={projet.pole}
            busy={busy}
            onSubmit={(p) => onSave(p, projet.slug)}
            onCancel={onToggleEdition}
          />
          <div className="mt-4 border-t border-white/5 pt-3 text-right">
            <button
              type="button"
              onClick={() => onDeleteProjet(projet)}
              disabled={busy}
              className="text-xs text-red-400/80 transition-colors hover:text-red-400 disabled:opacity-50"
            >
              Supprimer ce projet définitivement
            </button>
          </div>
        </div>
      )}

      {/* Image principale */}
      <div className="mt-4 flex items-center gap-4">
        <Apercu src={cover} />
        <div className="flex flex-col gap-2">
          <p className="text-xs text-doux">
            Image principale — cartes de l&apos;accueil + page dédiée
          </p>
          <div className="flex items-center gap-3">
            <BoutonFichier
              label={cover ? "Remplacer" : "Ajouter"}
              disabled={busy}
              onFiles={(f) => onUpload({ slot: slotCover }, f)}
            />
            {cover && (
              <button
                type="button"
                onClick={() => onDeleteImage({ slot: slotCover })}
                className="text-xs text-red-400/80 transition-colors hover:text-red-400"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Galerie */}
      <div className="mt-5 border-t border-white/5 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-doux">
            Galerie de la page dédiée ({galerie.length} image{galerie.length > 1 ? "s" : ""})
          </p>
          <BoutonFichier
            label="Ajouter des images"
            multiple
            disabled={busy}
            onFiles={(f) => onUpload({ galerie: projet.slug }, f)}
          />
        </div>
        {galerie.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {galerie.map((src) => (
              <div key={src} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-20 w-28 rounded-lg border border-white/10 object-cover"
                />
                <button
                  type="button"
                  onClick={() => onDeleteImage({ galerie: projet.slug, src })}
                  className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                  aria-label="Supprimer cette image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminClient() {
  const [statut, setStatut] = useState<Statut>("chargement");
  const [pwd, setPwd] = useState("");
  const [saisie, setSaisie] = useState("");
  const [erreurLogin, setErreurLogin] = useState<string | null>(null);
  const [configured, setConfigured] = useState<Configured>({ password: false, blob: false });
  const [manifest, setManifest] = useState<ImagesManifest>({ slots: {}, galeries: {} });
  const [projets, setProjets] = useState<Projet[]>(projetsDefaut);
  const [onglet, setOnglet] = useState<"accueil" | Pole>("accueil");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [enEdition, setEnEdition] = useState<string | null>(null); // slug en cours d'édition
  const [creation, setCreation] = useState(false); // formulaire « nouveau projet » ouvert

  const refresh = useCallback(async (motDePasse: string) => {
    const res = await fetch("/api/admin/state", {
      cache: "no-store",
      headers: motDePasse ? { "x-admin-password": motDePasse } : {},
    });
    const data = await res.json().catch(() => null);

    if (res.status === 503) {
      setConfigured(data?.configured ?? { password: false, blob: false });
      setStatut("config");
      return false;
    }
    if (res.status === 401) {
      setStatut("login");
      return false;
    }
    if (res.ok && data) {
      setManifest(data.manifest);
      if (Array.isArray(data.projets)) setProjets(data.projets);
      setConfigured(data.configured);
      setPwd(motDePasse);
      try {
        localStorage.setItem(PWD_KEY, motDePasse);
      } catch {}
      setStatut("ok");
      return true;
    }
    setStatut("login");
    return false;
  }, []);

  useEffect(() => {
    let stocke = "";
    try {
      stocke = localStorage.getItem(PWD_KEY) ?? "";
    } catch {}
    refresh(stocke);
  }, [refresh]);

  async function connecter(e: React.FormEvent) {
    e.preventDefault();
    setErreurLogin(null);
    const ok = await refresh(saisie);
    if (!ok) setErreurLogin("Mot de passe incorrect.");
  }

  function deconnecter() {
    try {
      localStorage.removeItem(PWD_KEY);
    } catch {}
    setPwd("");
    setSaisie("");
    setStatut("login");
  }

  /* ── Images ────────────────────────────────────────────── */

  /**
   * Upload DIRECT navigateur → Vercel Blob (les fonctions Vercel refusent
   * les corps > 4,5 Mo, donc les photos ne transitent plus par le serveur),
   * puis rattachement au manifeste via /api/admin/attach.
   */
  async function upload(cible: { slot?: string; galerie?: string }, files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMessage(null);
    let erreur: string | null = null;

    for (const file of Array.from(files)) {
      const ext = (file.name.includes(".") ? file.name.split(".").pop()! : "").toLowerCase();
      if (!EXTENSIONS_OK.has(ext)) {
        erreur =
          `« ${file.name} » : format non supporté. Utilise JPG, PNG, WebP, GIF, AVIF ou SVG.` +
          (ext === "heic" || ext === "heif"
            ? " Sur iPhone : Réglages → Appareil photo → Formats → « Le plus compatible », ou exporte la photo en JPG."
            : "");
        break;
      }
      if (file.size > MAX_UPLOAD) {
        erreur = `« ${file.name} » est trop lourd (${(file.size / 1024 / 1024).toFixed(1)} Mo, max 25 Mo).`;
        break;
      }

      try {
        const base = (cible.slot ?? `galerie-${cible.galerie}`)
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "");
        // 1. Le fichier part directement du navigateur vers le Blob
        const blob = await blobUpload(`images/${base}-${Date.now()}.${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload-token",
          clientPayload: JSON.stringify({ mdp: pwd }),
          contentType: file.type || undefined,
          multipart: file.size > 8 * 1024 * 1024,
        });
        // 2. Puis on le rattache au manifeste du site
        const res = await fetch("/api/admin/attach", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-password": pwd },
          body: JSON.stringify({ url: blob.url, slot: cible.slot, galerie: cible.galerie }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          erreur = data?.error ?? "Erreur pendant la publication.";
          break;
        }
        if (data?.manifest) setManifest(data.manifest);
      } catch (e) {
        erreur = e instanceof Error ? e.message : "Erreur pendant l'upload.";
        break;
      }
    }

    if (erreur) {
      await refresh(pwd);
      setMessage(`⚠️ ${erreur}`);
    } else {
      setMessage("En ligne ✓ — le site public est à jour.");
    }
    setBusy(false);
  }

  async function supprimerImage(payload: { slot?: string; galerie?: string; src?: string }) {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pwd },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.manifest) {
      setManifest(data.manifest);
      setMessage("Supprimé ✓ — le site public est à jour.");
    } else {
      await refresh(pwd);
      setMessage(`⚠️ ${data?.error ?? "Erreur pendant la suppression."}`);
    }
    setBusy(false);
  }

  /* ── Projets ───────────────────────────────────────────── */

  async function sauverProjet(projet: ProjetPayload, slugOriginal?: string) {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/projets", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": pwd },
      body: JSON.stringify({ projet, slugOriginal }),
    });
    const err = res.ok ? null : (await res.json().catch(() => null))?.error;
    await refresh(pwd);
    if (!err) {
      setEnEdition(null);
      setCreation(false);
    }
    setMessage(
      err ??
        (slugOriginal
          ? "Projet enregistré ✓ — le site public est à jour."
          : "Projet créé ✓ — pense à lui ajouter une image.")
    );
    setBusy(false);
  }

  async function supprimerProjet(projet: Projet) {
    if (
      !window.confirm(
        `Supprimer « ${projet.titre} » ?\n\nSa page, ses images et sa galerie seront retirées du site. Cette action est définitive.`
      )
    ) {
      return;
    }
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/projets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": pwd },
      body: JSON.stringify({ slug: projet.slug }),
    });
    const err = res.ok ? null : (await res.json().catch(() => null))?.error;
    await refresh(pwd);
    setMessage(err ?? "Projet supprimé ✓ — le site public est à jour.");
    setBusy(false);
  }

  /* ── Écrans d'état ─────────────────────────────────────── */

  if (statut === "chargement") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-doux">Chargement…</p>
      </main>
    );
  }

  if (statut === "config") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="carte max-w-lg">
          <h1 className="text-xl font-semibold text-clair">Configuration requise</h1>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-doux">
            {!configured.password && (
              <p>
                <span className="text-clair">1. Mot de passe :</span> sur Vercel →
                ton projet → Settings → Environment Variables → ajoute{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5">ADMIN_PASSWORD</code>{" "}
                avec le mot de passe de ton choix.
              </p>
            )}
            {!configured.blob && (
              <p>
                <span className="text-clair">2. Stockage :</span> sur Vercel → onglet{" "}
                <span className="text-clair">Storage</span> → Create →{" "}
                <span className="text-clair">Blob</span> → connecte le store au projet
                (la variable <code className="rounded bg-white/10 px-1.5 py-0.5">BLOB_READ_WRITE_TOKEN</code>{" "}
                est ajoutée automatiquement).
              </p>
            )}
            <p>
              Puis <span className="text-clair">redéploie</span> (Deployments → ⋯ →
              Redeploy) et recharge cette page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (statut === "login") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={connecter} className="carte w-full max-w-sm">
          <h1 className="text-xl font-semibold text-clair">
            SIL<span className="text-accent">ART</span> · Panel admin
          </h1>
          <p className="mt-1 text-xs text-doux">Entre le mot de passe administrateur.</p>
          <input
            type="password"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
            className="mt-4 w-full rounded-lg border border-white/15 bg-nuit px-4 py-2.5 text-sm text-clair outline-none focus:border-clair/60"
          />
          {erreurLogin && <p className="mt-2 text-xs text-red-400">{erreurLogin}</p>}
          <button type="submit" className="btn-accent mt-4 w-full px-6 py-2.5 text-xs">
            Se connecter
          </button>
        </form>
      </main>
    );
  }

  /* ── Panel ─────────────────────────────────────────────── */

  const portrait = manifest.slots["hero.portrait"] ?? null;
  const logos = manifest.galeries[GALERIE_LOGOS] ?? [];
  const projetsOnglet =
    onglet === "accueil" ? [] : projets.filter((p) => p.pole === onglet);

  return (
    <main className="min-h-screen pb-28">
      {/* En-tête */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className="text-lg font-semibold">
            SIL<span className="text-accent">ART</span>{" "}
            <span className="text-sm font-normal text-doux">· Panel admin</span>
          </p>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-sm text-doux transition-colors hover:text-clair">
              ← Voir le site
            </Link>
            <button
              type="button"
              onClick={deconnecter}
              className="text-xs text-doux transition-colors hover:text-clair"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <p className="text-sm text-doux">
          Images <span className="text-clair">et textes des projets</span> — les changements
          sont <span className="text-clair">publiés instantanément</span> sur le site.
        </p>

        {!configured.blob && (
          <p className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-200">
            Stockage Blob non configuré : les modifications échoueront. Vercel → Storage →
            Create → Blob, connecte le store au projet, puis redéploie.
          </p>
        )}

        {/* Onglets par page / catégorie */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOnglet(o.id);
                setEnEdition(null);
                setCreation(false);
              }}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                onglet === o.id
                  ? "border-clair bg-clair text-nuit"
                  : "border-white/15 text-doux hover:border-white/40 hover:text-clair"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Contenu de l'onglet */}
        <div className="mt-8 space-y-5">
          {onglet === "accueil" ? (
            <>
            <div className="carte">
              <h3 className="text-lg font-semibold text-clair">Portrait du hero</h3>
              <p className="mt-1 text-xs text-doux">
                Affiché au centre de la page d&apos;accueil avec l&apos;effet magnétique.
                Recommandé : PNG détouré (fond transparent), ≥ 800 px de large. Tant
                qu&apos;aucune image n&apos;est définie, le hero s&apos;affiche sans portrait.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Apercu src={portrait} large />
                <div className="flex flex-col gap-2">
                  <BoutonFichier
                    label={portrait ? "Remplacer" : "Ajouter"}
                    disabled={busy}
                    onFiles={(f) => upload({ slot: "hero.portrait" }, f)}
                  />
                  {portrait && (
                    <button
                      type="button"
                      onClick={() => supprimerImage({ slot: "hero.portrait" })}
                      className="text-left text-xs text-red-400/80 transition-colors hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Logos « Ils me font confiance » */}
            <div className="carte">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-clair">
                  « Ils me font confiance » — logos
                </h3>
                <BoutonFichier
                  label="Ajouter des logos"
                  multiple
                  disabled={busy}
                  onFiles={(f) => upload({ galerie: GALERIE_LOGOS }, f)}
                />
              </div>
              <p className="mt-1 text-xs text-doux">
                Bande de logos qui défile en bas de l&apos;accueil. Recommandé :
                PNG ou SVG sur fond transparent (les logos sont affichés en gris
                clair, en couleur au survol).{" "}
                {logos.length === 0 && (
                  <span className="text-yellow-200/90">
                    Tant qu&apos;aucun logo n&apos;est ajouté ici, le site affiche
                    des logos d&apos;exemple fictifs.
                  </span>
                )}
              </p>
              {logos.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {logos.map((src) => (
                    <div key={src} className="group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="h-14 w-28 rounded-lg border border-white/10 bg-white/5 object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => supprimerImage({ galerie: GALERIE_LOGOS, src })}
                        className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                        aria-label="Supprimer ce logo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
          ) : (
            <>
              {/* Nouveau projet */}
              {creation ? (
                <div className="carte border-accent/40">
                  <h3 className="text-lg font-semibold text-clair">Nouveau projet</h3>
                  <p className="mb-4 mt-1 text-xs text-doux">
                    Sa page /projets/… est créée automatiquement ; tu pourras lui ajouter
                    une image et une galerie juste après.
                  </p>
                  <ProjetForm
                    poleParDefaut={onglet}
                    busy={busy}
                    onSubmit={(p) => sauverProjet(p)}
                    onCancel={() => setCreation(false)}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCreation(true);
                    setEnEdition(null);
                  }}
                  className="w-full rounded-2xl border border-dashed border-white/20 px-6 py-4 text-sm text-doux transition-colors hover:border-accent/60 hover:text-clair"
                >
                  + Ajouter un projet dans « {ONGLETS.find((o) => o.id === onglet)?.label} »
                </button>
              )}

              {projetsOnglet.map((p) => (
                <EditeurProjet
                  key={p.slug}
                  projet={p}
                  manifest={manifest}
                  busy={busy}
                  ouvert={enEdition === p.slug}
                  onToggleEdition={() => {
                    setEnEdition(enEdition === p.slug ? null : p.slug);
                    setCreation(false);
                  }}
                  onUpload={upload}
                  onDeleteImage={supprimerImage}
                  onSave={(payload, slugOriginal) => sauverProjet(payload, slugOriginal)}
                  onDeleteProjet={supprimerProjet}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Barre d'état */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-nuit/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <p className="text-sm text-doux">
            {busy ? "Traitement…" : message ?? "Prêt."}
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-wider text-accent hover:underline"
          >
            Ouvrir le site ↗
          </a>
        </div>
      </div>
    </main>
  );
}
