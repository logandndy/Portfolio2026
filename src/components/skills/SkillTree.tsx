"use client";

import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import { SKILLS, SKILL_CATEGORY_ORDER, type SkillCategory } from "@/data/skills";
import SkillNode from "./SkillNode";
import styles from "./SkillTree.module.scss";

const CAT_ICON: Record<SkillCategory, string> = {
  frontend:  "FE",
  backend:   "BE",
  "3d_game": "3D",
  tools:     "//",
};

const CAT_COLOR: Record<SkillCategory, string> = {
  frontend:  "#61dafb",
  backend:   "#68a063",
  "3d_game": "#00d4ff",
  tools:     "#ff6b2b",
};

interface SkillTreeProps {
  dict: Dictionary;
  lang: Lang;
}

export default function SkillTree({ dict, lang }: SkillTreeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });
  const animated   = useRef(false);

  useEffect(() => {
    if (!isInView || animated.current || !bodyRef.current) return;
    animated.current = true;

    const rows = bodyRef.current.querySelectorAll("[data-row]");
    const bars = bodyRef.current.querySelectorAll("[data-bar]");

    gsap.fromTo(rows,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, stagger: 0.045, duration: 0.4, ease: "power3.out", delay: 0.15 }
    );
    gsap.fromTo(bars,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left center", stagger: 0.045, duration: 0.55, ease: "power3.out", delay: 0.25 }
    );
  }, [isInView]);

  return (
    <section ref={sectionRef} id="skills" className={styles.section}>

      {/* Top accent line */}
      <div className={styles.topline} aria-hidden />

      <div className={styles.inner}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles["header__left"]}>
            <p className={styles.eyebrow}>// {dict.skills.eyebrow}</p>
            <h2 className={styles.title}>{dict.skills.title}</h2>
          </div>
          <div className={styles["header__stats"]}>
            <span className={styles["stat"]}>
              <span className={styles["stat__num"]}>{SKILLS.length}</span>
              <span className={styles["stat__label"]}>modules</span>
            </span>
            <span className={styles["stat"]}>
              <span className={styles["stat__num"]}>{SKILL_CATEGORY_ORDER.length}</span>
              <span className={styles["stat__label"]}>domains</span>
            </span>
          </div>
        </header>

        {/* ── Grid: 2 cols on desktop ── */}
        <div ref={bodyRef} className={styles.grid}>
          {SKILL_CATEGORY_ORDER.map((cat) => {
            const catSkills = SKILLS.filter((s) => s.category === cat);
            const label     = dict.skills.categories[cat as keyof typeof dict.skills.categories];
            return (
              <div key={cat} className={styles.group}>
                {/* Category header row */}
                <div
                  className={styles["group__header"]}
                  style={{ "--cat-color": CAT_COLOR[cat] } as React.CSSProperties}
                >
                  <span className={styles["group__icon"]}>{CAT_ICON[cat]}</span>
                  <span className={styles["group__label"]}>{label}</span>
                  <span className={styles["group__count"]}>{catSkills.length}</span>
                  <div className={styles["group__line"]} />
                </div>

                {/* Skills */}
                {catSkills.map((skill, i) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    lang={lang}
                    dict={dict}
                    index={i}
                  />
                ))}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
