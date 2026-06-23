-- Star Badminton Club Dargai - Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  fathers_name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_players_player_code ON public.players(player_code);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON public.players(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_player_id ON public.payments(player_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_created_at ON public.investments(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read and write all club data
CREATE POLICY "Authenticated users can read players"
  ON public.players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert players"
  ON public.players FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete players"
  ON public.players FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payments"
  ON public.payments FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read investments"
  ON public.investments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert investments"
  ON public.investments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete investments"
  ON public.investments FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- HELPER VIEW (optional - for dashboard analytics)
-- ============================================================

CREATE OR REPLACE VIEW public.financial_summary AS
SELECT
  COALESCE((SELECT SUM(amount) FROM public.payments), 0) AS total_payments,
  COALESCE((SELECT SUM(amount) FROM public.investments), 0) AS total_investments,
  COALESCE((SELECT SUM(amount) FROM public.payments), 0)
    - COALESCE((SELECT SUM(amount) FROM public.investments), 0) AS current_balance;

GRANT SELECT ON public.financial_summary TO authenticated;
