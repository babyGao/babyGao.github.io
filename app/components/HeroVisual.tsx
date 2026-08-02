"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.45], [0, 72]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [1, 1.05]);

  return (
    <motion.div
      className="hero-visual"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={reduceMotion ? undefined : { y, scale }}
    >
      <Image
        src="/hero-cinematic.png"
        alt="Chrome and smoked glass sculpture above dark water"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 58vw"
        className="hero-image"
      />
      <div className="hero-image-scrim" />
    </motion.div>
  );
}
