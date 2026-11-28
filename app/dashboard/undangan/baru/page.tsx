"use client";

import { useActionState, useState } from "react";
import { createInvitation, type FormState } from "./actions";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

const DEFAULT_QUOTE =
  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya. — QS. Ar-Rum: 21";

export default function UndanganBaruPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createInvitation, {});
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const autoSlug = slugify(`${groom} ${bride}`);
  const slugValue = slugEdited ? slug : autoSlug;

  return (
    <>
      <h1>Buat Undangan</h1>
      <form action={formAction} className="card">
        <fieldset>
          <legend>Mempelai Pria</legend>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="groom_name">Nama panggilan *</label>
              <input id="groom_name" name="groom_name" required value={groom} onChange={(e) => setGroom(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="groom_full_name">Nama lengkap *</label>
              <input id="groom_full_name" name="groom_full_name" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="groom_parents">Putra dari</label>
            <input id="groom_parents" name="groom_parents" placeholder="Bapak … & Ibu …" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Mempelai Wanita</legend>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="bride_name">Nama panggilan *</label>
              <input id="bride_name" name="bride_name" required value={bride} onChange={(e) => setBride(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="bride_full_name">Nama lengkap *</label>
              <input id="bride_full_name" name="bride_full_name" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="bride_parents">Putri dari</label>
            <input id="bride_parents" name="bride_parents" placeholder="Bapak … & Ibu …" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Akad Nikah</legend>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="akad_at">Tanggal &amp; jam (WIB) *</label>
              <input id="akad_at" name="akad_at" type="datetime-local" required />
            </div>
            <div className="field">
              <label htmlFor="akad_venue">Tempat *</label>
              <input id="akad_venue" name="akad_venue" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="akad_address">Alamat</label>
            <input id="akad_address" name="akad_address" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Resepsi (opsional)</legend>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="resepsi_at">Tanggal &amp; jam (WIB)</label>
              <input id="resepsi_at" name="resepsi_at" type="datetime-local" />
            </div>
            <div className="field">
              <label htmlFor="resepsi_venue">Tempat</label>
              <input id="resepsi_venue" name="resepsi_venue" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="resepsi_address">Alamat</label>
            <input id="resepsi_address" name="resepsi_address" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Lainnya</legend>
          <div className="field">
            <label htmlFor="maps_url">Tautan Google Maps</label>
            <input id="maps_url" name="maps_url" type="url" placeholder="https://maps.app.goo.gl/…" />
          </div>
          <div className="field">
            <label htmlFor="quote">Kutipan pembuka</label>
            <textarea id="quote" name="quote" defaultValue={DEFAULT_QUOTE} />
          </div>
          <div className="field">
            <label htmlFor="slug">Alamat undangan *</label>
            <input
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9\-]{3,60}"
              value={slugValue}
              onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }}
            />
            <span className="muted" style={{ fontSize: "0.85rem" }}>/u/{slugValue || "nama-mempelai"}</span>
          </div>
        </fieldset>

        {state.error && <p className="error">{state.error}</p>}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan Undangan"}
        </button>
      </form>
    </>
  );
}
