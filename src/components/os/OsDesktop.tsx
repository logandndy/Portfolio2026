"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/types";
import styles from "./OsDesktop.module.scss";

export type AppId = "projects" | "skills" | "contact";

const APPS: Array<{ id: AppId; glyph: string; color: string; labelFr: string; labelEn: string }> = [
  { id: "projects", glyph: "◈", color: "#00d4ff", labelFr: "Projets",      labelEn: "Projects"   },
  { id: "skills",   glyph: "⬡", color: "#9b5de5", labelFr: "Compétences",  labelEn: "Skills"     },
  { id: "contact",  glyph: "@", color: "#ff6b2b", labelFr: "Contact",       labelEn: "Contact"    },
];

interface OsDesktopProps {
  lang: Lang;
  onOpen: (id: AppId) => void;
}

export default function OsDesktop({ lang, onOpen }: OsDesktopProps) {
  const [time, setTime] = useState("");

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
      {/* Taskbar */}
      <div className={styles.taskbar}>
        <span className={styles.taskbar__brand}>CORPO-OS v2.7</span>
        <span className={styles.taskbar__dot} />
        <span className={styles.taskbar__sep} />
        <span className={styles.taskbar__status}>ONLINE ●</span>
        <span className={styles.taskbar__time}>{time}</span>
      </div>

      {/* Desktop area */}
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
            <button
              key={app.id}
              className={styles.icon}
              style={{ "--app-color": app.color } as React.CSSProperties}
              onClick={() => onOpen(app.id)}
              aria-label={lang === "fr" ? app.labelFr : app.labelEn}
            >
              <div className={styles.icon__box}>
                <span className={styles.icon__glyph}>{app.glyph}</span>
              </div>
              <span className={styles.icon__label}>
                {lang === "fr" ? app.labelFr : app.labelEn}
              </span>
            </button>
          ))}
        </div>

        <p className={styles.hint}>
          <span className={styles.hint__cursor}>_</span>
          &nbsp;
          {lang === "fr"
            ? "Double-clic pour ouvrir"
            : "Click to open"}
        </p>
      </div>
    </div>
  );
}
