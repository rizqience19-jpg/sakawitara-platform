"use client";

import type { CSSProperties } from "react";
import "./purnama.css";
import type { Wedding } from "../data";
import { A } from "./ImageScene";
import { Photo, type ScenePhase } from "./Scenes";

/* ═══════════════════════════════════════════════════════════════
   Tema "Pendopo Purnama"
   1. Di depan regol (gerbang) yang tertutup, bulan purnama di belakang
   2. Daun regol membuka ke dalam
   3. Kamera maju menembus gerbang
   4. Kamera menyusuri jalan batu berlampu ting & kolam teratai menuju
      pendopo, tempat pengantin berdiri
   ═══════════════════════════════════════════════════════════════ */

function Img({ src, className, style, flip }: { src: string; className?: string; style?: CSSProperties; flip?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${A}/${src}.webp`} alt="" draggable={false} className={className} style={{ ...style, ...(flip ? { transform: "scaleX(-1)" } : null) }} />
  );
}

/** lampu ting + cahaya berkedip */
function Ting({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <div className={`pp-ting ${className}`} style={{ ["--fl" as string]: `${delay}s` }}>
      <span className="pp-glow" />
      <Img src="pp-lampu" />
    </div>
  );
}

export function ScenePurnama({ wedding }: { wedding?: Wedding }) {
  return (
    <div className="pp">
      {/* ── halaman dalam (terlihat setelah pintu terbuka) ── */}
      <div className="pp-cam">
        <Img src="sky" className="pp-sky" />
        <div className="pp-stage">
          <Img src="pp-kolam" className="pp-pond" />
          <div className="pp-pendopo">
            <Img src="pp-pendopo" />
          </div>
          <Img src="pp-jalan" className="pp-path" />
          <Ting className="pp-t-far-l" delay={0.3} />
          <Ting className="pp-t-far-r" delay={1.1} />
          <Ting className="pp-t-mid-l" delay={0.7} />
          <Ting className="pp-t-mid-r" delay={0.1} />
          <div className="pp-couple">
            <Img src="pp-pengantin" />
          </div>
        </div>
      </div>

      {/* ── lampu & bunga paling depan: dilewati kamera ── */}
      <div className="pp-near">
        <Ting className="pp-t-near-l" delay={0.5} />
        <Ting className="pp-t-near-r" delay={1.4} />
      </div>
      {/* ── bulan purnama: hanya saat masuk gerbang, berputar ── */}
      <div className="pp-moon">
        <Img src="pp-bulan" />
      </div>

      {/* ── nama mempelai saat kamera menyorot masing-masing ── */}
      {wedding && (
        <>
          <div className="pp-cap pp-cap-g">
            <span className="pp-cap-nick">{wedding.groom.nick}</span>
            <span className="pp-cap-full">{wedding.groom.full}</span>
          </div>
          <div className="pp-cap pp-cap-b">
            <span className="pp-cap-nick">{wedding.bride.nick}</span>
            <span className="pp-cap-full">{wedding.bride.full}</span>
          </div>
        </>
      )}

      {/* ── regol (gerbang) di paling depan ── */}
      <div className="pp-gate">
        <div className="pp-gate-in">
          <div className="pp-doors">
            <Img src="pp-pintu-kiri" className="pp-door pp-door-l" />
            <Img src="pp-pintu-kanan" className="pp-door pp-door-r" />
            <span className="pp-doorlight" />
          </div>
          <Img src="pp-regol" className="pp-regol" />
        </div>
      </div>
    </div>
  );
}

export function CoverPurnama({ wedding, guest, phase, onOpen }: { wedding: Wedding; guest: string; phase: ScenePhase; onOpen: () => void }) {
  return (
    <div className={`sc-cover cover-photo cover-purnama is-${phase}`}>
      <div className="cs-sky" style={{ backgroundImage: `url(${A}/sky.webp)` }} />
      <div className="sc-cover-body">
        <span className="sc-script">The Wedding Of</span>
        <Photo src={wedding.photos.cover} label={`${wedding.groom.nick[0]} & ${wedding.bride.nick[0]}`} className="ph-oval" />
        <h1 className="sc-caps">
          {wedding.groom.nick} &amp; {wedding.bride.nick}
        </h1>
        <div className="sc-guest">
          <span>Kepada Yth.</span>
          <span>Bapak/Ibu/Saudara/i</span>
          <strong>{guest}</strong>
          <em>*Mohon maaf apabila ada kesalahan dalam penulisan nama/gelar</em>
        </div>
        <button type="button" className="sc-open" onClick={onOpen}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
          </svg>
          <span className="lbl">Buka Undangan</span>
        </button>
      </div>
    </div>
  );
}
