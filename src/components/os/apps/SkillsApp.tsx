"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SKILLS, SKILL_CATEGORY_ORDER, type SkillCategory } from "@/data/skills";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./SkillsApp.module.scss";

const CAT_META: Record<SkillCategory, { tag: string; color: string }> = {
  frontend: { tag: "FE", color: "#00d4ff" },
  backend:  { tag: "BE", color: "#00ff88" },
  "3d_game":{ tag: "3D", color: "#9b5de5" },
  tools:    { tag: "⚙",  color: "#ff6b2b" },
};

interface SkillsAppProps {
  dict: Dictionary;
  lang: Lang;
}

export default function SkillsApp({ dict, lang }: SkillsAppProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current || !listRef.current) return;
    animated.current = true;
    const rows = listRef.current.querySelectorAll("[data-row]");
    const bars = listRef.current.querySelectorAll("[data-bar]");
    gsap.fromTo(rows, { opacity: 0, x: -12 }, {
      opacity: 1, x: 0, duration: 0.35,
      stagger: 0.04, ease: "power3.out", delay: 0.1
    });
    gsap.fromTo(bars, { scaleX: 0 }, {
      scaleX: 1, duration: 0.5,
      stagger: 0.04, ease: "power3.out",
      transformOrigin: "left center", delay: 0.2
    });
  }, []);

  const LEVEL_LABEL = ["", "INIT", "LEARN", "PROF", "ADV", "MASTER"] as const;
  const [openId, setOpenId] = useState<string | null>(null);
  const detailRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggle = (id: string) => {
    const isOpen = openId === id;
    // Close current
    if (openId) {
      const el = detailRefs.current.get(openId);
      if (el) gsap.to(el, { height: 0, opacity: 0, duration: 0.18, ease: "power2.in" });
    }
    if (isOpen) { setOpenId(null); return; }
    setOpenId(id);
    const el = detailRefs.current.get(id);
    if (el) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.25, ease: "power3.out" }
      );
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.scroll} ref={listRef}>
        {SKILL_CATEGORY_ORDER.map(cat => {
          const skills = SKILLS.filter(s => s.category === cat);
          if (!skills.length) return null;
          const meta = CAT_META[cat];
          const catLabel = dict.skills.categories[cat as keyof typeof dict.skills.categories];
          return (
            <div key={cat} className={styles.group} style={{ "--cat-color": meta.color } as React.CSSProperties}>
              <div className={styles.group__header}>
                <span className={styles.group__tag}>{meta.tag}</span>
                <span className={styles.group__label}>{catLabel}</span>
                <span className={styles.group__count}>{skills.length}</span>
                <div className={styles.group__line} />
              </div>

              {skills.map(skill => {
                const pct  = Math.round((skill.level / 5) * 100);
                const desc = lang === "fr" ? skill.descriptionFr : skill.descriptionEn;
                const isOpen = openId === skill.id;
                return (
                  <div
                    key={skill.id}
                    data-row
                    className={`${styles.node} ${isOpen ? styles["node--open"] : ""}`}
                    style={{ "--skill-color": skill.color } as React.CSSProperties}
                  >
                    <div
                      className={styles.node__row}
                      onClick={() => toggle(skill.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onKeyDown={e => e.key === "Enter" && toggle(skill.id)}
                    >
                      <span className={styles.node__dot} style={{ background: skill.color }}/>
                      <span className={styles.node__icon} style={{ color: skill.color }}>{skill.icon}</span>
                      <span className={styles.node__name}>{skill.name}</span>
                      <div className={styles.node__track}>
                        <div data-bar className={styles.node__bar} style={{ width: `${pct}%`, background: skill.color }}/>
                      </div>
                      <span className={styles.node__level} style={{ color: skill.color }}>{LEVEL_LABEL[skill.level]}</span>
                      <span className={styles.node__pct}>{pct}%</span>
                      <span className={`${styles.node__chevron} ${isOpen ? styles["node__chevron--open"] : ""}`}>›</span>
                    </div>
                    <div
                      ref={el => { if (el) detailRefs.current.set(skill.id, el); }}
                      style={{ height: 0, overflow: "hidden", opacity: 0 }}
                    >
                      <p className={styles.node__desc}>{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
