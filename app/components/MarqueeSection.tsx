"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Projet } from "@/app/data/projets";
import { slotImage, type ImagesManifest } from "@/app/data/images";

function Tuile({ projet, cover }: { projet: Projet; cover: string | null }) {
  if (cover) {
    return (
      <Link
        href={`/projets/${projet.slug}`}
        className="group relative h-[270px] w-[320px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-[420px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={projet.titre}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="text-xs uppercase tracking-widest text-accent">
            {projet.type}
          </span>
          <h3 className="mt-1 text-2xl font-semibold text-clair">
            {projet.titre}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/projets/${projet.slug}`}
      className="flex h-[270px] w-[320px] flex-shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-surface p-6 transition-colors hover:border-clair/50 sm:w-[420px]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-widest text-accent">
          {projet.type}
        </span>
        {projet.lien && (
          <span className="text-[10px] uppercase tracking-widest text-doux">
            En ligne
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-clair">{projet.titre}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-doux">
          {projet.resume}
        </p>
      </div>
    </Link>
  );
}

function MarqueeRow({
  items,
  transform,
  manifest,
}: {
  items: Projet[];
  transform: string;
  manifest: ImagesManifest;
}) {
  return (
    <div className="flex w-max gap-3" style={{ transform, willChange: "transform" }}>
      {[...items, ...items, ...items].map((projet, i) => (
        <Tuile
          key={`${projet.slug}-${i}`}
          projet={projet}
          cover={slotImage(manifest, `projet.${projet.slug}.cover`)}
        />
      ))}
    </div>
  );
}

export default function MarqueeSection({
  manifest,
  projets,
}: {
  manifest: ImagesManifest;
  projets: Projet[];
}) {
  const row1 = projets.filter((p) => p.pole === "dev");
  const row2 = projets.filter((p) => p.pole !== "dev");
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      setOffset(
        (window.scrollY - sectionRef.current.offsetTop + window.innerHeight) * 0.3
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-nuit pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <MarqueeRow
          items={row1}
          transform={`translateX(${offset - 200}px)`}
          manifest={manifest}
        />
        <MarqueeRow
          items={row2}
          transform={`translateX(${-(offset - 200)}px)`}
          manifest={manifest}
        />
      </div>
    </section>
  );
}
