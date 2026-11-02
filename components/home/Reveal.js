"use client";

import { motion } from "framer-motion";

// Scroll-triggered fade and rise. Reduced-motion users skip the transform (see MotionConfig in Providers).
export function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ id, eyebrow, title, text }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-ink">{eyebrow}</p>
      )}
      <h2 id={id} className="text-3xl font-extrabold sm:text-4xl">
        {title}
      </h2>
      {text && <p className="text-foreground/70">{text}</p>}
    </Reveal>
  );
}
