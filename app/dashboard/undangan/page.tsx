import Link from "next/link";

export default function UndanganPage() {
  return (
    <main style={{ padding: "48px 16px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36 }}>Undangan</h1>
      <p>Belum ada undangan. Data akan diambil dari Supabase.</p>
      <Link className="btn" href="/dashboard/undangan/baru">+ Buat Undangan</Link>
    </main>
  );
}
