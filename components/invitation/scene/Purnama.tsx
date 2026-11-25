"use client";

import type { CSSProperties } from "react";
import "./purnama.css";
import type { Wedding } from "../data";
import { A, Deco } from "./ImageScene";
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

export function ScenePurnama({ wedding }: { wedding?: Wedding }) {
  return (
    <div className="pp">
      {/* ── halaman dalam (terlihat setelah pintu terbuka) ── */}
      <div className="pp-cam">
        <Img src="pv-langit" className="pp-sky" />
        {/* bulan purnama terus berputar di langit belakang joglo */}
        <div className="pp-moon">
          <Img src="pv-bulan" />
        </div>
        <div className="pp-stage">
          <Img src="pv-gunung" className="pv-gunung" />
          <Img src="pv-kelapa" className="pv-kelapa" />
          <div className="pv-merah id-sway">
            <Img src="pv-pohon-merah" />
          </div>
          <Img src="pv-joglo" className="pv-joglo" />
          <Img src="pv-jalan" className="pv-jalan" />
          <div className="pp-couple">
            <Img src="pv-pengantin" />
          </div>
        </div>
        {/* pohon pembingkai kiri-kanan */}
        <div className="pv-tree pv-tree-l">
          <Img src="pv-pohon-kiri" />
        </div>
        <div className="pv-tree pv-tree-r">
          <Img src="pv-pohon-kanan" />
        </div>
      </div>

      {/* semak paling depan: tersibak saat kamera masuk */}
      <div className="pv-near">
        {/* kupu-kupu (di luar kamera: ukurannya tetap kecil saat zoom) */}
        {[0, 1, 2].map((i) => (
          <div key={i} className={`pv-fly pv-fly-${i}`}>
            <Img src="pv-kupu" />
          </div>
        ))}
        <div className="pv-semak pv-semak-l">
          <Img src="pv-semak-kiri" />
        </div>
        <div className="pv-semak pv-semak-r">
          <Img src="pv-semak-kanan" />
        </div>
      </div>

      {/* kabut lembut atas-bawah */}
      <span className="pp-haze" />

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
            <Img src="pv-pintu-kiri" className="pp-door pp-door-l" />
            <Img src="pv-pintu-kanan" className="pp-door pp-door-r" />
            <span className="pp-doorlight" />
          </div>
          <Img src="pv-regol" className="pp-regol" />
        </div>
      </div>
    </div>
  );
}

export function CoverPurnama({ wedding, guest, phase, onOpen }: { wedding: Wedding; guest: string; phase: ScenePhase; onOpen: () => void }) {
  return (
    <div className={`sc-cover cover-photo cover-purnama is-${phase}`}>
      <div className="cs-sky pp-sky-cream" />
      <Deco src="pv-bunga" className="cp-bunga-l" />
      <Deco src="pv-bunga" className="cp-bunga-r" flip />
      <span className="pp-batik" />
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
