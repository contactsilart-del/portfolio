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
- `app/data/projets.ts` — données des projets, expériences et compétences
- `app/data/site.ts` — infos du site et mentions légales

## Déploiement

Déployé sur [Vercel](https://vercel.com/) — chaque push sur `main` déclenche un déploiement automatique.

---

© SILART — Silas Clamens Albert
