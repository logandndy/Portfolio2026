"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./HeroScene.module.scss";

interface HeroOverlayProps {
  dict: Dictionary;
  lang: Lang;
  isDeskClicked: boolean;
  onExploreClick: () => void;
  onChatOpen: () => void;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  }),
};

export default function HeroOverlay({
  dict,
  lang,
  isDeskClicked,
  onExploreClick,
  onChatOpen,
}: HeroOverlayProps) {
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!statusRef.current) return;
    gsap.to(statusRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      repeatDelay: 1.5,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className={styles["hero-overlay"]}>
      {/* Status badge */}
      <motion.div
        className={styles["hero-status-badge"]}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <span ref={statusRef} className={styles["hero-status-badge__dot"]} />
        <span className={styles["hero-status-badge__text"]}>
          {dict.hero.status_available}
        </span>
      </motion.div>

      {/* Eyebrow */}
      <motion.p
        className={styles["hero-eyebrow"]}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        // {dict.hero.eyebrow}
      </motion.p>

      {/* Name */}
      <motion.h1
        className={styles["hero-title"]}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.5}
      >
        {dict.hero.greeting}{" "}
        <span className={styles["hero-title__name"]}>{dict.hero.name}</span>
      </motion.h1>

      {/* Role */}
      <motion.div
        className={styles["hero-role"]}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.7}
      >
        <span className={styles["hero-role__bracket"]}>[</span>
        <span className={styles["hero-role__text"]}>{dict.hero.role}</span>
        <span className={styles["hero-role__bracket"]}>]</span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        className={styles["hero-tagline"]}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.9}
      >
        {dict.hero.tagline}
      </motion.p>

      {/* CTAs */}
      <motion.div
        className={styles["hero-cta-group"]}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1.1}
      >
        <button
          className={styles["hero-cta-button--primary"]}
          onClick={onExploreClick}
        >
          <span>{dict.hero.cta_projects}</span>
          <span className={styles["hero-cta-button__arrow"]}>→</span>
        </button>
        <a
          href="#contact"
          className={styles["hero-cta-button--secondary"]}
        >
          {dict.hero.cta_contact}
        </a>
        <button
          className={styles["hero-cta-button--chat"]}
          onClick={onChatOpen}
        >
          <span>&gt;_</span>
          <span>{dict.hero.cta_chat}</span>
        </button>
      </motion.div>
    </div>
  );
}
