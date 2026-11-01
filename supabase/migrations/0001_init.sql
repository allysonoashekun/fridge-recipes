create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  time_minutes integer not null,
  ingredients_used jsonb not null,
  missing_ingredients jsonb not null,
  steps jsonb not null,
  created_at timestamptz not null default now()
);

create index recipes_user_created_idx on public.recipes (user_id, created_at desc);

create table public.pantry_staples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  items jsonb not null
);

create table public.api_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index api_usage_user_created_idx on public.api_usage (user_id, created_at desc);

alter table public.recipes enable row level security;
alter table public.pantry_staples enable row level security;
alter table public.api_usage enable row level security;

create policy "Own recipes" on public.recipes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Own pantry staples" on public.pantry_staples
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- api_usage is deliberately limited to select and insert: allowing update or
-- delete would let a client reset its own rate limit.
create policy "Read own usage" on public.api_usage
  for select to authenticated
  using (user_id = auth.uid());

create policy "Record own usage" on public.api_usage
  for insert to authenticated
  with check (user_id = auth.uid());

revoke all on public.recipes, public.pantry_staples, public.api_usage from anon, authenticated;
grant select, insert, update, delete on public.recipes, public.pantry_staples to authenticated;
grant select, insert on public.api_usage to authenticated;
