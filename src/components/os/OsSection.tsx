"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import MonitorSvg from "./MonitorSvg";
import PhoneSvg from "./PhoneSvg";
import OsDesktop, { type AppId } from "./OsDesktop";
import OsWindow from "./OsWindow";
import ProjectsApp from "./apps/ProjectsApp";
import SkillsApp from "./apps/SkillsApp";
import ContactApp from "./apps/ContactApp";
import styles from "./OsSection.module.scss";

interface OsSectionProps {
  dict: Dictionary;
  lang: Lang;
}

// Desktop breakpoint matches SCSS @include desktop (1025px)
const isDesktopViewport = () =>
  typeof window !== "undefined" && window.innerWidth >= 1025;

export default function OsSection({ dict, lang }: OsSectionProps) {
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const phoneContentRef   = useRef<HTMLDivElement>(null);
  const monitorContentRef = useRef<HTMLDivElement>(null);

  const getContentRef = () =>
    isDesktopViewport() ? monitorContentRef : phoneContentRef;

  const openApp = useCallback((id: AppId) => {
    const el = getContentRef().current;
    if (!el) { setActiveApp(id); return; }
    gsap.to(el, {
      opacity: 0, scale: 0.97, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActiveApp(id);
        gsap.fromTo(el,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
        );
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeApp = useCallback(() => {
    const el = getContentRef().current;
    if (!el) { setActiveApp(null); return; }
    gsap.to(el, {
      opacity: 0, x: 16, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActiveApp(null);
        gsap.fromTo(el,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }
        );
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderScreen = (contentRef: React.RefObject<HTMLDivElement | null>) => (
    <div className={styles["screen-content"]} ref={contentRef}>
      {activeApp === null ? (
        <OsDesktop lang={lang} onOpen={openApp} />
      ) : (
        <OsWindow appId={activeApp} onClose={closeApp}>
          {activeApp === "projects" && <ProjectsApp dict={dict} lang={lang} />}
          {activeApp === "skills"   && <SkillsApp   dict={dict} lang={lang} />}
          {activeApp === "contact"  && <ContactApp  dict={dict} lang={lang} />}
        </OsWindow>
      )}
    </div>
  );

  return (
    <section id="os" className={styles.section}>
      <div className={styles.topline} aria-hidden />

      <div className={styles.inner}>
        {/* ── Phone frame (mobile only, hidden on desktop via CSS) ── */}
        <div className={styles["frame-phone"]}>
          <PhoneSvg className={styles["frame-svg"]} />
          <div className={styles["screen-phone"]} data-os-screen>
            {renderScreen(phoneContentRef)}
          </div>
        </div>

        {/* ── Monitor frame (desktop only, hidden on mobile via CSS) ── */}
        <div className={styles["frame-monitor"]}>
          <MonitorSvg className={styles["frame-svg"]} />
          <div className={styles["screen-monitor"]} data-os-screen>
            {renderScreen(monitorContentRef)}
          </div>
        </div>
      </div>
    </section>
  );
}
