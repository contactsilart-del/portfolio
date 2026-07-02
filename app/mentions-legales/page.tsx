import Link from "next/link";
import type { Metadata } from "next";
import { site, legal } from "@/app/data/site";

export const metadata: Metadata = {
  title: `Mentions légales — ${site.marque}`,
  description: `Mentions légales du site ${site.marque} — ${site.nom}.`,
  robots: { index: false, follow: true },
};

function Bloc({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-clair">
        {titre}
      </h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-doux">
        {children}
      </div>
    </section>
  );
}

export default function MentionsLegales() {
  return (
    <>
      {/* Nav minimale */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-nuit/80 backdrop-blur">
        <nav className="section flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            SIL<span className="text-accent">ART</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-doux transition-colors hover:text-clair"
          >
            ← Retour à l&apos;accueil
          </Link>
        </nav>
      </header>

      <main className="section max-w-3xl pb-24 pt-32">
        <p className="surtitre">Informations légales</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Mentions légales
        </h1>
        <p className="mt-4 text-sm text-doux">
          Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance
          dans l&apos;économie numérique (LCEN).
        </p>

        <Bloc titre="Éditeur du site">
          <p>
            <span className="text-clair">{legal.editeurNom}</span>
            {legal.editeurStatut ? ` — ${legal.editeurStatut}` : ""}
          </p>
          {legal.editeurAdresse && <p>{legal.editeurAdresse}</p>}
          <p>
            Email :{" "}
            <a
              href={`mailto:${legal.editeurEmail}`}
              className="text-accent hover:underline"
            >
              {legal.editeurEmail}
            </a>
          </p>
          {legal.editeurTelephone && (
            <p>Téléphone : {legal.editeurTelephone}</p>
          )}
          {legal.siret && <p>SIRET : {legal.siret}</p>}
          {legal.tva && <p>TVA intracommunautaire : {legal.tva}</p>}
          {!legal.siret && (
            <p>
              Site édité à titre personnel par une personne physique.
              Conformément à l&apos;article 6-III-2 de la loi n° 2004-575 du 21
              juin 2004 (LCEN), les coordonnées postales de l&apos;éditeur ont
              été communiquées à l&apos;hébergeur et sont disponibles sur simple
              demande à l&apos;adresse email ci-dessus.
            </p>
          )}
        </Bloc>

        <Bloc titre="Responsable de la publication">
          <p>{legal.responsablePublication}</p>
        </Bloc>

        <Bloc titre="Hébergement">
          <p>
            Le site est hébergé par{" "}
            <span className="text-clair">{legal.hebergeurNom}</span>.
          </p>
          {legal.hebergeurAdresse && <p>{legal.hebergeurAdresse}</p>}
          {legal.hebergeurSite && (
            <p>
              <a
                href={legal.hebergeurSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {legal.hebergeurSite.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
        </Bloc>

        <Bloc titre="Propriété intellectuelle">
          <p>
            L&apos;ensemble du contenu de ce site (textes, éléments graphiques,
            interface, code, projets présentés) est la propriété exclusive de{" "}
            {legal.editeurNom}, sauf mention contraire. Toute reproduction,
            représentation, modification ou exploitation, totale ou partielle,
            sans autorisation écrite préalable est interdite et constituerait une
            contrefaçon au sens du Code de la propriété intellectuelle.
          </p>
          <p>
            Les marques, logos et projets clients présentés à titre de références
            restent la propriété de leurs détenteurs respectifs.
          </p>
        </Bloc>

        <Bloc titre="Données personnelles">
          <p>
            Ce site est un portfolio vitrine. Il ne collecte aucune donnée
            personnelle via un formulaire : le seul moyen de contact est le
            courrier électronique, à votre initiative.
          </p>
          <p>
            Les informations que vous transmettez par email (nom, adresse email,
            contenu du message) sont utilisées uniquement pour répondre à votre
            demande et ne sont ni cédées ni revendues à des tiers.
          </p>
          <p>
            Conformément au Règlement général sur la protection des données
            (RGPD) et à la loi « Informatique et Libertés », vous disposez
            d&apos;un droit d&apos;accès, de rectification et de suppression des
            données vous concernant. Pour l&apos;exercer, écrivez à{" "}
            <a
              href={`mailto:${legal.editeurEmail}`}
              className="text-accent hover:underline"
            >
              {legal.editeurEmail}
            </a>
            .
          </p>
          <p>
            Pour plus de détails, consultez la{" "}
            <Link
              href="/politique-de-confidentialite"
              className="text-accent hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </Bloc>

        <Bloc titre="Cookies">
          <p>
            Ce site n&apos;utilise pas de cookies de suivi ni d&apos;outils de
            mesure d&apos;audience. Aucune information n&apos;est stockée sur
            votre appareil à des fins de traçage.
          </p>
        </Bloc>

        <Bloc titre="Liens externes">
          <p>
            Ce site contient des liens vers des sites tiers (projets en ligne,
            réseaux sociaux). {legal.editeurNom} ne saurait être tenu responsable
            du contenu de ces sites externes.
          </p>
        </Bloc>

        <Bloc titre="Crédits">
          <p>
            Conception et développement : {legal.editeurNom} ({site.marque}).
            Site réalisé avec Next.js, React et Tailwind CSS.
          </p>
        </Bloc>

        {legal.miseAJour && (
          <p className="mt-12 text-xs text-doux">
            Dernière mise à jour : {legal.miseAJour}.
          </p>
        )}
      </main>

      <footer className="border-t border-white/5">
        <div className="section flex flex-col items-center justify-between gap-3 py-8 text-sm text-doux sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.marque} · {site.nom}
          </p>
          <Link href="/" className="transition-colors hover:text-clair">
            Retour à l&apos;accueil
          </Link>
        </div>
      </footer>
    </>
  );
}
