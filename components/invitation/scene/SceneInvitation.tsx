"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import "../invitation.css";
import "./scene.css";
import type { SceneTemplate, Wedding } from "../data";
import { Reveal } from "../Reveal";
import { CoverIstana, CoverJoglo, CoverSawah, Photo, SceneIstana, type ScenePhase } from "./Scenes";
import { Deco, Flock, SceneJogloImg, SceneSawahImg } from "./ImageScene";

export default function SceneInvitation({ template, wedding, guest }: { template: SceneTemplate; wedding: Wedding; guest: string }) {
  const [phase, setPhase] = useState<ScenePhase>("cover");
  const [titled, setTitled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // kunci scroll sampai scene selesai dirakit
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = phase === "open" ? "" : "hidden";
    if (phase !== "open") window.scrollTo(0, 0);
    return () => {
      html.style.overflow = "";
    };
  }, [phase]);

  // parallax: scroll + gerak pointer → CSS variable
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    let sy = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = 0;
      // --p: progres scroll 0 → 1 selama layar pertama; dipakai layer untuk "terbelah" ke luar
      root.style.setProperty("--p", sy.toFixed(4));
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onScroll = () => {
      sy = Math.min(window.scrollY / window.innerHeight, 1.3);
      queue();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      queue();
    };
    // HP: miringkan layar → scene ikut bergeser (Android langsung; iOS butuh izin, diabaikan)
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      mx = Math.max(-1, Math.min(1, e.gamma / 25));
      my = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      queue();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
      cancelAnimationFrame(raf);
    };
  }, []);

  const open = () => {
    if (phase !== "cover") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("go");
    window.setTimeout(() => setTitled(true), reduce ? 200 : template.titleAt);
    window.setTimeout(() => setPhase("open"), reduce ? 400 : template.unlockAt);
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

  const Cover = template.scene === "istana" ? CoverIstana : template.scene === "joglo" ? CoverJoglo : CoverSawah;
  const Scene = template.scene === "istana" ? SceneIstana : template.scene === "joglo" ? SceneJogloImg : SceneSawahImg;
  /** ornamen PNG bergoyang di bagian konten (hanya tema berilustrasi) */
  const deco = template.scene !== "istana";

  return (
    <div ref={rootRef} className={`sx sx-${template.scene}${deco ? " sx-clear" : ""}${phase !== "cover" ? " is-go" : ""}${titled ? " is-titled" : ""}`}>
      <div className="scene" aria-hidden>
        <Scene />
      </div>
      {/* lapisan lembut di atas ilustrasi saat scroll, agar teks tetap terbaca */}
      {deco && <div className="veil" aria-hidden />}

      {phase !== "open" && <Cover wedding={wedding} guest={guest} phase={phase} onOpen={open} />}

      <main className="sx-main">
        <TitleCard wedding={wedding} />
        <CoupleIntro wedding={wedding} deco={deco} />
        <BrideGroom wedding={wedding} deco={deco} />
        <SaveDate wedding={wedding} deco={deco} />
        <EventCards wedding={wedding} />
        <ExtraInfo wedding={wedding} />
        <LoveStory wedding={wedding} deco={deco} />
        <Moments wedding={wedding} />
        <Gift wedding={wedding} deco={deco} />
        <WishesBox wedding={wedding} />
        <ThankYou wedding={wedding} deco={deco} />
      </main>

      {wedding.musicUrl && (
        <>
          <audio ref={audioRef} src={wedding.musicUrl} loop preload="auto" />
          <button type="button" className={`sx-music${playing ? " is-playing" : ""}${titled ? " is-shown" : ""}`} onClick={toggleMusic} aria-label={playing ? "Matikan musik" : "Putar musik"}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
            </svg>
          </button>
        </>
      )}

      <nav className={`sx-dock${phase === "open" ? " is-shown" : ""}`} aria-label="Navigasi undangan">
        {[
          ["#sx-home", "Home", "M3 11 12 3l9 8v10h-6v-6H9v6H3z"],
          ["#sx-mempelai", "Mempelai", "M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"],
          ["#sx-acara", "Acara", "M7 2v3M17 2v3M3 8h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
          ["#sx-galeri", "Galeri", "M4 5h16v14H4zM4 15l5-5 5 5 2-2 4 4"],
          ["#sx-ucapan", "Ucapan", "M4 5h16v11H8l-4 4z"],
        ].map(([href, label, d]) => (
          <a key={href} href={href} aria-label={label}>
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden>
              <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ───────────── Bagian-bagian konten ───────────── */

function TitleCard({ wedding }: { wedding: Wedding }) {
  return (
    <section id="sx-home" className="sx-title">
      <div className="title-card">
        <span className="sc-script t-1">The Wedding Of</span>
        <span className="sc-caps t-2">{wedding.groom.nick}</span>
        <span className="sc-script t-amp t-3">&amp;</span>
        <span className="sc-caps t-4">{wedding.bride.nick}</span>
        <span className="sc-date t-5">{wedding.dateLabel}</span>
        <span className="mouse t-6" aria-hidden>
          <i />
        </span>
      </div>
    </section>
  );
}

type D = { wedding: Wedding; deco?: boolean };

function CoupleIntro({ wedding, deco }: D) {
  const mono = `${wedding.groom.nick[0]}`;
  const mono2 = `${wedding.bride.nick[0]}`;
  return (
    <section className="sx-sec sx-panel">
      {deco && <Deco src="orchid" className="d-intro-r" />}
      {deco && <Deco src="vine" className="d-intro-l" idle="swing" origin="40% 0%" />}
      <Reveal variant="curtain">
        <div className="frame-arch">
          <Photo src={wedding.photos.couple} label={`${wedding.groom.nick} & ${wedding.bride.nick}`} className="ph-arch" />
        </div>
      </Reveal>
      <Reveal variant="up" delay={150}>
        <div className="card quote-card">
          <div className="mono">
            {mono}
            <small>&amp;</small>
            {mono2}
          </div>
          <p>“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”</p>
          <span className="src">QS. Ar-Rum : 21</span>
        </div>
      </Reveal>
    </section>
  );
}

function BrideGroom({ wedding, deco }: D) {
  const people = [
    { p: wedding.groom, photo: wedding.photos.groom, v: "left" as const },
    { p: wedding.bride, photo: wedding.photos.bride, v: "right" as const },
  ];
  return (
    <section id="sx-mempelai" className="sx-sec sx-panel">
      {deco && <Deco src="lilac" className="d-bg-lilac" idle="swing" origin="0% 20%" flip />}
      <Reveal variant="up">
        <div className="card arch-card">
          <h2 className="sx-h">Bride &amp; Groom</h2>
          <p className="salam">Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
          <p className="lead">Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, semoga ridho-Mu tercurah mengiringi pernikahan kami.</p>
          {people.map(({ p, photo, v }, i) => (
            <div key={p.nick} className="person">
              <Reveal variant={v}>
                <Photo src={photo} label={p.nick} className="ph-portrait" />
              </Reveal>
              <Reveal variant="up" delay={150}>
                <span className="person-nick">{p.nick}</span>
                <h3 className="person-name">{p.full}</h3>
                <p className="person-parents">{p.parents}</p>
                <a className="pill" href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noreferrer">
                  @{p.instagram}
                </a>
              </Reveal>
              {i === 0 && (
                <Reveal variant="zoom" delay={200}>
                  <span className="amp-big">&amp;</span>
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function SaveDate({ wedding, deco }: D) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const diff = now === null ? null : Math.max(0, new Date(wedding.dateISO).getTime() - now);
  const parts: [string, number | null][] = [
    ["Hari", diff === null ? null : Math.floor(diff / 864e5)],
    ["Jam", diff === null ? null : Math.floor(diff / 36e5) % 24],
    ["Menit", diff === null ? null : Math.floor(diff / 6e4) % 60],
    ["Detik", diff === null ? null : Math.floor(diff / 1e3) % 60],
  ];
  return (
    <section className="sx-sec sx-savedate">
      {(wedding.photos.saveDate || !deco) && <Photo src={wedding.photos.saveDate} label="" className="ph-bg" />}
      {deco && <Flock at={0} top="6%" dur={14} />}
      {deco && <Deco src="bouquet-red" className="d-sd-l" />}
      {deco && <Deco src="flower-corner" className="d-sd-r" origin="0% 100%" flip />}
      <div className="savedate-in">
        <Reveal variant="blur">
          <h2 className="sx-h light">Save The Date</h2>
        </Reveal>
        <Reveal variant="up" delay={120}>
          <span className="sd-date">{wedding.dateLabel}</span>
        </Reveal>
        <div className="cd">
          {parts.map(([l, v], i) => (
            <Reveal key={l} variant="flip" delay={i * 110}>
              <div className="cd-box">
                <b key={v ?? "x"}>{v === null ? "--" : String(v).padStart(2, "0")}</b>
                <span>{l}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="up" delay={450}>
          <a
            className="pill pill-light"
            target="_blank"
            rel="noreferrer"
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${wedding.groom.nick} & ${wedding.bride.nick}`)}&dates=20270214T010000Z/20270214T070000Z`}
          >
            Simpan Tanggal
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function EventCards({ wedding }: { wedding: Wedding }) {
  const [dayName, rest] = wedding.dateLabel.split(", ");
  const [day, ...monthYear] = (rest ?? "").split(" ");
  return (
    <section id="sx-acara" className="sx-sec sx-window">
      {wedding.events.map((ev, i) => (
        <Reveal key={ev.title} variant="up" delay={i * 120}>
          <article className="card arch-card event">
            <h3 className="event-t">{ev.title}</h3>
            <span className="event-day">{dayName}</span>
            <span className="event-num">{day}</span>
            <span className="event-my">{monthYear.join(" ")}</span>
            <span className="event-time">◷ {ev.time}</span>
            <span className="event-loc">Lokasi Acara</span>
            <strong>{ev.place}</strong>
            <span className="event-addr">{ev.address}</span>
            <a className="pill" href={ev.maps} target="_blank" rel="noreferrer">
              Google Maps
            </a>
          </article>
        </Reveal>
      ))}
    </section>
  );
}

function ExtraInfo({ wedding }: { wedding: Wedding }) {
  return (
    <section className="sx-sec sx-panel">
      <Reveal variant="up">
        <div className="card">
          <h2 className="sx-h">Dresscode</h2>
          <p className="lead">{wedding.dresscode.text}</p>
          <div className="swatches">
            {wedding.dresscode.colors.map((c, i) => (
              <Reveal key={c} variant="zoom" delay={i * 120}>
                <span className="swatch" style={{ background: c }} />
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal variant="up" delay={100}>
        <div className="card">
          <h2 className="sx-h">Live Streaming</h2>
          <p className="lead">{wedding.liveStream.text}</p>
          <a className="pill" href={wedding.liveStream.url} target="_blank" rel="noreferrer">
            ▶ Tonton Live Streaming
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function LoveStory({ wedding, deco }: D) {
  return (
    <section className="sx-sec sx-panel">
      {deco && <Deco src="flower-corner" className="d-story-fl" origin="0% 100%" />}
      <Reveal variant="up">
        <h2 className="sx-h">Love Story</h2>
      </Reveal>
      <ol className="story">
        {wedding.story.map((s, i) => (
          <li key={s.year}>
            <span className="story-node">♥</span>
            <Reveal variant="up" delay={80}>
              <div className="card story-card">
                <Photo src={wedding.photos.story[i] ?? null} label={s.year} className="ph-story" />
                <span className="story-year">{s.year}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Moments({ wedding }: { wedding: Wedding }) {
  return (
    <section id="sx-galeri" className="sx-sec sx-panel">
      <Reveal variant="up">
        <h2 className="sx-h">Our Moments</h2>
      </Reveal>
      <div className="moments">
        {wedding.photos.gallery.map((src, i) => (
          <Reveal key={i} variant="zoom" delay={(i % 2) * 120} className={`m-${i}`}>
            <Photo src={src} label={`Foto ${i + 1}`} className="ph-fill" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gift({ wedding, deco }: D) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (n: string) => {
    navigator.clipboard?.writeText(n).catch(() => {});
    setCopied(n);
    window.setTimeout(() => setCopied(null), 1800);
  };
  return (
    <section className="sx-sec sx-panel">
      {deco && <Deco src="flower-corner" className="d-gift" origin="0% 100%" />}
      <Reveal variant="up">
        <div className="card">
          <h2 className="sx-h">Wedding Gift</h2>
          <p className="lead">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui dibawah ini.</p>
          <button type="button" className="pill" onClick={() => setShow((s) => !s)}>
            {show ? "Tutup" : "🎁 Klik di Sini"}
          </button>
          <div className={`gift-list${show ? " is-open" : ""}`}>
            <div>
              {wedding.gifts.map((g) => (
                <div key={g.number} className="gift">
                  <b>{g.bank}</b>
                  <span className="gift-no">{g.number}</span>
                  <span>a.n. {g.holder}</span>
                  <button type="button" className="pill pill-sm" onClick={() => copy(g.number)}>
                    {copied === g.number ? "Tersalin ✓" : "Salin"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function WishesBox({ wedding }: { wedding: Wedding }) {
  const [list, setList] = useState(wedding.wishes.map((w, i) => ({ ...w, id: i })));
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [attend, setAttend] = useState("Hadir");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setList((l) => [{ name: name.trim(), text: text.trim(), attend, id: Date.now() }, ...l]);
    setName("");
    setText("");
  };
  return (
    <section id="sx-ucapan" className="sx-sec sx-panel">
      <Reveal variant="up">
        <div className="card">
          <h2 className="sx-h">Wishes</h2>
          <p className="lead">Berikan doa dan ucapan terbaik untuk kami.</p>
          <form className="wish-form" onSubmit={submit}>
            <input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Ucapan" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
            <span className="wish-label">Konfirmasi Kehadiran</span>
            <div className="radio-row">
              {["Hadir", "Tidak Hadir"].map((o) => (
                <label key={o} className={attend === o ? "is-on" : ""}>
                  <input type="radio" name="attend" value={o} checked={attend === o} onChange={() => setAttend(o)} />
                  {o}
                </label>
              ))}
            </div>
            <button type="submit" className="pill pill-solid">
              Kirim
            </button>
          </form>
          <ul className="wish-list">
            {list.map((w) => (
              <li key={w.id}>
                <b>{w.name}</b> <small>{w.attend}</small>
                <p>{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function ThankYou({ wedding, deco }: D) {
  return (
    <section className="sx-sec sx-panel sx-end">
      {deco && <Deco src="bouquet-red" className="d-end-l" />}
      {deco && <Deco src="bouquet-red" className="d-end-r" flip />}
      {deco && <Deco src="lilac" className="d-end-top" idle="swing" origin="0% 20%" />}
      <Reveal variant="curtain">
        <div className="frame-arch">
          <Photo src={wedding.photos.closing} label={`${wedding.groom.nick} & ${wedding.bride.nick}`} className="ph-arch" />
        </div>
      </Reveal>
      <Reveal variant="up" delay={150}>
        <h2 className="sx-h">Terima Kasih</h2>
        <p className="lead">Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.</p>
        <p className="lead">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
        <span className="lead small">Kami yang berbahagia</span>
        <span className="sc-caps end-names">
          {wedding.groom.nick} &amp; {wedding.bride.nick}
        </span>
      </Reveal>
      <footer className="sx-foot">SAKAWITARA · Wedding &amp; Creative</footer>
    </section>
  );
}
