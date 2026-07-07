import Link from "next/link";
import { experiences } from "@/app/data/projets";
import { site } from "@/app/data/site";
import { slotImage } from "@/app/data/images";
import { getImagesManifest } from "@/app/data/images-server";
import { getProjets } from "@/app/data/projets-server";
import FadeIn from "@/app/components/FadeIn";
import Magnet from "@/app/components/Magnet";
import AnimatedText from "@/app/components/AnimatedText";
import MarqueeSection from "@/app/components/MarqueeSection";
import ProjectsStack from "@/app/components/ProjectsStack";
import LogosClients from "@/app/components/LogosClients";
import Forme3D from "@/app/components/Forme3D";

const liensNav = [
  { href: "#projets", label: "Projets" },
  { href: "#services", label: "Services" },
  { href: "#apropos", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

const APROPOS_TEXT =
  "J'ai 20 ans, je suis développeur web full-stack en freelance, en parallèle de mon BUT MMI. Formé au design autant qu'au code, je crée des sites de A à Z : l'idée, la maquette, le développement, la mise en ligne. Construisons quelque chose d'incroyable ensemble !";

const services = [
  {
    num: "01",
    nom: "Sites sur mesure",
    desc: "Conception et développement de sites complets avec Next.js et React : vitrine, réservation, espace client — du design à la mise en ligne.",
  },
  {
    num: "02",
    nom: "E-commerce",
    desc: "Boutiques en ligne sous Shopify ou sur mesure : catalogue, tunnel de vente, paiement Stripe et optimisation de la conversion.",
  },
  {
    num: "03",
    nom: "UI/UX Design",
    desc: "Maquettes et interfaces claires, pensées pour l'utilisateur : wireframes, prototypes et design systems fidèles à votre image.",
  },
  {
    num: "04",
    nom: "Branding & identité",
    desc: "Logos, identités visuelles et supports print qui donnent une image cohérente et mémorable à votre marque.",
  },
  {
    num: "05",
    nom: "Audiovisuel & contenu",
    desc: "Vidéo, photo, drone, montage et color grading pour raconter votre histoire et animer vos réseaux.",
  },
];

/**
 * Éléments 3D flottants aux coins de la section À propos.
 * Remplaçables via /admin (onglet Accueil) ; formes d'exemple par défaut.
 * Positionnés hors du texte au repos — le Magnet et le flottement peuvent
 * les faire passer dessus, sans jamais bloquer la souris (pointer-events).
 */
const coins3d = [
  // Mobile (pas de souris → lévitation seule) : petites formes dans les
  // zones de marge haut/bas de la section, jamais sur le texte.
  // Desktop (lg+) : sur les flancs du titre et du paragraphe, + effet magnétique.
  {
    slot: "apropos.forme-1",
    defaut: "/images/3d/forme-1.svg",
    classes: "left-[6%] top-[2%] lg:left-[5%] lg:top-[16%]",
    delay: 0.2,
    x: -60,
    duree: "5.6s",
  },
  {
    slot: "apropos.forme-2",
    defaut: "/images/3d/forme-2.svg",
    classes: "right-[6%] top-[3.5%] lg:right-[5%] lg:top-[18%]",
    delay: 0.3,
    x: 60,
    duree: "6.4s",
  },
  {
    slot: "apropos.forme-3",
    defaut: "/images/3d/forme-3.svg",
    classes: "bottom-[2%] left-[8%] lg:bottom-auto lg:left-[4%] lg:top-[48%]",
    delay: 0.4,
    x: -60,
    duree: "7s",
  },
  {
    slot: "apropos.forme-4",
    defaut: "/images/3d/forme-4.svg",
    classes: "bottom-[3.5%] right-[8%] lg:bottom-auto lg:right-[4%] lg:top-[46%]",
    delay: 0.5,
    x: 60,
    duree: "6s",
  },
];

const pilulesApropos = [
  {
    texte: "Next.js & React",
    classes:
      "left-[2%] top-[6%] -rotate-6 sm:left-[4%] md:left-[6%]",
    delay: 0.1,
    x: -80,
  },
  {
    texte: "UI/UX & Branding",
    classes: "right-[2%] top-[6%] rotate-3 sm:right-[4%] md:right-[6%]",
    delay: 0.15,
    x: 80,
  },
  {
    texte: "Shopify & WordPress",
    classes:
      "bottom-[8%] left-[3%] rotate-6 sm:left-[6%] md:left-[10%]",
    delay: 0.25,
    x: -80,
  },
  {
    texte: "Vidéo · Photo · Drone",
    classes:
      "bottom-[8%] right-[3%] -rotate-3 sm:right-[6%] md:right-[10%]",
    delay: 0.3,
    x: 80,
  },
];

export default async function Home() {
  const manifest = await getImagesManifest();
  const projets = await getProjets();
  const portrait = slotImage(manifest, "hero.portrait");

  return (
    <main style={{ overflowX: "clip" }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section id="top" className="relative flex h-screen flex-col">
        <div className="halo pointer-events-none absolute inset-0" />

        {/* Navbar */}
        <FadeIn delay={0} y={-20}>
          <nav className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
            {liensNav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-medium uppercase tracking-wider text-clair transition-opacity duration-200 hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </FadeIn>

        {/* Titre géant */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-hidden">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading whitespace-nowrap text-center text-[22vw] font-black uppercase leading-none tracking-tight">
              SILART
            </h1>
          </FadeIn>
          <FadeIn delay={0.35} y={20}>
            <p
              className="mt-3 text-center font-light uppercase tracking-[0.3em] text-clair"
              style={{ fontSize: "clamp(0.75rem, 1.6vw, 1.4rem)" }}
            >
              Silas Clamens Albert · Développeur web full-stack
            </p>
          </FadeIn>
        </div>

        {/* Portrait — effet magnétique (défini via /admin) */}
        {portrait && (
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-[240px] -translate-x-1/2 sm:w-[320px] md:w-[400px] lg:w-[460px]">
            <FadeIn delay={0.6} y={30}>
              <Magnet padding={150} strength={3}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={portrait} alt={`Portrait de ${site.nom}`} className="w-full" />
              </Magnet>
            </FadeIn>
          </div>
        )}

        {/* Barre du bas — empilée et centrée sur mobile (déborde sinon) */}
        <div className="z-20 flex flex-col items-center gap-4 px-6 pb-7 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-8 sm:text-left md:px-10 md:pb-10">
          <FadeIn delay={0.45} y={20}>
            <p
              className="max-w-[280px] font-light uppercase leading-snug tracking-wide text-doux sm:max-w-[240px] md:max-w-[300px]"
              style={{ fontSize: "clamp(0.7rem, 1.3vw, 1.25rem)" }}
            >
              designer · développeur · créatif — freelance, en parallèle du BUT
              MMI, dispo pour de nouveaux projets
            </p>
          </FadeIn>
          <FadeIn delay={0.6} y={20}>
            <Magnet padding={80} strength={4}>
              <a href="#contact" className="btn-accent">
                Me contacter
              </a>
            </Magnet>
          </FadeIn>
        </div>
      </section>

      {/* ── Marquee projets ──────────────────────────────── */}
      <MarqueeSection manifest={manifest} projets={projets} />

      {/* ── À propos ─────────────────────────────────────── */}
      <section
        id="apropos"
        className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10"
      >
        {/* Éléments 3D flottants en coins (gérés via /admin) */}
        {coins3d.map((c) => (
          <FadeIn
            key={c.slot}
            delay={c.delay}
            x={c.x}
            y={0}
            duration={0.9}
            className={`pointer-events-none absolute z-10 ${c.classes}`}
          >
            <Forme3D src={slotImage(manifest, c.slot) ?? c.defaut} duree={c.duree} />
          </FadeIn>
        ))}

        {/* Pilules décoratives en coins */}
        {pilulesApropos.map((p) => (
          <FadeIn
            key={p.texte}
            delay={p.delay}
            x={p.x}
            y={0}
            duration={0.9}
            className={`absolute hidden sm:block ${p.classes}`}
          >
            <span className="inline-block rounded-full border border-white/15 bg-surface px-5 py-2.5 text-xs uppercase tracking-widest text-doux md:text-sm">
              {p.texte}
            </span>
          </FadeIn>
        ))}

        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading text-center font-black uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              À propos
            </h2>
          </FadeIn>
          <AnimatedText
            text={APROPOS_TEXT}
            className="max-w-[560px] text-center font-medium leading-relaxed text-clair"
            style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
          />
        </div>

        {/* Parcours compact */}
        <FadeIn delay={0.1} y={30} className="mt-16 w-full max-w-4xl sm:mt-20">
          <div className="grid gap-3 sm:grid-cols-3">
            {experiences.map((exp) => (
              <div
                key={exp.structure}
                className="rounded-2xl border border-white/10 bg-surface/60 px-5 py-4"
              >
                <p className="text-xs uppercase tracking-widest text-accent">
                  {exp.type}
                </p>
                <p className="mt-1 font-medium text-clair">{exp.structure}</p>
                <p className="mt-0.5 text-sm font-light text-doux">{exp.poste}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="mt-14 sm:mt-16">
          <FadeIn delay={0.15} y={20}>
            <a href="#contact" className="btn-accent">
              Me contacter
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── Services (fond clair) ────────────────────────── */}
      <section
        id="services"
        className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      >
        <FadeIn y={40}>
          <h2
            className="mb-16 text-center font-black uppercase leading-none tracking-tight text-nuit sm:mb-20 md:mb-28"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            Services
          </h2>
        </FadeIn>

        <div className="mx-auto max-w-5xl">
          {services.map((service, i) => (
            <FadeIn key={service.num} delay={i * 0.1}>
              <div
                className={`flex items-start gap-6 py-8 sm:gap-10 sm:py-10 md:gap-16 md:py-12 ${
                  i < services.length - 1 ? "border-b" : ""
                }`}
                style={{ borderColor: "rgba(12, 12, 12, 0.15)" }}
              >
                <span
                  className="flex-shrink-0 font-black leading-none text-nuit"
                  style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
                >
                  {service.num}
                </span>
                <div className="flex flex-col gap-2 pt-2 sm:gap-3 sm:pt-3">
                  <h3
                    className="font-medium uppercase text-nuit"
                    style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                  >
                    {service.nom}
                  </h3>
                  <p
                    className="max-w-2xl font-light leading-relaxed text-nuit opacity-60"
                    style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                  >
                    {service.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Projets (cartes empilées) ────────────────────── */}
      <section
        id="projets"
        className="relative z-10 -mt-10 rounded-t-[40px] bg-nuit px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
      >
        <FadeIn y={40}>
          <h2
            className="hero-heading mb-6 text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            Projets
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} y={20}>
          <p className="mx-auto mb-16 max-w-md text-center font-light text-doux sm:mb-20 md:mb-24">
            Trois pôles, dix-huit projets. Chaque projet a sa page dédiée —
            clique pour voir les détails.
          </p>
        </FadeIn>

        <ProjectsStack manifest={manifest} projets={projets} />
      </section>

      {/* ── Ils me font confiance ────────────────────────── */}
      <LogosClients manifest={manifest} />

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="section section-y text-center">
        <FadeIn y={30}>
          <p className="surtitre">Contact</p>
          <h2
            className="hero-heading mx-auto mt-4 font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 8vw, 96px)" }}
          >
            On construit ton site ?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-light text-doux">
            Dis-moi ce que tu as en tête. Je te réponds vite, avec un premier
            avis honnête et un devis clair.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* lowercase : l'email en capitales larges déborde sur petit écran */}
            <a
              href={`mailto:${site.email}`}
              className="btn-accent max-w-full"
              style={{ textTransform: "lowercase" }}
            >
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
        </FadeIn>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/5">
        <div className="section flex flex-col items-center justify-between gap-3 py-8 text-center text-sm text-doux sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.marque} · {site.nom}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-clair"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="transition-colors hover:text-clair"
            >
              Confidentialité
            </Link>
            <span>Conçu et développé avec Next.js</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
