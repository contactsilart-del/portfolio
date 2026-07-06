import {
  GALERIE_LOGOS,
  galerieImages,
  logosClientsDefaut,
  type ImagesManifest,
} from "@/app/data/images";
import FadeIn from "./FadeIn";

/**
 * Section « Ils me font confiance » : bande de logos en défilement continu.
 * Animation CSS pure (voir .logos-piste dans globals.css) : boucle sans
 * couture grâce à deux copies de la liste, pause au survol, désactivée
 * si l'utilisateur préfère réduire les animations.
 */
export default function LogosClients({ manifest }: { manifest: ImagesManifest }) {
  const persos = galerieImages(manifest, GALERIE_LOGOS);
  const logos = persos.length > 0 ? persos : logosClientsDefaut;
  // Durée proportionnelle au nombre de logos : vitesse constante
  const duree = Math.max(logos.length * 4, 16);

  const Liste = () => (
    <ul className="flex w-max shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24">
      {logos.map((src, i) => (
        <li key={`${src}-${i}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-8 w-auto max-w-[180px] opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-10"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Ils me font confiance" className="border-y border-white/5 py-16 md:py-24">
      <FadeIn y={30}>
        <p className="surtitre text-center">Confiance</p>
        <h2 className="mt-3 text-center text-2xl font-semibold uppercase tracking-tight text-clair md:text-4xl">
          Ils me font confiance
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <div
          className="mt-12 overflow-hidden md:mt-16"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div
            className="logos-piste flex w-max"
            style={{ "--duree": `${duree}s` } as React.CSSProperties}
          >
            <Liste />
            <Liste />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
