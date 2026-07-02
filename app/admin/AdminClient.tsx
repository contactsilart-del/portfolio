"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { poles, projetsParPole, type Pole, type Projet } from "@/app/data/projets";

type Manifest = { slots: Record<string, string>; galeries: Record<string, string[]> };

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

export default function AdminClient() {
  const [manifest, setManifest] = useState<Manifest>({ slots: {}, galeries: {} });
  const [pending, setPending] = useState<string[]>([]);
  const [onglet, setOnglet] = useState<"accueil" | Pole>("accueil");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/state", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setManifest(data.manifest);
      setPending(data.pending ?? []);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function upload(cible: { slot?: string; galerie?: string }, files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMessage(null);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      if (cible.slot) form.append("slot", cible.slot);
      if (cible.galerie) form.append("galerie", cible.galerie);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setMessage(err?.error ?? "Erreur pendant l'upload.");
        break;
      }
    }
    await refresh();
    setBusy(false);
  }

  async function supprimer(payload: { slot?: string; galerie?: string; src?: string }) {
    setBusy(true);
    setMessage(null);
    await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await refresh();
    setBusy(false);
  }

  async function publier() {
    setBusy(true);
    setMessage("Publication en cours…");
    const res = await fetch("/api/admin/publish", { method: "POST" });
    const data = await res.json().catch(() => null);
    setMessage(data?.message ?? data?.error ?? "Erreur pendant la publication.");
    await refresh();
    setBusy(false);
  }

  function EditeurProjet({ projet }: { projet: Projet }) {
    const slotCover = `projet.${projet.slug}.cover`;
    const cover = manifest.slots[slotCover] ?? null;
    const galerie = manifest.galeries[projet.slug] ?? [];

    return (
      <div className="carte">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-clair">{projet.titre}</h3>
            <p className="text-xs uppercase tracking-wider text-doux">{projet.type}</p>
          </div>
          <Link
            href={`/projets/${projet.slug}`}
            className="text-xs text-accent hover:underline"
          >
            Voir la page →
          </Link>
        </div>

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
                onFiles={(f) => upload({ slot: slotCover }, f)}
              />
              {cover && (
                <button
                  type="button"
                  onClick={() => supprimer({ slot: slotCover })}
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
              Galerie de la page dédiée ({galerie.length} image
              {galerie.length > 1 ? "s" : ""})
            </p>
            <BoutonFichier
              label="Ajouter des images"
              multiple
              disabled={busy}
              onFiles={(f) => upload({ galerie: projet.slug }, f)}
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
                    onClick={() => supprimer({ galerie: projet.slug, src })}
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

  const portrait = manifest.slots["hero.portrait"] ?? null;

  return (
    <main className="min-h-screen pb-32">
      {/* En-tête */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className="text-lg font-semibold">
            SIL<span className="text-accent">ART</span>{" "}
            <span className="text-sm font-normal text-doux">· Panel admin — Images</span>
          </p>
          <Link href="/" className="text-sm text-doux transition-colors hover:text-clair">
            ← Voir le site
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <p className="text-sm text-doux">
          Panel local (dev uniquement). Ajoute ou remplace les images, puis clique{" "}
          <span className="text-clair">« Publier en ligne »</span> pour mettre bysilart.fr à
          jour.
        </p>

        {/* Onglets par page / catégorie */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnglet(o.id)}
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
                      onClick={() => supprimer({ slot: "hero.portrait" })}
                      className="text-left text-xs text-red-400/80 transition-colors hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            projetsParPole(onglet).map((p) => <EditeurProjet key={p.slug} projet={p} />)
          )}
        </div>
      </div>

      {/* Barre de publication */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-nuit/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-sm text-doux">
            {pending.length > 0
              ? `${pending.length} modification${pending.length > 1 ? "s" : ""} locale${
                  pending.length > 1 ? "s" : ""
                } non publiée${pending.length > 1 ? "s" : ""}`
              : "Tout est publié ✓"}
            {message && <span className="ml-3 text-clair">{message}</span>}
          </p>
          <button
            type="button"
            onClick={publier}
            disabled={busy || pending.length === 0}
            className="btn-accent px-6 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "…" : "Publier en ligne"}
          </button>
        </div>
      </div>
    </main>
  );
}
