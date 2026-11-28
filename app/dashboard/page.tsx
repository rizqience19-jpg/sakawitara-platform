import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: totalUndangan }, { count: totalRsvp }, { count: totalHadir }] = await Promise.all([
    supabase.from("invitations").select("id", { count: "exact", head: true }),
    supabase.from("rsvps").select("id", { count: "exact", head: true }),
    supabase.from("rsvps").select("id", { count: "exact", head: true }).eq("attendance", "hadir"),
  ]);

  return (
    <>
      <p className="eyebrow">Sugeng rawuh</p>
      <h1>Ringkasan</h1>
      <div className="stats">
        <div className="card"><div className="stat-num">{totalUndangan ?? 0}</div><div className="muted">Undangan</div></div>
        <div className="card"><div className="stat-num">{totalRsvp ?? 0}</div><div className="muted">RSVP masuk</div></div>
        <div className="card"><div className="stat-num">{totalHadir ?? 0}</div><div className="muted">Konfirmasi hadir</div></div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn" href="/dashboard/undangan/baru">+ Buat Undangan</Link>
        <Link className="btn btn-outline" href="/dashboard/undangan">Lihat Semua</Link>
      </div>
    </>
  );
}
