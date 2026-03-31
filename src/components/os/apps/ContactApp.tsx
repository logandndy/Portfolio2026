"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import styles from "./ContactApp.module.scss";

interface ContactAppProps {
  dict: Dictionary;
  lang: Lang;
}

export default function ContactApp({ dict, lang }: ContactAppProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise(r => setTimeout(r, 1200));
    setStatus("success");
  };

  const btnLabel =
    status === "sending" ? dict.contact.sending :
    status === "success" ? dict.contact.success :
    dict.contact.send_button;

  return (
    <div className={styles.app}>
      <div className={styles.scroll}>
        <div className={styles.body}>

          {/* Form column */}
          <div className={styles.formCol}>
            <p className={styles.eyebrow}>{dict.contact.eyebrow}</p>
            <h2 className={styles.title}>{dict.contact.title}</h2>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {(["name", "email"] as const).map(field => (
                <div key={field} className={styles.field}>
                  <label htmlFor={`os-${field}`} className={styles.label}>
                    {dict.contact[`${field}_label` as keyof typeof dict.contact] as string}
                  </label>
                  <div className={`${styles.inputWrap} ${focused === field ? styles["inputWrap--active"] : ""}`}>
                    <span className={styles.scanline} aria-hidden />
                    <input
                      id={`os-${field}`}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      required
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={dict.contact[`${field}_placeholder` as keyof typeof dict.contact] as string}
                      className={styles.input}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              ))}

              <div className={styles.field}>
                <label htmlFor="os-message" className={styles.label}>{dict.contact.message_label}</label>
                <div className={`${styles.inputWrap} ${focused === "message" ? styles["inputWrap--active"] : ""}`}>
                  <span className={styles.scanline} aria-hidden />
                  <textarea
                    id="os-message"
                    name="message"
                    required
                    rows={3}
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
                <span>{status === "success" ? "✓" : "→"}</span>
              </button>

              {status === "error" && <p className={styles.error}>{dict.contact.error}</p>}
            </form>
          </div>

          {/* Info column */}
          <div className={styles.infoCol}>
            <p className={styles.label}>{dict.contact.or_reach}</p>

            <div className={styles.links}>
              <a href="mailto:logan.dandy@email.com" className={styles.link}>
                <span className={styles.link__icon}>@</span>
                <span>logan.dandy@email.com</span>
                <span className={styles.link__arrow}>↗</span>
              </a>
              <a href="tel:+33600000000" className={styles.link}>
                <span className={styles.link__icon}>☎</span>
                <span>+33 6 00 00 00 00</span>
                <span className={styles.link__arrow}>↗</span>
              </a>
              <a
                href="https://github.com/logandndy"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.link__icon}>⌥</span>
                <span>github.com/logandndy</span>
                <span className={styles.link__arrow}>↗</span>
              </a>
            </div>

            <a href={`/cv/cv-${lang}.pdf`} download className={styles.cvBtn}>
              <span>↓</span>
              <span>{dict.contact.download_cv}</span>
            </a>

            <div className={styles.hint}>
              <span className={styles.hint__pre}>&gt;_</span>
              <span>
                {lang === "fr"
                  ? "Tape \"HIRE\" sur ton clavier"
                  : "Type \"HIRE\" on your keyboard"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
