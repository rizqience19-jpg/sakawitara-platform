import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function logout() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/login");
  }

  return (
    <>
      <header className="dash-nav">
        <Link className="brand" href="/dashboard">SAKAWITARA</Link>
        <nav>
          <Link href="/dashboard">Ringkasan</Link>
          <Link href="/dashboard/undangan">Undangan</Link>
          <form action={logout}>
            <button className="btn btn-outline" type="submit" style={{ padding: "4px 16px" }}>Keluar</button>
          </form>
        </nav>
      </header>
      <main>
        <div className="dash-wrap">{children}</div>
      </main>
    </>
  );
}
