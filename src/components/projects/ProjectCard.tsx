"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Project } from "@/data/projects";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  project: Project;
  dict: Dictionary;
  lang: Lang;
  index: number;
  isInView: boolean;
}

export default function ProjectCard({
  project,
  dict,
  lang,
  index,
  isInView,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt effect — holographic feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const title = lang === "fr" ? project.titleFr : project.titleEn;
  const problem = lang === "fr" ? project.problemFr : project.problemEn;
  const solution = lang === "fr" ? project.solutionFr : project.solutionEn;

  return (
    <motion.div
      className={styles["project-card-wrapper"]}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        className={styles["project-card"]}
        style={{
          rotateX,
          rotateY,
          // Dynamic border glow based on project accent color
          "--project-accent": project.accentColor,
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Corner accent — cyber clip */}
        <div
          className={styles["project-card__corner"]}
          style={{ background: project.accentColor }}
        />

        {/* Header */}
        <div className={styles["project-card__header"]}>
          <div className={styles["project-card__meta"]}>
            <span
              className={styles["project-card__index"]}
              style={{ color: project.accentColor }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles["project-card__year"]}>{project.year}</span>
          </div>
          <h3 className={styles["project-card__title"]}>{title}</h3>

          {/* Tags */}
          <div className={styles["project-card__tags"]}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={styles["project-card__tag"]}
                style={{
                  borderColor: `${project.accentColor}40`,
                  color: project.accentColor,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className={styles["project-card__body"]}>
          <div className={styles["project-card__field"]}>
            <span className={styles["project-card__field-label"]}>
              {dict.projects.problem}
            </span>
            <p className={styles["project-card__field-text"]}>{problem}</p>
          </div>

          <div className={styles["project-card__field"]}>
            <span className={styles["project-card__field-label"]}>
              {dict.projects.solution}
            </span>
            <p className={styles["project-card__field-text"]}>{solution}</p>
          </div>
        </div>

        {/* Stack */}
        <div className={styles["project-card__stack"]}>
          <span className={styles["project-card__field-label"]}>
            {dict.projects.stack}
          </span>
          <div className={styles["project-card__stack-list"]}>
            {project.stack.map((tech) => (
              <span key={tech} className={styles["project-card__stack-item"]}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className={styles["project-card__footer"]}>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["project-card__link"]}
            style={{ color: project.accentColor }}
          >
            <span>{dict.projects.viewCode}</span>
            <span className={styles["project-card__link-arrow"]}>↗</span>
          </a>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["project-card__link"]}
              style={{ color: project.accentColor }}
            >
              <span>{dict.projects.viewLive}</span>
              <span className={styles["project-card__link-arrow"]}>↗</span>
            </a>
          ) : (
            <span className={styles["project-card__link--disabled"]}>
              {dict.projects.noLive}
            </span>
          )}
        </div>

        {/* Holographic shimmer overlay */}
        <div className={styles["project-card__holo-overlay"]} aria-hidden />
      </motion.div>
    </motion.div>
  );
}
