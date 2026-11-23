"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Wedding } from "../data";
import { BatikPanel, Birds, Butterfly, CarvedBand, FlowerBed, Foliage, FoliageCurtain, Fountain, Joglo, Lily, Mansion, Swan, Waterfall } from "./Art";

export type ScenePhase = "cover" | "go" | "open";

type Enter = "rise" | "left" | "right" | "drop" | "fade" | "zoom" | "grow" | "zoomout";
type Idle = "sway" | "float" | "breathe";

/**
 * Satu lapisan scene.
 * - wrapper luar  → parallax (scroll & gerak pointer) sesuai `depth`
 * - wrapper tengah → animasi masuk (`enter`, mulai pada `at` ms setelah undangan dibuka)
 * - wrapper dalam → gerak idle terus-menerus (`idle`)
 */
export function Layer({
  className = "",
  depth = 0,
  enter = "rise",
  at = 0,
  dur = 1300,
  idle,
  style,
  children,
}: {
  className?: string;
  depth?: number;
  enter?: Enter;
  at?: number;
  dur?: number;
  idle?: Idle;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={`ly ${className}`} style={{ ...style, ["--depth" as string]: depth }}>
      <div className={`ly-in en-${enter}`} style={{ ["--at" as string]: `${at}ms`, ["--dur" as string]: `${dur}ms` }}>
        <div className={idle ? `ly-idle id-${idle}` : "ly-idle"}>{children}</div>
      </div>
    </div>
  );
}

function Flyers({ at, colors }: { at: number; colors: [string, string][] }) {
  return (
    <>
      {colors.map((c, i) => (
        <div key={i} className={`fly fly-${i + 1}`} style={{ ["--at" as string]: `${at + i * 350}ms` }}>
          <div className="fly-bob">
            <Butterfly c1={c[0]} c2={c[1]} />
          </div>
        </div>
      ))}
    </>
  );
}

/* ═════════════════ SCENE 1: TAMAN ISTANA ═════════════════ */
export function SceneIstana() {
  const greens = ["#6f8f4e", "#86a35f", "#5b7a3f", "#9bb873"];
  const greensDark = ["#4f6d36", "#5f7f42", "#6e8d4c"];
  const toile = ["#cbbd9f", "#c2b293", "#d6cab0"];
  const roses: [string, string][] = [
    ["#e9a27f", "#c86f4c"],
    ["#f3d9c4", "#d9aa86"],
    ["#e48a6a", "#b9583a"],
    ["#f7ece0", "#d8c0a2"],
  ];
  const leaves = ["#8a9a6a", "#a3ae84", "#6f7f52"];
  return (
    <>
      <Layer className="l-full" enter="fade" at={900} dur={1600} depth={0.1}>
        <div className="istana-sky" />
      </Layer>
      <Layer className="l-toile-l" enter="fade" at={1000} dur={1600} depth={0.25} idle="sway">
        <Foliage colors={toile} seed={11} count={40} trunk="#c2b293" />
      </Layer>
      <Layer className="l-toile-r" enter="fade" at={1100} dur={1600} depth={0.25} idle="sway">
        <Foliage colors={toile} seed={23} count={40} trunk="#c2b293" />
      </Layer>
      <div className="stage">
        <Layer className="l-mansion" enter="rise" at={1500} dur={1500} depth={0.45}>
          <Mansion />
        </Layer>
        <Layer className="l-bush-back-l" enter="left" at={1900} dur={1300} depth={0.6} idle="sway">
          <Foliage colors={greens} seed={5} />
        </Layer>
        <Layer className="l-bush-back-r" enter="right" at={2000} dur={1300} depth={0.6} idle="sway">
          <Foliage colors={greens} seed={17} />
        </Layer>
        <Layer className="l-fountain" enter="rise" at={2150} dur={1200} depth={0.75}>
          <Fountain />
        </Layer>
        <Layer className="l-bush-front-l" enter="left" at={2350} dur={1200} depth={0.95} idle="sway">
          <Foliage colors={greensDark} seed={31} />
        </Layer>
        <Layer className="l-bush-front-r" enter="right" at={2450} dur={1200} depth={0.95} idle="sway">
          <Foliage colors={greensDark} seed={41} />
        </Layer>
        <Layer className="l-swan-l" enter="rise" at={2700} dur={1100} depth={1.1} idle="float">
          <Swan />
        </Layer>
        <Layer className="l-swan-r" enter="rise" at={2800} dur={1100} depth={1.1} idle="float">
          <Swan flip />
        </Layer>
        <Layer className="l-flower-l" enter="rise" at={2900} dur={1200} depth={1.4} idle="sway">
          <FlowerBed roses={roses} leaves={leaves} seed={7} count={10} />
        </Layer>
        <Layer className="l-flower-c" enter="rise" at={3050} dur={1200} depth={1.5} idle="breathe">
          <FlowerBed roses={roses} leaves={leaves} seed={19} count={9} />
        </Layer>
        <Layer className="l-flower-r" enter="rise" at={3150} dur={1200} depth={1.4} idle="sway">
          <FlowerBed roses={roses} leaves={leaves} seed={29} count={10} />
        </Layer>
      </div>
      <Flyers
        at={3200}
        colors={[
          ["#3f6fd8", "#b9d0ff"],
          ["#8b4fd1", "#e2c8ff"],
          ["#e08a2e", "#ffe0b0"],
        ]}
      />
      <div className="flock" style={{ ["--at" as string]: "3500ms" }}>
        <Birds />
      </div>
    </>
  );
}

/* ═════════════════ SCENE 2: JOGLO & AIR TERJUN ═════════════════ */
export function SceneJoglo() {
  const gold = ["#b88d52", "#a37a42", "#cfa86b", "#93693a"];
  const brown = ["#8a5f33", "#74502b", "#9c6f3e"];
  const sage = ["#7d8a6a", "#94a07f", "#6a775a"];
  return (
    <>
      <Layer className="l-full" enter="zoomout" at={200} dur={2800} depth={0.1}>
        <Waterfall className="l-svg-full" />
      </Layer>
      <div className="stage">
        <Layer className="l-joglo" enter="rise" at={1700} dur={1500} depth={0.5}>
          <Joglo />
        </Layer>
        <Layer className="l-tree1-l" enter="grow" at={2200} dur={1300} depth={0.7} idle="sway">
          <Foliage colors={gold} seed={3} />
        </Layer>
        <Layer className="l-tree1-r" enter="grow" at={2350} dur={1300} depth={0.7} idle="sway">
          <Foliage colors={gold} seed={13} />
        </Layer>
        <Layer className="l-tree2-l" enter="grow" at={2650} dur={1300} depth={1} idle="sway">
          <Foliage colors={brown} seed={21} />
        </Layer>
        <Layer className="l-tree2-r" enter="grow" at={2800} dur={1300} depth={1} idle="sway">
          <Foliage colors={brown} seed={37} />
        </Layer>
        <Layer className="l-lily-l" enter="zoom" at={1300} dur={1100} depth={1.4} idle="sway">
          <Lily />
        </Layer>
        <Layer className="l-lily-r" enter="zoom" at={1450} dur={1100} depth={1.4} idle="sway">
          <Lily />
        </Layer>
        <Layer className="l-lily-s" enter="zoom" at={3000} dur={1000} depth={1.6} idle="breathe">
          <Lily color="#e0603f" />
        </Layer>
      </div>
      <Layer className="l-tall-l" enter="drop" at={3100} dur={1300} depth={0.85} idle="sway">
        <Foliage colors={sage} seed={51} />
      </Layer>
      <Layer className="l-tall-r" enter="drop" at={3200} dur={1300} depth={0.85} idle="sway">
        <Foliage colors={sage} seed={61} />
      </Layer>
      <Layer className="l-band" enter="drop" at={3450} dur={1100} depth={0.3}>
        <CarvedBand />
      </Layer>
      <Flyers
        at={2500}
        colors={[
          ["#2f63d6", "#a8c6ff"],
          ["#7d3fd0", "#dcc4ff"],
        ]}
      />
    </>
  );
}

/* ═════════════════ COVER ═════════════════ */
export function Photo({ src, label, className = "" }: { src: string | null; label: string; className?: string }) {
  return (
    <div className={`ph ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} />
      ) : (
        <div className="ph-empty">
          <svg viewBox="0 0 64 64" aria-hidden>
            <circle cx="24" cy="22" r="8" fill="currentColor" />
            <circle cx="42" cy="22" r="8" fill="currentColor" />
            <path d="M8 56 C 8 40, 40 40, 40 56 Z M26 56 C 26 40, 58 40, 58 56 Z" fill="currentColor" />
          </svg>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

function GuestInfo({ guest }: { guest: string }) {
  return (
    <div className="sc-guest">
      <span>Kepada Yth.</span>
      <span>Bapak/Ibu/Saudara/i</span>
      <strong>{guest}</strong>
      <em>*Mohon maaf apabila ada kesalahan dalam penulisan nama/gelar</em>
    </div>
  );
}

function OpenBtn({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="sc-open" onClick={onOpen}>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
      </svg>
      Buka Undangan
    </button>
  );
}

export function CoverIstana({ wedding, guest, phase, onOpen }: { wedding: Wedding; guest: string; phase: ScenePhase; onOpen: () => void }) {
  const roses: [string, string][] = [
    ["#e2b9a8", "#b98370"],
    ["#f1e2d5", "#cfb299"],
    ["#c99c8e", "#9c6c5e"],
  ];
  const leaves = ["#9aa184", "#b4b79c", "#7f876a"];
  return (
    <>
      <div className={`sc-cover cover-istana is-${phase}`}>
        <div className="cv-corner cv-corner-l">
          <FlowerBed roses={roses} leaves={leaves} seed={71} count={7} />
        </div>
        <div className="cv-corner cv-corner-r">
          <FlowerBed roses={roses} leaves={leaves} seed={83} count={7} />
        </div>
        <div className="sc-cover-body">
          <span className="sc-script">The Wedding Of</span>
          <Photo src={wedding.photos.cover} label={`${wedding.groom.nick[0]} & ${wedding.bride.nick[0]}`} className="ph-oval" />
          <h1 className="sc-caps">
            {wedding.groom.nick} &amp; {wedding.bride.nick}
          </h1>
          <GuestInfo guest={guest} />
          <OpenBtn onOpen={onOpen} />
        </div>
      </div>
      {phase === "go" && (
        <div className="curtain" aria-hidden>
          <FoliageCurtain />
        </div>
      )}
    </>
  );
}

export function CoverJoglo({ wedding, guest, phase, onOpen }: { wedding: Wedding; guest: string; phase: ScenePhase; onOpen: () => void }) {
  return (
    <div className={`sc-cover cover-joglo is-${phase}`}>
      <div className="door door-l">
        <BatikPanel className="door-svg" />
      </div>
      <div className="door door-r">
        <BatikPanel className="door-svg" />
      </div>
      <div className="sc-cover-body medallion">
        <span className="sc-script">The Wedding Of</span>
        <h1 className="sc-caps sc-caps-stack">
          <span>{wedding.groom.nick}</span>
          <i>&amp;</i>
          <span>{wedding.bride.nick}</span>
        </h1>
        <span className="sc-date">{wedding.dateLabel}</span>
        <GuestInfo guest={guest} />
        <OpenBtn onOpen={onOpen} />
      </div>
    </div>
  );
}
