"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type RevealVariant = "up" | "down" | "left" | "right" | "zoom" | "blur" | "flip";

/** Elemen yang muncul dengan animasi saat masuk viewport. */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rv rv-${variant}${visible ? " is-visible" : ""} ${className}`}
      style={{ ...style, ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Teks yang muncul huruf per huruf. */
export function SplitText({ text, start = 0, step = 45, className = "" }: { text: string; start?: number; step?: number; className?: string }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="split-ch" style={{ ["--i" as string]: i, ["--s" as string]: `${start}ms`, ["--step" as string]: `${step}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
