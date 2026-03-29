"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./ContactSection.module.scss";

interface ContactSectionProps {
  dict: Dictionary;
  lang: Lang;
}

export default function ContactSection({ dict, lang }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulated send — connect to real service (Resend, Formspree, etc.) later
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles["contact-section"]}
    >
      <div className={styles["contact-section__inner"]}>
        {/* Header */}
        <motion.div
          className={styles["contact-section__header"]}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className={styles["contact-section__eyebrow"]}>
            // {dict.contact.eyebrow}
          </p>
          <h2 className={styles["contact-section__title"]}>
            {dict.contact.title}
          </h2>
          <p className={styles["contact-section__subtitle"]}>
            {dict.contact.subtitle}
          </p>
        </motion.div>

        <div className={styles["contact-layout"]}>
          {/* Form */}
          <motion.form
            className={styles["contact-form"]}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className={styles["contact-form__field"]}>
              <label
                htmlFor="contact-name"
                className={styles["contact-form__label"]}
              >
                {dict.contact.name_label}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formState.name}
                onChange={handleChange}
                placeholder={dict.contact.name_placeholder}
                className={styles["contact-form__input"]}
                autoComplete="name"
              />
            </div>

            <div className={styles["contact-form__field"]}>
              <label
                htmlFor="contact-email"
                className={styles["contact-form__label"]}
              >
                {dict.contact.email_label}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={handleChange}
                placeholder={dict.contact.email_placeholder}
                className={styles["contact-form__input"]}
                autoComplete="email"
              />
            </div>

            <div className={styles["contact-form__field"]}>
              <label
                htmlFor="contact-message"
                className={styles["contact-form__label"]}
              >
                {dict.contact.message_label}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={formState.message}
                onChange={handleChange}
                placeholder={dict.contact.message_placeholder}
                className={styles["contact-form__textarea"]}
              />
            </div>

            <button
              type="submit"
              className={styles["contact-form__submit"]}
              disabled={status === "sending" || status === "success"}
            >
              {status === "sending"
                ? dict.contact.sending
                : status === "success"
                ? dict.contact.success
                : dict.contact.send_button}
            </button>

            {status === "error" && (
              <p className={styles["contact-form__error"]}>{dict.contact.error}</p>
            )}
          </motion.form>

          {/* Sidebar info */}
          <motion.div
            className={styles["contact-info"]}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <p className={styles["contact-info__reach"]}>{dict.contact.or_reach}</p>

            <a
              href="mailto:logan.dandy@email.com"
              className={styles["contact-info__link"]}
            >
              <span className={styles["contact-info__link-icon"]}>@</span>
              logan.dandy@email.com
            </a>

            <a
              href="tel:+33600000000"
              className={styles["contact-info__link"]}
            >
              <span className={styles["contact-info__link-icon"]}>☎</span>
              +33 6 00 00 00 00
            </a>

            <a
              href={`/cv/cv-${lang}.pdf`}
              download
              className={styles["contact-info__cv-download"]}
            >
              <span>↓</span>
              {dict.contact.download_cv}
            </a>

            {/* Easter egg hint */}
            <div className={styles["contact-info__hint"]}>
              <span className={styles["contact-info__hint-text"]}>
                {lang === "fr"
                  ? "// Psst... essaie de taper quelque chose sur ton clavier 👀"
                  : "// Psst... try typing something on your keyboard 👀"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles["site-footer"]}>
        <p className={styles["site-footer__text"]}>
          {lang === "fr"
            ? "Conçu & développé par Logan Dandy — 2025"
            : "Designed & developed by Logan Dandy — 2025"}
        </p>
        <p className={styles["site-footer__stack"]}>
          Next.js · React Three Fiber · GSAP · SCSS
        </p>
      </footer>
    </section>
  );
}
