"use client";
import styles from "./DeviceFrame.module.scss";

/** Purely decorative overlay — pointer-events: none, no layout impact */
export default function DeviceFrame() {
  return (
    <div className={styles["device"]} aria-hidden>
      {/* ── Corners ── */}
      <span className={`${styles.corner} ${styles["corner--tl"]}`} />
      <span className={`${styles.corner} ${styles["corner--tr"]}`} />
      <span className={`${styles.corner} ${styles["corner--bl"]}`} />
      <span className={`${styles.corner} ${styles["corner--br"]}`} />

      {/* ── Desktop status bar (bottom) ── */}
      <div className={styles["statusbar"]}>
        <span className={styles["statusbar__dot"]} />
        <span className={styles["statusbar__item"]}>SYS:ONLINE</span>
        <span className={styles["statusbar__sep"]}>|</span>
        <span className={styles["statusbar__item"]}>LD://PORTFOLIO</span>
        <span className={styles["statusbar__spacer"]} />
        <span className={styles["statusbar__item"]}>v2027.1.0</span>
      </div>

      {/* ── Mobile notch ── */}
      <div className={styles["notch"]} />

      {/* ── Mobile home indicator ── */}
      <div className={styles["home-bar"]} />
    </div>
  );
}
