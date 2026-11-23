export type Invitation = {
  id: string;
  slug: string;
  groom_name: string;
  groom_full_name: string;
  groom_parents: string | null;
  bride_name: string;
  bride_full_name: string;
  bride_parents: string | null;
  akad_at: string;
  akad_venue: string;
  akad_address: string | null;
  resepsi_at: string | null;
  resepsi_venue: string | null;
  resepsi_address: string | null;
  maps_url: string | null;
  quote: string | null;
  created_at: string;
};

export type Rsvp = {
  id: string;
  invitation_id: string;
  name: string;
  attendance: "hadir" | "tidak" | "ragu";
  guests: number;
  message: string | null;
  created_at: string;
};

const TZ = "Asia/Jakarta";

export function formatTanggal(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatJam(iso: string) {
  return (
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TZ,
    }).format(new Date(iso)) + " WIB"
  );
}
