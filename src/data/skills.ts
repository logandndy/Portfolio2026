export type SkillCategory = "frontend" | "backend" | "3d_game" | "tools";
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon: string;
  color: string;
  unlocked: boolean;
  requires?: string[];
  descriptionFr: string;
  descriptionEn: string;
}

export const SKILLS: Skill[] = [
  // --- FRONTEND ---
  {
    id: "html",
    name: "HTML",
    category: "frontend",
    level: 5,
    icon: "{ }",
    color: "#e34c26",
    unlocked: true,
    descriptionFr: "Structure sémantique, accessibilité, SEO natif.",
    descriptionEn: "Semantic structure, accessibility, native SEO.",
  },
  {
    id: "css",
    name: "CSS / SCSS",
    category: "frontend",
    level: 5,
    icon: "#",
    color: "#264de4",
    unlocked: true,
    requires: ["html"],
    descriptionFr: "Animations, responsive design, architecture BEM.",
    descriptionEn: "Animations, responsive design, BEM architecture.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend",
    level: 4,
    icon: "JS",
    color: "#f7df1e",
    unlocked: true,
    requires: ["html", "css"],
    descriptionFr: "ES2022+, async/await, manipulation du DOM.",
    descriptionEn: "ES2022+, async/await, DOM manipulation.",
  },
  {
    id: "react",
    name: "React",
    category: "frontend",
    level: 4,
    icon: "⚛",
    color: "#61dafb",
    unlocked: true,
    requires: ["javascript"],
    descriptionFr: "Hooks, Context, patterns avancés de composition.",
    descriptionEn: "Hooks, Context, advanced composition patterns.",
  },
  // --- BACKEND ---
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    level: 4,
    icon: "⬡",
    color: "#68a063",
    unlocked: true,
    requires: ["javascript"],
    descriptionFr: "APIs REST, gestion de modules, I/O asynchrone.",
    descriptionEn: "REST APIs, module management, async I/O.",
  },
  {
    id: "java",
    name: "Java",
    category: "backend",
    level: 4,
    icon: "☕",
    color: "#f89820",
    unlocked: true,
    descriptionFr: "POO, design patterns, concurrence, JVM.",
    descriptionEn: "OOP, design patterns, concurrency, JVM.",
  },
  // --- 3D & GAME ---
  {
    id: "jmonkeyengine",
    name: "jMonkeyEngine",
    category: "3d_game",
    level: 3,
    icon: "◆",
    color: "#00d4ff",
    unlocked: true,
    requires: ["java"],
    descriptionFr: "Moteur 3D Java, scènes hiérarchiques, physique.",
    descriptionEn: "Java 3D engine, hierarchical scenes, physics.",
  },
  {
    id: "lemur",
    name: "Lemur UI",
    category: "3d_game",
    level: 3,
    icon: "UI",
    color: "#9b5de5",
    unlocked: true,
    requires: ["jmonkeyengine"],
    descriptionFr: "Framework UI 3D pour jMonkeyEngine.",
    descriptionEn: "3D UI framework for jMonkeyEngine.",
  },
  // --- TOOLS ---
  {
    id: "nextjs",
    name: "Next.js",
    category: "tools",
    level: 4,
    icon: "▲",
    color: "#ffffff",
    unlocked: true,
    requires: ["react"],
    descriptionFr: "App Router, SSR/SSG, optimisations de performance.",
    descriptionEn: "App Router, SSR/SSG, performance optimizations.",
  },
  {
    id: "r3f",
    name: "React Three Fiber",
    category: "tools",
    level: 3,
    icon: "3D",
    color: "#ff6b2b",
    unlocked: true,
    requires: ["react"],
    descriptionFr: "3D déclaratif dans React, intégration Three.js.",
    descriptionEn: "Declarative 3D in React, Three.js integration.",
  },
];

export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "backend",
  "3d_game",
  "tools",
];
