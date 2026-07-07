"use client";

import { motion } from "framer-motion";
import Magnet from "./Magnet";

/**
 * Élément 3D flottant de la section À propos.
 * - Lévitation continue (classe .flottant)
 * - Attraction magnétique au survol (desktop)
 * - Saisissable (souris ou doigt) : on peut le lâcher n'importe où,
 *   il revient en ressort doux vers sa position d'origine
 */
export default function Forme3D({ src, duree }: { src: string; duree: string }) {
  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: 65, bounceDamping: 13 }}
      whileDrag={{ scale: 1.12 }}
      whileHover={{ scale: 1.05 }}
      className="pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <Magnet padding={150} strength={2.2}>
        <div className="flottant" style={{ "--flotte-duree": duree } as React.CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            className="w-20 select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] sm:w-24 lg:w-36"
          />
        </div>
      </Magnet>
    </motion.div>
  );
}
