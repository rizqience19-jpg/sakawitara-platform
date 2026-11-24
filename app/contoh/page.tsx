import Link from "next/link";
import type { Metadata } from "next";
import { sceneTemplates, templates } from "@/components/invitation/data";
import { FlowerBed, Mansion } from "@/components/invitation/scene/Art";
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
      <h2 className="kat-group">3D Motion</h2>
      <section className="kat-grid">
        {sceneTemplates.map((t, i) => (
          <article key={t.slug} className={`kat-card kat-${t.scene}`} style={{ animationDelay: `${i * 120}ms` }}>
            <div className="kat-preview" aria-hidden>
              {t.scene === "istana" ? (
                <div className="pv pv-scene">
                  <div className="pv-mansion"><Mansion /></div>
                  <div className="pv-flowers"><FlowerBed roses={[["#e9a27f", "#c86f4c"], ["#f3d9c4", "#d9aa86"]]} leaves={["#8a9a6a", "#6f7f52"]} seed={7} count={8} /></div>
                  <i className="pv-leafcurtain" />
                </div>
              ) : (
                /* eslint-disable @next/next/no-img-element */
                <div className="pv pv-scene pv-img">
                  <img className="pvi-sky" src="/scene/nusantara/sky.webp" alt="" />
                  <img className="pvi-mtn" src="/scene/nusantara/mountains.webp" alt="" />
                  <img className="pvi-main" src={`/scene/nusantara/${t.scene === "joglo" ? "joglo" : "ricefield"}.webp`} alt="" />
                  <img className="pvi-fl" src="/scene/nusantara/flower-corner.webp" alt="" />
                </div>
              )}
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
      <h2 className="kat-group">Klasik</h2>
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
