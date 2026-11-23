"use client";

import { useRef, type MouseEvent } from "react";
import type { OpeningStyle, Wedding } from "./data";

export type Phase = "cover" | "opening" | "open";

type Props = {
  style: OpeningStyle;
  wedding: Wedding;
  guest: string;
  phase: Phase;
  onOpen: () => void;
};

export function Opening(props: Props) {
  if (props.style === "gerbang") return <GateOpening {...props} />;
  if (props.style === "amplop") return <EnvelopeOpening {...props} />;
  return <IrisOpening {...props} />;
}

function GuestBlock({ guest }: { guest: string }) {
  return (
    <div className="cv-guest">
      <span className="cv-label">Kepada Yth. Bapak/Ibu/Saudara/i</span>
      <strong className="cv-name">{guest}</strong>
      <span className="cv-note">Mohon maaf apabila ada kesalahan penulisan nama/gelar</span>
    </div>
  );
}

function OpenButton({ onClick, label = "Buka Undangan" }: { onClick: (e: MouseEvent<HTMLButtonElement>) => void; label?: string }) {
  return (
    <button type="button" className="cv-btn" onClick={onClick}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
      </svg>
      {label}
    </button>
  );
}

/* ───────────── 1. GERBANG: dua daun pintu terbuka 3D ───────────── */
function GateOpening({ wedding, guest, phase, onOpen }: Props) {
  return (
    <div className={`cover cover-gerbang is-${phase}`}>
      <div className="gate gate-l">
        <GatePattern />
      </div>
      <div className="gate gate-r">
        <GatePattern />
      </div>
      <div className="gate-seam" />
      <div className="cv-center">
        <span className="cv-kicker">The Wedding of</span>
        <h1 className="cv-title">
          {wedding.groom.nick} <em>&amp;</em> {wedding.bride.nick}
        </h1>
        <span className="cv-date">{wedding.dateShort}</span>
        <GuestBlock guest={guest} />
        <OpenButton onClick={onOpen} />
      </div>
    </div>
  );
}

function GatePattern() {
  return (
    <svg className="gate-svg" viewBox="0 0 200 600" preserveAspectRatio="none" aria-hidden>
      <rect x="14" y="14" width="172" height="572" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="26" y="26" width="148" height="548" rx="2" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".6" />
      <path d="M26 160 Q100 60 174 160" fill="none" stroke="currentColor" strokeWidth=".8" />
      <path d="M26 440 Q100 540 174 440" fill="none" stroke="currentColor" strokeWidth=".8" />
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={i} cx="100" cy={190 + i * 37} r={i % 2 ? 4 : 8} fill="none" stroke="currentColor" strokeWidth=".6" />
      ))}
    </svg>
  );
}

/* ───────────── 2. AMPLOP: segel lilin, flap terbuka, surat naik ───────────── */
function EnvelopeOpening({ wedding, guest, phase, onOpen }: Props) {
  return (
    <div className={`cover cover-amplop is-${phase}`}>
      <div className="env-text env-text-top">
        <span className="cv-kicker">You are invited</span>
        <GuestBlock guest={guest} />
      </div>
      <div className="env-wrap">
        <div className="env">
          <div className="env-back" />
          <div className="env-letter">
            <span className="cv-kicker">The Wedding of</span>
            <span className="env-letter-names">
              {wedding.groom.nick} &amp; {wedding.bride.nick}
            </span>
            <span className="env-letter-date">{wedding.dateShort}</span>
          </div>
          <div className="env-pocket" />
          <div className="env-flap" />
          <button type="button" className="env-seal" onClick={onOpen} aria-label="Buka undangan">
            <span>
              {wedding.groom.nick[0]}
              {wedding.bride.nick[0]}
            </span>
          </button>
        </div>
      </div>
      <div className="env-text env-text-bottom">
        <span className="env-hint">Ketuk segel untuk membuka</span>
      </div>
    </div>
  );
}

/* ───────────── 3. LINGKAR: iris menutup dari titik klik ───────────── */
function IrisOpening({ wedding, guest, phase, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (el) {
      const r = e.currentTarget.getBoundingClientRect();
      el.style.setProperty("--cx", `${r.left + r.width / 2}px`);
      el.style.setProperty("--cy", `${r.top + r.height / 2}px`);
    }
    onOpen();
  };
  return (
    <div ref={ref} className={`cover cover-lingkar is-${phase}`}>
      <div className="iris-rings" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <Leaves />
      <div className="cv-center">
        <span className="cv-kicker">The Wedding of</span>
        <h1 className="cv-title">
          {wedding.groom.nick}
          <em>&amp;</em>
          {wedding.bride.nick}
        </h1>
        <span className="cv-date">{wedding.dateLabel}</span>
        <GuestBlock guest={guest} />
        <OpenButton onClick={handle} />
      </div>
    </div>
  );
}

function Leaves() {
  return (
    <div className="iris-leaves" aria-hidden>
      {["tl", "tr", "bl", "br"].map((p) => (
        <svg key={p} className={`leaf leaf-${p}`} viewBox="0 0 120 120">
          <path d="M10 110 C 20 50, 60 15, 110 10 C 100 60, 70 100, 10 110 Z" fill="currentColor" opacity=".18" />
          <path d="M10 110 C 45 75, 75 45, 110 10" stroke="currentColor" strokeWidth="1.2" fill="none" opacity=".45" />
        </svg>
      ))}
    </div>
  );
}
