import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_INVITATION, DEMO_RSVPS } from "@/lib/demo";
import type { Invitation, Rsvp } from "@/lib/types";
import InvitationView from "./InvitationView";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
};

async function load(slug: string): Promise<{ invitation: Invitation; rsvps: Rsvp[] } | null> {
  if (slug === DEMO_INVITATION.slug) return { invitation: DEMO_INVITATION, rsvps: DEMO_RSVPS };

  const supabase = await createClient();
  const { data: invitation } = await supabase.from("invitations").select("*").eq("slug", slug).maybeSingle();
  if (!invitation) return null;

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return { invitation: invitation as Invitation, rsvps: (rsvps ?? []) as Rsvp[] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Undangan tidak ditemukan" };
  const { groom_name, bride_name } = data.invitation;
  return {
    title: `Undangan Pernikahan ${groom_name} & ${bride_name}`,
    description: `Dengan penuh rasa syukur, kami mengundang Anda di hari bahagia ${groom_name} & ${bride_name}.`,
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { to } = await searchParams;
  const data = await load(slug);
  if (!data) notFound();

  const guest = to?.trim().slice(0, 80) || null;
  const isDemo = slug === DEMO_INVITATION.slug;

  return <InvitationView invitation={data.invitation} initialRsvps={data.rsvps} guest={guest} isDemo={isDemo} />;
}
