"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { Dictionary } from "@/lib/i18n";
import type { Lang } from "@/types";
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

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  alpha: number;
  color: string;
  progress: number;
}

type Phase = "idle" | "opening" | "open" | "closing";

interface HistoryEntry { role: "user" | "assistant"; content: string; }
type ChatMode = "select" | "recruiter" | "project";

const MODE_GREETING: Record<ChatMode, Record<string, string>> = {
  select: { fr: "", en: "" },
  recruiter: {
    fr: "Bonjour. Je suis Logan Donday. Posez-moi vos questions — sur mon parcours, mes compétences, mes dispo, ce que vous voulez.",
    en: "Hey. I'm Logan Donday. Ask me anything — background, skills, availability, whatever you need to know.",
  },
  project: {
    fr: "Salut. Je suis Logan. Parlez-moi de votre projet — je vous dis direct ce que je peux apporter.",
    en: "Hey. I'm Logan. Tell me about your project — I'll tell you straight what I can bring to the table.",
  },
};

export default function AIChatbot({ dict, lang, openTrigger = 0 }: AIChatbotProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<ChatMode>("select");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeLines, setActiveLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const historyRef = useRef<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectMode = (m: "recruiter" | "project") => {
    setMode(m);
    setMessages([{ id: "greeting", role: "bot", text: MODE_GREETING[m][lang] }]);
    historyRef.current = [];
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const backToSelect = () => {
    setMode("select");
    setMessages([]);
    setActiveLines([]);
    setIsTyping(false);
    historyRef.current = [];
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  // phaseRef mirrors phase so callbacks can read current value without stale closures
  const phaseRef = useRef<Phase>("idle");
  // Keep ref in sync so callbacks can read current phase without stale closures
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const { displayedLines, currentLine, isDone } = useTypewriter(activeLines, {
    speed: 22,
    delayBetweenLines: 300,
  });

  useEffect(() => {
    if (isDone && activeLines.length > 0) {
      const newMessages: ChatMessage[] = activeLines.map((line, i) => ({
        id: `bot-${Date.now()}-${i}`,
        role: "bot",
        text: line,
      }));
      setMessages((prev) => [...prev, ...newMessages]);
      // Save full bot response to history
      historyRef.current = [
        ...historyRef.current,
        { role: "assistant", content: activeLines.join("\n") },
      ];
      setActiveLines([]);
      setIsTyping(false);
      // Refocus input after bot responds
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isDone, activeLines]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentLine]);

  // ── Particle assembly (open) ──
  const runOpenAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = Math.min(560, window.innerWidth * 0.9);
    const H = Math.min(680, window.innerHeight * 0.84);
    const wx = (window.innerWidth - W) / 2;
    const wy = (window.innerHeight - H) / 2;

    const particles: Particle[] = Array.from({ length: 350 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      tx: wx + Math.random() * W,
      ty: wy + Math.random() * H,
      size: 1.5 + Math.random() * 4,
      alpha: 0.5 + Math.random() * 0.5,
      color: Math.random() > 0.45 ? "#00d4ff" : "#9b5de5",
      progress: 0,
    }));
    particlesRef.current = particles;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const t = p.progress;
        const cx = p.x + (p.tx - p.x) * t;
        const cy = p.y + (p.ty - p.y) * t;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(cx - p.size / 2, cy - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    tweenRef.current = gsap.to(particles, {
      progress: 1,
      duration: 0.85,
      stagger: { each: 0.002, from: "random" },
      ease: "power3.in",
      onUpdate: draw,
      onComplete: () => {
        // Canvas fades out as chat window fades in
        gsap.to(canvas, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.opacity = "1";
            setPhase("open");
          },
        });
      },
    });
  }, []);

  // ── Particle scatter (close) ──
  const runCloseAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    const particles = particlesRef.current;

    if (!canvas || particles.length === 0) {
      setPhase("idle");
      return;
    }

    // Ensure canvas is visible and sized correctly
    gsap.killTweensOf(canvas);
    canvas.style.opacity = "1";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setPhase("idle"); return; }

    // Particles start at their final (window area) positions and scatter out
    for (const p of particles) p.progress = 1;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const t = p.progress; // 1 → 0
        const cx = p.x + (p.tx - p.x) * t;
        const cy = p.y + (p.ty - p.y) * t;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * t; // fade as they scatter
        ctx.fillRect(cx - p.size / 2, cy - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    tweenRef.current = gsap.to(particles, {
      progress: 0,
      duration: 0.4,
      stagger: { each: 0.001, from: "center" },
      ease: "power2.out",
      onUpdate: draw,
      onComplete: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setPhase("idle");
      },
    });
  }, []);

  // ── Phase transitions ──
  // Empty deps: use phaseRef to avoid stale closures that cause re-open loops
  const openChat = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    tweenRef.current?.kill();
    setPhase("opening");
  }, []);

  const closeChat = useCallback(() => {
    if (phaseRef.current !== "open") return;
    tweenRef.current?.kill();
    setPhase("closing");
  }, []);

  useEffect(() => {
    if (phase === "opening") runOpenAnimation();
    if (phase === "closing") runCloseAnimation();
  }, [phase, runOpenAnimation, runCloseAnimation]);

  // Only re-run when openTrigger actually changes — not when openChat ref changes
  useEffect(() => {
    if (openTrigger > 0) openChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTrigger]);

  // ── Core send logic ──
  const sendMessage = async (question: string) => {
    if (!question.trim() || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: question },
    ]);
    historyRef.current = [...historyRef.current, { role: "user", content: question }];
    setIsTyping(true);
    setActiveLines([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: historyRef.current.slice(-10), mode }),
      });
      const data = await res.json() as { lines: string[] };
      const lines = data.lines?.length ? data.lines : ["..."];
      setActiveLines(lines);
      // Will be added to history once typewriter finishes (see isDone effect)
    } catch {
      setActiveLines(lang === "fr"
        ? ["Erreur de connexion. Réessayez."]
        : ["Connection error. Please retry."]);
    }
  };

  const handleQuestion = (questionIndex: number) => {
    sendMessage(dict.chatbot.questions[questionIndex]);
  };

  const handleInputSend = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  const isVisible = phase !== "idle";

  return (
    <>
      {/* Floating toggle — always visible bottom-right */}
      <motion.button
        className={styles["chatbot-toggle"]}
        onClick={openChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI assistant"
      >
        <span className={styles["chatbot-toggle__icon"]}>&gt;_</span>
        <span className={styles["chatbot-toggle__label"]}>{dict.chatbot.subtitle}</span>
      </motion.button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={styles["chatbot-overlay"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Dark backdrop — click to close */}
            <div
              className={styles["chatbot-backdrop"]}
              onClick={closeChat}
            />

            {/* Particle canvas — always mounted inside overlay */}
            <canvas
              ref={canvasRef}
              className={styles["chatbot-particle-canvas"]}
            />

            {/* Chat window — only when fully open */}
            <AnimatePresence>
              {phase === "open" && (
                <motion.div
                  className={styles["chatbot-window"]}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Header */}
                  <div className={styles["chatbot-header"]}>
                    <div className={styles["chatbot-header__info"]}>
                      {mode !== "select" && (
                        <button
                          className={styles["chatbot-header__back"]}
                          onClick={backToSelect}
                          aria-label="Retour"
                        >
                          ←
                        </button>
                      )}
                      <span className={styles["chatbot-header__dot"]} />
                      <span className={styles["chatbot-header__title"]}>
                        {dict.chatbot.subtitle}
                      </span>
                    </div>
                    <button
                      className={styles["chatbot-header__close"]}
                      onClick={closeChat}
                      aria-label="Fermer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Mode selection screen */}
                  {mode === "select" && (
                    <div className={styles["chatbot-mode-select"]}>
                      <p className={styles["chatbot-mode-select__label"]}>
                        {lang === "fr" ? "// CHOISISSEZ UN MODE" : "// SELECT A MODE"}
                      </p>
                      <button
                        className={styles["chatbot-mode-btn"]}
                        onClick={() => selectMode("recruiter")}
                        data-color="cyan"
                      >
                        <span className={styles["chatbot-mode-btn__icon"]}>◈</span>
                        <span className={styles["chatbot-mode-btn__title"]}>
                          {lang === "fr" ? "Entretien recruteur" : "Recruiter interview"}
                        </span>
                        <span className={styles["chatbot-mode-btn__sub"]}>
                          {lang === "fr"
                            ? "Profil, compétences, disponibilités"
                            : "Profile, skills, availability"}
                        </span>
                      </button>
                      <button
                        className={styles["chatbot-mode-btn"]}
                        onClick={() => selectMode("project")}
                        data-color="orange"
                      >
                        <span className={styles["chatbot-mode-btn__icon"]}>⬡</span>
                        <span className={styles["chatbot-mode-btn__title"]}>
                          {lang === "fr" ? "Parler d'un projet" : "Discuss a project"}
                        </span>
                        <span className={styles["chatbot-mode-btn__sub"]}>
                          {lang === "fr"
                            ? "Collaboration, idée, mission freelance"
                            : "Collaboration, idea, freelance mission"}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Messages */}
                  {mode !== "select" && <div className={styles["chatbot-messages"]}>
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

                    {isTyping && activeLines.length > 0 && (
                      <>
                        {displayedLines.map((line, i) => (
                          <div
                            key={`typing-done-${i}`}
                            className={`${styles["chatbot-message"]} ${styles["chatbot-message--bot"]}`}
                          >
                            <span className={styles["chatbot-message__prefix"]}>
                              &gt;{" "}
                            </span>
                            {line}
                          </div>
                        ))}
                        {currentLine && (
                          <div
                            className={`${styles["chatbot-message"]} ${styles["chatbot-message--bot"]} ${styles["chatbot-message--typing"]}`}
                          >
                            <span className={styles["chatbot-message__prefix"]}>
                              &gt;{" "}
                            </span>
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
                        <span className={styles["chatbot-message__prefix"]}>
                          &gt;{" "}
                        </span>
                        <span className={styles["chatbot-cursor"]}>█</span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>}

                  {/* Quick questions — recruiter mode only */}
                  {mode === "recruiter" && (
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
                  )}

                  {/* Free text input — both modes */}
                  {mode !== "select" && <div className={styles["chatbot-input"]}>
                    <input
                      ref={inputRef}
                      type="text"
                      className={styles["chatbot-input__field"]}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleInputSend()}
                      placeholder={lang === "fr" ? "Posez une question..." : "Ask a question..."}
                      disabled={isTyping}
                      autoComplete="off"
                    />
                    <button
                      className={styles["chatbot-input__send"]}
                      onClick={handleInputSend}
                      disabled={isTyping || !inputValue.trim()}
                      aria-label="Send"
                    >
                      ↵
                    </button>
                  </div>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
