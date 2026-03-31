"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { PROJECTS } from "@/data/projects";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./ProjectsApp.module.scss";

interface ProjectsAppProps {
  dict: Dictionary;
  lang: Lang;
}

export default function ProjectsApp({ dict, lang }: ProjectsAppProps) {
  const [idx, setIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const goTo = (next: number) => {
    if (next < 0 || next >= PROJECTS.length || next === idx) return;
    const dir = next > idx ? 1 : -1;
    const card = cardRef.current;
    if (!card) { setIdx(next); return; }
    gsap.to(card, {
      x: dir * -30, opacity: 0, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setIdx(next);
        gsap.fromTo(card,
          { x: dir * 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.28, ease: "power3.out" }
        );
      }
    });
  };

  const p = PROJECTS[idx];
  const title   = lang === "fr" ? p.titleFr    : p.titleEn;
  const problem = lang === "fr" ? p.problemFr  : p.problemEn;
  const solution= lang === "fr" ? p.solutionFr : p.solutionEn;

  return (
    <div className={styles.app} style={{ "--app-accent": p.accentColor } as React.CSSProperties}>
      {/* Nav strip */}
      <div className={styles.nav}>
        <button
          className={styles.nav__btn}
          onClick={() => goTo(idx - 1)}
          disabled={idx === 0}
          aria-label="Previous project"
        >‹</button>

        <div className={styles.nav__dots}>
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              className={`${styles.nav__dot} ${i === idx ? styles["nav__dot--active"] : ""}`}
              onClick={() => goTo(i)}
              style={i === idx ? { background: p.accentColor } : undefined}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        <button
          className={styles.nav__btn}
          onClick={() => goTo(idx + 1)}
          disabled={idx === PROJECTS.length - 1}
          aria-label="Next project"
        >›</button>
      </div>

      {/* Card */}
      <div className={styles.card} ref={cardRef}>
        {/* Accent bar */}
        <div className={styles.card__accent} style={{ background: p.accentColor }}/>

        {/* Header */}
        <div className={styles.card__header}>
          <div className={styles.card__tags}>
            {p.tags.map(t => (
              <span key={t} className={styles.card__tag}>{t}</span>
            ))}
            <span className={styles.card__year}>{p.year}</span>
          </div>
          <h2 className={styles.card__title}>{title}</h2>
        </div>

        {/* Body */}
        <div className={styles.card__body}>
          <div className={styles.card__block}>
            <p className={styles.card__label}>{dict.projects.problem}</p>
            <p className={styles.card__text}>{problem}</p>
          </div>
          <div className={styles.card__block}>
            <p className={styles.card__label}>{dict.projects.solution}</p>
            <p className={styles.card__text}>{solution}</p>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.card__footer}>
          <div className={styles.card__stack}>
            {p.stack.map(s => (
              <span key={s} className={styles.card__chip}>{s}</span>
            ))}
          </div>
          <div className={styles.card__actions}>
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card__btn}
              style={{ borderColor: p.accentColor, color: p.accentColor }}
            >
              {dict.projects.viewCode} ↗
            </a>
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.card__btn} ${styles["card__btn--filled"]}`}
                style={{
                  borderColor: p.accentColor,
                  color: p.accentColor,
                  background: `${p.accentColor}14`
                }}
              >
                {dict.projects.viewLive} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
