export interface Project {
  id: string;
  titleFr: string;
  titleEn: string;
  problemFr: string;
  problemEn: string;
  solutionFr: string;
  solutionEn: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  accentColor: string;
  tags: string[];
  year: number;
}

export const PROJECTS: Project[] = [
  {
    id: "project-01",
    titleFr: "Moteur de Jeu 3D Personnalisé",
    titleEn: "Custom 3D Game Engine",
    problemFr:
      "Les moteurs existants offrent trop d'abstraction et masquent les mécaniques bas-niveau nécessaires pour un rendu optimisé sur hardware modeste.",
    problemEn:
      "Existing engines abstract too much and hide the low-level mechanics needed for optimized rendering on modest hardware.",
    solutionFr:
      "Développement d'un moteur 3D en Java avec jMonkeyEngine et l'interface Lemur pour le UI. Système de scène hiérarchique, gestion des entités, physique et rendu custom.",
    solutionEn:
      "Built a 3D engine in Java using jMonkeyEngine with Lemur for UI. Hierarchical scene system, entity management, physics and custom rendering pipeline.",
    stack: ["Java", "jMonkeyEngine", "Lemur", "OpenGL"],
    githubUrl: "https://github.com/logandndy",
    accentColor: "#00d4ff",
    tags: ["3D", "Game Engine", "Java"],
    year: 2024,
  },
  {
    id: "project-02",
    titleFr: "API REST Haute Performance",
    titleEn: "High-Performance REST API",
    problemFr:
      "Une startup avait besoin d'une API capable de gérer des milliers de requêtes simultanées avec une latence minimale pour son application mobile.",
    problemEn:
      "A startup needed an API capable of handling thousands of concurrent requests with minimal latency for their mobile application.",
    solutionFr:
      "Architecture Node.js avec gestion asynchrone optimisée, mise en cache intelligente et endpoints RESTful structurés. Documentation Swagger complète.",
    solutionEn:
      "Node.js architecture with optimized async handling, intelligent caching and structured RESTful endpoints. Complete Swagger documentation.",
    stack: ["Node.js", "Express", "JavaScript", "REST"],
    githubUrl: "https://github.com/logandndy",
    accentColor: "#9b5de5",
    tags: ["Backend", "API", "Node.js"],
    year: 2024,
  },
  {
    id: "project-03",
    titleFr: "Interface Web Interactive",
    titleEn: "Interactive Web Interface",
    problemFr:
      "Des données complexes devaient être présentées de façon intuitive et engageante pour des utilisateurs non-techniques.",
    problemEn:
      "Complex data needed to be presented in an intuitive and engaging way for non-technical users.",
    solutionFr:
      "Application React avec visualisations dynamiques, animations fluides et architecture de composants réutilisables. Expérience utilisateur centrée sur la clarté.",
    solutionEn:
      "React application with dynamic visualizations, smooth animations and reusable component architecture. User experience centered on clarity.",
    stack: ["React", "JavaScript", "CSS", "HTML"],
    githubUrl: "https://github.com/logandndy",
    accentColor: "#ff6b2b",
    tags: ["Frontend", "React", "UX"],
    year: 2025,
  },
  {
    id: "project-04",
    titleFr: "Portfolio 2027",
    titleEn: "Portfolio 2027",
    problemFr:
      "Les portfolios classiques sont ennuyeux. Les recruteurs ne se souviennent pas des candidats qui font comme tout le monde.",
    problemEn:
      "Classic portfolios are boring. Recruiters don't remember candidates who do what everyone else does.",
    solutionFr:
      "Ce site. Une expérience 3D immersive construite avec React Three Fiber, GSAP et Next.js. Design système Cyber-Corpo 2077 entièrement custom.",
    solutionEn:
      "This site. An immersive 3D experience built with React Three Fiber, GSAP and Next.js. Fully custom Cyber-Corpo 2077 design system.",
    stack: ["Next.js", "React Three Fiber", "GSAP", "TypeScript", "SCSS"],
    githubUrl: "https://github.com/logandndy/Portfolio2026",
    liveUrl: "/",
    accentColor: "#00ff88",
    tags: ["Full-Stack", "3D", "Creative Dev"],
    year: 2025,
  },
];
