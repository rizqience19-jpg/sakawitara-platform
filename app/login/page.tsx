"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("Email atau kata sandi salah.");
    else router.push("/dashboard");
  };

  return (
    <main style={{ display: "grid", placeItems: "center", padding: 16 }}>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, width: "min(100%, 340px)" }}>
        <h1 style={{ fontSize: 32, textAlign: "center" }}>Masuk Admin</h1>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
        <input type="password" required placeholder="Kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} style={field} />
        {error && <p style={{ color: "#f08c7a", margin: 0 }}>{error}</p>}
        <button className="btn" type="submit" disabled={loading} style={{ border: 0, cursor: "pointer" }}>
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}

const field = { padding: "12px 14px", borderRadius: 10, border: "1px solid #5a4a38", background: "#1f1a15", color: "#f5efe6", fontSize: 15 };
