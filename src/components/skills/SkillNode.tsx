"use client";

import { useRef } from "react";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Skill } from "@/data/skills";
import styles from "./SkillTree.module.scss";

const LEVEL_LABELS = ["—", "INIT", "LEARNING", "PROFICIENT", "ADVANCED", "MASTER"] as const;

interface SkillNodeProps {
  skill:      Skill;
  dict:       Dictionary;
  lang:       Lang;
  index:      number;
  isActive:   boolean;
  onActivate: (s: Skill) => void;
}

export default function SkillNode({ skill, lang, index, isActive, onActivate }: SkillNodeProps) {
  const nodeRef   = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef(false);

  // Expand/collapse detail on isActive change
  if (prevActive.current !== isActive && detailRef.current) {
    const el = detailRef.current;
    if (isActive) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.32, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.22, ease: "power2.in" });
    }
    prevActive.current = isActive;
  }

  const handleMouseEnter = () => {
    gsap.to(nodeRef.current, { y: -3, duration: 0.22, ease: "power2.out", overwrite: "auto" });
  };
  const handleMouseLeave = () => {
    gsap.to(nodeRef.current, { y: 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  };

  const pct         = (skill.level / 5) * 100;
  const levelLabel  = LEVEL_LABELS[skill.level];
  const description = lang === "fr" ? skill.descriptionFr : skill.descriptionEn;

  return (
    <div
      ref={nodeRef}
      data-node
      className={`${styles["skill-node"]} ${isActive ? styles["skill-node--active"] : ""}`}
      style={{
        "--skill-color":      skill.color,
        "--skill-color-faint": `${skill.color}18`,
        "--skill-color-glow":  `${skill.color}50`,
      } as React.CSSProperties}
      onClick={() => onActivate(skill)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onActivate(skill)}
      aria-expanded={isActive}
    >
      {/* Left accent */}
      <div className={styles["skill-node__accent"]} />

      {/* Main row */}
      <div className={styles["skill-node__row"]}>
        {/* Icon badge */}
        <div className={styles["skill-node__icon"]} style={{ borderColor: `${skill.color}70`, color: skill.color }}>
          {skill.icon}
        </div>

        {/* Name + bar */}
        <div className={styles["skill-node__center"]}>
          <div className={styles["skill-node__name"]}>{skill.name}</div>
          <div className={styles["skill-node__track"]}>
            <div
              data-bar
              className={styles["skill-node__bar"]}
              style={{
                width: `${pct}%`,
                background: skill.color,
                boxShadow: `0 0 8px ${skill.color}70`,
              }}
            />
          </div>
        </div>

        {/* Level label + index */}
        <div className={styles["skill-node__meta"]}>
          <span className={styles["skill-node__level"]} style={{ color: skill.color }}>
            {levelLabel}
          </span>
          <span className={styles["skill-node__pct"]}>{pct}%</span>
        </div>
      </div>

      {/* Expandable description */}
      <div ref={detailRef} className={styles["skill-node__detail"]} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p className={styles["skill-node__desc"]}>{description}</p>
      </div>
    </div>
  );
}
