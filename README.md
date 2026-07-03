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

## Panel admin (images)

Accessible en ligne : **https://bysilart.fr/admin** (protégé par mot de passe).

- Images triées par page/catégorie (Accueil, Dev, Branding, Audiovisuel)
- Ajout / remplacement / suppression : portrait du hero, image principale
  de chaque projet (cartes + page dédiée) et galeries des pages dédiées
- Publication **instantanée** : les fichiers sont stockés sur Vercel Blob et
  le site est revalidé à chaque modification (aucun redéploiement nécessaire)

Prérequis (une seule fois, sur le dashboard Vercel) :

1. **Storage → Create → Blob**, connecter le store au projet
   (la variable `BLOB_READ_WRITE_TOKEN` est ajoutée automatiquement)
2. **Settings → Environment Variables** : ajouter `ADMIN_PASSWORD`
3. Redéployer

En local sans token Blob, le site utilise le fallback `app/data/images.json`
(vide) ; pour voir les images de production en dev : `vercel env pull .env.local`.

## Déploiement

Déployé sur [Vercel](https://vercel.com/) — chaque push sur `main` déclenche un déploiement automatique.

---

© SILART — Silas Clamens Albert
