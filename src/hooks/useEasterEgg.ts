"use client";

import { useState, useCallback } from "react";

export function useEasterEgg() {
  const [isTriggered, setIsTriggered] = useState(false);

  const trigger = useCallback(() => setIsTriggered(true), []);

  const reset = useCallback(() => setIsTriggered(false), []);

  return { isTriggered, trigger, reset };
}
