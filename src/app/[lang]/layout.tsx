import { notFound } from "next/navigation";
import { isValidLang, getDictionary } from "@/lib/i18n";
import type { Lang } from "@/types";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  return (
    <div data-lang={lang as Lang}>
      {children}
    </div>
  );
}
