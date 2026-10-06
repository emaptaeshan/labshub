-- Run once in Supabase → SQL editor.
-- 1. One row holds the whole Hub state. Signed-in users can read and write it.
create table if not exists hub (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table hub enable row level security;
create policy "team can read hub" on hub for select to authenticated using (true);
create policy "team can write hub" on hub for insert to authenticated with check (true);
create policy "team can update hub" on hub for update to authenticated using (true);

-- 2. Public requests from /raise. Anyone can insert; only signed-in users can read.
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  data jsonb not null,
  imported boolean default false
);
alter table requests enable row level security;
create policy "anyone can raise" on requests for insert to anon, authenticated with check (true);
create policy "team can read requests" on requests for select to authenticated using (true);
create policy "team can mark imported" on requests for update to authenticated using (true);

-- 3. Live updates between browsers (optional but recommended)
alter publication supabase_realtime add table hub;
