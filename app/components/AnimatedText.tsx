"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  const total = text.length;
  let cursor = 0;

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wordIndex) => {
        const start = cursor;
        cursor += word.length + 1;
        return (
          <span key={wordIndex}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIndex) => (
                <Char
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  range={[
                    (start + charIndex) / total,
                    (start + charIndex + 1) / total,
                  ]}
                />
              ))}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
