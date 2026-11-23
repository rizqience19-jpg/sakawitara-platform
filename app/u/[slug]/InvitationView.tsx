"use client";

import { useEffect, useState } from "react";
import Gunungan from "@/app/components/Gunungan";
import { createClient } from "@/lib/supabase/client";
import { formatJam, formatTanggal, type Invitation, type Rsvp } from "@/lib/types";

type Props = {
  invitation: Invitation;
  initialRsvps: Rsvp[];
  guest: string | null;
  isDemo: boolean;
};

const ATTENDANCE_LABEL: Record<Rsvp["attendance"], string> = {
  hadir: "Hadir",
  tidak: "Berhalangan",
  ragu: "Masih ragu",
};

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    hari: Math.floor(diff / 86_400_000),
    jam: Math.floor((diff / 3_600_000) % 24),
    menit: Math.floor((diff / 60_000) % 60),
    detik: Math.floor((diff / 1000) % 60),
  };
}

function Divider() {
  return <div className="divider" aria-hidden="true">❖</div>;
}

export default function InvitationView({ invitation: inv, initialRsvps, guest, isDemo }: Props) {
  const [opened, setOpened] = useState(false);
  const countdown = useCountdown(inv.akad_at);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  return (
    <>
      <section className={`inv-cover${opened ? " opened" : ""}`} aria-hidden={opened}>
        <div className="fade-in">
          <Gunungan size={90} />
          <p className="eyebrow" style={{ marginTop: 20 }}>Pawiwahan</p>
          <div className="inv-names">{inv.groom_name} &amp; {inv.bride_name}</div>
          <p className="muted">{formatTanggal(inv.akad_at)}</p>
          <div style={{ margin: "28px 0" }}>
            <p className="muted" style={{ margin: 0 }}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p style={{ fontSize: "1.4rem", color: "var(--emas-muda)", margin: "4px 0 0" }}>{guest ?? "Tamu Undangan"}</p>
          </div>
          <button className="btn" onClick={() => setOpened(true)}>✉ Buka Undangan</button>
        </div>
      </section>

      <div aria-hidden={!opened}>
        {/* Pembuka */}
        <section className="inv-section" style={{ minHeight: "100vh", display: "grid", placeContent: "center" }}>
          <p className="eyebrow">Sugeng Rawuh</p>
          <h1 className="script" style={{ fontSize: "clamp(3rem, 12vw, 5rem)" }}>{inv.groom_name} &amp; {inv.bride_name}</h1>
          <Divider />
          {inv.quote && <p style={{ fontStyle: "italic" }}>{inv.quote}</p>}
        </section>

        {/* Mempelai */}
        <section className="inv-section">
          <h2>Mempelai</h2>
          <p className="muted">
            Dengan memohon rahmat dan ridha Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
          </p>
          <div className="inv-couple" style={{ marginTop: 28 }}>
            <div>
              <h3 className="script" style={{ fontSize: "2.6rem", color: "var(--emas-muda)" }}>{inv.groom_name}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>{inv.groom_full_name}</p>
              {inv.groom_parents && <p className="muted" style={{ margin: 0 }}>Putra dari {inv.groom_parents}</p>}
            </div>
            <div className="ampersand">&amp;</div>
            <div>
              <h3 className="script" style={{ fontSize: "2.6rem", color: "var(--emas-muda)" }}>{inv.bride_name}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>{inv.bride_full_name}</p>
              {inv.bride_parents && <p className="muted" style={{ margin: 0 }}>Putri dari {inv.bride_parents}</p>}
            </div>
          </div>
        </section>

        {/* Acara */}
        <section className="inv-section">
          <h2>Rangkaian Acara</h2>
          <Divider />
          <div className="inv-events">
            <EventCard title="Akad Nikah" at={inv.akad_at} venue={inv.akad_venue} address={inv.akad_address} />
            {inv.resepsi_at && inv.resepsi_venue && (
              <EventCard title="Resepsi" at={inv.resepsi_at} venue={inv.resepsi_venue} address={inv.resepsi_address} />
            )}
          </div>
          {inv.maps_url && (
            <a className="btn" href={inv.maps_url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 24 }}>
              📍 Lihat Lokasi
            </a>
          )}
        </section>

        {/* Hitung mundur */}
        <section className="inv-section">
          <h2>Menghitung Hari</h2>
          <div className="countdown" style={{ marginTop: 16 }}>
            {(["hari", "jam", "menit", "detik"] as const).map((k) => (
              <div key={k}>
                <b>{countdown ? String(countdown[k]).padStart(2, "0") : "--"}</b>
                <span>{k}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RSVP & ucapan */}
        <RsvpSection invitationId={inv.id} initialRsvps={initialRsvps} guest={guest} isDemo={isDemo} />

        {/* Penutup */}
        <section className="inv-section">
          <p>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
          </p>
          <p className="eyebrow" style={{ marginTop: 24 }}>Matur Nuwun</p>
          <div className="inv-names" style={{ fontSize: "2.6rem" }}>{inv.groom_name} &amp; {inv.bride_name}</div>
          <Gunungan size={56} />
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: 32, letterSpacing: "0.3em" }}>SAKAWITARA</p>
        </section>
      </div>
    </>
  );
}

function EventCard({ title, at, venue, address }: { title: string; at: string; venue: string; address: string | null }) {
  return (
    <div className="card">
      <h3 style={{ color: "var(--emas-muda)" }}>{title}</h3>
      <p style={{ margin: 0 }}>{formatTanggal(at)}</p>
      <p style={{ margin: "0 0 12px" }}>Pukul {formatJam(at)}</p>
      <p style={{ margin: 0, fontWeight: 600 }}>{venue}</p>
      {address && <p className="muted" style={{ margin: 0 }}>{address}</p>}
    </div>
  );
}

function RsvpSection({ invitationId, initialRsvps, guest, isDemo }: { invitationId: string; initialRsvps: Rsvp[]; guest: string | null; isDemo: boolean }) {
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [name, setName] = useState(guest ?? "");
  const [attendance, setAttendance] = useState<Rsvp["attendance"]>("hadir");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    const row = {
      invitation_id: invitationId,
      name: name.trim(),
      attendance,
      guests: attendance === "tidak" ? 0 : guests,
      message: message.trim() || null,
    };

    let saved: Rsvp;
    if (isDemo) {
      saved = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    } else {
      const { data, error } = await createClient().from("rsvps").insert(row).select().single();
      if (error || !data) {
        setSending(false);
        setStatus({ ok: false, text: "Maaf, gagal mengirim. Silakan coba lagi." });
        return;
      }
      saved = data as Rsvp;
    }

    setRsvps((r) => [saved, ...r]);
    setMessage("");
    setSending(false);
    setStatus({ ok: true, text: "Matur nuwun! Konfirmasi dan ucapan Anda sudah terkirim." });
  }

  return (
    <section className="inv-section">
      <h2>Konfirmasi Kehadiran</h2>
      <p className="muted">Mohon kesediaannya untuk mengisi konfirmasi kehadiran dan doa restu.</p>
      <form className="card" onSubmit={onSubmit} style={{ textAlign: "left", marginTop: 16 }}>
        <div className="field">
          <label htmlFor="rsvp-name">Nama</label>
          <input id="rsvp-name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="rsvp-att">Kehadiran</label>
            <select id="rsvp-att" value={attendance} onChange={(e) => setAttendance(e.target.value as Rsvp["attendance"])}>
              <option value="hadir">Hadir</option>
              <option value="tidak">Berhalangan</option>
              <option value="ragu">Masih ragu</option>
            </select>
          </div>
          {attendance !== "tidak" && (
            <div className="field">
              <label htmlFor="rsvp-guests">Jumlah tamu</label>
              <select id="rsvp-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} orang</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="field">
          <label htmlFor="rsvp-msg">Ucapan &amp; doa</label>
          <textarea id="rsvp-msg" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        {status && <p className={status.ok ? "success" : "error"}>{status.text}</p>}
        <button className="btn" type="submit" disabled={sending}>{sending ? "Mengirim…" : "Kirim"}</button>
      </form>

      {rsvps.some((r) => r.message) && (
        <>
          <h3 style={{ marginTop: 40, color: "var(--emas-muda)" }}>Ucapan &amp; Doa Restu</h3>
          <div className="wishes">
            {rsvps.filter((r) => r.message).map((r) => (
              <div className="wish" key={r.id}>
                <strong>{r.name}</strong>
                <span className="badge">{ATTENDANCE_LABEL[r.attendance]}</span>
                <p style={{ margin: "4px 0 0" }}>{r.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
