"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import type { Lang } from "@/types";
import styles from "./OsBoot.module.scss";

interface Line {
  text: string;
  color?: string;
  charDelay: number; // seconds per char
  postDelay: number; // seconds pause after line
}

const LINES: Record<Lang, Line[]> = {
  en: [
    { text: "> CORP-OS v2.7 — BOOT SEQUENCE",          color: "#00ff88", charDelay: 0.015, postDelay: 0.40 },
    { text: "> HARDWARE CHECK.....................  OK", color: "#00ff88", charDelay: 0.012, postDelay: 0.20 },
    { text: "",                                                            charDelay: 0,     postDelay: 0.20 },
    { text: "> LOCATING PORTFOLIO FILES",                color: "#00d4ff", charDelay: 0.018, postDelay: 0.30 },
    { text: "> USER ............  LOGAN DONDAY",         color: "#e8edf2", charDelay: 0.012, postDelay: 0.10 },
    { text: "> TITLE ...........  SOFTWARE ENGINEER",    color: "#e8edf2", charDelay: 0.012, postDelay: 0.10 },
    { text: "> LOCATION ........  FR · CH · CA",         color: "#e8edf2", charDelay: 0.012, postDelay: 0.10 },
    { text: "> STATUS ..........  AVAILABLE ●",          color: "#00ff88", charDelay: 0.012, postDelay: 0.50 },
    { text: "",                                                            charDelay: 0,     postDelay: 0.10 },
    { text: "// ACCESS GRANTED. Welcome, recruiter.",    color: "#ff6b2b", charDelay: 0.022, postDelay: 0.00 },
  ],
  fr: [
    { text: "> CORP-OS v2.7 — DÉMARRAGE",               color: "#00ff88", charDelay: 0.015, postDelay: 0.40 },
    { text: "> VÉRIFICATION SYSTÈME..............  OK",  color: "#00ff88", charDelay: 0.012, postDelay: 0.20 },
    { text: "",                                                            charDelay: 0,     postDelay: 0.20 },
    { text: "> CHARGEMENT DES FICHIERS",                 color: "#00d4ff", charDelay: 0.018, postDelay: 0.30 },
    { text: "> UTILISATEUR .....  LOGAN DONDAY",         color: "#e8edf2", charDelay: 0.012, postDelay: 0.10 },
    { text: "> TITRE ...........  INGÉNIEUR LOGICIEL",   color: "#e8edf2", charDelay: 0.012, postDelay: 0.10 },
    { text: "> LOCALISATION ....  FR · CH · CA",         color: "#e8edf2", charDelay: 0.012, postDelay: 0.10 },
    { text: "> STATUT ..........  DISPONIBLE ●",         color: "#00ff88", charDelay: 0.012, postDelay: 0.50 },
    { text: "",                                                            charDelay: 0,     postDelay: 0.10 },
    { text: "// ACCÈS ACCORDÉ. Bienvenue, recruteur.",   color: "#ff6b2b", charDelay: 0.022, postDelay: 0.00 },
  ],
};

interface OsBootProps {
  lang: Lang;
  onEnter: () => void;
}

export default function OsBoot({ lang, onEnter }: OsBootProps) {
  const bootRef   = useRef<HTMLDivElement>(null);
  const termRef   = useRef<HTMLDivElement>(null);
  const enterRef  = useRef<HTMLButtonElement>(null);
  const hintRef   = useRef<HTMLParagraphElement>(null);
  const exitingRef = useRef(false);
  const [typingDone, setTypingDone] = useState(false);

  // ── Typewriter ────────────────────────────────────────────
  useEffect(() => {
    const lines = LINES[lang];
    const term  = termRef.current;
    const boot  = bootRef.current;
    if (!term || !boot) return;

    const kills: gsap.core.Tween[] = [];
    let lineIdx = 0;
    let charIdx = 0;
    let span: HTMLSpanElement | null = null;
    let alive = true;

    const nextChar = () => {
      if (!alive) return;
      if (lineIdx >= lines.length) { setTypingDone(true); return; }
      const line = lines[lineIdx];

      // Empty line = spacer
      if (line.text.length === 0) {
        const br = document.createElement("br");
        term.appendChild(br);
        lineIdx++;
        kills.push(gsap.delayedCall(line.postDelay || 0.15, nextChar));
        return;
      }

      // Create span for new line
      if (!span) {
        span = document.createElement("span");
        span.style.color  = line.color ?? "";
        span.style.display = "block";
        term.appendChild(span);
      }

      if (charIdx < line.text.length) {
        span.textContent = line.text.slice(0, charIdx + 1);
        charIdx++;
        term.scrollTop = term.scrollHeight;
        kills.push(gsap.delayedCall(line.charDelay, nextChar));
      } else {
        lineIdx++;
        charIdx = 0;
        span = null;
        kills.push(gsap.delayedCall(line.postDelay, nextChar));
      }
    };

    // Power-on CRT flicker, then start typing
    const tl = gsap.timeline()
      .set(boot,  { opacity: 0 })
      .to(boot,   { opacity: 1,   duration: 0.06 })
      .to(boot,   { opacity: 0.1, duration: 0.08 })
      .to(boot,   { opacity: 1,   duration: 0.05 })
      .to(boot,   { opacity: 0.5, duration: 0.06 })
      .to(boot,   { opacity: 1,   duration: 0.10 })
      .call(() => { kills.push(gsap.delayedCall(0.15, nextChar)); });

    return () => {
      alive = false;
      tl.kill();
      kills.forEach(k => k.kill());
    };
  }, [lang]);

  // ── Fade in ENTER button when done ────────────────────────
  useEffect(() => {
    if (!typingDone) return;
    gsap.fromTo(
      [enterRef.current, hintRef.current],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.10, ease: "power2.out" }
    );
  }, [typingDone]);

  // ── Keyboard ENTER ────────────────────────────────────────
  const handleEnter = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    gsap.to(bootRef.current, {
      opacity: 0, duration: 0.32, ease: "power2.in",
      onComplete: onEnter,
    });
  }, [onEnter]);

  useEffect(() => {
    if (!typingDone) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter") handleEnter(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typingDone, handleEnter]);

  return (
    <div ref={bootRef} className={styles.boot}>
      {/* Scanline overlay */}
      <div className={styles.scanlines} aria-hidden />

      {/* Terminal output area */}
      <div ref={termRef} className={styles.terminal} aria-live="polite" />

      {/* Blinking cursor — follows text while typing */}
      {!typingDone && <span className={styles.cursor} aria-hidden />}

      {/* Enter area */}
      <div className={styles.footer}>
        <button
          ref={enterRef}
          className={styles.enterBtn}
          onClick={handleEnter}
          aria-label={lang === "fr" ? "Entrer dans le portfolio" : "Enter portfolio"}
        >
          <span className={styles.enterBtn__bracket}>[</span>
          <span>{lang === "fr" ? "ENTRER" : "ENTER"}</span>
          <span className={styles.enterBtn__bracket}>]</span>
          <span className={styles.enterBtn__arrow}>→</span>
        </button>
        <p ref={hintRef} className={styles.hint}>
          {lang === "fr" ? "ou appuie sur ↵ ENTRÉE" : "or press ↵ ENTER"}
        </p>
      </div>
    </div>
  );
}
