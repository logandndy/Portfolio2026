export type Lang = "fr" | "en";

export interface NavItem {
  key: string;
  href: string;
}

export interface DialogueLine {
  questionKey: string;
  lines: string[];
}

export interface DialogueData {
  version: string;
  botName: string;
  responses: Record<string, DialogueLine>;
}

export type SectionId = "hero" | "projects" | "skills" | "contact";
