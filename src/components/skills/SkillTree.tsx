"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import { SKILLS, SKILL_CATEGORY_ORDER, type Skill, type SkillCategory } from "@/data/skills";
import SkillNode from "./SkillNode";
import styles from "./SkillTree.module.scss";

// Representative colour per category
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
  const sectionRef  = useRef<HTMLElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const isSwitching = useRef(false);
  const hasEntered  = useRef(false);

  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("frontend");
  const [activeSkill, setActiveSkill]       = useState<Skill | null>(null);

  const activeSkills = SKILLS.filter((s) => s.category === activeCategory);

  // ── Entrance ────────────────────────────────────────────────
  useEffect(() => {
    if (!isInView || hasEntered.current) return;
    hasEntered.current = true;

    gsap.from(leftRef.current,  { opacity: 0, x: -28, duration: 0.7, ease: "power3.out" });
    gsap.from(rightRef.current, { opacity: 0, x: 20,  duration: 0.7, delay: 0.12, ease: "power3.out" });
    animateGridIn(0.28);
  }, [isInView]);

  // ── Re-animate grid after category change ───────────────────
  useEffect(() => {
    if (!hasEntered.current) return;
    animateGridIn(0);
  }, [activeCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  function animateGridIn(delay: number) {
    const nodes = gridRef.current?.querySelectorAll("[data-node]")   ?? [];
    const bars  = gridRef.current?.querySelectorAll("[data-bar]")    ?? [];
    gsap.fromTo(nodes,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.48, delay, ease: "power3.out" }
    );
    gsap.fromTo(bars,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left center", stagger: 0.07, duration: 0.6, delay: delay + 0.05, ease: "power3.out" }
    );
  }

  // ── Category switch ─────────────────────────────────────────
  const switchCategory = useCallback((next: SkillCategory) => {
    if (next === activeCategory || isSwitching.current) return;
    isSwitching.current = true;
    setActiveSkill(null);

    const nodes = gridRef.current?.querySelectorAll("[data-node]") ?? [];
    gsap.to(nodes, {
      opacity: 0, y: -14, stagger: 0.035, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActiveCategory(next);
        isSwitching.current = false;
      },
    });
  }, [activeCategory]);

  const catLabel = (cat: SkillCategory) =>
    dict.skills.categories[cat as keyof typeof dict.skills.categories] ?? cat;

  return (
    <section ref={sectionRef} id="skills" className={styles["skills-section"]}>
      <div className={styles["skills-section__topline"]} aria-hidden />

      <div className={styles["skills-inner"]}>

        {/* ── Mobile-only header ── */}
        <header className={styles["skills-mobile-header"]}>
          <p className={styles["skills-eyebrow"]}>// {dict.skills.eyebrow}</p>
          <h2 className={styles["skills-title"]}>{dict.skills.title}</h2>
        </header>

        <div className={styles["skills-layout"]}>

          {/* ══ LEFT PANEL ═══════════════════════════════════ */}
          <div ref={leftRef} className={styles["skills-nav"]}>

            {/* Desktop-only heading */}
            <div className={styles["skills-nav__heading"]}>
              <p className={styles["skills-eyebrow"]}>// {dict.skills.eyebrow}</p>
              <h2 className={styles["skills-title"]}>{dict.skills.title}</h2>
              <p className={styles["skills-subtitle"]}>{dict.skills.subtitle}</p>
            </div>

            {/* Category tabs */}
            <div className={styles["skills-nav__list"]} role="tablist">
              {SKILL_CATEGORY_ORDER.map((cat) => {
                const active = cat === activeCategory;
                const color  = CAT_COLOR[cat];
                const count  = SKILLS.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active}
                    className={`${styles["skills-nav__item"]} ${active ? styles["skills-nav__item--active"] : ""}`}
                    style={{ "--cat-color": color } as React.CSSProperties}
                    onClick={() => switchCategory(cat)}
                  >
                    <span
                      className={styles["skills-nav__dot"]}
                      style={active ? { background: color, boxShadow: `0 0 8px ${color}` } : {}}
                    />
                    <span className={styles["skills-nav__label"]}>{catLabel(cat)}</span>
                    <span className={styles["skills-nav__count"]}
                      style={active ? { color, borderColor: `${color}50` } : {}}>
                      {String(count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══ RIGHT PANEL ══════════════════════════════════ */}
          <div ref={rightRef} className={styles["skills-content"]}>

            {/* Active category header */}
            <div className={styles["skills-content__header"]}>
              <span
                className={styles["skills-content__cat"]}
                style={{ color: CAT_COLOR[activeCategory] }}
              >
                {catLabel(activeCategory)}
              </span>
              <span className={styles["skills-content__count"]}>
                {activeSkills.length}&nbsp;modules
              </span>
              <div
                className={styles["skills-content__bar"]}
                style={{ background: CAT_COLOR[activeCategory], boxShadow: `0 0 12px ${CAT_COLOR[activeCategory]}60` }}
              />
            </div>

            {/* Skill grid */}
            <div ref={gridRef} className={styles["skills-grid"]}>
              {activeSkills.map((skill, i) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  lang={lang}
                  dict={dict}
                  index={i}
                  isActive={activeSkill?.id === skill.id}
                  onActivate={(s) =>
                    setActiveSkill((prev) => (prev?.id === s.id ? null : s))
                  }
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
