"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Lang } from "@/types";
import styles from "./OsDesktop.module.scss";

export type AppId = "projects" | "skills" | "contact" | "chatbot";

const APPS: Array<{ id: AppId; glyph: string; color: string; labelFr: string; labelEn: string }> = [
  { id: "projects", glyph: "◈",  color: "#00d4ff", labelFr: "Projets",     labelEn: "Projects"  },
  { id: "skills",   glyph: "⬡",  color: "#9b5de5", labelFr: "Compétences", labelEn: "Skills"    },
  { id: "contact",  glyph: "@",  color: "#ff6b2b", labelFr: "Contact",      labelEn: "Contact"   },
  { id: "chatbot",  glyph: ">_", color: "#e040fb", labelFr: "CORPO//BOT",   labelEn: "CORPO//BOT"},
];

// ── Pixel fragment effect ─────────────────────────────────────
interface PixelData {
  bx: number;
  by: number;
  maxJitter: number;
  alphaBase: number;
  phase: number;
  skipChance: number;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

interface AppIconProps {
  app: (typeof APPS)[number];
  label: string;
  onOpen: () => void;
}

function AppIcon({ app, label, onOpen }: AppIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const pixelsRef = useRef<PixelData[]>([]);

  const buildPixels = useCallback((W: number, H: number) => {
    const BLOCK = 5;
    const cols = Math.ceil(W / BLOCK);
    const rows = Math.ceil(H / BLOCK);
    const pixels: PixelData[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Normalized distance from center (0 = center, 1 = corner)
        const cx = (col + 0.5) / cols - 0.5;
        const cy = (row + 0.5) / rows - 0.5;
        const dist = Math.sqrt(cx * cx + cy * cy) * Math.SQRT2; // 0..1

        pixels.push({
          bx: col * BLOCK,
          by: row * BLOCK,
          // Center pixels are dense & stable, edges scatter harder
          maxJitter: 1 + dist * 9,
          alphaBase: 0.55 - dist * 0.35,
          phase: Math.random() * Math.PI * 2,
          // Edge pixels randomly absent for jagged fragmentation look
          skipChance: dist > 0.55 ? 0.35 : 0,
        });
      }
    }
    return pixels;
  }, []);

  const startFragment = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const W = Math.round(rect.width);
    const H = Math.round(rect.height);
    canvas.width = W;
    canvas.height = H;

    pixelsRef.current = buildPixels(W, H);

    const ctx = canvas.getContext("2d")!;
    const [r, g, b] = parseHex(app.color);
    let frame = 0;

    const draw = () => {
      if (!activeRef.current) return;
      ctx.clearRect(0, 0, W, H);
      frame++;

      for (const p of pixelsRef.current) {
        // Randomly skip edge pixels each frame → jagged/fragmented border
        if (p.skipChance > 0 && Math.random() < p.skipChance) continue;

        // Jitter oscillates so pixels breathe in/out of their base position
        const jitterAmp = p.maxJitter * (0.4 + 0.6 * Math.abs(Math.sin(frame * 0.12 + p.phase)));
        const ox = (Math.random() - 0.5) * 2 * jitterAmp;
        const oy = (Math.random() - 0.5) * 2 * jitterAmp;

        // Alpha pulses independently per pixel
        const alpha = Math.max(0, p.alphaBase * (0.6 + 0.4 * Math.sin(frame * 0.09 + p.phase)));

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(p.bx + ox, p.by + oy, 4, 4);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
  }, [app.color, buildPixels]);

  const stopFragment = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <button
      className={styles.icon}
      style={{ "--app-color": app.color } as React.CSSProperties}
      onClick={onOpen}
      onMouseEnter={startFragment}
      onMouseLeave={stopFragment}
      onTouchStart={startFragment}
      onTouchEnd={stopFragment}
      aria-label={label}
    >
      <div className={styles.icon__box}>
        <canvas ref={canvasRef} className={styles.icon__canvas} />
        <span className={styles.icon__glyph}>{app.glyph}</span>
      </div>
      <span className={styles.icon__label}>{label}</span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────
interface OsDesktopProps {
  lang: Lang;
  onOpen: (id: AppId) => void;
  onToggleLang: () => void;
  onSecretFound: () => void;
}

export default function OsDesktop({ lang, onOpen, onToggleLang, onSecretFound }: OsDesktopProps) {
  const [time, setTime] = useState("");
  const clickTs = useRef<number[]>([]);

  const handleBrandClick = () => {
    const now = Date.now();
    clickTs.current = [...clickTs.current, now].filter(t => now - t < 2500);
    if (clickTs.current.length >= 5) {
      clickTs.current = [];
      onSecretFound();
    }
  };

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.getHours().toString().padStart(2, "0") + ":" +
        d.getMinutes().toString().padStart(2, "0")
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.desktop}>
      {/* ── Taskbar ─────────────────────────────────────────── */}
      <div className={styles.taskbar}>
        <span className={styles.taskbar__brand} onClick={handleBrandClick} role="button" aria-label="LD">
          <span className={styles.taskbar__brand_bracket}>&lt;</span>
          <span className={styles.taskbar__brand_text}>LD</span>
          <span className={styles.taskbar__brand_bracket}>/&gt;</span>
        </span>

        <span className={styles.taskbar__dot} />

        <div className={styles.taskbar__lang}>
          <button
            className={`${styles.taskbar__langBtn} ${lang === "fr" ? styles["taskbar__langBtn--active"] : ""}`}
            onClick={onToggleLang}
            aria-label="Français"
          >FR</button>
          <span className={styles.taskbar__langSep}>|</span>
          <button
            className={`${styles.taskbar__langBtn} ${lang === "en" ? styles["taskbar__langBtn--active"] : ""}`}
            onClick={onToggleLang}
            aria-label="English"
          >EN</button>
        </div>

        <a
          href={`/cv/cv-${lang}.pdf`}
          download
          className={styles.taskbar__cv}
          aria-label="Download CV"
        >
          ↓ CV
        </a>

        <span className={styles.taskbar__sep} />

        <span className={styles.taskbar__status}>● ONLINE</span>
        <span className={styles.taskbar__time}>{time}</span>
      </div>

      {/* ── Desktop area ────────────────────────────────────── */}
      <div className={styles.area}>
        <div className={styles.greeting}>
          <span className={styles.greeting__title}>
            {lang === "fr" ? "// INTERFACE PORTF.EXE" : "// PORTFOLIO INTERFACE"}
          </span>
          <span className={styles.greeting__sub}>
            {lang === "fr" ? "SÉLECTIONNE UNE APPLICATION" : "SELECT AN APPLICATION"}
          </span>
        </div>

        <div className={styles.icons}>
          {APPS.map(app => (
            <AppIcon
              key={app.id}
              app={app}
              label={lang === "fr" ? app.labelFr : app.labelEn}
              onOpen={() => onOpen(app.id)}
            />
          ))}
        </div>

        <p className={styles.hint}>
          <span className={styles.hint__cursor}>_</span>
          &nbsp;
          {lang === "fr" ? "Cliquer pour ouvrir" : "Click to open"}
        </p>
      </div>
    </div>
  );
}
