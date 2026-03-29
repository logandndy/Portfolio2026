"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import HeroDeskSVG from "./HeroDeskSVG";
import styles from "./HeroScene.module.scss";

interface HeroSceneProps {
  dict: Dictionary;
  lang: Lang;
  onChatOpen: () => void;
}

export default function HeroScene({ dict, lang, onChatOpen }: HeroSceneProps) {
  const handleFolderClick = (section: string) => {
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <section className={styles["hero-section"]} id="hero">
      <HeroDeskSVG
        lang={lang}
        onMonitorClick={onChatOpen}
        onFolderClick={handleFolderClick}
      />

      <motion.div
        className={styles["hero-scroll-hint"]}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0.5, 1], y: [10, 0, 5, 0] }}
        transition={{ delay: 2.5, duration: 2, repeat: Infinity, repeatDelay: 4 }}
      >
        <span className={styles["hero-scroll-hint__text"]}>
          {dict.hero.scroll_hint}
        </span>
        <span className={styles["hero-scroll-hint__arrow"]}>↓</span>
      </motion.div>
    </section>
  );
}
