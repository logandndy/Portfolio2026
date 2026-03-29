import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Logan Dandy — Software Engineer",
  description:
    "Portfolio de Software Engineer. De la logique Backend aux Expériences Interactives. Disponible en France, Suisse et Canada.",
  keywords: ["Software Engineer", "React", "Node.js", "Java", "3D", "Portfolio"],
  authors: [{ name: "Logan Dandy" }],
  openGraph: {
    title: "Logan Dandy — Software Engineer",
    description: "Portfolio de Software Engineer 2027. Cyber-Corpo Interactive Experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
