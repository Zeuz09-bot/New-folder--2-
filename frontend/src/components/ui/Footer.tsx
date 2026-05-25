import Link from 'next/link';
import { Ticket, Phone, MapPin, Clock } from 'lucide-react';
import { EVENT } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative bg-dark-100 border-t border-gold-100">
      {/* Gold accent line */}
      <div className="gold-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Ticket className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold font-[family-name:var(--font-poppins)]">
                <span className="gold-text">ILEYA</span>
                <span className="text-white ml-1">FEST</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              The biggest celebration of the year. Experience premium
              entertainment, live music, and unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Buy Tickets', href: '/tickets' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Contact', href: '/#contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 hover:text-gold transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Info */}
          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Event Details
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span>
                  {EVENT.dateDisplay}
                  <br />
                  {EVENT.time} — {EVENT.timeEnd}
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span>
                  {EVENT.venue}
                  <br />
                  {EVENT.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${EVENT.phone1}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  {EVENT.phone1}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${EVENT.phone2}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  {EVENT.phone2}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-divider mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © 2026 ILEYA FEST. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            GT Hotel and Event Center presents{' '}
            <span className="text-gold">{EVENT.name}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
