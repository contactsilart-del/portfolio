import Link from "next/link";
import {
  poles,
  projetsParPole,
  experiences,
  competences,
} from "@/app/data/projets";
import { site } from "@/app/data/site";

const liensNav = [
  { href: "#projets", label: "Projets" },
  { href: "#competences", label: "Compétences" },
  { href: "#parcours", label: "Parcours" },
  { href: "#apropos", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-nuit/80 backdrop-blur">
        <nav className="section flex h-16 items-center justify-between">
          <Link href="#top" className="text-lg font-semibold tracking-tight">
            SIL<span className="text-accent">ART</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {liensNav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-doux transition-colors hover:text-clair"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`mailto:${site.email}`}
              className="btn-accent px-4 py-2 text-sm"
            >
              Me contacter
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="halo absolute inset-0" />
        <div className="section relative flex min-h-screen flex-col justify-center py-32">
          <p className="surtitre animate-fade-up">{site.titrePrincipal}</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            {site.nom}
          </h1>
          <p className="mt-4 text-lg font-medium text-doux">{site.slogan}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-doux">
            J&apos;ai 20 ans et je conçois des sites web sur mesure, du design à
            la mise en ligne. Là où le design visuel rencontre la stratégie
            digitale — rapides, soignés, et pensés pour tes clients.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#projets" className="btn-accent">
              Voir mes projets
            </a>
            <a href={`mailto:${site.email}`} className="btn-ghost">
              Travailler ensemble
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-sm text-doux">
            <span>
              <span className="text-clair">Basé</span> en France
            </span>
            <span>
              <span className="text-clair">Freelance</span> · BUT MMI 3ᵉ année
            </span>
            <span>
              <span className="text-clair">Dispo</span> pour de nouveaux projets
            </span>
          </div>
        </div>
      </section>

      {/* Projets */}
      <section id="projets" className="section section-y">
        <p className="surtitre">Projets</p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Ce que j&apos;ai construit
        </h2>
        <p className="mt-4 max-w-xl text-doux">
          Du développement web au design et à l&apos;audiovisuel — une sélection
          de projets menés de A à Z.
        </p>

        <div className="mt-16 space-y-20">
          {poles.map((pole) => {
            const items = projetsParPole(pole.id);
            if (items.length === 0) return null;
            return (
              <div key={pole.id}>
                <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {pole.titre}
                  </h3>
                  <p className="text-sm text-doux">{pole.sousTitre}</p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projets/${p.slug}`}
                      className="carte group flex flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-accent">
                          {p.type}
                        </span>
                        {p.lien && (
                          <span className="text-xs text-doux">En ligne</span>
                        )}
                      </div>
                      <h4 className="mt-3 text-2xl font-semibold">{p.titre}</h4>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-doux">
                        {p.resume}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="puce-tech text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                        Voir le projet
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compétences */}
      <section
        id="competences"
        className="border-y border-white/5 bg-surface/40"
      >
        <div className="section section-y">
          <p className="surtitre">Compétences</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Mes outils
          </h2>
          <p className="mt-4 max-w-xl text-doux">
            Un profil complet : je code, je designe, je réalise. De quoi mener un
            projet du début à la fin.
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {competences.map((groupe) => (
              <div key={groupe.categorie}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-clair">
                  {groupe.categorie}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {groupe.items.map((c) => (
                    <span key={c} className="puce-tech text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours / Expériences */}
      <section id="parcours" className="section section-y">
        <p className="surtitre">Parcours</p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Où j&apos;ai travaillé
        </h2>
        <div className="mt-12 space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.structure}
              className="carte flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-8"
            >
              <div className="md:w-1/3">
                <p className="text-lg font-semibold">{exp.structure}</p>
                <span className="text-xs uppercase tracking-widest text-accent">
                  {exp.type}
                </span>
              </div>
              <div className="md:flex-1">
                <p className="font-medium text-clair">{exp.poste}</p>
                <p className="mt-1 text-sm leading-relaxed text-doux">
                  {exp.texte}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* À propos */}
      <section
        id="apropos"
        className="border-y border-white/5 bg-surface/40"
      >
        <div className="section section-y">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
            <div>
              <p className="surtitre">À propos</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Bonjour, moi c&apos;est Silas
              </h2>
            </div>
            <div className="space-y-4 text-doux">
              <p>
                J&apos;ai 20 ans et je suis développeur web full-stack en
                freelance, en parallèle de mon BUT MMI (3ᵉ année). Je crée des
                sites web de A à Z : je pars de ton idée, je dessine
                l&apos;interface, je développe, puis je mets en ligne.
              </p>
              <p>
                Ma formation en MMI me donne une double casquette :{" "}
                <span className="text-clair">développement</span> et{" "}
                <span className="text-clair">
                  design, branding et audiovisuel
                </span>
                . Tu obtiens un interlocuteur unique, du concept au site en
                ligne.
              </p>
              <p>
                Mon dernier projet, <span className="text-clair">Van Alaska</span>
                , est un site de réservation complet : calendrier, paiement en
                ligne, espace client et back-office pour tout gérer sans toucher
                au code.
              </p>
              <p>Une idée en tête ? Écris-moi, on en parle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="section section-y text-center">
          <p className="surtitre">Contact</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            On construit ton site ?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-doux">
            Dis-moi ce que tu as en tête. Je te réponds vite, avec un premier
            avis honnête et un devis clair.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`mailto:${site.email}`} className="btn-accent">
              {site.email}
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="section flex flex-col items-center justify-between gap-3 py-8 text-sm text-doux sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.marque} · {site.nom}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-clair"
            >
              Mentions légales
            </Link>
            <span>Conçu et développé avec Next.js</span>
          </div>
        </div>
      </footer>
    </>
  );
}
