"use client";

import { useRef } from "react";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Project } from "@/data/projects";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  project: Project;
  dict: Dictionary;
  lang: Lang;
  index: number;
}

export default function ProjectCard({ project, dict, lang, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r  = card.getBoundingClientRect();
    const rx = -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * 4;
    const ry =  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * 4;
    gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: "power3.out", overwrite: "auto" });
  };

  const title   = lang === "fr" ? project.titleFr   : project.titleEn;
  const problem = lang === "fr" ? project.problemFr : project.problemEn;
  const solution= lang === "fr" ? project.solutionFr: project.solutionEn;

  return (
    <div
      ref={cardRef}
      className={styles["project-card"]}
      style={{
        "--project-accent":       project.accentColor,
        "--project-accent-faint": `${project.accentColor}14`,
        "--project-accent-glow":  `${project.accentColor}40`,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Corner cut */}
      <div className={styles["project-card__corner"]} style={{ background: project.accentColor }} />

      {/* Ghost watermark number */}
      <div className={styles["project-card__ghost"]} aria-hidden>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* ── TOP META ── */}
      <div className={styles["project-card__top"]}>
        <span className={styles["project-card__index"]} style={{ color: project.accentColor }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles["project-card__year"]}>{project.year}</span>
        <div className={styles["project-card__tags"]}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={styles["project-card__tag"]}
              style={{ borderColor: `${project.accentColor}55`, color: project.accentColor }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── TITLE + accent line ── */}
      <div className={styles["project-card__title-block"]}>
        <h3 className={styles["project-card__title"]}>{title}</h3>
        <div
          className={styles["project-card__title-bar"]}
          style={{ background: project.accentColor, boxShadow: `0 0 12px var(--project-accent-glow)` }}
        />
      </div>

      {/* ── BODY: 2-col on desktop ── */}
      <div className={styles["project-card__body"]}>

        {/* Left: problem + solution */}
        <div className={styles["project-card__text"]}>
          <div className={styles["project-card__field"]}>
            <span className={styles["project-card__label"]}>{dict.projects.problem}</span>
            <p className={styles["project-card__p"]}>{problem}</p>
          </div>
          <div className={styles["project-card__field"]}>
            <span className={styles["project-card__label"]}>{dict.projects.solution}</span>
            <p className={styles["project-card__p"]}>{solution}</p>
          </div>
        </div>

        {/* Right: stack + CTA buttons */}
        <div className={styles["project-card__aside"]}>
          <div className={styles["project-card__stack-block"]}>
            <span className={styles["project-card__label"]}>{dict.projects.stack}</span>
            <div className={styles["project-card__stack-list"]}>
              {project.stack.map((tech) => (
                <span key={tech} className={styles["project-card__stack-badge"]}>{tech}</span>
              ))}
            </div>
          </div>

          <div className={styles["project-card__ctas"]}>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["project-card__cta"]}
            >
              <span>{dict.projects.viewCode}</span>
              <span className={styles["project-card__cta-arrow"]}>↗</span>
            </a>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles["project-card__cta"]} ${styles["project-card__cta--filled"]}`}
              >
                <span>{dict.projects.viewLive}</span>
                <span className={styles["project-card__cta-arrow"]}>↗</span>
              </a>
            ) : (
              <span className={styles["project-card__cta-disabled"]}>
                {dict.projects.noLive}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Holo shimmer */}
      <div className={styles["project-card__shimmer"]} aria-hidden />
    </div>
  );
}
