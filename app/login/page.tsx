"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Gunungan from "@/app/components/Gunungan";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email atau kata sandi salah.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main style={{ display: "grid", placeItems: "center" }}>
      <form className="card" onSubmit={onSubmit} style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Gunungan size={64} />
        <p className="eyebrow" style={{ marginTop: 16 }}>Sakawitara</p>
        <h2>Masuk Admin</h2>
        <div className="field" style={{ textAlign: "left" }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field" style={{ textAlign: "left" }}>
          <label htmlFor="password">Kata sandi</label>
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
