"use client";

import { useState } from "react";
import { poles, type Pole, type Projet } from "@/app/data/projets";

/** Données envoyées à l'API (le slug est géré côté serveur). */
export type ProjetPayload = Omit<Projet, "slug">;

const inputCls =
  "w-full rounded-lg border border-white/15 bg-nuit px-3 py-2 text-sm text-clair outline-none transition-colors focus:border-clair/60";

function Champ({
  label,
  aide,
  children,
}: {
  label: string;
  aide?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-doux">{label}</span>
      {aide && <span className="ml-2 text-[11px] normal-case text-doux/70">{aide}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export default function ProjetForm({
  initial,
  poleParDefaut,
  busy,
  onSubmit,
  onCancel,
}: {
  initial?: Projet;
  poleParDefaut: Pole;
  busy: boolean;
  onSubmit: (projet: ProjetPayload) => void;
  onCancel: () => void;
}) {
  const [titre, setTitre] = useState(initial?.titre ?? "");
  const [pole, setPole] = useState<Pole>(initial?.pole ?? poleParDefaut);
  const [type, setType] = useState(initial?.type ?? "");
  const [resume, setResume] = useState(initial?.resume ?? "");
  const [description, setDescription] = useState(initial?.description.join("\n\n") ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [annee, setAnnee] = useState(initial?.annee ?? "");
  const [lien, setLien] = useState(initial?.lien ?? "");
  const [lienLabel, setLienLabel] = useState(initial?.lienLabel ?? "");
  const [erreur, setErreur] = useState<string | null>(null);

  function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!titre.trim()) {
      setErreur("Le titre est obligatoire.");
      return;
    }
    const lienPropre = lien.trim();
    if (lienPropre && !/^https?:\/\//i.test(lienPropre)) {
      setErreur("Le lien doit commencer par http:// ou https://");
      return;
    }
    setErreur(null);
    onSubmit({
      titre: titre.trim(),
      pole,
      type: type.trim(),
      resume: resume.trim(),
      description: description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      role: role.trim() || undefined,
      annee: annee.trim() || undefined,
      lien: lienPropre || null,
      lienLabel: lienPropre ? lienLabel.trim() || null : null,
    });
  }

  return (
    <form onSubmit={envoyer} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label="Titre *">
          <input
            className={inputCls}
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Nom du projet"
            autoFocus={!initial}
          />
        </Champ>
        <Champ label="Pôle">
          <select
            className={inputCls}
            value={pole}
            onChange={(e) => setPole(e.target.value as Pole)}
          >
            {poles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titre}
              </option>
            ))}
          </select>
        </Champ>
      </div>

      <Champ label="Type" aide="ex. « Site de réservation », « Identité visuelle »">
        <input
          className={inputCls}
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Sous-titre affiché sur les cartes"
        />
      </Champ>

      <Champ label="Résumé" aide="1 à 2 phrases, affiché sur les cartes de l'accueil">
        <textarea
          className={`${inputCls} min-h-[70px] resize-y`}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
      </Champ>

      <Champ
        label="Description"
        aide="texte de la page dédiée — sépare les paragraphes par une ligne vide"
      >
        <textarea
          className={`${inputCls} min-h-[140px] resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Champ>

      <div className="grid gap-4 sm:grid-cols-3">
        <Champ label="Tags" aide="séparés par des virgules">
          <input
            className={inputCls}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Next.js, React, Stripe"
          />
        </Champ>
        <Champ label="Rôle" aide="optionnel">
          <input
            className={inputCls}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Design & développement"
          />
        </Champ>
        <Champ label="Année" aide="optionnel">
          <input
            className={inputCls}
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            placeholder="2026"
          />
        </Champ>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label="Lien" aide="optionnel — URL complète">
          <input
            className={inputCls}
            value={lien}
            onChange={(e) => setLien(e.target.value)}
            placeholder="https://monprojet.fr"
          />
        </Champ>
        <Champ label="Texte du lien" aide="ex. « monprojet.fr », « Voir le site »">
          <input
            className={inputCls}
            value={lienLabel}
            onChange={(e) => setLienLabel(e.target.value)}
            placeholder="Voir le site"
            disabled={!lien.trim()}
          />
        </Champ>
      </div>

      {erreur && <p className="text-xs text-red-400">{erreur}</p>}

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={busy} className="btn-accent px-6 py-2 text-xs disabled:opacity-50">
          {initial ? "Enregistrer" : "Créer le projet"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-wider text-doux transition-colors hover:text-clair"
        >
          Annuler
        </button>
        {initial && (
          <span className="ml-auto text-[11px] text-doux/70">
            L&apos;URL /projets/{initial.slug} ne change pas
          </span>
        )}
      </div>
    </form>
  );
}
