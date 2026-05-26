// ──────────────────────────────────────────────
// ILEYA FEST — Utility Functions
// ──────────────────────────────────────────────

/**
 * Format a number as Nigerian Naira currency.
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string into a human-readable format.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date string into a human-readable format with time.
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate a sequential ticket code: EVT-2026-XXXXXX
 */
export function generateTicketCode(lastNumber: number): string {
  const next = lastNumber + 1;
  return `EVT-2026-${next.toString().padStart(6, '0')}`;
}

/**
 * Get status badge color classes.
 */
export function getStatusColor(status: string): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'PENDING':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', dot: 'bg-yellow-500' };
    case 'APPROVED':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500' };
    case 'REJECTED':
      return { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500' };
    default:
      return { bg: 'bg-zinc-500/10', text: 'text-zinc-500', dot: 'bg-zinc-500' };
  }
}

/**
 * Get tier accent color.
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case 'REGULAR':
      return '#8B8B8B';
    case 'VIP':
      return '#9B59B6';
    case 'VVIP':
      return '#C0392B';
    case 'SILVER':
      return '#BDC3C7';
    case 'GOLD':
      return '#D4AF37';
    case 'DIAMOND':
      return '#60C0D0';
    default:
      return '#D4AF37';
  }
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate Nigerian phone number.
 */
export function isValidPhone(phone: string): boolean {
  return /^(\+234|0)[789]\d{9}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Calculate time remaining until the event.
 */
export function getTimeRemaining(targetDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} {
  const total = new Date(targetDate + 'T19:00:00+01:00').getTime() - Date.now();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    expired: false,
  };
}

/**
 * Clsx-like utility for conditional class names.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
