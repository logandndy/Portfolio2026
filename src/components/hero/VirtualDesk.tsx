"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ReactElement } from "react";
import gsap from "gsap";
import type { Lang } from "@/types";

interface VirtualDeskProps {
  onDeskClick: () => void;
  onSkillsClick: () => void;
  onContactClick: () => void;
  isClicked: boolean;
  cameraTarget: "overview" | "desk" | "projects";
  lang: Lang;
}

// Floating neon label component
function NeonLabel({
  text,
  position,
  color = "#00d4ff",
}: {
  text: string;
  position: [number, number, number];
  color?: string;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
      <Text
        position={position}
        fontSize={0.22}
        color={color}
        font="/fonts/JetBrainsMono-Regular.ttf"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor={color}
      >
        {text}
      </Text>
    </Float>
  );
}

// Holographic folder item
function HoloFolder({
  position,
  color,
  label,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const hovered = useRef(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = hovered.current
        ? 1.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2
        : 0.6;
    }
    if (glowRef.current) {
      const s = hovered.current
        ? 1.3 + Math.sin(state.clock.elapsedTime * 2) * 0.08
        : 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      glowRef.current.scale.setScalar(s);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered.current ? 0.12 : 0.04;
    }
    if (groupRef.current) {
      const targetY = hovered.current ? 0.12 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerEnter={(e) => {
        e.stopPropagation();
        hovered.current = true;
        document.body.style.cursor = onClick ? "pointer" : "default";
      }}
      onPointerLeave={() => {
        hovered.current = false;
        document.body.style.cursor = "auto";
      }}
    >
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} />
      </mesh>

      {/* Main folder box */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Tab */}
      <mesh position={[-0.12, 0.05, 0]}>
        <boxGeometry args={[0.18, 0.04, 0.08]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <NeonLabel text={label} position={[0, 0.25, 0]} color={color} />
    </group>
  );
}

// Grid floor using Drei Grid
function GridFloor() {
  return (
    <Grid
      position={[0, -1.5, 0]}
      args={[20, 20]}
      cellSize={1}
      cellThickness={0.4}
      cellColor="#00d4ff"
      sectionSize={5}
      sectionThickness={0.6}
      sectionColor="#9b5de5"
      fadeDistance={18}
      fadeStrength={2}
      infiniteGrid
    />
  );
}

// Floating data particles
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, count } = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 8 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return { positions, count };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const posArray = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] +=
          Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#00d4ff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Main desk surface
function DeskSurface({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -0.52, 0]}
      receiveShadow
      onClick={onClick}
    >
      <boxGeometry args={[5, 0.06, 3]} />
      <meshStandardMaterial
        color="#0a141f"
        emissive="#00d4ff"
        emissiveIntensity={0.15}
        metalness={0.9}
        roughness={0.15}
      />
    </mesh>
  );
}

// Screen monitor
function HoloMonitor() {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 0.4, -1.1]}>
      {/* Screen */}
      <mesh ref={screenRef} castShadow>
        <boxGeometry args={[2.6, 1.5, 0.04]} />
        <meshStandardMaterial
          color="#050b12"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0, -0.88, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.08, 0.3, 8]} />
        <meshStandardMaterial color="#0d1a26" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Monitor base */}
      <mesh position={[0, -1.04, 0.12]}>
        <boxGeometry args={[0.6, 0.04, 0.3]} />
        <meshStandardMaterial color="#0d1a26" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Screen content lines (fake code) */}
      <NeonLabel text="> PORTFOLIO_2027.exe" position={[0, 0.4, 0.03]} color="#00d4ff" />
      <NeonLabel text="■ ■ ■ LOADING..." position={[0, 0.1, 0.03]} color="#9b5de5" />
      <NeonLabel text="[STATUS: AVAILABLE]" position={[0, -0.2, 0.03]} color="#00ff88" />
    </group>
  );
}

export default function VirtualDesk({
  onDeskClick,
  onSkillsClick,
  onContactClick,
  isClicked,
  cameraTarget,
  lang,
}: VirtualDeskProps) {
  const { camera } = useThree();

  // Animate camera when cameraTarget changes
  useFrame(() => {
    if (cameraTarget === "projects" && isClicked) {
      gsap.to(camera.position, {
        x: 0,
        y: 6,
        z: 14,
        duration: 1.4,
        ease: "power3.inOut",
      });
      gsap.to((camera as THREE.PerspectiveCamera).rotation, {
        x: -0.3,
        duration: 1.4,
        ease: "power3.inOut",
      });
    }
  });

  const projectsLabel = lang === "fr" ? "PROJETS" : "PROJECTS";
  const skillsLabel = lang === "fr" ? "COMPÉTENCES" : "SKILLS";
  const contactLabel = "CONTACT";

  return (
    <group>
      <GridFloor />
      <DataParticles />
      <DeskSurface onClick={onDeskClick} />
      <HoloMonitor />

      {/* Holographic folders on the desk */}
      <HoloFolder
        position={[-1.6, -0.4, 0.3]}
        color="#00d4ff"
        label={projectsLabel}
        onClick={onDeskClick}
      />
      <HoloFolder
        position={[0, -0.4, 0.6]}
        color="#9b5de5"
        label={skillsLabel}
        onClick={onSkillsClick}
      />
      <HoloFolder
        position={[1.6, -0.4, 0.3]}
        color="#ff6b2b"
        label={contactLabel}
        onClick={onContactClick}
      />

      {/* Floating accent ring */}
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[0, 1.5, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.015, 8, 80]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={1.5}
          />
        </mesh>
      </Float>

      {/* Second ring, tilted */}
      <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh position={[0, 1.5, -0.5]} rotation={[Math.PI / 3, 0.5, 0]}>
          <torusGeometry args={[1.5, 0.01, 8, 80]} />
          <meshStandardMaterial
            color="#9b5de5"
            emissive="#9b5de5"
            emissiveIntensity={1.2}
          />
        </mesh>
      </Float>
    </group>
  );
}
