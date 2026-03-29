"use client";

import { useState, useCallback } from "react";
import type { Lang } from "@/types";

export function useLanguage(initial: Lang = "fr") {
  const [lang, setLang] = useState<Lang>(initial);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  const switchTo = useCallback((l: Lang) => {
    setLang(l);
  }, []);

  return { lang, toggle, switchTo };
}
