"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Skill } from "@/data/skills";
import styles from "./SkillTree.module.scss";

interface SkillNodeProps {
  skill: Skill;
  dict: Dictionary;
  lang: Lang;
  index: number;
  isInView: boolean;
  isHovered: boolean;
  onHover: (skill: Skill | null) => void;
}

export default function SkillNode({
  skill,
  dict,
  lang,
  index,
  isInView,
  isHovered,
  onHover,
}: SkillNodeProps) {
  return (
    <motion.div
      className={`${styles["skill-node"]} ${isHovered ? styles["skill-node--hovered"] : ""}`}
      style={{
        "--skill-color": skill.color,
        borderColor: isHovered ? skill.color : undefined,
      } as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 + 0.3 }}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Icon */}
      <div
        className={styles["skill-node__icon"]}
        style={{ color: skill.color }}
      >
        {skill.icon}
      </div>

      {/* Name */}
      <span className={styles["skill-node__name"]}>{skill.name}</span>

      {/* Level dots */}
      <div className={styles["skill-node__level"]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className={`${styles["skill-node__dot"]} ${
              i < skill.level ? styles["skill-node__dot--filled"] : ""
            }`}
            style={i < skill.level ? { background: skill.color } : {}}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.08 + i * 0.05 + 0.5, duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
