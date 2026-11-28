import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/types";

type Row = {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  akad_at: string;
  rsvps: { count: number }[];
};

export default async function UndanganListPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("id, slug, groom_name, bride_name, akad_at, rsvps(count)")
    .order("akad_at", { ascending: true });

  const rows = (data ?? []) as Row[];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Undangan</h1>
        <Link className="btn" href="/dashboard/undangan/baru">+ Buat Undangan</Link>
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        {error && <p className="error">Gagal memuat data: {error.message}</p>}
        {!error && rows.length === 0 && <p className="muted">Belum ada undangan. Buat yang pertama!</p>}
        {rows.length > 0 && (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr><th>Mempelai</th><th>Akad</th><th>RSVP</th><th>Tautan</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.groom_name} &amp; {r.bride_name}</td>
                    <td>{formatTanggal(r.akad_at)}</td>
                    <td>{r.rsvps?.[0]?.count ?? 0}</td>
                    <td><Link href={`/u/${r.slug}`} target="_blank">/u/{r.slug}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="muted" style={{ fontSize: "0.9rem", marginTop: 16 }}>
        Tip: tambahkan <code>?to=Nama+Tamu</code> di akhir tautan agar nama tamu tampil di sampul undangan.
      </p>
    </>
  );
}
