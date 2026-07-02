import Link from "next/link";
import type { Metadata } from "next";
import { site, legal } from "@/app/data/site";

export const metadata: Metadata = {
  title: `Politique de confidentialité — ${site.marque}`,
  description: `Politique de confidentialité du site ${site.marque} — ${site.nom}.`,
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

export default function PolitiqueDeConfidentialite() {
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
        <p className="surtitre">Vie privée</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-sm text-doux">
          Cette politique décrit quelles données sont traitées lorsque vous
          visitez ce site, pourquoi, et quels sont vos droits, conformément au
          Règlement général sur la protection des données (RGPD) et à la loi
          « Informatique et Libertés ».
        </p>

        <Bloc titre="Responsable du traitement">
          <p>
            <span className="text-clair">{legal.editeurNom}</span>
            {legal.editeurStatut ? ` — ${legal.editeurStatut}` : ""}
          </p>
          <p>
            Contact :{" "}
            <a
              href={`mailto:${legal.editeurEmail}`}
              className="text-accent hover:underline"
            >
              {legal.editeurEmail}
            </a>
          </p>
        </Bloc>

        <Bloc titre="Données collectées">
          <p>
            Ce site est un portfolio vitrine :{" "}
            <span className="text-clair">
              il ne comporte ni formulaire, ni compte utilisateur, ni outil de
              suivi publicitaire
            </span>
            . Aucune donnée personnelle n&apos;est collectée lors d&apos;une
            simple visite, en dehors des données techniques décrites ci-dessous.
          </p>
          <p>
            <span className="text-clair">Emails :</span> si vous me contactez
            par courrier électronique, je reçois les informations que vous
            choisissez de transmettre (nom, adresse email, contenu du message).
          </p>
          <p>
            <span className="text-clair">Données techniques :</span>{" "}
            l&apos;hébergeur du site ({legal.hebergeurNom}) peut enregistrer
            automatiquement des journaux techniques (adresse IP, type de
            navigateur, pages consultées) à des fins de sécurité et de bon
            fonctionnement du service.
          </p>
        </Bloc>

        <Bloc titre="Finalités et bases légales">
          <p>
            Les informations transmises par email sont utilisées uniquement pour
            répondre à votre demande et assurer le suivi de nos échanges
            (exécution de mesures précontractuelles ou intérêt légitime).
          </p>
          <p>
            Les journaux techniques de l&apos;hébergeur relèvent de son intérêt
            légitime à assurer la sécurité et la continuité du service.
          </p>
        </Bloc>

        <Bloc titre="Durée de conservation">
          <p>
            Les échanges par email sont conservés le temps nécessaire au
            traitement de la demande et au suivi de la relation commerciale
            éventuelle, puis supprimés.
          </p>
        </Bloc>

        <Bloc titre="Destinataires et transferts">
          <p>
            Vos données ne sont ni vendues, ni louées, ni cédées à des tiers.
            Elles ne sont accessibles qu&apos;à {legal.editeurNom}.
          </p>
          <p>
            Le site est hébergé par{" "}
            <span className="text-clair">{legal.hebergeurNom}</span>, dont les
            serveurs peuvent être situés en dehors de l&apos;Union européenne
            (États-Unis). Ces transferts sont encadrés par des garanties
            appropriées (clauses contractuelles types de la Commission
            européenne).
          </p>
        </Bloc>

        <Bloc titre="Cookies">
          <p>
            Ce site n&apos;utilise{" "}
            <span className="text-clair">aucun cookie de suivi</span> ni outil
            de mesure d&apos;audience. Aucune bannière de consentement
            n&apos;est donc nécessaire.
          </p>
        </Bloc>

        <Bloc titre="Vos droits">
          <p>
            Conformément au RGPD, vous disposez des droits d&apos;accès, de
            rectification, d&apos;effacement, d&apos;opposition, de limitation
            du traitement et de portabilité des données vous concernant.
          </p>
          <p>
            Pour les exercer, écrivez à{" "}
            <a
              href={`mailto:${legal.editeurEmail}`}
              className="text-accent hover:underline"
            >
              {legal.editeurEmail}
            </a>
            . Vous pouvez également introduire une réclamation auprès de la
            CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              cnil.fr
            </a>
            ).
          </p>
        </Bloc>

        <Bloc titre="Liens externes">
          <p>
            Ce site contient des liens vers des sites tiers (projets en ligne,
            LinkedIn…). Leur consultation est soumise à leurs propres politiques
            de confidentialité, dont {legal.editeurNom} n&apos;est pas
            responsable.
          </p>
        </Bloc>

        <Bloc titre="Évolution de cette politique">
          <p>
            Cette politique peut être mise à jour pour refléter les évolutions
            du site. La date de dernière mise à jour figure ci-dessous.
          </p>
          <p>
            Voir aussi les{" "}
            <Link
              href="/mentions-legales"
              className="text-accent hover:underline"
            >
              mentions légales
            </Link>
            .
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
