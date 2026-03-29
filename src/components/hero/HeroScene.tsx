"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import VirtualDesk from "./VirtualDesk";
import HeroOverlay from "./HeroOverlay";
import styles from "./HeroScene.module.scss";

interface HeroSceneProps {
  dict: Dictionary;
  lang: Lang;
}

export default function HeroScene({ dict, lang }: HeroSceneProps) {
  const [cameraTarget, setCameraTarget] = useState<"overview" | "desk" | "projects">("overview");
  const [isDeskClicked, setIsDeskClicked] = useState(false);

  const handleDeskClick = () => {
    setIsDeskClicked(true);
    setCameraTarget("projects");
    // Scroll to projects section after camera animation
    setTimeout(() => {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  };

  return (
    <section className={styles["hero-section"]} id="hero">
      {/* 3D Canvas */}
      <div className={styles["hero-canvas-wrapper"]}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <PerspectiveCamera makeDefault position={[0, 3, 9]} fov={55} />

          {/* Lighting */}
          <ambientLight intensity={0.15} />
          <pointLight position={[0, 6, 0]} intensity={0.8} color="#00d4ff" distance={20} />
          <pointLight position={[-5, 2, -3]} intensity={0.4} color="#9b5de5" distance={15} />
          <pointLight position={[5, 1, 2]} intensity={0.3} color="#ff6b2b" distance={10} />

          <Suspense fallback={null}>
            <VirtualDesk
              onDeskClick={handleDeskClick}
              isClicked={isDeskClicked}
              cameraTarget={cameraTarget}
              lang={lang}
            />
          </Suspense>

          {/* Fog for depth */}
          <fog attach="fog" args={["#020408", 12, 30]} />
        </Canvas>
      </div>

      {/* Overlay HTML avec texte et CTA */}
      <HeroOverlay
        dict={dict}
        lang={lang}
        isDeskClicked={isDeskClicked}
        onExploreClick={handleDeskClick}
      />

      {/* Hint scroll */}
      <motion.div
        className={styles["hero-scroll-hint"]}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0.5, 1], y: [10, 0, 5, 0] }}
        transition={{ delay: 3, duration: 2, repeat: Infinity, repeatDelay: 4 }}
      >
        <span className={styles["hero-scroll-hint__text"]}>
          {dict.hero.scroll_hint}
        </span>
        <span className={styles["hero-scroll-hint__arrow"]}>↓</span>
      </motion.div>
    </section>
  );
}
