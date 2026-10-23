"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const COLS = 46; // digits across the portrait
const CELL_RATIO = 1.25; // each digit cell is a little taller than wide
const MOUSE_RADIUS = 5; // cells around the cursor that light up

type Cell = { b: number; digit: string; settleAt: number };

/**
 * The portrait drawn as a grid of 0s and 1s.
 * - On load the digits flicker randomly, then settle into the photo.
 * - A few digits keep flipping so it feels alive; the mouse lights them up.
 * - `reveal` (0 → 1, scroll-linked) cross-fades from the digits to the real photo.
 */
export function BinaryPortrait({
  src,
  alt,
  reveal,
  className,
}: {
  src: string;
  alt: string;
  reveal: MotionValue<number>;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const digitsOpacity = useTransform(reveal, [0, 1], [1, 0]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cells: Cell[] = [];
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    const mouse = { x: -999, y: -999 };
    const start = performance.now();

    const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const monoFont = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";

    // Sample the photo's brightness into a COLS × rows grid, cropped like
    // `object-fit: cover; object-position: 50% 32%` so it matches the real photo.
    const img = new window.Image();
    img.src = src;

    const layout = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cellW = width / COLS;
      cellH = cellW * CELL_RATIO;
      rows = Math.ceil(height / cellH);

      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const sw = width / scale;
      const sh = height / scale;
      const sx = (img.naturalWidth - sw) * 0.5;
      const sy = (img.naturalHeight - sh) * 0.32;

      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, rows);
      const data = octx.getImageData(0, 0, COLS, rows).data;

      cells = [];
      for (let i = 0; i < COLS * rows; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // contrast curve so the face reads clearly
        const v = Math.min(1, Math.max(0, (lum - 0.12) / 0.76));
        const col = i % COLS;
        cells.push({
          b: v,
          digit: v < 0.5 ? "1" : "0",
          settleAt: reduce ? 0 : 0.25 + (col / COLS) * 0.9 + Math.random() * 0.6,
        });
      }
    };

    const draw = (now: number) => {
      const { width, height } = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const dark = document.documentElement.classList.contains("dark");
      const fg = css("--foreground");
      const accent = css("--accent");
      const t = (now - start) / 1000;
      ctx.font = `${Math.round(cellH * 0.86)}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const col = i % COLS;
        const row = (i / COLS) | 0;
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;

        // Light theme: dark areas are strong ink. Dark theme: light areas glow.
        let alpha = dark ? c.b : 1 - c.b;
        alpha = 0.08 + Math.pow(alpha, 1.25) * 0.92;
        let digit = c.digit;

        if (t < c.settleAt) {
          // still decoding: random flicker
          digit = Math.random() < 0.5 ? "0" : "1";
          alpha = 0.15 + Math.random() * 0.35;
        } else if (!reduce && Math.random() < 0.004) {
          // a few digits keep flipping
          c.digit = c.digit === "0" ? "1" : "0";
          digit = c.digit;
        }

        const dist = Math.hypot((mouse.x - x) / cellW, (mouse.y - y) / cellH);
        const near = dist < MOUSE_RADIUS;
        ctx.globalAlpha = near ? Math.min(1, alpha + 0.5) : alpha;
        ctx.fillStyle = near ? accent : fg;
        ctx.fillText(near && Math.random() < 0.3 ? (digit === "0" ? "1" : "0") : digit, x, y);
      }
      ctx.globalAlpha = 1;
    };

    // ~20 fps is plenty for flickering digits and keeps the page light.
    const loop = (now: number) => {
      if (visible && now - last > 50) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };

    const startAll = () => {
      layout();
      if (reduce) draw(performance.now() + 10_000);
      else raf = requestAnimationFrame(loop);
    };
    if (img.complete) startAll();
    else img.onload = startAll;

    const resize = new ResizeObserver(() => {
      layout();
      if (reduce) draw(performance.now() + 10_000);
    });
    resize.observe(wrap);

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);

    // Redraw straight away when the theme changes (reduced-motion mode has no loop).
    const themeObserver = new MutationObserver(() => draw(performance.now() + 10_000));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [src, reduce]);

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", className)}>
      {/* the real photo fades in as you scroll */}
      <motion.div style={{ opacity: reveal }} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 80vw, 420px" className="object-cover object-[50%_32%]" />
      </motion.div>
      <motion.canvas
        ref={canvasRef}
        aria-hidden
        style={{ opacity: digitsOpacity }}
        className="absolute inset-0 h-full w-full"
      />
      <motion.div
        aria-hidden
        style={{ opacity: reveal }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
      />
    </div>
  );
}
