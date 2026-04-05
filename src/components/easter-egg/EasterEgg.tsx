"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./EasterEgg.module.scss";

interface EasterEggProps {
  dict: Dictionary;
  lang: Lang;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  duration: number;
  delay: number;
  color: string;
  size: number;
}

const NEON_COLORS = ["#00d4ff", "#9b5de5", "#ff6b2b", "#00ff88", "#f7df1e"];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    duration: 1.5 + Math.random() * 2,
    delay: Math.random() * 0.8,
    color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    size: 4 + Math.random() * 8,
  }));
}

export default function EasterEgg({ dict, lang, onClose }: EasterEggProps) {
  const particles = useRef(createParticles(60));

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className={styles["easter-egg-overlay"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      >
        {/* Neon confetti */}
        <div className={styles["easter-egg-confetti"]} aria-hidden>
          {particles.current.map((p) => (
            <motion.div
              key={p.id}
              className={styles["confetti-particle"]}
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: "100vh",
                opacity: [1, 1, 0],
                rotate: 720,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
                repeat: Infinity,
                repeatDelay: Math.random() * 1,
              }}
            />
          ))}
        </div>

        {/* Modal */}
        <motion.div
          className={styles["easter-egg-modal"]}
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles["easter-egg-modal__header"]}>
            <span className={styles["easter-egg-modal__code"]}>
              {lang === "fr" ? "// SÉQUENCE DÉTECTÉE" : "// SEQUENCE DETECTED"}
            </span>
            <button
              className={styles["easter-egg-modal__close"]}
              onClick={onClose}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <h2 className={styles["easter-egg-modal__title"]}>
            {dict.easter_egg.title}
          </h2>
          <p className={styles["easter-egg-modal__subtitle"]}>
            {dict.easter_egg.subtitle}
          </p>
          <p className={styles["easter-egg-modal__message"]}>
            {dict.easter_egg.message}
          </p>

          <div className={styles["easter-egg-modal__actions"]}>
            <a
              href={`/cv/cv-${lang}.pdf`}
              download
              className={styles["easter-egg-modal__download"]}
            >
              <span>↓</span>
              {dict.easter_egg.download}
            </a>
            <button
              className={styles["easter-egg-modal__close-btn"]}
              onClick={onClose}
            >
              {lang === "fr" ? "Fermer" : "Close"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
