import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjet, projets, poles } from "@/app/data/projets";
import { site } from "@/app/data/site";
import { slotImage, galerieImages } from "@/app/data/images";
import { getImagesManifest } from "@/app/data/images-server";

export function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const projet = getProjet(params.slug);
  if (!projet) return { title: "Projet introuvable — SILART" };
  return {
    title: `${projet.titre} — ${site.marque}`,
    description: projet.resume,
  };
}

export default async function ProjetPage({ params }: { params: { slug: string } }) {
  const projet = getProjet(params.slug);
  if (!projet) notFound();

  const pole = poles.find((p) => p.id === projet.pole);
  const autres = projets
    .filter((p) => p.pole === projet.pole && p.slug !== projet.slug)
    .slice(0, 3);
  const manifest = await getImagesManifest();
  const cover = slotImage(manifest, `projet.${projet.slug}.cover`);
  const galerie = galerieImages(manifest, projet.slug);

  return (
    <>
      {/* Nav minimale */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-nuit/80 backdrop-blur">
        <nav className="section flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SIL<span className="text-accent">ART</span>
          </Link>
          <Link
            href="/#projets"
            className="text-sm text-doux transition-colors hover:text-clair"
          >
            ← Tous les projets
          </Link>
        </nav>
      </header>

      <article className="section pb-24 pt-32">
        <p className="surtitre">{pole?.titre}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
          {projet.titre}
        </h1>
        <p className="mt-4 text-lg text-doux">{projet.type}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {projet.tags.map((t) => (
            <span key={t} className="puce-tech">
              {t}
            </span>
          ))}
        </div>

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={projet.titre}
            className="mt-10 max-h-[520px] w-full rounded-3xl border border-white/10 object-cover"
          />
        )}

        {(projet.role || projet.annee) && (
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-doux">
            {projet.role && (
              <span>
                <span className="text-clair">Rôle</span> · {projet.role}
              </span>
            )}
            {projet.annee && (
              <span>
                <span className="text-clair">Année</span> · {projet.annee}
              </span>
            )}
          </div>
        )}

        <div className="mt-12 max-w-2xl space-y-5 text-lg leading-relaxed text-doux">
          {projet.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {galerie.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {galerie.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={projet.titre}
                className="w-full rounded-3xl border border-white/10 object-cover"
              />
            ))}
          </div>
        )}

        {projet.lien && (
          <a
            href={projet.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent mt-10"
          >
            {projet.lienLabel ?? "Voir le projet"}
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        )}

        {/* Autres projets du même pôle */}
        {autres.length > 0 && (
          <div className="mt-24 border-t border-white/5 pt-12">
            <p className="surtitre">Dans le même pôle</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {autres.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projets/${p.slug}`}
                  className="carte block"
                >
                  <span className="text-xs uppercase tracking-widest text-accent">
                    {p.type}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{p.titre}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
