-- Create feedback table
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  type text check (type in ('AR_accuracy', 'UX', 'performance', 'other')),
  rating integer check (rating >= 1 and rating <= 5),
  message text,
  device_info jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.feedback enable row level security;
