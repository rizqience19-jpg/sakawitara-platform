-- Skema database Sakawitara. Jalankan di Supabase SQL Editor.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  groom_name text not null,
  groom_full_name text not null,
  groom_parents text,
  bride_name text not null,
  bride_full_name text not null,
  bride_parents text,
  akad_at timestamptz not null,
  akad_venue text not null,
  akad_address text,
  resepsi_at timestamptz,
  resepsi_venue text,
  resepsi_address text,
  maps_url text,
  quote text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  attendance text not null check (attendance in ('hadir', 'tidak', 'ragu')),
  guests int not null default 1 check (guests between 0 and 10),
  message text check (char_length(message) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists rsvps_invitation_idx on public.rsvps (invitation_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.admins enable row level security;
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;

-- Admin hanya bisa melihat barisnya sendiri (dipakai dashboard untuk cek akses).
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select using (user_id = auth.uid());

-- Undangan bisa dibaca siapa saja (halaman publik), dikelola hanya oleh admin.
drop policy if exists "invitations public read" on public.invitations;
create policy "invitations public read" on public.invitations
  for select using (true);

drop policy if exists "invitations admin write" on public.invitations;
create policy "invitations admin write" on public.invitations
  for all using (public.is_admin()) with check (public.is_admin());

-- Tamu boleh mengirim RSVP & ucapan, dan ucapan tampil untuk semua tamu.
drop policy if exists "rsvps public read" on public.rsvps;
create policy "rsvps public read" on public.rsvps
  for select using (true);

drop policy if exists "rsvps public insert" on public.rsvps;
create policy "rsvps public insert" on public.rsvps
  for insert with check (true);

drop policy if exists "rsvps admin delete" on public.rsvps;
create policy "rsvps admin delete" on public.rsvps
  for delete using (public.is_admin());

-- Setelah membuat user di Authentication, jadikan admin:
-- insert into public.admins (user_id) values ('<uuid-user>');
