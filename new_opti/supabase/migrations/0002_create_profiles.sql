-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  phone_number text,
  gender text check (gender in ('male', 'female', 'other')),
  pd_value_mm numeric(5,2),
  preferred_language text default 'en',
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create trigger for updated_at
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure moddatetime (updated_at);
