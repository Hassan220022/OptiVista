-- Create categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  gender text check (gender in ('male', 'female', 'unisex')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.categories enable row level security;

-- Trigger for updated_at
create trigger handle_updated_at before update on public.categories
  for each row execute procedure moddatetime (updated_at);
