-- Jalankan di Supabase > SQL Editor (sekali saja)
create table if not exists satu_data (
  k text primary key,
  v jsonb not null,
  updated_at timestamptz default now()
);

alter table satu_data enable row level security;

create policy "akses_satu" on satu_data
  for all to anon using (true) with check (true);

grant select, insert, update, delete on satu_data to anon;
