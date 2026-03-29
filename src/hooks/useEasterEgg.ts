"use client";

import { useState, useEffect, useCallback } from "react";

const SECRET_CODE = "HIRE";

export function useEasterEgg() {
  const [buffer, setBuffer] = useState("");
  const [isTriggered, setIsTriggered] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isTriggered) return;

      const key = e.key.toUpperCase();
      if (key.length !== 1 || !/[A-Z]/.test(key)) {
        setBuffer("");
        return;
      }

      setBuffer((prev) => {
        const next = (prev + key).slice(-SECRET_CODE.length);
        if (next === SECRET_CODE) {
          setIsTriggered(true);
        }
        return next;
      });
    },
    [isTriggered]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setIsTriggered(false);
    setBuffer("");
  }, []);

  return { isTriggered, reset };
}
