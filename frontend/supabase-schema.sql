-- ══════════════════════════════════════════════
-- ILEYA FEST — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ══════════════════════════════════════════════

-- ── Tickets Table ──
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('REGULAR', 'VVIP', 'SILVER', 'GOLD', 'DIAMOND')),
  ticket_quantity INTEGER NOT NULL DEFAULT 1 CHECK (ticket_quantity BETWEEN 1 AND 10),
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_proof_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  payment_date TIMESTAMPTZ,
  rejection_reason TEXT DEFAULT '',
  ticket_code TEXT UNIQUE NOT NULL,
  verification_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  qr_code_url TEXT,
  is_checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update updated_at trigger ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Indexes for performance ──
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_verification_token ON tickets(verification_token);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

-- ── Row Level Security ──
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Public: Anyone can insert a ticket (purchase)
CREATE POLICY "Anyone can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (true);

-- Public: Anyone can read their own ticket by ID (for status checks)
CREATE POLICY "Anyone can read tickets"
  ON tickets FOR SELECT
  USING (true);

-- Only service role can update tickets (admin operations via API routes)
-- The service_role key bypasses RLS automatically, so no explicit policy needed for admin updates.

-- ── Storage Buckets ──
-- Create these in the Supabase Dashboard → Storage:
-- 1. Bucket: "payment-proofs" (public: false)
-- 2. Bucket: "qr-codes" (public: true)

-- Storage policies for payment-proofs bucket:
-- Allow anyone to upload (INSERT):
-- CREATE POLICY "Anyone can upload payment proofs"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'payment-proofs');

-- Storage policies for qr-codes bucket:
-- Allow public read:
-- CREATE POLICY "Public read for QR codes"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'qr-codes');

-- ── Ticket Counter Sequence (for EVT-2026-XXXXXX) ──
CREATE SEQUENCE IF NOT EXISTS ticket_counter START 1;

-- Helper function to get next ticket code
CREATE OR REPLACE FUNCTION get_next_ticket_code()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  next_num := nextval('ticket_counter');
  RETURN 'EVT-2026-' || lpad(next_num::text, 6, '0');
END;
$$ LANGUAGE plpgsql;
