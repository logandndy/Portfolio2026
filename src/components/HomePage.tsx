"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { getDictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Dictionary } from "@/lib/i18n";
import Navbar from "@/components/navigation/Navbar";
import HeroScene from "@/components/hero/HeroScene";
import ProjectsSection from "@/components/projects/ProjectsSection";
import SkillTree from "@/components/skills/SkillTree";
import AIChatbot from "@/components/chatbot/AIChatbot";
import ContactSection from "@/components/contact/ContactSection";
import EasterEgg from "@/components/easter-egg/EasterEgg";
import SectionTransition, { type SectionTransitionHandle } from "@/components/ui/SectionTransition";

const SECTIONS = ["hero", "projects", "skills", "contact"];

interface HomePageProps {
  dict: Dictionary;
  lang: Lang;
}

export default function HomePage({ dict: initialDict, lang: initialLang }: HomePageProps) {
  const { lang, toggle } = useLanguage(initialLang);
  const { isTriggered: easterEggTriggered, reset: resetEasterEgg } = useEasterEgg();
  const [chatbotTrigger, setChatbotTrigger] = useState(0);

  const dict = getDictionary(lang);

  const transitionRef = useRef<SectionTransitionHandle>(null);
  const currentIdxRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const navigate = useCallback((direction: 1 | -1) => {
    const nextIdx = currentIdxRef.current + direction;
    if (nextIdx < 0 || nextIdx >= SECTIONS.length) return;
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    transitionRef.current?.play(() => {
      const el = document.getElementById(SECTIONS[nextIdx]);
      if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" } as ScrollToOptions);
      currentIdxRef.current = nextIdx;
    });

    // Unlock after full animation (cover ~0.65s + stagger ~0.55s + uncover ~0.52s + stagger ~0.4s + buffer)
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1600);
  }, []);

  // Keep currentIdxRef in sync via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            currentIdxRef.current = idx;
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Scroll / keyboard / touch interception
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept events inside the chatbot overlay
      if (target.closest('[class*="chatbot-overlay"]') || target.closest('[class*="chatbot-window"]')) return;
      e.preventDefault();
      if (e.deltaY > 0) navigate(1);
      else navigate(-1);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[class*="chatbot"]')) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 55) navigate(dy > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); navigate(1); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); navigate(-1); }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <>
      <Navbar dict={dict} lang={lang} onToggleLang={toggle} />

      <main>
        <HeroScene
          dict={dict}
          lang={lang}
          onChatOpen={() => setChatbotTrigger((t) => t + 1)}
        />
        <ProjectsSection dict={dict} lang={lang} />
        <SkillTree dict={dict} lang={lang} />
        <ContactSection dict={dict} lang={lang} />
      </main>

      <AIChatbot dict={dict} lang={lang} openTrigger={chatbotTrigger} />

      {easterEggTriggered && (
        <EasterEgg dict={dict} lang={lang} onClose={resetEasterEgg} />
      )}

      <SectionTransition ref={transitionRef} />
    </>
  );
}
