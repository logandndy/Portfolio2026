"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterOptions {
  speed?: number;
  delayBetweenLines?: number;
}

export function useTypewriter(lines: string[], options: TypewriterOptions = {}) {
  const { speed = 28, delayBetweenLines = 400 } = options;

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Always reset on lines change — prevents stale isDone=true triggering
    // the component's commit effect when the next response arrives
    setDisplayedLines([]);
    setCurrentLine("");
    setIsDone(false);

    if (!lines.length) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    lineIndexRef.current = 0;
    charIndexRef.current = 0;

    const typeNextChar = () => {
      const lineIdx = lineIndexRef.current;
      const charIdx = charIndexRef.current;

      if (lineIdx >= lines.length) {
        setIsTyping(false);
        setIsDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const currentTarget = lines[lineIdx];

      if (charIdx < currentTarget.length) {
        setCurrentLine(currentTarget.slice(0, charIdx + 1));
        charIndexRef.current += 1;
      } else {
        // Line complete — push to displayed and start next
        setDisplayedLines((prev) => [...prev, currentTarget]);
        setCurrentLine("");
        lineIndexRef.current += 1;
        charIndexRef.current = 0;

        if (lineIndexRef.current < lines.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            intervalRef.current = setInterval(typeNextChar, speed);
          }, delayBetweenLines);
        }
      }
    };

    intervalRef.current = setInterval(typeNextChar, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lines, speed, delayBetweenLines]);

  return { displayedLines, currentLine, isTyping, isDone };
}
