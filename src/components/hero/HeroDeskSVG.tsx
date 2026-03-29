"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Lang } from "@/types";
import styles from "./HeroScene.module.scss";

interface HeroDeskSVGProps {
  lang: Lang;
  onMonitorClick: () => void;
  onFolderClick: (section: string) => void;
}

export default function HeroDeskSVG({ lang, onMonitorClick, onFolderClick }: HeroDeskSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Float wrappers (GSAP y animation)
  const monitorFloatRef = useRef<SVGGElement>(null);
  const f1FloatRef = useRef<SVGGElement>(null);
  const f2FloatRef = useRef<SVGGElement>(null);
  const f3FloatRef = useRef<SVGGElement>(null);

  // Hover inner refs (GSAP scale)
  const chatBtnRef = useRef<SVGGElement>(null);
  const f1InnerRef = useRef<SVGGElement>(null);
  const f2InnerRef = useRef<SVGGElement>(null);
  const f3InnerRef = useRef<SVGGElement>(null);

  // Animated elements
  const screenGlowRef = useRef<SVGRectElement>(null);
  const statusDotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([f1InnerRef.current, f2InnerRef.current, f3InnerRef.current], {
        transformOrigin: "50% 100%",
      });
      gsap.set(chatBtnRef.current, { transformOrigin: "50% 50%" });

      // Entrance
      gsap.from(
        [monitorFloatRef.current, f1FloatRef.current, f2FloatRef.current, f3FloatRef.current],
        { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, ease: "power3.out", delay: 0.4 }
      );

      // Float animations
      gsap.to(monitorFloatRef.current, { y: -8, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });
      gsap.to(f1FloatRef.current, { y: -6, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
      gsap.to(f2FloatRef.current, { y: -8, duration: 3.9, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.2 });
      gsap.to(f3FloatRef.current, { y: -6, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });

      // Screen glow pulse
      gsap.to(screenGlowRef.current, { opacity: 0.22, duration: 2.0, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // Status dot pulse
      gsap.to(statusDotRef.current, { opacity: 0.3, duration: 0.9, repeat: -1, yoyo: true, ease: "power1.inOut" });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  const hoverIn = (ref: React.RefObject<SVGGElement | null>) => {
    if (!ref.current) return;
    gsap.to(ref.current, { scale: 1.06, duration: 0.22, ease: "power2.out", overwrite: "auto" });
  };
  const hoverOut = (ref: React.RefObject<SVGGElement | null>) => {
    if (!ref.current) return;
    gsap.to(ref.current, { scale: 1, duration: 0.28, ease: "power2.in", overwrite: "auto" });
  };

  const fr = lang === "fr";
  const statusLine   = fr ? "DISPONIBLE" : "AVAILABLE";
  const greetingLine = fr ? "Bonjour, je suis" : "Hello, I'm";
  const stackLine    = "Full-Stack · TypeScript · Next.js · GSAP";
  const tagLine2     = fr ? "Backend · Interfaces Interactives · 3D" : "Backend · Interactive Interfaces · 3D";
  const chatLabel    = fr ? ">_ Parler à l'IA" : ">_ Chat with AI";
  const projectsLabel = fr ? "PROJETS" : "PROJECTS";
  const skillsLabel   = fr ? "COMPÉTENCES" : "SKILLS";
  const clickHint     = fr ? "▲ CLIQUER" : "▲ CLICK";

  return (
    <div className={styles["hero-canvas-wrapper"]}>
      <svg
        ref={svgRef}
        viewBox="0 0 640 700"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        aria-label={fr ? "Bureau interactif — portfolio" : "Interactive desk — portfolio"}
      >
        <defs>
          {/* ── Glow filters ── */}
          <filter id="glow-cyan" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-violet" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-orange" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-screen" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-btn" x="-40%" y="-60%" width="180%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* ── Gradients ── */}
          <linearGradient id="monitor-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1c2e" />
            <stop offset="100%" stopColor="#050e1a" />
          </linearGradient>
          <linearGradient id="screen-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030e18" />
            <stop offset="100%" stopColor="#010810" />
          </linearGradient>
          <radialGradient id="screen-glow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="name-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#9b5de5" />
          </linearGradient>
          <linearGradient id="desk-surface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1c2a" />
            <stop offset="100%" stopColor="#060e17" />
          </linearGradient>
          <linearGradient id="desk-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060e17" />
            <stop offset="100%" stopColor="#030810" />
          </linearGradient>
          <linearGradient id="folder-f1-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#062030" /><stop offset="100%" stopColor="#031520" />
          </linearGradient>
          <linearGradient id="folder-f2-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#160a2e" /><stop offset="100%" stopColor="#0d0620" />
          </linearGradient>
          <linearGradient id="folder-f3-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#211008" /><stop offset="100%" stopColor="#130a04" />
          </linearGradient>
          <radialGradient id="vignette" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#020408" stopOpacity="0" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0.6" />
          </radialGradient>

          {/* ── Clip paths ── */}
          <clipPath id="screen-clip">
            <rect x="38" y="28" width="564" height="370" rx="4" />
          </clipPath>
          <clipPath id="f1-body-clip">
            <rect x="42" y="490" width="136" height="76" rx="3" />
          </clipPath>
          <clipPath id="f2-body-clip">
            <rect x="252" y="488" width="136" height="76" rx="3" />
          </clipPath>
          <clipPath id="f3-body-clip">
            <rect x="462" y="490" width="136" height="76" rx="3" />
          </clipPath>
        </defs>

        {/* ── Background ── */}
        <rect width="640" height="700" fill="#020408" />

        {/* Horizontal grid lines (desk area) */}
        {[420, 450, 480, 520, 570, 630].map((y, i) => (
          <line key={`hl${i}`} x1="0" y1={y} x2="640" y2={y}
            stroke="#00d4ff" strokeWidth="0.4"
            strokeOpacity={Math.max(0.02, 0.06 - i * 0.008)} />
        ))}

        {/* Scanlines */}
        {Array.from({ length: 35 }).map((_, i) => (
          <line key={`sc${i}`} x1="0" y1={i * 20} x2="640" y2={i * 20}
            stroke="#000" strokeWidth="1" strokeOpacity="0.05" />
        ))}

        {/* Ambient particles */}
        {([
          [14, 100, 0.3], [26, 190, 0.2], [610, 140, 0.3], [620, 210, 0.2],
          [315, 8, 0.35], [430, 6, 0.25], [200, 12, 0.2],
          [10, 340, 0.15], [630, 330, 0.15], [600, 450, 0.12],
        ] as number[][]).map(([x, y, op], i) => (
          <circle key={`pt${i}`} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.4}
            fill={i % 2 === 0 ? "#00d4ff" : "#9b5de5"} opacity={op} />
        ))}

        {/* Side accent bars */}
        <line x1="8" y1="50" x2="8" y2="400"
          stroke="#9b5de5" strokeWidth="1.5" strokeOpacity="0.28" filter="url(#glow-violet)" />
        <line x1="632" y1="50" x2="632" y2="400"
          stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.28" filter="url(#glow-cyan)" />

        {/* ─────────────────────────────────── */}
        {/* MONITOR                             */}
        {/* ─────────────────────────────────── */}
        <g ref={monitorFloatRef}>
          {/* Outer screen glow halo */}
          <rect x="12" y="6" width="616" height="432" rx="18"
            fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.15"
            filter="url(#glow-screen)" />
          {/* Monitor frame */}
          <rect x="20" y="12" width="600" height="415" rx="12"
            fill="url(#monitor-body)" />
          {/* Screen bezel */}
          <rect x="30" y="22" width="580" height="394" rx="8" fill="#040e18" />
          {/* Screen surface */}
          <rect x="38" y="28" width="564" height="370" rx="4"
            fill="url(#screen-bg)" />
          {/* Screen glow (animated) */}
          <rect ref={screenGlowRef}
            x="38" y="28" width="564" height="370" rx="4"
            fill="url(#screen-glow)" opacity="0.1" />
          {/* Edge glows */}
          <rect x="38" y="28" width="564" height="2" fill="#00d4ff" opacity="0.55" />
          <rect x="38" y="396" width="564" height="1" fill="#00d4ff" opacity="0.1" />
          {/* Monitor outer border */}
          <rect x="20" y="12" width="600" height="415" rx="12"
            fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.4" />
          {/* Corner accents */}
          <path d="M 30,22 L 56,22 L 56,26 L 34,26 L 34,46"
            stroke="#00d4ff" strokeWidth="1.5" fill="none" strokeOpacity="0.6" />
          <path d="M 610,22 L 584,22 L 584,26 L 606,26 L 606,46"
            stroke="#00d4ff" strokeWidth="1.5" fill="none" strokeOpacity="0.6" />
          <path d="M 30,427 L 56,427 L 56,423 L 34,423 L 34,403"
            stroke="#00d4ff" strokeWidth="1.5" fill="none" strokeOpacity="0.35" />
          <path d="M 610,427 L 584,427 L 584,423 L 606,423 L 606,403"
            stroke="#00d4ff" strokeWidth="1.5" fill="none" strokeOpacity="0.35" />
          {/* Power LED */}
          <circle cx="320" cy="426" r="3" fill="#00d4ff" opacity="0.45" />

          {/* ── SCREEN CONTENT (clipped) ── */}
          <g clipPath="url(#screen-clip)">
            {/* Terminal top bar */}
            <rect x="38" y="28" width="564" height="22" fill="#041220" opacity="0.9" />
            <circle cx="54" cy="39" r="5" fill="#ff6b2b" opacity="0.75" />
            <circle cx="70" cy="39" r="5" fill="#ffcc00" opacity="0.75" />
            <circle cx="86" cy="39" r="5" fill="#00ff88" opacity="0.75" />
            <text x="320" y="43" fontFamily="JetBrains Mono, monospace" fontSize="10"
              fill="#4a5a6e" textAnchor="middle">portfolio-v2.terminal</text>
            {/* Separator */}
            <line x1="38" y1="50" x2="602" y2="50"
              stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.12" />

            {/* Status */}
            <circle ref={statusDotRef} cx="58" cy="65" r="5" fill="#00ff88" />
            <text x="72" y="69" fontFamily="JetBrains Mono, monospace" fontSize="11"
              fill="#00ff88" letterSpacing="1.5">{statusLine}</text>

            {/* Eyebrow */}
            <text x="58" y="92" fontFamily="JetBrains Mono, monospace" fontSize="13"
              fill="#9b5de5" opacity="0.9">{"// Logan.init()"}</text>

            {/* Greeting */}
            <text x="58" y="120" fontFamily="JetBrains Mono, monospace" fontSize="16"
              fill="#8a9bb0">{greetingLine}</text>

            {/* NAME — large gradient */}
            <text x="320" y="188"
              fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
              fontSize="54" fontWeight="800" textAnchor="middle"
              fill="url(#name-grad)" letterSpacing="-1">LOGAN DANDY</text>

            {/* Role */}
            <text x="320" y="220" fontFamily="JetBrains Mono, monospace" fontSize="17"
              fill="#00d4ff" textAnchor="middle" letterSpacing="2">
              {"[ Software Engineer ]"}
            </text>

            {/* Dashed separator */}
            <line x1="58" y1="238" x2="582" y2="238"
              stroke="#9b5de5" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="4 8" />

            {/* Stack line */}
            <text x="320" y="262" fontFamily="JetBrains Mono, monospace" fontSize="12"
              fill="#8a9bb0" textAnchor="middle" opacity="0.85">{stackLine}</text>

            {/* Secondary tagline */}
            <text x="320" y="280" fontFamily="JetBrains Mono, monospace" fontSize="11"
              fill="#5a6e7e" textAnchor="middle" fontStyle="italic">{tagLine2}</text>

            {/* ── CHAT CTA BUTTON ── */}
            <g ref={chatBtnRef}
              onClick={onMonitorClick}
              style={{ cursor: "pointer" }}
              onMouseEnter={() =>
                gsap.to(chatBtnRef.current, { scale: 1.04, duration: 0.2, ease: "power2.out", overwrite: "auto" })
              }
              onMouseLeave={() =>
                gsap.to(chatBtnRef.current, { scale: 1, duration: 0.25, ease: "power2.in", overwrite: "auto" })
              }
            >
              {/* Glow bg */}
              <rect x="188" y="304" width="264" height="46" rx="6"
                fill="#9b5de5" opacity="0.06" filter="url(#glow-btn)" />
              {/* Border */}
              <rect x="188" y="304" width="264" height="46" rx="6"
                fill="rgba(155,93,229,0.1)" stroke="#9b5de5"
                strokeWidth="1.5" strokeOpacity="0.75" />
              {/* Label */}
              <text x="320" y="332" fontFamily="JetBrains Mono, monospace" fontSize="15"
                fill="#c8a0f0" textAnchor="middle" fontWeight="600" letterSpacing="1">
                {chatLabel}
              </text>
            </g>

            {/* Blinking cursor + prompt */}
            <text x="58" y="385" fontFamily="JetBrains Mono, monospace" fontSize="11"
              fill="#9b5de5" opacity="0.5">~$</text>
            <rect x="76" y="373" width="7" height="11" fill="#00d4ff" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0;0.7"
                dur="1.1s" repeatCount="indefinite" />
            </rect>
          </g>

          {/* Screen scanlines */}
          <g clipPath="url(#screen-clip)" opacity="0.04" pointerEvents="none">
            {Array.from({ length: 46 }).map((_, i) => (
              <line key={`ssl${i}`} x1="38" y1={28 + i * 8} x2="602" y2={28 + i * 8}
                stroke="#000" strokeWidth="2" />
            ))}
          </g>
        </g>

        {/* ─────────────────────────────────── */}
        {/* MONITOR STAND                       */}
        {/* ─────────────────────────────────── */}
        <rect x="300" y="427" width="40" height="26" rx="2"
          fill="#06111c" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.2" />
        <rect x="275" y="453" width="90" height="12" rx="3"
          fill="#071420" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.25" />

        {/* ─────────────────────────────────── */}
        {/* DESK SURFACE                        */}
        {/* ─────────────────────────────────── */}
        <polygon points="-20,465 660,465 680,565 -40,565"
          fill="url(#desk-surface)" />
        {/* Top edge glow */}
        <line x1="0" y1="465" x2="640" y2="465"
          stroke="#00d4ff" strokeWidth="1.8" strokeOpacity="0.45" filter="url(#glow-cyan)" />
        {/* Front face */}
        <polygon points="-40,565 680,565 680,586 -40,586"
          fill="url(#desk-front)" />
        {/* Subtle desk grid */}
        {[160, 310, 460].map((x, i) => (
          <line key={`dg${i}`} x1={x} y1="465" x2={x + 7} y2="560"
            stroke="#00d4ff" strokeWidth="0.3" strokeOpacity="0.06" />
        ))}
        {/* Holographic projection from stand */}
        <polygon points="285,465 355,465 362,475 278,475"
          fill="#00d4ff" opacity="0.04" />

        {/* ─────────────────────────────────── */}
        {/* FOLDER — PROJECTS (cyan)            */}
        {/* ─────────────────────────────────── */}
        <g ref={f1FloatRef}>
          <g ref={f1InnerRef}
            onClick={() => onFolderClick("projects")}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => hoverIn(f1InnerRef)}
            onMouseLeave={() => hoverOut(f1InnerRef)}
          >
            {/* Glow halo */}
            <rect x="38" y="474" width="144" height="94" rx="5"
              fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.18"
              filter="url(#glow-cyan)" />
            {/* Tab */}
            <path d="M 42,491 L 96,491 L 106,478 L 42,478 Z"
              fill="#0a2030" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.6" />
            {/* Body */}
            <rect x="42" y="490" width="136" height="76" rx="3"
              fill="url(#folder-f1-bg)" />
            <rect x="42" y="490" width="136" height="76" rx="3"
              fill="none" stroke="#00d4ff" strokeWidth="1.2" strokeOpacity="0.55" />
            {/* Document lines */}
            <g clipPath="url(#f1-body-clip)">
              {([0, 14, 28, 42] as number[]).map((dy, i) => (
                <line key={`f1l${i}`}
                  x1="56" y1={508 + dy}
                  x2={56 + ([108, 90, 100, 78] as number[])[i]} y2={508 + dy}
                  stroke="#00d4ff" strokeWidth="0.8" strokeOpacity={0.28 - i * 0.05} />
              ))}
            </g>
            {/* Label */}
            <text x="110" y="578" fontFamily="JetBrains Mono, monospace" fontSize="11"
              fill="#00d4ff" textAnchor="middle" fontWeight="700" letterSpacing="2"
              filter="url(#glow-soft)">{projectsLabel}</text>
            <text x="110" y="592" fontFamily="JetBrains Mono, monospace" fontSize="8"
              fill="#00d4ff" textAnchor="middle" opacity="0.4" letterSpacing="1">
              {clickHint}
            </text>
          </g>
        </g>

        {/* ─────────────────────────────────── */}
        {/* FOLDER — SKILLS (violet)            */}
        {/* ─────────────────────────────────── */}
        <g ref={f2FloatRef}>
          <g ref={f2InnerRef}
            onClick={() => onFolderClick("skills")}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => hoverIn(f2InnerRef)}
            onMouseLeave={() => hoverOut(f2InnerRef)}
          >
            <rect x="248" y="472" width="144" height="94" rx="5"
              fill="none" stroke="#9b5de5" strokeWidth="1" strokeOpacity="0.18"
              filter="url(#glow-violet)" />
            <path d="M 252,489 L 306,489 L 316,476 L 252,476 Z"
              fill="#160a28" stroke="#9b5de5" strokeWidth="0.8" strokeOpacity="0.6" />
            <rect x="252" y="488" width="136" height="76" rx="3"
              fill="url(#folder-f2-bg)" />
            <rect x="252" y="488" width="136" height="76" rx="3"
              fill="none" stroke="#9b5de5" strokeWidth="1.2" strokeOpacity="0.55" />
            <g clipPath="url(#f2-body-clip)">
              {([0, 14, 28, 42] as number[]).map((dy, i) => (
                <line key={`f2l${i}`}
                  x1="266" y1={506 + dy}
                  x2={266 + ([108, 92, 100, 76] as number[])[i]} y2={506 + dy}
                  stroke="#9b5de5" strokeWidth="0.8" strokeOpacity={0.28 - i * 0.05} />
              ))}
            </g>
            <text x="320" y="576" fontFamily="JetBrains Mono, monospace" fontSize="11"
              fill="#9b5de5" textAnchor="middle" fontWeight="700" letterSpacing="2"
              filter="url(#glow-soft)">{skillsLabel}</text>
            <text x="320" y="590" fontFamily="JetBrains Mono, monospace" fontSize="8"
              fill="#9b5de5" textAnchor="middle" opacity="0.4" letterSpacing="1">
              {clickHint}
            </text>
          </g>
        </g>

        {/* ─────────────────────────────────── */}
        {/* FOLDER — CONTACT (orange)           */}
        {/* ─────────────────────────────────── */}
        <g ref={f3FloatRef}>
          <g ref={f3InnerRef}
            onClick={() => onFolderClick("contact")}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => hoverIn(f3InnerRef)}
            onMouseLeave={() => hoverOut(f3InnerRef)}
          >
            <rect x="458" y="474" width="144" height="94" rx="5"
              fill="none" stroke="#ff6b2b" strokeWidth="1" strokeOpacity="0.18"
              filter="url(#glow-orange)" />
            <path d="M 462,491 L 516,491 L 526,478 L 462,478 Z"
              fill="#200e04" stroke="#ff6b2b" strokeWidth="0.8" strokeOpacity="0.6" />
            <rect x="462" y="490" width="136" height="76" rx="3"
              fill="url(#folder-f3-bg)" />
            <rect x="462" y="490" width="136" height="76" rx="3"
              fill="none" stroke="#ff6b2b" strokeWidth="1.2" strokeOpacity="0.55" />
            <g clipPath="url(#f3-body-clip)">
              {([0, 14, 28, 42] as number[]).map((dy, i) => (
                <line key={`f3l${i}`}
                  x1="476" y1={508 + dy}
                  x2={476 + ([108, 90, 100, 78] as number[])[i]} y2={508 + dy}
                  stroke="#ff6b2b" strokeWidth="0.8" strokeOpacity={0.28 - i * 0.05} />
              ))}
            </g>
            <text x="530" y="578" fontFamily="JetBrains Mono, monospace" fontSize="11"
              fill="#ff6b2b" textAnchor="middle" fontWeight="700" letterSpacing="2"
              filter="url(#glow-soft)">CONTACT</text>
            <text x="530" y="592" fontFamily="JetBrains Mono, monospace" fontSize="8"
              fill="#ff6b2b" textAnchor="middle" opacity="0.4" letterSpacing="1">
              {clickHint}
            </text>
          </g>
        </g>

        {/* Vignette */}
        <rect width="640" height="700" fill="url(#vignette)" pointerEvents="none" />

      </svg>
    </div>
  );
}
