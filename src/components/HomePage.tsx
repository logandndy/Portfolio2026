"use client";

import { useState } from "react";
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

interface HomePageProps {
  dict: Dictionary;
  lang: Lang;
}

export default function HomePage({ dict: initialDict, lang: initialLang }: HomePageProps) {
  const { lang, toggle } = useLanguage(initialLang);
  const { isTriggered: easterEggTriggered, reset: resetEasterEgg } = useEasterEgg();
  const [chatbotTrigger, setChatbotTrigger] = useState(0);

  const dict = getDictionary(lang);

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
    </>
  );
}
