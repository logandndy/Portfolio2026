"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./ContactSection.module.scss";

interface ContactSectionProps {
  dict: Dictionary;
  lang: Lang;
}

export default function ContactSection({ dict, lang }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const entered    = useRef(false);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  // Entrance
  useEffect(() => {
    if (!isInView || entered.current) return;
    entered.current = true;
    gsap.fromTo(leftRef.current,  { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.05 });
    gsap.fromTo(rightRef.current, { opacity: 0, x: 24  }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.18 });
  }, [isInView]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  const btnLabel =
    status === "sending" ? dict.contact.sending :
    status === "success" ? dict.contact.success :
    dict.contact.send_button;

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className={styles.topline} aria-hidden />

      <div className={styles.inner}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <p className={styles.eyebrow}>{dict.contact.eyebrow}</p>
          <h2 className={styles.title}>{dict.contact.title}</h2>
          <p className={styles.subtitle}>{dict.contact.subtitle}</p>
        </header>

        {/* ── 2-col body ── */}
        <div className={styles.body}>

          {/* LEFT: form */}
          <div ref={leftRef} className={styles.formWrap}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {(["name", "email"] as const).map((field) => (
                <div key={field} className={styles.field}>
                  <label htmlFor={`c-${field}`} className={styles.label}>
                    {dict.contact[`${field}_label` as keyof typeof dict.contact] as string}
                  </label>
                  <div className={`${styles.inputWrap} ${focused === field ? styles["inputWrap--active"] : ""}`}>
                    <span className={styles["inputWrap__scanline"]} aria-hidden />
                    <input
                      id={`c-${field}`}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      required
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={dict.contact[`${field}_placeholder` as keyof typeof dict.contact] as string}
                      className={styles.input}
                      autoComplete={field}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              ))}

              <div className={styles.field}>
                <label htmlFor="c-message" className={styles.label}>
                  {dict.contact.message_label}
                </label>
                <div className={`${styles.inputWrap} ${styles["inputWrap--area"]} ${focused === "message" ? styles["inputWrap--active"] : ""}`}>
                  <span className={styles["inputWrap__scanline"]} aria-hidden />
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={dict.contact.message_placeholder}
                    className={styles.textarea}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                className={`${styles.submit} ${status === "success" ? styles["submit--success"] : ""}`}
              >
                <span>{btnLabel}</span>
                <span className={styles["submit__arrow"]}>
                  {status === "success" ? "✓" : "→"}
                </span>
              </button>

              {status === "error" && (
                <p className={styles.error}>{dict.contact.error}</p>
              )}
            </form>
          </div>

          {/* RIGHT: info */}
          <div ref={rightRef} className={styles.info}>

            <p className={styles["info__label"]}>{dict.contact.or_reach}</p>

            <div className={styles["info__links"]}>
              <a href="mailto:logan.dandy@email.com" className={styles["info__link"]}>
                <span className={styles["info__link-icon"]}>@</span>
                <span>logan.dandy@email.com</span>
                <span className={styles["info__link-arrow"]}>↗</span>
              </a>
              <a href="tel:+33600000000" className={styles["info__link"]}>
                <span className={styles["info__link-icon"]}>☎</span>
                <span>+33 6 00 00 00 00</span>
                <span className={styles["info__link-arrow"]}>↗</span>
              </a>
            </div>

            <a href={`/cv/cv-${lang}.pdf`} download className={styles["info__cv"]}>
              <span className={styles["info__cv-icon"]}>↓</span>
              <span>{dict.contact.download_cv}</span>
            </a>

            <div className={styles["info__hint"]}>
              <span className={styles["info__hint-pre"]}>&gt;_</span>
              <span>
                {lang === "fr"
                  ? "Essaie de taper \"HIRE\" sur ton clavier"
                  : "Try typing \"HIRE\" on your keyboard"}
              </span>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
              <p className={styles["footer__text"]}>
                {lang === "fr" ? "Conçu & développé par " : "Designed & built by "}
                <strong>Logan Dandy</strong> — 2025
              </p>
              <p className={styles["footer__stack"]}>Next.js · R3F · GSAP · SCSS</p>
            </footer>
          </div>

        </div>
      </div>
    </section>
  );
}
