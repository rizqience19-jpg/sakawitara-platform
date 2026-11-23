import Link from "next/link";
import type { Metadata } from "next";
import { templates } from "@/components/invitation/data";
import "./katalog.css";

export const metadata: Metadata = {
  title: "Contoh Undangan | SAKAWITARA",
  description: "Katalog contoh undangan digital SAKAWITARA dengan berbagai gaya opening.",
};

export default function Katalog() {
  return (
    <main className="kat">
      <header className="kat-head">
        <p className="kat-kicker">SAKAWITARA · KATALOG</p>
        <h1>Contoh Undangan Digital</h1>
        <p className="kat-sub">Pilih tema, lalu ketuk “Buka Undangan” untuk melihat animasi pembukanya.</p>
      </header>
      <section className="kat-grid">
        {templates.map((t, i) => (
          <article key={t.slug} className={`kat-card kat-${t.opening}`} style={{ animationDelay: `${i * 120}ms` }}>
            <div className="kat-preview" aria-hidden>
              <Preview kind={t.opening} />
            </div>
            <div className="kat-body">
              <span className="kat-badge">{t.openingLabel}</span>
              <h2>{t.name}</h2>
              <p>{t.tagline}</p>
              <Link className="btn" href={`/contoh/${t.slug}?to=Tamu+Undangan`}>
                Lihat Contoh
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

/** Pratinjau mini yang terus memutar animasi opening-nya. */
function Preview({ kind }: { kind: string }) {
  if (kind === "gerbang")
    return (
      <div className="pv pv-gate">
        <span className="pv-names">R &amp; N</span>
        <i className="pv-door pv-door-l" />
        <i className="pv-door pv-door-r" />
      </div>
    );
  if (kind === "amplop")
    return (
      <div className="pv pv-env">
        <div className="pv-env-body">
          <span className="pv-letter">R &amp; N</span>
          <i className="pv-pocket" />
          <i className="pv-flap" />
          <i className="pv-seal" />
        </div>
      </div>
    );
  return (
    <div className="pv pv-iris">
      <span className="pv-names">R &amp; N</span>
      <i className="pv-iris-cover" />
    </div>
  );
}
