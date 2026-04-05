"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useEasterEgg } from "@/hooks/useEasterEgg";
import { getDictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import type { Dictionary } from "@/lib/i18n";
import OsSection from "@/components/os/OsSection";
import EasterEgg from "@/components/easter-egg/EasterEgg";

interface HomePageProps {
  dict: Dictionary;
  lang: Lang;
}

export default function HomePage({ dict: _initialDict, lang: initialLang }: HomePageProps) {
  const { lang, toggle } = useLanguage(initialLang);
  const { isTriggered: easterEggTriggered, trigger: triggerEasterEgg, reset: resetEasterEgg } = useEasterEgg();

  const dict = getDictionary(lang);

  return (
    <>
      <OsSection dict={dict} lang={lang} onToggleLang={toggle} onSecretFound={triggerEasterEgg} />

      {easterEggTriggered && (
        <EasterEgg dict={dict} lang={lang} onClose={resetEasterEgg} />
      )}
    </>
  );
}
