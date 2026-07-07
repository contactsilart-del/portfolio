"use client";

/**
 * Logo de la bande « Ils me font confiance ».
 * Si le fichier n'existe plus (entrée orpheline du manifeste), le logo
 * se masque tout seul au lieu de laisser un espace vide dans la bande.
 */
export default function LogoImg({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      className="h-8 w-auto max-w-[180px] opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-10"
      onError={(e) => {
        const li = e.currentTarget.closest("li");
        if (li) li.style.display = "none";
      }}
    />
  );
}
