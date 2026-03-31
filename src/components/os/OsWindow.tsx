"use client";

import type { AppId } from "./OsDesktop";
import styles from "./OsWindow.module.scss";

const APP_TITLES: Record<AppId, string> = {
  projects: "PROJECTS.EXE",
  skills:   "SKILL_TREE.EXE",
  contact:  "CONNECT.EXE",
};

interface OsWindowProps {
  appId: AppId;
  onClose: () => void;
  children: React.ReactNode;
}

export default function OsWindow({ appId, onClose, children }: OsWindowProps) {
  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <div className={styles.titlebar__dots}>
          <span
            className={`${styles.titlebar__dot} ${styles["titlebar__dot--close"]}`}
            onClick={onClose}
            role="button"
            aria-label="Close"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && onClose()}
          />
          <span className={`${styles.titlebar__dot} ${styles["titlebar__dot--min"]}`} />
          <span className={`${styles.titlebar__dot} ${styles["titlebar__dot--max"]}`} />
        </div>

        <span className={styles.titlebar__title}>{APP_TITLES[appId]}</span>

        <button className={styles.titlebar__close} onClick={onClose} aria-label="Close app">
          ESC ×
        </button>
      </div>

      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}
