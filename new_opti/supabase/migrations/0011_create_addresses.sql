-- Create addresses table for user shipping/billing addresses
create table public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text default 'Home',
  full_name text not null,
  phone text,
  street_address text not null,
  street_address_2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null default 'US',
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index addresses_user_id_idx on public.addresses(user_id);
create index addresses_is_default_idx on public.addresses(is_default);

-- Enable RLS
alter table public.addresses enable row level security;

-- RLS policies
create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can create own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- Trigger for updated_at
create trigger handle_addresses_updated_at before update on public.addresses
  for each row execute procedure moddatetime (updated_at);

-- Function to ensure only one default address per user
create or replace function ensure_single_default_address()
returns trigger as $$
begin
  if NEW.is_default = true then
    update public.addresses
    set is_default = false
    where user_id = NEW.user_id and id != NEW.id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger ensure_single_default_address_trigger
  before insert or update on public.addresses
  for each row execute function ensure_single_default_address();
