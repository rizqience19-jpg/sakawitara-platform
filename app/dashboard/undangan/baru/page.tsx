import Link from "next/link";

export default function UndanganBaruPage() {
  return (
    <main style={{ padding: "48px 16px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36 }}>Buat Undangan</h1>
      <p>Formulir pembuatan undangan (pilih tema, data mempelai, acara, foto) belum dibuat.</p>
      <Link className="btn btn-ghost" href="/contoh">Pilih dari Katalog Tema</Link>
    </main>
  );
}
