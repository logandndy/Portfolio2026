import { getDictionary } from "@/lib/i18n";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Lang } from "@/types";
import HomePage from "@/components/HomePage";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang as Lang);

  return <HomePage dict={dict} lang={lang as Lang} />;
}
