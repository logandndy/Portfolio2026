"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import VirtualDesk from "./VirtualDesk";
import type { Lang } from "@/types";
import styles from "./HeroScene.module.scss";

interface HeroCanvasProps {
  lang: Lang;
  onDeskClick: () => void;
  onSkillsClick: () => void;
  onContactClick: () => void;
  isClicked: boolean;
  cameraTarget: "overview" | "desk" | "projects";
}

export default function HeroCanvas({
  lang,
  onDeskClick,
  onSkillsClick,
  onContactClick,
  isClicked,
  cameraTarget,
}: HeroCanvasProps) {
  return (
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
            onDeskClick={onDeskClick}
            onSkillsClick={onSkillsClick}
            onContactClick={onContactClick}
            isClicked={isClicked}
            cameraTarget={cameraTarget}
            lang={lang}
          />
        </Suspense>

        <fog attach="fog" args={["#020408", 12, 30]} />
      </Canvas>
    </div>
  );
}
