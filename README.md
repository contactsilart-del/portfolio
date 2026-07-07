# Portfolio — SILART

Portfolio personnel de **Silas Clamens Albert** (SILART) — développeur web full-stack, designer et créatif.

Site vitrine présentant les projets (développement web, branding, audiovisuel), les compétences et le parcours.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Développement

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:3001
```

## Build de production

```bash
npm run build
npm run start    # sur http://localhost:3001
```

## Structure

- `app/page.tsx` — page d'accueil (hero, projets par pôle, compétences, parcours, contact)
- `app/projets/[slug]/page.tsx` — page dédiée par projet
- `app/mentions-legales/page.tsx` — mentions légales
- `app/politique-de-confidentialite/page.tsx` — politique de confidentialité
- `app/data/projets.ts` — données des projets, expériences et compétences
- `app/data/site.ts` — infos du site et mentions légales
- `app/data/images.json` — manifeste des images (géré via le panel admin)

## Panel admin (images + projets)

Accessible en ligne : **https://bysilart.fr/admin** (protégé par mot de passe).

- Contenu trié par page/catégorie (Accueil, Dev, Branding, Audiovisuel)
- **Images** : portrait du hero, logos « Ils me font confiance », image
  principale de chaque projet (cartes + page dédiée) et galeries —
  compressées automatiquement dans le navigateur (WebP, 2400 px max)
- **Projets** : création, édition des textes (titre, type, résumé,
  description, tags, rôle, année, lien) et suppression — la page
  /projets/… est générée automatiquement
- **Stockage : le dépôt GitHub lui-même.** Chaque action du panel crée un
  commit (images dans `public/images/`, données dans `app/data/images.json`
  et `app/data/projets.json`) → Vercel redéploie automatiquement (~1 min).
  Aucun service externe, aucun quota, contenu versionné dans Git.
- `app/data/projets.ts` sert de liste par défaut tant que le panel n'a
  jamais publié (puis `app/data/projets.json` fait foi)

Prérequis (une seule fois) :

1. **Jeton GitHub** : github.com → Settings → Developer settings →
   Fine-grained personal access tokens → Generate. Repository access :
   *Only select repositories* → `portfolio`. Permissions → Repository →
   **Contents : Read and write**.
2. Sur Vercel → **Settings → Environment Variables** : ajouter
   `GITHUB_TOKEN` (le jeton) et `ADMIN_PASSWORD` (mot de passe du panel)
3. Redéployer

Après un changement via le panel, penser à `git pull` avant de travailler
en local (le panel committe sur `main`).

## Déploiement

Déployé sur [Vercel](https://vercel.com/) — chaque push sur `main` déclenche un déploiement automatique.

---

© SILART — Silas Clamens Albert
