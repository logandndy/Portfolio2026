"use client";
import { useRef, useImperativeHandle, forwardRef } from "react";

export interface SectionTransitionHandle {
  play(onMidpoint: () => void, direction: 1 | -1): void;
}

// ─── constants ────────────────────────────────────────────────
const CELL      = 5;                               // px — pixel size
const CHARS     = "0123456789ABCDEF<>[]{}#@!%^&*"; // glyphs inside each cell
const COL_BG    = "#020408";                       // near-black bg
const COL_DIM   = "rgba(0,212,255,0.18)";          // resting glyph
const COL_HEAD  = "#ffffff";                       // wave-front bright
const COL_TRAIL = "#00d4ff";                       // trail neon cyan
const COL_FILL  = "#020408";                       // solid fill colour

// Cover duration then uncover duration (seconds)
const DUR_COVER   = 0.45;
const DUR_UNCOVER = 0.38;

// ─── helper ───────────────────────────────────────────────────
function randChar() { return CHARS[Math.floor(Math.random() * CHARS.length)]; }

// ─── component ────────────────────────────────────────────────
const SectionTransition = forwardRef<SectionTransitionHandle, {}>(
  function SectionTransition(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef    = useRef<number>(0);

    useImperativeHandle(ref, () => ({
      play(onMidpoint: () => void, direction: 1 | -1 = 1) {
        const canvas = canvasRef.current;
        if (!canvas) { onMidpoint(); return; }

        // ── Setup ──────────────────────────────────────────────
        // Read dimensions from the parent screen container, not the viewport
        canvas.style.display = "block";
        const parent = canvas.parentElement;
        const W   = parent ? parent.clientWidth  : window.innerWidth;
        const H   = parent ? parent.clientHeight : window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width          = W * dpr;
        canvas.height         = H * dpr;
        canvas.style.width    = W + "px";
        canvas.style.height   = H + "px";
        canvas.style.opacity  = "1";

        const ctx = canvas.getContext("2d");
        if (!ctx) { onMidpoint(); return; }
        ctx.scale(dpr, dpr);

        // Grid dimensions
        const COLS = Math.ceil(W / CELL);
        const ROWS = Math.ceil(H / CELL);

        // Each cell keeps its own random glyph (shuffled on wave-front pass)
        const glyphs: string[] = Array.from({ length: COLS * ROWS }, randChar);

        // ── Phase state ────────────────────────────────────────
        cancelAnimationFrame(rafRef.current);

        let phase: "cover" | "uncover" = "cover";
        let phaseStart = performance.now();
        let midFired   = false;

        // ── Draw ───────────────────────────────────────────────
        const draw = (now: number) => {
          const elapsed  = (now - phaseStart) / 1000;
          const isCover  = phase === "cover";
          const totalDur = isCover ? DUR_COVER : DUR_UNCOVER;
          const t        = Math.min(elapsed / totalDur, 1); // 0 → 1

          // Clear
          ctx.clearRect(0, 0, W, H);

          // ── Row-based wave ─────────────────────────────────
          // direction  1 = scroll down → wave top→bottom
          // direction -1 = scroll up   → wave bottom→top
          //
          // "covered" means a row is fully opaque black
          // Wave-front row index:
          //   cover phase:   front travels from row 0 → ROWS   (direction 1)
          //                  or ROWS → 0   (direction -1)
          //   uncover phase: reverse of cover

          const totalRows = ROWS;

          // For cover: front advances from leading edge inward
          // rowProgress(row) → how "covered" that row is [0..1]
          const waveFront = (rowIdx: number): number => {
            // Normalised row position 0..1 from leading edge
            const normRow = direction > 0
              ? rowIdx / (totalRows - 1)          // 0=top, 1=bottom
              : (totalRows - 1 - rowIdx) / (totalRows - 1); // 0=bottom, 1=top

            // In cover phase, wave sweeps forward (0→1 over time t)
            // In uncover phase, wave sweeps backward (1→0 over time t)
            if (isCover) {
              // How far ahead is the wavefront vs this row?
              // wavefront at t=1 has passed all rows
              return t - normRow; // positive = covered
            } else {
              // Uncover: wavefront clears rows in same direction as cover
              return t - normRow; // positive = uncovered
            }
          };

          ctx.font          = `bold ${CELL - 1}px 'Courier New', monospace`;
          ctx.textBaseline  = "top";
          ctx.textAlign     = "left";

          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              const x    = col * CELL;
              const y    = row * CELL;
              const idx  = row * COLS + col;
              const wf   = waveFront(row);

              if (isCover) {
                if (wf <= 0) {
                  // Not yet reached — draw resting glyph (dim)
                  ctx.fillStyle = COL_BG;
                  ctx.fillRect(x, y, CELL, CELL);
                  if (Math.random() < 0.003) glyphs[idx] = randChar(); // idle flicker
                  ctx.fillStyle = COL_DIM;
                  ctx.fillText(glyphs[idx], x, y);
                } else if (wf < 0.06) {
                  // Wave head — bright white pixel
                  glyphs[idx] = randChar();
                  ctx.fillStyle = COL_HEAD;
                  ctx.fillRect(x, y, CELL, CELL);
                  ctx.fillStyle = COL_BG;
                  ctx.fillText(glyphs[idx], x, y);
                } else if (wf < 0.18) {
                  // Trail — fading cyan glyph
                  const fade = 1 - (wf - 0.06) / 0.12;
                  glyphs[idx] = randChar();
                  ctx.fillStyle = COL_FILL;
                  ctx.fillRect(x, y, CELL, CELL);
                  ctx.globalAlpha = fade * 0.9;
                  ctx.fillStyle = COL_TRAIL;
                  ctx.fillText(glyphs[idx], x, y);
                  ctx.globalAlpha = 1;
                } else {
                  // Fully covered — solid black
                  ctx.fillStyle = COL_FILL;
                  ctx.fillRect(x, y, CELL, CELL);
                }
              } else {
                // Uncover phase — wave clears in same direction
                if (wf <= 0) {
                  // Still covered
                  ctx.fillStyle = COL_FILL;
                  ctx.fillRect(x, y, CELL, CELL);
                } else if (wf < 0.06) {
                  // Wave head clearing — bright flash then reveals content
                  glyphs[idx] = randChar();
                  ctx.fillStyle = COL_HEAD;
                  ctx.fillRect(x, y, CELL, CELL);
                  ctx.fillStyle = COL_BG;
                  ctx.fillText(glyphs[idx], x, y);
                } else if (wf < 0.18) {
                  // Brief cyan dissolve
                  const fade = 1 - (wf - 0.06) / 0.12;
                  ctx.fillStyle = COL_BG;
                  ctx.fillRect(x, y, CELL, CELL);
                  if (fade > 0.05) {
                    ctx.globalAlpha = fade * 0.6;
                    ctx.fillStyle = COL_TRAIL;
                    ctx.fillText(glyphs[idx], x, y);
                    ctx.globalAlpha = 1;
                  }
                } else {
                  // Fully cleared — transparent (content shows through)
                  // nothing to draw
                }
              }
            }
          }

          // ── Phase transitions ──────────────────────────────
          if (isCover && t >= 1 && !midFired) {
            midFired   = true;
            phase      = "uncover";
            phaseStart = performance.now();
            onMidpoint();
            rafRef.current = requestAnimationFrame(draw);
            return;
          }

          if (!isCover && t >= 1) {
            ctx.clearRect(0, 0, W, H);
            canvas.style.display = "none";
            return;
          }

          rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        style={{
          position:       "absolute",
          inset:          0,
          zIndex:         100,
          display:        "none",
          pointerEvents:  "none",
          imageRendering: "pixelated",
        }}
      />
    );
  }
);

export default SectionTransition;
