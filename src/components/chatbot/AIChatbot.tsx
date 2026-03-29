"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
import dialogueData from "@/data/ai-dialogue.json";
import styles from "./AIChatbot.module.scss";

interface AIChatbotProps {
  dict: Dictionary;
  lang: Lang;
  openTrigger?: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

export default function AIChatbot({ dict, lang, openTrigger = 0 }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "bot",
      text: dict.chatbot.greeting,
    },
  ]);
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openTrigger > 0) setIsOpen(true);
  }, [openTrigger]);

  const { displayedLines, currentLine, isDone } = useTypewriter(activeLines, {
    speed: 22,
    delayBetweenLines: 300,
  });

  // When typewriter finishes, push all lines as separate bot messages
  useEffect(() => {
    if (isDone && activeLines.length > 0) {
      const newMessages: ChatMessage[] = activeLines.map((line, i) => ({
        id: `bot-${Date.now()}-${i}`,
        role: "bot",
        text: line,
      }));
      setMessages((prev) => [...prev, ...newMessages]);
      setActiveLines([]);
      setIsTyping(false);
    }
  }, [isDone, activeLines]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentLine]);

  const handleQuestion = (questionIndex: number) => {
    if (isTyping) return;

    const question = dict.chatbot.questions[questionIndex];
    const langSuffix = lang === "fr" ? "fr" : "en";

    // Find matching response
    const responseKeys = Object.keys(dialogueData.responses);
    const matchingKey = responseKeys.find((key) => key.endsWith(`_${langSuffix}`));

    // Map question index to response key
    const keyMap: Record<number, string> = {
      0: `availability_${langSuffix}`,
      1: `why_hire_${langSuffix}`,
      2: `stack_${langSuffix}`,
      3: `remote_${langSuffix}`,
      4: `ambitious_project_${langSuffix}`,
      5: `salary_${langSuffix}`,
    };

    const responseKey = keyMap[questionIndex];
    const response = dialogueData.responses[responseKey as keyof typeof dialogueData.responses];

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: question },
    ]);

    setIsTyping(true);
    setActiveLines(response?.lines ?? ["..."]);
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        className={styles["chatbot-toggle"]}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close assistant" : "Open AI assistant"}
      >
        <span className={styles["chatbot-toggle__icon"]}>
          {isOpen ? "✕" : ">_"}
        </span>
        {!isOpen && (
          <span className={styles["chatbot-toggle__label"]}>
            {dict.chatbot.subtitle}
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles["chatbot-window"]}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className={styles["chatbot-header"]}>
              <div className={styles["chatbot-header__info"]}>
                <span className={styles["chatbot-header__dot"]} />
                <span className={styles["chatbot-header__title"]}>
                  {dict.chatbot.subtitle}
                </span>
              </div>
              <button
                className={styles["chatbot-header__close"]}
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className={styles["chatbot-messages"]}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles["chatbot-message"]} ${
                    msg.role === "user"
                      ? styles["chatbot-message--user"]
                      : styles["chatbot-message--bot"]
                  }`}
                >
                  {msg.role === "bot" && (
                    <span className={styles["chatbot-message__prefix"]}>
                      &gt;{" "}
                    </span>
                  )}
                  {msg.text}
                </div>
              ))}

              {/* Typewriter in progress */}
              {isTyping && activeLines.length > 0 && (
                <>
                  {displayedLines.map((line, i) => (
                    <div
                      key={`typing-done-${i}`}
                      className={`${styles["chatbot-message"]} ${styles["chatbot-message--bot"]}`}
                    >
                      <span className={styles["chatbot-message__prefix"]}>&gt; </span>
                      {line}
                    </div>
                  ))}
                  {currentLine && (
                    <div
                      className={`${styles["chatbot-message"]} ${styles["chatbot-message--bot"]} ${styles["chatbot-message--typing"]}`}
                    >
                      <span className={styles["chatbot-message__prefix"]}>&gt; </span>
                      {currentLine}
                      <span className={styles["chatbot-cursor"]}>█</span>
                    </div>
                  )}
                </>
              )}

              {isTyping && !currentLine && activeLines.length === 0 && (
                <div
                  className={`${styles["chatbot-message"]} ${styles["chatbot-message--bot"]}`}
                >
                  <span className={styles["chatbot-message__prefix"]}>&gt; </span>
                  <span className={styles["chatbot-cursor"]}>█</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className={styles["chatbot-questions"]}>
              <p className={styles["chatbot-questions__label"]}>
                {dict.chatbot.placeholder}
              </p>
              <div className={styles["chatbot-questions__list"]}>
                {dict.chatbot.questions.map((question, i) => (
                  <button
                    key={i}
                    className={styles["chatbot-question-btn"]}
                    onClick={() => handleQuestion(i)}
                    disabled={isTyping}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
