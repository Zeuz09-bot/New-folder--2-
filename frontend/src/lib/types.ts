// ──────────────────────────────────────────────
// ILEYA FEST — TypeScript Types
// ──────────────────────────────────────────────

export type TicketType = 'REGULAR' | 'VIP' | 'VVIP' | 'SILVER' | 'GOLD' | 'DIAMOND';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Ticket {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  ticket_type: TicketType;
  ticket_quantity: number;
  amount_paid: number;
  payment_proof_url: string | null;
  payment_status: PaymentStatus;
  payment_date: string | null;
  rejection_reason: string;
  ticket_code: string;
  verification_token: string;
  qr_code_url: string | null;
  is_checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketTier {
  id: TicketType;
  name: string;
  price: number;
  currency: string;
  benefits: string[];
  color: string;
  gradient: string;
  icon: string;
}

export interface DashboardStats {
  total_tickets: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  checked_in_count: number;
  total_revenue: number;
  revenue_by_tier: Record<string, { revenue: number; count: number }>;
}

export interface PurchaseFormData {
  full_name: string;
  email: string;
  phone_number: string;
  ticket_type: TicketType;
  ticket_quantity: number;
}

export interface ScanResult {
  valid: boolean;
  status: 'VALID' | 'INVALID' | 'ALREADY_USED' | 'UNPAID';
  message: string;
  ticket?: Ticket;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
