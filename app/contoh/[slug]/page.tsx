import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Invitation from "@/components/invitation/Invitation";
import { getTemplate, sampleWedding, templates } from "@/components/invitation/data";

type Params = { slug: string };
type Search = { to?: string | string[] };

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  return {
    title: `${sampleWedding.groom.nick} & ${sampleWedding.bride.nick} | ${t?.name ?? "Undangan"}`,
    description: `Contoh undangan digital tema ${t?.name ?? ""} — SAKAWITARA`,
  };
}

export default async function ContohUndangan({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { slug } = await params;
  const { to } = await searchParams;
  const template = getTemplate(slug);
  if (!template) notFound();

  const raw = Array.isArray(to) ? to[0] : to;
  const guest = raw?.trim().slice(0, 80) || "Tamu Undangan";

  return <Invitation template={template} wedding={sampleWedding} guest={guest} />;
}
