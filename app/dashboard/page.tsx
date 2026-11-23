import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ padding: "48px 16px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36 }}>Dashboard</h1>
      <p>Kelola undangan digital SAKAWITARA.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn" href="/dashboard/undangan">Daftar Undangan</Link>
        <Link className="btn btn-ghost" href="/contoh">Lihat Katalog Tema</Link>
      </div>
    </main>
  );
}
