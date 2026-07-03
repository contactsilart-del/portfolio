"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { poles, projetsParPole, type Pole } from "@/app/data/projets";
import { slotImage, type ImagesManifest } from "@/app/data/images";

function CartePole({
  pole,
  index,
  total,
  progress,
  manifest,
}: {
  pole: { id: Pole; titre: string; sousTitre: string };
  index: number;
  total: number;
  progress: MotionValue<number>;
  manifest: ImagesManifest;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const items = projetsParPole(pole.id);

  return (
    <div
      className="sticky top-[calc(5rem_+_var(--stack))] h-[85vh] md:top-[calc(6rem_+_var(--stack))]"
      style={{ "--stack": `${index * 28}px` } as CSSProperties}
    >
      <motion.div
        style={{ scale, transformOrigin: "top center" }}
        className="rounded-[36px] border-2 border-clair/70 bg-nuit p-6 sm:p-8 md:rounded-[48px] md:p-10"
      >
        {/* En-tête de carte */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-5 md:gap-8">
            <span
              className="hero-heading font-black leading-none"
              style={{ fontSize: "clamp(3rem, 8vw, 110px)" }}
            >
              0{index + 1}
            </span>
            <div>
              <h3 className="text-xl font-semibold uppercase tracking-tight text-clair sm:text-2xl md:text-3xl">
                {pole.titre}
              </h3>
              <p className="mt-1 text-sm font-light text-doux">{pole.sousTitre}</p>
            </div>
          </div>
          <span className="hidden text-xs uppercase tracking-widest text-doux md:block">
            {items.length} projets
          </span>
        </div>

        {/* Liste des projets du pôle */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8">
          {items.map((p) => {
            const cover = slotImage(manifest, `projet.${p.slug}.cover`);
            return (
              <Link
                key={p.slug}
                href={`/projets/${p.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/60 px-5 py-4 transition-colors hover:border-clair/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      className="h-12 w-16 flex-shrink-0 rounded-lg border border-white/10 object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-clair">{p.titre}</p>
                    <p className="mt-0.5 truncate text-xs uppercase tracking-wider text-doux">
                      {p.type}
                    </p>
                  </div>
                </div>
                <svg
                  className="h-4 w-4 flex-shrink-0 text-accent transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsStack({ manifest }: { manifest: ImagesManifest }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="mx-auto max-w-6xl">
      {poles.map((pole, i) => (
        <CartePole
          key={pole.id}
          pole={pole}
          index={i}
          total={poles.length}
          progress={scrollYProgress}
          manifest={manifest}
        />
      ))}
    </div>
  );
}
