"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string };

// Input datetime-local tidak membawa zona waktu; anggap WIB.
function toWib(value: FormDataEntryValue | null) {
  const v = String(value ?? "").trim();
  return v ? `${v}:00+07:00` : null;
}

function text(fd: FormData, key: string) {
  const v = String(fd.get(key) ?? "").trim();
  return v || null;
}

export async function createInvitation(_prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir, silakan masuk lagi." };

  const slug = String(fd.get("slug") ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]{3,60}$/.test(slug)) {
    return { error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung (3–60 karakter)." };
  }

  const payload = {
    slug,
    groom_name: text(fd, "groom_name"),
    groom_full_name: text(fd, "groom_full_name"),
    groom_parents: text(fd, "groom_parents"),
    bride_name: text(fd, "bride_name"),
    bride_full_name: text(fd, "bride_full_name"),
    bride_parents: text(fd, "bride_parents"),
    akad_at: toWib(fd.get("akad_at")),
    akad_venue: text(fd, "akad_venue"),
    akad_address: text(fd, "akad_address"),
    resepsi_at: toWib(fd.get("resepsi_at")),
    resepsi_venue: text(fd, "resepsi_venue"),
    resepsi_address: text(fd, "resepsi_address"),
    maps_url: text(fd, "maps_url"),
    quote: text(fd, "quote"),
    created_by: user.id,
  };

  if (!payload.groom_name || !payload.groom_full_name || !payload.bride_name || !payload.bride_full_name || !payload.akad_at || !payload.akad_venue) {
    return { error: "Lengkapi data mempelai dan akad nikah." };
  }

  const { error } = await supabase.from("invitations").insert(payload);
  if (error) {
    if (error.code === "23505") return { error: "Slug sudah dipakai, pilih yang lain." };
    return { error: `Gagal menyimpan: ${error.message}` };
  }

  redirect("/dashboard/undangan");
}
