create extension if not exists pgcrypto;

create table if not exists public.production_records (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  eggs integer not null default 0,
  damaged integer not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.feed_records (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  kg numeric not null default 0,
  cost_per_kg numeric not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.farm_tasks (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  priority text not null default 'media',
  status text not null default 'pending',
  source text not null default 'Manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.calculator_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_eggs numeric not null default 35,
  egg_price numeric not null default 0.58,
  tray_size numeric not null default 30,
  month_days numeric not null default 30,
  feed_cost numeric not null default 330,
  other_costs numeric not null default 90,
  flock_size numeric not null default 120,
  loss_rate numeric not null default 3,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  text text not null,
  media_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.livestock_modules (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text,
  breed text,
  age text,
  weight text,
  status text,
  status_type text,
  emoji text,
  code text,
  flock_size numeric default 0,
  efficiency text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.production_records enable row level security;
alter table public.feed_records enable row level security;
alter table public.farm_tasks enable row level security;
alter table public.calculator_settings enable row level security;
alter table public.ai_messages enable row level security;
alter table public.livestock_modules enable row level security;

create policy "users read own production" on public.production_records
  for select using (auth.uid() = user_id);
create policy "users insert own production" on public.production_records
  for insert with check (auth.uid() = user_id);
create policy "users update own production" on public.production_records
  for update using (auth.uid() = user_id);
create policy "users delete own production" on public.production_records
  for delete using (auth.uid() = user_id);

create policy "users read own feed" on public.feed_records
  for select using (auth.uid() = user_id);
create policy "users insert own feed" on public.feed_records
  for insert with check (auth.uid() = user_id);
create policy "users update own feed" on public.feed_records
  for update using (auth.uid() = user_id);
create policy "users delete own feed" on public.feed_records
  for delete using (auth.uid() = user_id);

create policy "users read own tasks" on public.farm_tasks
  for select using (auth.uid() = user_id);
create policy "users insert own tasks" on public.farm_tasks
  for insert with check (auth.uid() = user_id);
create policy "users update own tasks" on public.farm_tasks
  for update using (auth.uid() = user_id);
create policy "users delete own tasks" on public.farm_tasks
  for delete using (auth.uid() = user_id);

create policy "users read own calculator" on public.calculator_settings
  for select using (auth.uid() = user_id);
create policy "users insert own calculator" on public.calculator_settings
  for insert with check (auth.uid() = user_id);
create policy "users update own calculator" on public.calculator_settings
  for update using (auth.uid() = user_id);

create policy "users read own ai messages" on public.ai_messages
  for select using (auth.uid() = user_id);
create policy "users insert own ai messages" on public.ai_messages
  for insert with check (auth.uid() = user_id);

create policy "users read own livestock modules" on public.livestock_modules
  for select using (auth.uid() = user_id);
create policy "users insert own livestock modules" on public.livestock_modules
  for insert with check (auth.uid() = user_id);
create policy "users update own livestock modules" on public.livestock_modules
  for update using (auth.uid() = user_id);
create policy "users delete own livestock modules" on public.livestock_modules
  for delete using (auth.uid() = user_id);
