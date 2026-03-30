"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import { PROJECTS } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectsSection.module.scss";

const TOTAL = PROJECTS.length;

interface ProjectsSectionProps {
  dict: Dictionary;
  lang: Lang;
}

export default function ProjectsSection({ dict, lang }: ProjectsSectionProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const isInView    = useInView(sectionRef, { once: true, margin: "-50px" });
  const viewportRef = useRef<HTMLDivElement>(null); // for slide-width calc
  const trackRef    = useRef<HTMLDivElement>(null);
  const currentRef  = useRef(0);
  const [current, setCurrent] = useState(0);
  const isAnimating = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback((idx: number, animated = true) => {
    if (isAnimating.current && animated) return;
    const next = Math.max(0, Math.min(TOTAL - 1, idx));
    const viewport = viewportRef.current;
    const track    = trackRef.current;
    if (!viewport || !track) return;

    currentRef.current = next;
    setCurrent(next);
    isAnimating.current = animated;

    gsap.to(track, {
      x: -(next * viewport.offsetWidth),
      duration: animated ? 0.52 : 0,
      ease: "power3.inOut",
      onComplete: () => { isAnimating.current = false; },
    });
  }, []);

  // Entrance fade-in
  useEffect(() => {
    if (!isInView || !trackRef.current) return;
    gsap.fromTo(trackRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    );
  }, [isInView]);

  // Re-snap on resize
  useEffect(() => {
    const onResize = () => goTo(currentRef.current, false);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [goTo]);

  // Horizontal swipe on viewport
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(currentRef.current + (dx > 0 ? 1 : -1));
    }
  };

  const accent = PROJECTS[current]?.accentColor ?? "#00d4ff";

  return (
    <section ref={sectionRef} id="projects" className={styles["projects-section"]}>
      <div className={styles["projects-section__inner"]}>

        {/* ── Header ── */}
        <motion.div
          className={styles["projects-section__header"]}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles["projects-section__eyebrow"]}>
            // {dict.projects.eyebrow}
          </p>
          <h2 className={styles["projects-section__title"]}>
            {dict.projects.title}
          </h2>
        </motion.div>

        {/* ── Carousel row: [btn] [viewport] [btn] ── */}
        <div className={styles["projects-carousel"]}>
          <button
            className={`${styles["carousel-btn"]} ${styles["carousel-btn--prev"]}`}
            onClick={() => goTo(currentRef.current - 1)}
            disabled={current === 0}
            aria-label="Projet précédent"
          >
            ‹
          </button>

          <div
            ref={viewportRef}
            className={styles["projects-carousel__viewport"]}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div ref={trackRef} className={styles["projects-carousel__track"]}>
              {PROJECTS.map((project, index) => (
                <div key={project.id} className={styles["project-slide"]}>
                  <ProjectCard
                    project={project}
                    dict={dict}
                    lang={lang}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles["carousel-btn"]} ${styles["carousel-btn--next"]}`}
            onClick={() => goTo(currentRef.current + 1)}
            disabled={current === TOTAL - 1}
            aria-label="Projet suivant"
          >
            ›
          </button>
        </div>

        {/* ── Bottom bar: dots + counter ── */}
        <div className={styles["projects-controls"]}>
          <div className={styles["carousel-dots"]}>
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                className={`${styles["carousel-dot"]} ${i === current ? styles["carousel-dot--active"] : ""}`}
                style={i === current
                  ? { background: accent, boxShadow: `0 0 8px ${accent}` }
                  : {}}
                onClick={() => goTo(i)}
                aria-label={`Projet ${i + 1}`}
              />
            ))}
          </div>

          <span className={styles["carousel-counter"]}>
            <span style={{ color: accent }}>{String(current + 1).padStart(2, "0")}</span>
            <span className={styles["carousel-counter__sep"]}> / </span>
            <span>{String(TOTAL).padStart(2, "0")}</span>
          </span>
        </div>

      </div>

      <div className={styles["projects-section__scanlines"]} aria-hidden />
    </section>
  );
}
