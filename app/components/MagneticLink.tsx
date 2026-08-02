"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/icons/ArrowUpRight";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

export function MagneticLink({
  href,
  label,
  variant = "primary",
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.45 });

  const handleMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.14);
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.14);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div className="magnetic-link-wrap" style={reduceMotion ? undefined : { x: springX, y: springY }}>
      <Link
        href={href}
        className={`magnetic-link magnetic-link-${variant}`}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <span>{label}</span>
        <ArrowUpRight aria-hidden="true" weight="regular" />
      </Link>
    </motion.div>
  );
}
