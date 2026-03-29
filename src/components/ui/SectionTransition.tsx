"use client";
import { useRef, useImperativeHandle, forwardRef } from "react";

export interface SectionTransitionHandle {
  play(onMidpoint: () => void): void;
}

const CELL = 5;
const TRAIL = 32;
const CHARS = "0123456789ABCDEF<>{}[]!@#/\\";
const CYAN = "#00d4ff";
const VIOLET = "#9b5de5";
const HEAD_COLOR = "#d0f0ff";

function rndChar() {
  return CHARS[(Math.random() * CHARS.length) | 0];
}

const SectionTransition = forwardRef<SectionTransitionHandle, {}>(
  function SectionTransition(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      play(onMidpoint: () => void) {
        const canvas = canvasRef.current;
        if (!canvas) { onMidpoint(); return; }

        const W = window.innerWidth;
        const H = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        canvas.style.display = "block";

        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);
        ctx.font = `${CELL}px 'JetBrains Mono', 'Courier New', monospace`;
        ctx.textBaseline = "top";

        const cols = Math.ceil(W / CELL);
        const rows = Math.ceil(H / CELL);

        const COVER_DUR = 0.65;
        const UNCOVER_DUR = 0.52;
        const STAGGER = 0.55; // spread window in seconds

        // Pre-compute per-column delays (left→right + small jitter)
        const coverDelay = Float32Array.from({ length: cols }, (_, c) =>
          (c / (cols - 1)) * STAGGER + Math.random() * 0.025
        );
        const uncoverDelay = Float32Array.from({ length: cols }, (_, c) =>
          (c / (cols - 1)) * STAGGER * 0.75 + Math.random() * 0.015
        );

        // Per-column fill duration (remaining time after stagger)
        const coverColDur = COVER_DUR * 0.55;
        const uncoverColDur = UNCOVER_DUR * 0.55;

        // Static char grid (scrambled periodically)
        const cellChars = Array.from({ length: cols * rows }, rndChar);

        let phase: "cover" | "uncover" = "cover";
        let phaseStart = performance.now();
        let midpointFired = false;
        let rafId: number;
        let frame = 0;

        const draw = (now: number) => {
          frame++;
          const elapsed = (now - phaseStart) / 1000;

          // Scramble ~15% of chars every 3 frames
          if (frame % 3 === 0) {
            for (let i = 0; i < cellChars.length; i++) {
              if (Math.random() < 0.15) cellChars[i] = rndChar();
            }
          }

          ctx.clearRect(0, 0, W, H);
          let allDone = true;

          for (let c = 0; c < cols; c++) {
            if (phase === "cover") {
              const colT = elapsed - coverDelay[c];
              if (colT < 0) { allDone = false; continue; }

              const progress = Math.min(colT / coverColDur, 1);
              const head = progress * rows;
              if (progress < 1) allDone = false;

              // Dark cover for the filled portion
              ctx.globalAlpha = 1;
              ctx.fillStyle = "#020408";
              ctx.fillRect(c * CELL, 0, CELL, head * CELL);

              // Trail characters near the head
              const headRow = Math.floor(head);
              const trailStart = Math.max(0, headRow - TRAIL);

              for (let r = trailStart; r <= Math.min(headRow, rows - 1); r++) {
                const dist = headRow - r;
                let alpha: number;
                let color: string;

                if (dist <= 1) {
                  alpha = 1.0;
                  color = HEAD_COLOR;
                } else if (dist <= 4) {
                  alpha = 0.88 - (dist - 1) * 0.08;
                  color = CYAN;
                } else if (dist <= 15) {
                  alpha = 0.58 - (dist - 4) * 0.022;
                  color = CYAN;
                } else {
                  alpha = 0.18 + Math.random() * 0.1;
                  color = Math.random() > 0.38 ? CYAN : VIOLET;
                }

                ctx.globalAlpha = Math.max(0, alpha);
                ctx.fillStyle = color;
                ctx.fillText(cellChars[r * cols + c], c * CELL, r * CELL);
              }

            } else {
              // Uncover phase
              const colT = elapsed - uncoverDelay[c];

              if (colT < 0) {
                // Column not cleared yet — static dim chars covering full column
                for (let r = 0; r < rows; r++) {
                  ctx.globalAlpha = 0.18 + Math.random() * 0.08;
                  ctx.fillStyle = Math.random() > 0.4 ? CYAN : VIOLET;
                  ctx.fillText(cellChars[r * cols + c], c * CELL, r * CELL);
                }
                allDone = false;
              } else {
                const progress = Math.min(colT / uncoverColDur, 1);
                const clearHead = progress * rows;

                if (progress < 1) {
                  allDone = false;
                  // Dark cover for remaining (below clear boundary)
                  ctx.globalAlpha = 1;
                  ctx.fillStyle = "#020408";
                  ctx.fillRect(c * CELL, clearHead * CELL, CELL, H - clearHead * CELL);

                  // Fade-out trail at the clear boundary
                  const clearHeadRow = Math.floor(clearHead);
                  for (let r = clearHeadRow; r < Math.min(clearHeadRow + TRAIL, rows); r++) {
                    const dist = r - clearHeadRow;
                    const alpha = Math.max(0, 0.18 - dist * 0.005) + Math.random() * 0.05;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = Math.random() > 0.4 ? CYAN : VIOLET;
                    ctx.fillText(cellChars[r * cols + c], c * CELL, r * CELL);
                  }
                }
                // progress >= 1: fully cleared, nothing drawn (transparent → shows new section)
              }
            }
          }

          ctx.globalAlpha = 1;

          if (phase === "cover" && allDone && !midpointFired) {
            midpointFired = true;
            onMidpoint();
            phase = "uncover";
            phaseStart = performance.now();
            rafId = requestAnimationFrame(draw);
            return;
          }

          if (phase === "uncover" && allDone) {
            canvas.style.display = "none";
            return;
          }

          rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          display: "none",
          pointerEvents: "none",
        }}
      />
    );
  }
);

export default SectionTransition;
