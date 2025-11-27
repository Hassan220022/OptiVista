-- Create ar_assets table
create table public.ar_assets (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  supabase_path_ar_model text not null,
  supabase_path_texture text,
  scale_factor numeric(6,3) default 1.0,
  offset_x numeric(6,3) default 0.0,
  offset_y numeric(6,3) default 0.0,
  offset_z numeric(6,3) default 0.0,
  platform_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.ar_assets enable row level security;

-- Trigger for updated_at
create trigger handle_updated_at before update on public.ar_assets
  for each row execute procedure moddatetime (updated_at);
