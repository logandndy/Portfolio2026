import type { Lang } from "@/types";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const dictionaries = { fr, en } as const;

export type Dictionary = typeof fr;

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries.fr;
}

export const SUPPORTED_LANGS: Lang[] = ["fr", "en"];
export const DEFAULT_LANG: Lang = "fr";

export function isValidLang(lang: string): lang is Lang {
  return SUPPORTED_LANGS.includes(lang as Lang);
}
