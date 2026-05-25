// ──────────────────────────────────────────────
// ILEYA FEST — Constants & Configuration
// ──────────────────────────────────────────────

import { TicketTier } from './types';

// ── Event Details ──
export const EVENT = {
  name: 'ILEYA FEST with SAMAD',
  tagline: 'The Biggest Celebration of the Year',
  date: '2026-05-28',
  dateDisplay: 'Thursday, May 28th, 2026',
  time: '7:00 PM',
  timeEnd: 'Till Dawn',
  venue: 'GT Hotel and Event Center',
  address: 'Agala Road, Ikire, Osun State',
  description:
    'Experience the ultimate celebration at ILEYA FEST — a night of incredible music, electrifying performances, and premium entertainment. Featuring SAMAD and an all-star lineup of artists, DJs, and hypemen.',
  phone1: '08123090135',
  phone2: '09064283198',
} as const;

// ── Performers ──
export const PERFORMERS = {
  headliner: 'SAMAD',
  guestArtists: [
    'Femzy Nanah',
    'Ibile Olorin',
    'Flame',
    'Femzy',
    'Dappy G',
    'Ibrolee',
    'Lil Marthex',
  ],
  djs: ['DJ Rolex', 'DJ Tizzy'],
  hypemen: [
    'Hypeman Gbasky (ODG)',
    'Hypeman Semighty',
    'Hypeman Zaddy',
    'Hypeman Kay',
    'Hypeman MTN',
  ],
  drummer: 'Olashy Drumz',
} as const;

// ── Ticket Tiers ──
export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'REGULAR',
    name: 'Regular',
    price: 3000,
    currency: 'NGN',
    benefits: ['General access', 'Standing area'],
    color: '#8B8B8B',
    gradient: 'from-zinc-600 to-zinc-800',
    icon: '🎫',
  },
  {
    id: 'VVIP',
    name: 'VVIP',
    price: 60000,
    currency: 'NGN',
    benefits: ['Priority seating', 'VIP access', 'Complimentary drinks'],
    color: '#C0392B',
    gradient: 'from-red-700 to-red-900',
    icon: '🌟',
  },
  {
    id: 'SILVER',
    name: 'Silver',
    price: 150000,
    currency: 'NGN',
    benefits: ['Premium seating', 'Exclusive access', 'VIP lounge entry', 'Premium drinks'],
    color: '#BDC3C7',
    gradient: 'from-slate-400 to-slate-600',
    icon: '🥈',
  },
  {
    id: 'GOLD',
    name: 'Gold',
    price: 300000,
    currency: 'NGN',
    benefits: ['Front-row seating', 'Backstage access', 'Meet & greet', 'Full bar access', 'VIP parking'],
    color: '#D4AF37',
    gradient: 'from-yellow-500 to-yellow-700',
    icon: '🥇',
  },
  {
    id: 'DIAMOND',
    name: 'Diamond',
    price: 500000,
    currency: 'NGN',
    benefits: [
      'Luxury VIP experience',
      'Private lounge access',
      'Exclusive merchandise',
      'Personal attendant',
      'Premium bottle service',
      'Photo opportunity with artists',
    ],
    color: '#A3E4D7',
    gradient: 'from-cyan-400 to-blue-600',
    icon: '💎',
  },
];

// ── Bank Transfer Details ──
export const BANK_DETAILS = {
  bankName: 'GTBank (Guaranty Trust Bank)',
  accountNumber: '0123456789',
  accountName: 'ILEYA FEST ENTERTAINMENT',
  note: 'Please use your full name as the transfer reference/narration.',
} as const;

// ── FAQ ──
export const FAQ_ITEMS = [
  {
    question: 'How do I purchase a ticket?',
    answer:
      'Select your preferred ticket tier, fill in your details, then transfer the exact amount to our bank account. Upload your payment proof and wait for admin confirmation. Your QR-coded ticket will be emailed to you once approved.',
  },
  {
    question: 'How long does payment verification take?',
    answer:
      'Payment verification typically takes 1–6 hours during business hours. You will receive your ticket via email once your payment has been confirmed.',
  },
  {
    question: 'What should I bring to the event?',
    answer:
      'Bring your QR code ticket (printed or on your phone). A valid ID may be required for premium tiers. The QR code will be scanned at the venue entrance.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Refund requests must be made at least 48 hours before the event. Please contact us at the numbers provided below. A processing fee may apply.',
  },
  {
    question: 'Is there parking available?',
    answer:
      'Yes, GT Hotel and Event Center has parking available. VIP and premium ticket holders get priority parking access.',
  },
  {
    question: 'Can I upgrade my ticket tier?',
    answer:
      'Ticket upgrades are available before the event. Contact us to arrange the difference payment and receive a new ticket.',
  },
];

// ── Tier price lookup ──
export const TIER_PRICES: Record<string, number> = {
  REGULAR: 3000,
  VVIP: 60000,
  SILVER: 150000,
  GOLD: 300000,
  DIAMOND: 500000,
};
