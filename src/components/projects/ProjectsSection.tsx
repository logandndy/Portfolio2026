"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import { PROJECTS } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectsSection.module.scss";

interface ProjectsSectionProps {
  dict: Dictionary;
  lang: Lang;
}

export default function ProjectsSection({ dict, lang }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={styles["projects-section"]}
    >
      <div className={styles["projects-section__inner"]}>
        {/* Section header */}
        <motion.div
          className={styles["projects-section__header"]}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles["projects-section__eyebrow"]}>
            // {dict.projects.eyebrow}
          </p>
          <h2 className={styles["projects-section__title"]}>
            {dict.projects.title}
          </h2>
          <p className={styles["projects-section__subtitle"]}>
            {dict.projects.subtitle}
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className={styles["projects-grid"]}>
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              dict={dict}
              lang={lang}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>

      {/* Decorative scanline overlay */}
      <div className={styles["projects-section__scanlines"]} aria-hidden />
    </section>
  );
}
