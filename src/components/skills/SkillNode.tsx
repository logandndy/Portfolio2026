"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Skill } from "@/data/skills";
import styles from "./SkillTree.module.scss";

const LEVEL_LABEL = ["", "INIT", "LEARNING", "PROFICIENT", "ADVANCED", "MASTER"] as const;

interface SkillNodeProps {
  skill:  Skill;
  dict:   Dictionary;
  lang:   Lang;
  index:  number;
}

export default function SkillNode({ skill, lang, index }: SkillNodeProps) {
  const rowRef    = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    const el = detailRef.current;
    if (!el) return;
    if (next) {
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.28, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
    }
  };

  const handleEnter = () =>
    gsap.to(rowRef.current, { x: 4, duration: 0.18, ease: "power2.out", overwrite: "auto" });
  const handleLeave = () =>
    gsap.to(rowRef.current, { x: 0, duration: 0.3, ease: "power3.out", overwrite: "auto" });

  const pct  = Math.round((skill.level / 5) * 100);
  const desc = lang === "fr" ? skill.descriptionFr : skill.descriptionEn;

  return (
    <div
      data-row
      className={`${styles.node} ${open ? styles["node--open"] : ""}`}
      style={{ "--skill-color": skill.color, "--skill-faint": `${skill.color}14` } as React.CSSProperties}
    >
      {/* Main row */}
      <div
        ref={rowRef}
        className={styles["node__row"]}
        onClick={toggle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
      >
        {/* Accent dot */}
        <span
          className={styles["node__dot"]}
          style={{ background: skill.color, boxShadow: `0 0 6px ${skill.color}` }}
        />

        {/* Icon */}
        <span className={styles["node__icon"]} style={{ color: skill.color }}>
          {skill.icon}
        </span>

        {/* Name */}
        <span className={styles["node__name"]}>{skill.name}</span>

        {/* Progress bar */}
        <div className={styles["node__track"]}>
          <div
            data-bar
            className={styles["node__bar"]}
            style={{ width: `${pct}%`, background: skill.color }}
          />
        </div>

        {/* Level + pct */}
        <span className={styles["node__level"]} style={{ color: skill.color }}>
          {LEVEL_LABEL[skill.level]}
        </span>
        <span className={styles["node__pct"]}>{pct}%</span>

        {/* Expand chevron */}
        <span className={`${styles["node__chevron"]} ${open ? styles["node__chevron--open"] : ""}`}>›</span>
      </div>

      {/* Expandable description */}
      <div
        ref={detailRef}
        className={styles["node__detail"]}
        style={{ height: 0, overflow: "hidden", opacity: 0 }}
      >
        <p className={styles["node__desc"]}>{desc}</p>
      </div>
    </div>
  );
}
