"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import { SKILLS, SKILL_CATEGORY_ORDER, type Skill } from "@/data/skills";
import SkillNode from "./SkillNode";
import styles from "./SkillTree.module.scss";

interface SkillTreeProps {
  dict: Dictionary;
  lang: Lang;
}

export default function SkillTree({ dict, lang }: SkillTreeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const skillsByCategory = SKILL_CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = SKILLS.filter((s) => s.category === cat);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={styles["skills-section"]}
    >
      <div className={styles["skills-section__inner"]}>
        {/* Header */}
        <motion.div
          className={styles["skills-section__header"]}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className={styles["skills-section__eyebrow"]}>
            // {dict.skills.eyebrow}
          </p>
          <h2 className={styles["skills-section__title"]}>
            {dict.skills.title}
          </h2>
          <p className={styles["skills-section__subtitle"]}>
            {dict.skills.subtitle}
          </p>
        </motion.div>

        {/* Tree layout */}
        <div className={styles["skill-tree"]}>
          {SKILL_CATEGORY_ORDER.map((category, catIndex) => (
            <motion.div
              key={category}
              className={styles["skill-category"]}
              initial={{ opacity: 0, x: catIndex % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: catIndex * 0.15 }}
            >
              <div className={styles["skill-category__header"]}>
                <span className={styles["skill-category__label"]}>
                  {dict.skills.categories[category as keyof typeof dict.skills.categories]}
                </span>
                <div className={styles["skill-category__line"]} />
              </div>

              <div className={styles["skill-category__nodes"]}>
                {skillsByCategory[category].map((skill, skillIndex) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    dict={dict}
                    lang={lang}
                    index={skillIndex}
                    isInView={isInView}
                    isHovered={hoveredSkill?.id === skill.id}
                    onHover={setHoveredSkill}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill detail tooltip */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div
              className={styles["skill-tooltip"]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className={styles["skill-tooltip__name"]} style={{ color: hoveredSkill.color }}>
                {hoveredSkill.name}
              </p>
              <p className={styles["skill-tooltip__desc"]}>
                {lang === "fr" ? hoveredSkill.descriptionFr : hoveredSkill.descriptionEn}
              </p>
              <div className={styles["skill-tooltip__level"]}>
                <span className={styles["skill-tooltip__level-label"]}>
                  {dict.skills.level}
                </span>
                <div className={styles["skill-tooltip__level-bar"]}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${styles["skill-tooltip__level-pip"]} ${
                        i < hoveredSkill.level ? styles["skill-tooltip__level-pip--filled"] : ""
                      }`}
                      style={
                        i < hoveredSkill.level
                          ? { background: hoveredSkill.color }
                          : {}
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
