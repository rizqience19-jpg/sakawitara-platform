"use client";

import type { CSSProperties } from "react";
import { Layer, type Enter, type Exit, type Idle } from "./Scenes";

/* ═══════════════════════════════════════════════════════════════
   Scene dari ilustrasi PNG/WebP — setiap gambar = satu layer.
   Ganti `src` untuk tema baru; animasi masuk, goyang, efek air,
   parallax & "terbelah saat scroll" sudah ditangani engine.
   ═══════════════════════════════════════════════════════════════ */

/** Kotak efek dalam % gambar: [top, right, bottom, left] (seperti CSS inset). */
type Box = [number, number, number, number];
type Fx = { kind: "fall" | "ripple" | "splash" | "mist"; box: Box };

export type ImgLayer = {
  src: string;
  /** posisi & lebar (relatif stage bila `stage`, relatif layar bila tidak) */
  pos: CSSProperties;
  stage?: boolean;
  full?: boolean;
  enter: Enter;
  at: number;
  dur?: number;
  depth: number;
  idle?: Idle;
  /** titik putar goyangan, mis. "50% 100%" (pangkal batang) atau "0% 20%" (ranting menggantung) */
  origin?: string;
  flip?: boolean;
  exit?: Exit;
  fx?: Fx[];
};

const A = "/scene/nusantara";

function Img({ l }: { l: ImgLayer }) {
  return (
    <div className="img-wrap" style={l.flip ? { transform: "scaleX(-1)" } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={l.src} alt="" draggable={false} decoding="async" className={l.full ? "img-full" : "img"} />
      {l.fx && (
        <span className="fx-box">
      {l.fx.map((f, i) => (
        <span
          key={i}
          className={`fx fx-${f.kind}`}
          style={{
            clipPath: `inset(${f.box[0]}% ${f.box[1]}% ${f.box[2]}% ${f.box[3]}%)`,
            WebkitMaskImage: f.kind === "mist" ? undefined : `url(${l.src})`,
            maskImage: f.kind === "mist" ? undefined : `url(${l.src})`,
          }}
        />
      ))}
        </span>
      )}
    </div>
  );
}

function renderLayers(layers: ImgLayer[], stage: boolean) {
  return layers
    .filter((l) => !!l.stage === stage)
    .map((l, i) => (
      <Layer
        key={`${l.src}-${i}`}
        className={l.full ? "l-full" : ""}
        style={{ ...l.pos, ["--origin" as string]: l.origin ?? "50% 100%" }}
        enter={l.enter}
        at={l.at}
        dur={l.dur ?? 2400}
        depth={l.depth}
        idle={l.idle}
        exit={l.exit}
      >
        <Img l={l} />
      </Layer>
    ));
}

/* burung: 7 sprite hasil potongan, posisinya mengikuti gambar asli (1317×784) */
const BIRDS: [number, number, number, number][] = [
  [0, 696, 148, 784],
  [188, 576, 472, 688],
  [324, 244, 620, 364],
  [544, 392, 832, 572],
  [760, 152, 1004, 292],
  [940, 332, 1052, 432],
  [972, 0, 1316, 160],
];

export function Flock({ at, top = "8%", dur = 18 }: { at: number; top?: string; dur?: number }) {
  return (
    <div className="flock-img" style={{ top, ["--at" as string]: `${at}ms`, ["--fd" as string]: `${dur}s` }} aria-hidden>
      {BIRDS.map(([x0, y0, x1, y1], i) => (
        <span
          key={i}
          className="bird-sp"
          style={{
            left: `${(x0 / 1317) * 100}%`,
            top: `${(y0 / 784) * 100}%`,
            width: `${((x1 - x0) / 1317) * 100}%`,
            animationDelay: `${(i * 0.37).toFixed(2)}s`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/bird-${i}.webp`} alt="" style={{ animationDelay: `${(i * 0.21).toFixed(2)}s` }} />
        </span>
      ))}
    </div>
  );
}

export function Petals({ at, kind = "lilac" }: { at: number; kind?: "lilac" | "gold" }) {
  return (
    <div className={`drift drift-${kind}`} style={{ ["--at" as string]: `${at}ms` }} aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 41 + 9) % 100}%`,
            animationDelay: `${((i * 1.3) % 9).toFixed(1)}s`,
            animationDuration: `${10 + ((i * 3) % 7)}s`,
            ["--sz" as string]: `${7 + ((i * 5) % 8)}px`,
            ["--dx" as string]: `${i % 2 ? 80 : -80}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ═════════════ SCENE: JOGLO TIRTA (air terjun & joglo) ═════════════ */
const JOGLO: ImgLayer[] = [
  { src: `${A}/sky.webp`, full: true, pos: { inset: 0 }, enter: "zoomout", at: 200, dur: 3200, depth: 0.05, idle: "sky", exit: { s: 0.08 } },
  {
    src: `${A}/mountains.webp`, pos: { top: "21%", left: "-45%", width: "190%" }, stage: true,
    enter: "riseSoft", at: 900, dur: 3000, depth: 0.15, exit: { y: -8 },
    fx: [{ kind: "mist", box: [30, 0, 10, 0] }],
  },
  {
    src: `${A}/lake.webp`, pos: { top: "32%", left: "-38%", width: "176%" }, stage: true,
    enter: "riseSoft", at: 1200, dur: 2800, depth: 0.25, exit: { y: -4, s: 0.05 },
    fx: [{ kind: "ripple", box: [42, 0, 0, 0] }],
  },
  {
    src: `${A}/waterfall.webp`, pos: { bottom: "33%", left: "-22%", width: "144%" }, stage: true,
    enter: "rise", at: 1600, dur: 2800, depth: 0.4, exit: { y: -6, s: 0.12 },
    fx: [
      { kind: "fall", box: [12, 62, 24, 17] },
      { kind: "fall", box: [24, 22, 18, 53] },
      { kind: "ripple", box: [80, 18, 2, 20] },
      { kind: "splash", box: [64, 58, 14, 22] },
      { kind: "splash", box: [70, 24, 10, 56] },
    ],
  },
  { src: `${A}/joglo.webp`, pos: { bottom: "8%", left: "4%", width: "92%" }, stage: true, enter: "rise", at: 2300, dur: 2800, depth: 0.6, exit: { y: 6, s: 0.18 } },
  { src: `${A}/banana.webp`, pos: { bottom: "12%", left: "-20%", width: "54%" }, stage: true, enter: "grow", at: 2800, dur: 2400, depth: 0.8, idle: "sway", exit: { x: -60 } },
  { src: `${A}/banana.webp`, pos: { bottom: "10%", right: "-20%", width: "56%" }, stage: true, flip: true, enter: "grow", at: 2950, dur: 2400, depth: 0.8, idle: "sway", exit: { x: 60 } },
  { src: `${A}/orchid.webp`, pos: { bottom: "20%", right: "-12%", width: "36%" }, stage: true, enter: "grow", at: 3300, dur: 2200, depth: 1, idle: "sway", exit: { x: 70, y: 10 } },
  { src: `${A}/lilac.webp`, pos: { top: "-3%", left: "-24%", width: "min(98vw, 620px)" }, enter: "swingIn", at: 3350, dur: 2600, depth: 0.9, idle: "swing", origin: "0% 20%", exit: { x: -45, y: -25 } },
  { src: `${A}/vine.webp`, pos: { top: "-6%", right: "-6%", width: "min(40vw, 260px)" }, flip: true, enter: "drop", at: 3500, dur: 2400, depth: 0.95, idle: "swing", origin: "60% 0%", exit: { x: 40, y: -30 } },
  { src: `${A}/flower-corner.webp`, pos: { bottom: "-4%", left: "-10%", width: "84%" }, stage: true, enter: "bloom", at: 3700, dur: 2200, depth: 1.4, idle: "sway", origin: "0% 100%", exit: { x: -40, y: 45 } },
  { src: `${A}/flower-corner.webp`, pos: { bottom: "-6%", right: "-12%", width: "78%" }, stage: true, flip: true, enter: "bloom", at: 3850, dur: 2200, depth: 1.5, idle: "sway", origin: "0% 100%", exit: { x: 40, y: 45 } },
];

export function SceneJogloImg() {
  return (
    <div className="cam">
      {renderLayers(JOGLO, false).slice(0, 1)}
      <div className="sun" />
      <div className="stage">{renderLayers(JOGLO, true)}</div>
      {renderLayers(JOGLO, false).slice(1)}
      <Flock at={4200} />
      <Petals at={4600} kind="lilac" />
    </div>
  );
}

/* ═════════════ SCENE: SAWAH LESTARI (sawah, sungai & danau) ═════════════ */
const SAWAH: ImgLayer[] = [
  { src: `${A}/sky.webp`, full: true, pos: { inset: 0 }, enter: "zoomout", at: 200, dur: 3200, depth: 0.05, idle: "sky", exit: { s: 0.08 } },
  {
    src: `${A}/mountains.webp`, pos: { top: "24%", left: "-55%", width: "210%" }, stage: true,
    enter: "riseSoft", at: 1000, dur: 3000, depth: 0.15, exit: { y: -8 },
    fx: [{ kind: "mist", box: [25, 0, 10, 0] }],
  },
  {
    src: `${A}/lake.webp`, pos: { top: "37%", left: "-45%", width: "190%" }, stage: true,
    enter: "riseSoft", at: 1300, dur: 2800, depth: 0.25, exit: { y: -4, s: 0.05 },
    fx: [{ kind: "ripple", box: [42, 0, 0, 0] }],
  },
  {
    src: `${A}/ricefield.webp`, pos: { bottom: "12%", left: "-30%", width: "160%" }, stage: true,
    enter: "rise", at: 1800, dur: 2800, depth: 0.5, exit: { y: 10, s: 0.2 },
    fx: [{ kind: "ripple", box: [38, 14, 4, 6] }],
  },
  { src: `${A}/banana.webp`, pos: { bottom: "16%", left: "-24%", width: "62%" }, stage: true, enter: "grow", at: 2500, dur: 2400, depth: 0.75, idle: "sway", exit: { x: -60 } },
  { src: `${A}/banana.webp`, pos: { bottom: "20%", right: "-26%", width: "54%" }, stage: true, flip: true, enter: "grow", at: 2650, dur: 2400, depth: 0.7, idle: "sway", exit: { x: 60 } },
  { src: `${A}/orchid.webp`, pos: { bottom: "14%", left: "-10%", width: "38%" }, stage: true, flip: true, enter: "grow", at: 3000, dur: 2200, depth: 1, idle: "sway", exit: { x: -70, y: 10 } },
  { src: `${A}/lilac.webp`, pos: { top: "-4%", right: "-26%", width: "min(98vw, 620px)" }, flip: true, enter: "swingIn", at: 3200, dur: 2600, depth: 0.9, idle: "swing", origin: "0% 20%", exit: { x: 45, y: -25 } },
  { src: `${A}/vine.webp`, pos: { top: "-8%", left: "-8%", width: "min(40vw, 260px)" }, enter: "drop", at: 3350, dur: 2400, depth: 0.95, idle: "swing", origin: "40% 0%", exit: { x: -40, y: -30 } },
  { src: `${A}/bouquet-red.webp`, pos: { bottom: "-8%", left: "-6%", width: "50%" }, stage: true, enter: "bloom", at: 3600, dur: 2200, depth: 1.4, idle: "sway", exit: { x: -40, y: 45 } },
  { src: `${A}/flower-corner.webp`, pos: { bottom: "-5%", right: "-14%", width: "76%" }, stage: true, flip: true, enter: "bloom", at: 3750, dur: 2200, depth: 1.5, idle: "sway", origin: "0% 100%", exit: { x: 40, y: 45 } },
];

export function SceneSawahImg() {
  return (
    <div className="cam">
      {renderLayers(SAWAH, false).slice(0, 1)}
      <div className="sun" />
      <div className="stage">{renderLayers(SAWAH, true)}</div>
      {renderLayers(SAWAH, false).slice(1)}
      <Flock at={4000} top="6%" />
      <Petals at={4400} kind="gold" />
    </div>
  );
}

/** Ornamen bergoyang untuk dekorasi bagian konten. */
export function Deco({ src, className, idle = "sway", origin = "50% 100%", flip }: { src: string; className: string; idle?: Idle; origin?: string; flip?: boolean }) {
  return (
    <div className={`deco ${className}`} aria-hidden style={{ ["--origin" as string]: origin }}>
      <div className={`id-${idle}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/${src}.webp`} alt="" loading="lazy" style={flip ? { transform: "scaleX(-1)" } : undefined} />
      </div>
    </div>
  );
}
