"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import "./invitation.css";
import type { Template, Wedding } from "./data";
import { Opening, type Phase } from "./Openings";
import { Reveal, SplitText } from "./Reveal";

export default function Invitation({ template, wedding, guest }: { template: Template; wedding: Wedding; guest: string }) {
  const [phase, setPhase] = useState<Phase>("cover");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // kunci scroll selama cover masih tampil
  useEffect(() => {
    const root = document.documentElement;
    if (phase !== "open") {
      root.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      root.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
    };
  }, [phase]);

  const open = () => {
    if (phase !== "cover") return;
    setPhase("opening");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setPhase("open"), reduce ? 400 : template.openDuration);
    const a = audioRef.current;
    if (a) a.play().then(() => setPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else {
      a.pause();
      setPlaying(false);
    }
  };

  const started = phase !== "cover";

  return (
    <div className={`inv tpl-${template.opening}${started ? " is-started" : ""}`} style={{ ["--hero-delay" as string]: `${template.heroDelay}ms` }}>
      {phase !== "open" && <Opening style={template.opening} wedding={wedding} guest={guest} phase={phase} onOpen={open} />}

      <Particles kind={template.opening} />

      <main className="inv-main">
        <Hero wedding={wedding} started={started} />
        <Quote />
        <Couple wedding={wedding} />
        <Countdown wedding={wedding} />
        <Events wedding={wedding} />
        <Story wedding={wedding} />
        <Gallery />
        <Wishes wedding={wedding} />
        <Gifts wedding={wedding} />
        <Closing wedding={wedding} />
      </main>

      {wedding.musicUrl && (
        <>
          <audio ref={audioRef} src={wedding.musicUrl} loop preload="auto" />
          <button type="button" className={`music${playing ? " is-playing" : ""}${started ? " is-shown" : ""}`} onClick={toggleMusic} aria-label={playing ? "Matikan musik" : "Putar musik"}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
            </svg>
          </button>
        </>
      )}

      <Dock shown={phase === "open"} />
    </div>
  );
}

/* ───────────── Partikel melayang (kelopak / kilau / daun) ───────────── */
function Particles({ kind }: { kind: string }) {
  return (
    <div className={`particles particles-${kind}`} aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            animationDelay: `${((i * 1.7) % 12).toFixed(1)}s`,
            animationDuration: `${11 + ((i * 3) % 9)}s`,
            ["--size" as string]: `${8 + ((i * 5) % 10)}px`,
            ["--drift" as string]: `${i % 2 ? 60 : -60}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ───────────── Hero ───────────── */
function Hero({ wedding, started }: { wedding: Wedding; started: boolean }) {
  return (
    <section id="home" className={`hero${started ? " is-in" : ""}`}>
      <div className="hero-bg" />
      <div className="hero-frame" aria-hidden />
      <div className="hero-content">
        <span className="hero-kicker">The Wedding of</span>
        <h1 className="hero-names">
          <SplitText text={wedding.groom.nick} start={250} />
          <span className="hero-amp">&amp;</span>
          <SplitText text={wedding.bride.nick} start={650} />
        </h1>
        <span className="hero-line" />
        <span className="hero-date">{wedding.dateLabel}</span>
      </div>
      <a href="#quote" className="hero-scroll" aria-label="Gulir ke bawah">
        <span />
      </a>
    </section>
  );
}

function Quote() {
  return (
    <section id="quote" className="sec sec-quote">
      <Reveal variant="zoom">
        <Ornament />
      </Reveal>
      <Reveal variant="blur" delay={150}>
        <p className="quote-text">
          “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
        </p>
      </Reveal>
      <Reveal variant="up" delay={300}>
        <span className="quote-src">QS. Ar-Rum : 21</span>
      </Reveal>
    </section>
  );
}

function Couple({ wedding }: { wedding: Wedding }) {
  const people = [
    { p: wedding.groom, v: "left" as const },
    { p: wedding.bride, v: "right" as const },
  ];
  return (
    <section id="mempelai" className="sec">
      <Reveal variant="up">
        <span className="sec-kicker">Bismillahirrahmanirrahim</span>
        <p className="sec-lead">Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:</p>
      </Reveal>
      <div className="couple">
        {people.map(({ p, v }, idx) => (
          <div key={p.nick} className="couple-item">
            <Reveal variant={v}>
              <div className="portrait">
                <div className="portrait-ring" />
                <div className="portrait-img">
                  <span>{p.nick[0]}</span>
                </div>
              </div>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <h3 className="couple-name">{p.full}</h3>
              <p className="couple-parents">{p.parents}</p>
              <a className="chip" href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noreferrer">
                @{p.instagram}
              </a>
            </Reveal>
            {idx === 0 && (
              <Reveal variant="zoom" delay={250}>
                <span className="couple-amp">&amp;</span>
              </Reveal>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Countdown({ wedding }: { wedding: Wedding }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const diff = now === null ? null : Math.max(0, new Date(wedding.dateISO).getTime() - now);
  const parts = [
    { label: "Hari", v: diff === null ? null : Math.floor(diff / 864e5) },
    { label: "Jam", v: diff === null ? null : Math.floor(diff / 36e5) % 24 },
    { label: "Menit", v: diff === null ? null : Math.floor(diff / 6e4) % 60 },
    { label: "Detik", v: diff === null ? null : Math.floor(diff / 1e3) % 60 },
  ];
  return (
    <section className="sec sec-count">
      <Reveal variant="up">
        <h2 className="sec-title">Menuju Hari Bahagia</h2>
      </Reveal>
      <div className="count">
        {parts.map((p, i) => (
          <Reveal key={p.label} variant="flip" delay={i * 120}>
            <div className="count-box">
              <span className="count-num" key={p.v ?? "x"}>
                {p.v === null ? "--" : String(p.v).padStart(2, "0")}
              </span>
              <span className="count-label">{p.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal variant="up" delay={500}>
        <a
          className="btn-outline"
          target="_blank"
          rel="noreferrer"
          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${wedding.groom.nick} & ${wedding.bride.nick}`)}&dates=20270214T010000Z/20270214T070000Z`}
        >
          Simpan ke Kalender
        </a>
      </Reveal>
    </section>
  );
}

function Events({ wedding }: { wedding: Wedding }) {
  return (
    <section id="acara" className="sec">
      <Reveal variant="up">
        <span className="sec-kicker">Save the Date</span>
        <h2 className="sec-title">Rangkaian Acara</h2>
      </Reveal>
      <div className="events">
        {wedding.events.map((ev, i) => (
          <Reveal key={ev.title} variant={i % 2 ? "right" : "left"} delay={i * 150}>
            <article className="event-card">
              <h3 className="event-title">{ev.title}</h3>
              <span className="event-date">{wedding.dateLabel}</span>
              <span className="event-time">{ev.time}</span>
              <span className="event-place">{ev.place}</span>
              <span className="event-addr">{ev.address}</span>
              <a className="btn-solid" href={ev.maps} target="_blank" rel="noreferrer">
                Lihat Lokasi
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Story({ wedding }: { wedding: Wedding }) {
  return (
    <section className="sec">
      <Reveal variant="up">
        <span className="sec-kicker">Our Journey</span>
        <h2 className="sec-title">Kisah Kami</h2>
      </Reveal>
      <ol className="timeline">
        {wedding.story.map((s, i) => (
          <li key={s.year} className={`tl-item ${i % 2 ? "tl-r" : "tl-l"}`}>
            <Reveal variant={i % 2 ? "right" : "left"} delay={80}>
              <span className="tl-dot" />
              <span className="tl-year">{s.year}</span>
              <h3 className="tl-title">{s.title}</h3>
              <p className="tl-text">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Gallery() {
  return (
    <section id="galeri" className="sec">
      <Reveal variant="up">
        <span className="sec-kicker">Moments</span>
        <h2 className="sec-title">Galeri</h2>
      </Reveal>
      <div className="gallery">
        {Array.from({ length: 6 }).map((_, i) => (
          <Reveal key={i} variant="zoom" delay={(i % 3) * 120} className={`g-item g-${i}`}>
            <div className="g-img" style={{ ["--h" as string]: i * 18 }}>
              <span>Foto {i + 1}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Wishes({ wedding }: { wedding: Wedding }) {
  const [list, setList] = useState(wedding.wishes.map((w, i) => ({ ...w, id: i })));
  const [name, setName] = useState("");
  const [attend, setAttend] = useState("Hadir");
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setList((l) => [{ name: name.trim(), attend, text: text.trim(), id: Date.now() }, ...l]);
    setName("");
    setText("");
  };

  return (
    <section id="ucapan" className="sec">
      <Reveal variant="up">
        <span className="sec-kicker">RSVP</span>
        <h2 className="sec-title">Ucapan &amp; Doa</h2>
      </Reveal>
      <Reveal variant="up" delay={150}>
        <form className="rsvp" onSubmit={submit}>
          <input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={attend} onChange={(e) => setAttend(e.target.value)}>
            <option>Hadir</option>
            <option>Tidak hadir</option>
            <option>Masih ragu</option>
          </select>
          <textarea placeholder="Tulis ucapan & doa" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn-solid" type="submit">
            Kirim Ucapan
          </button>
        </form>
      </Reveal>
      <ul className="wishes">
        {list.map((w) => (
          <li key={w.id} className="wish">
            <div className="wish-avatar">{w.name[0]}</div>
            <div>
              <strong>{w.name}</strong> <span className="wish-tag">{w.attend}</span>
              <p>{w.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Gifts({ wedding }: { wedding: Wedding }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (num: string) => {
    navigator.clipboard?.writeText(num).catch(() => {});
    setCopied(num);
    window.setTimeout(() => setCopied(null), 1800);
  };
  return (
    <section className="sec">
      <Reveal variant="up">
        <span className="sec-kicker">Wedding Gift</span>
        <h2 className="sec-title">Tanda Kasih</h2>
        <p className="sec-lead">Doa restu Anda adalah karunia terindah. Namun jika ingin memberi tanda kasih, dapat melalui:</p>
      </Reveal>
      <div className="gifts">
        {wedding.gifts.map((g, i) => (
          <Reveal key={g.number} variant="flip" delay={i * 150}>
            <div className="gift-card">
              <span className="gift-chip" />
              <span className="gift-bank">{g.bank}</span>
              <span className="gift-num">{g.number.replace(/(\d{4})(?=\d)/g, "$1 ")}</span>
              <span className="gift-holder">a.n. {g.holder}</span>
              <button type="button" className="btn-outline" onClick={() => copy(g.number)}>
                {copied === g.number ? "Tersalin ✓" : "Salin Nomor"}
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Closing({ wedding }: { wedding: Wedding }) {
  return (
    <section className="sec sec-closing">
      <Reveal variant="blur">
        <p className="sec-lead">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
      </Reveal>
      <Reveal variant="zoom" delay={200}>
        <h2 className="closing-names">
          {wedding.groom.nick} &amp; {wedding.bride.nick}
        </h2>
      </Reveal>
      <Reveal variant="up" delay={400}>
        <Ornament />
        <p className="credit">Made with love by SAKAWITARA</p>
      </Reveal>
    </section>
  );
}

function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 160 24" aria-hidden>
      <path d="M0 12 H62" stroke="currentColor" strokeWidth="1" />
      <path d="M98 12 H160" stroke="currentColor" strokeWidth="1" />
      <path d="M80 2 L90 12 L80 22 L70 12 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="80" cy="12" r="3" fill="currentColor" />
      <circle cx="66" cy="12" r="1.5" fill="currentColor" />
      <circle cx="94" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function Dock({ shown }: { shown: boolean }) {
  const items = [
    { href: "#home", label: "Home", d: "M3 11 12 3l9 8v10h-6v-6H9v6H3z" },
    { href: "#mempelai", label: "Mempelai", d: "M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" },
    { href: "#acara", label: "Acara", d: "M7 2v3M17 2v3M3 8h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" },
    { href: "#galeri", label: "Galeri", d: "M4 5h16v14H4zM4 15l5-5 5 5 2-2 4 4" },
    { href: "#ucapan", label: "Ucapan", d: "M4 5h16v11H8l-4 4z" },
  ];
  return (
    <nav className={`dock${shown ? " is-shown" : ""}`} aria-label="Navigasi undangan">
      {items.map((it) => (
        <a key={it.href} href={it.href} aria-label={it.label}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path d={it.d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
