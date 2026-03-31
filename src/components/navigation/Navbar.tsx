"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./Navbar.module.scss";

interface NavbarProps {
  dict: Dictionary;
  lang: Lang;
  onToggleLang: () => void;
}

export default function Navbar({ dict, lang, onToggleLang }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Measure real navbar height and expose as CSS var
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const set = () =>
      document.documentElement.style.setProperty("--navbar-h", el.offsetHeight + "px");
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { key: dict.nav.home, href: "#hero" },
    { key: dict.nav.projects, href: "#projects" },
    { key: dict.nav.skills, href: "#skills" },
    { key: dict.nav.contact, href: "#contact" },
  ];

  return (
    <header
      ref={headerRef}
      className={`${styles["navbar"]} ${isScrolled ? styles["navbar--scrolled"] : ""}`}
    >
      <div className={styles["navbar__inner"]}>
        {/* Logo / Brand */}
        <a href="#hero" className={styles["navbar__logo"]}>
          <span className={styles["navbar__logo-bracket"]}>&lt;</span>
          <span className={styles["navbar__logo-name"]}>LD</span>
          <span className={styles["navbar__logo-bracket"]}>/&gt;</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className={styles["navbar__links"]} aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles["navbar__link"]}>
              {link.key}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className={styles["navbar__actions"]}>
          {/* Lang switcher */}
          <button
            className={styles["navbar__lang-toggle"]}
            onClick={onToggleLang}
            aria-label={`Switch to ${lang === "fr" ? "English" : "Français"}`}
          >
            <span className={lang === "fr" ? styles["navbar__lang--active"] : ""}>FR</span>
            <span className={styles["navbar__lang-sep"]}>|</span>
            <span className={lang === "en" ? styles["navbar__lang--active"] : ""}>EN</span>
          </button>

          {/* Download CV */}
          <a
            href={`/cv/cv-${lang}.pdf`}
            download
            className={styles["navbar__cv-button"]}
          >
            {dict.nav.downloadCV}
          </a>

          {/* Mobile menu toggle */}
          <button
            className={styles["navbar__mobile-toggle"]}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menu"
            aria-expanded={isMobileOpen}
          >
            <span className={`${styles["navbar__burger"]} ${isMobileOpen ? styles["navbar__burger--open"] : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            className={styles["navbar__mobile-menu"]}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles["navbar__mobile-link"]}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.key}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
