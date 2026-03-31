"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import MonitorSvg from "./MonitorSvg";
import PhoneSvg from "./PhoneSvg";
import OsBoot from "./OsBoot";
import OsDesktop, { type AppId } from "./OsDesktop";
import OsWindow from "./OsWindow";
import ProjectsApp from "./apps/ProjectsApp";
import SkillsApp from "./apps/SkillsApp";
import ContactApp from "./apps/ContactApp";
import SectionTransition, { type SectionTransitionHandle } from "@/components/ui/SectionTransition";
import AIChatbot from "@/components/chatbot/AIChatbot";
import styles from "./OsSection.module.scss";

interface OsSectionProps {
  dict: Dictionary;
  lang: Lang;
  onToggleLang: () => void;
}

export default function OsSection({ dict, lang, onToggleLang }: OsSectionProps) {
  const [booted, setBooted]           = useState(false);
  const [activeApp, setActiveApp]     = useState<AppId | null>(null);
  const [chatTrigger, setChatTrigger] = useState(0);

  // Each visible screen has its own contained canvas
  const phoneTransRef   = useRef<SectionTransitionHandle>(null);
  const monitorTransRef = useRef<SectionTransitionHandle>(null);

  const isDesktopViewport = () =>
    typeof window !== "undefined" && window.innerWidth >= 1025;

  const getTransRef = () =>
    isDesktopViewport() ? monitorTransRef : phoneTransRef;

  // ── Pixel-matrix transition wrapper ───────────────────────
  const withTransition = useCallback((fn: () => void, direction: 1 | -1 = 1) => {
    const ref = getTransRef();
    if (!ref.current) { fn(); return; }
    ref.current.play(fn, direction);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBooted = useCallback(() => {
    withTransition(() => setBooted(true), 1);
  }, [withTransition]);

  const openApp = useCallback((id: AppId) => {
    if (id === "chatbot") { setChatTrigger(t => t + 1); return; }
    withTransition(() => setActiveApp(id), 1);
  }, [withTransition]);

  const closeApp = useCallback(() => {
    withTransition(() => setActiveApp(null), -1);
  }, [withTransition]);

  // ── Block page scroll ─────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Shared screen content ─────────────────────────────────
  const renderScreenContent = () => (
    <>
      {!booted ? (
        <OsBoot lang={lang} onEnter={handleBooted} />
      ) : activeApp === null ? (
        <OsDesktop lang={lang} onOpen={openApp} onToggleLang={onToggleLang} />
      ) : (
        <OsWindow appId={activeApp} onClose={closeApp}>
          {activeApp === "projects" && <ProjectsApp dict={dict} lang={lang} />}
          {activeApp === "skills"   && <SkillsApp   dict={dict} lang={lang} />}
          {activeApp === "contact"  && <ContactApp  dict={dict} lang={lang} />}
        </OsWindow>
      )}
    </>
  );

  return (
    <>
      <section id="os" className={styles.section}>
        <div className={styles.inner}>

          {/* ── Phone frame (mobile only) ── */}
          <div className={styles["frame-phone"]}>
            <PhoneSvg className={styles["frame-svg"]} />
            <div className={styles["screen-phone"]} data-os-screen>
              <div className={styles["screen-content"]}>
                {renderScreenContent()}
                {/* Transition canvas — contained inside this screen */}
                <SectionTransition ref={phoneTransRef} />
              </div>
            </div>
          </div>

          {/* ── Monitor frame (desktop only) ── */}
          <div className={styles["frame-monitor"]}>
            <MonitorSvg className={styles["frame-svg"]} />
            <div className={styles["screen-monitor"]} data-os-screen>
              <div className={styles["screen-content"]}>
                {renderScreenContent()}
                {/* Transition canvas — contained inside this screen */}
                <SectionTransition ref={monitorTransRef} />
              </div>
            </div>
          </div>

        </div>
      </section>

      <AIChatbot dict={dict} lang={lang} openTrigger={chatTrigger} />
    </>
  );
}
