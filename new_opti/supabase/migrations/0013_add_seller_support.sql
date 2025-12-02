-- Add seller role to profiles
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;
  
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'seller'));

-- Add seller profile fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS store_name TEXT,
  ADD COLUMN IF NOT EXISTS store_description TEXT,
  ADD COLUMN IF NOT EXISTS store_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS is_seller_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS seller_approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS seller_commission_rate NUMERIC(5,2) DEFAULT 10.00;

-- Add seller_id to products (for multi-seller marketplace)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id);

-- Create index for seller products
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON public.products(seller_id);

-- Create seller_stats table for analytics
CREATE TABLE IF NOT EXISTS public.seller_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_orders INTEGER DEFAULT 0,
  total_revenue_cents BIGINT DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, date)
);

-- Create seller_payouts table
CREATE TABLE IF NOT EXISTS public.seller_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents BIGINT NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payout_method TEXT,
  payout_details JSONB,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.seller_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_stats
CREATE POLICY "Sellers can view own stats" ON public.seller_stats
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Admins can view all stats" ON public.seller_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for seller_payouts
CREATE POLICY "Sellers can view own payouts" ON public.seller_payouts
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Admins can manage all payouts" ON public.seller_payouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update products RLS for sellers
DROP POLICY IF EXISTS "Sellers can manage own products" ON public.products;
CREATE POLICY "Sellers can manage own products" ON public.products
  FOR ALL USING (
    seller_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for seller_payouts updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.seller_payouts
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
