'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { TicketTier } from '@/lib/types';

interface TicketTierCardProps {
  tier: TicketTier;
  index: number;
  featured?: boolean;
}

export default function TicketTierCard({ tier, index, featured }: TicketTierCardProps) {
  const isGoldOrAbove = ['GOLD', 'DIAMOND'].includes(tier.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group"
    >
      {/* Featured label */}
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-gold to-gold-dark text-black text-[10px] font-bold uppercase px-4 py-1 rounded-full tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 ${
          featured
            ? 'glass-gold glow-gold-strong'
            : 'glass-card'
        }`}
      >
        {/* Top gradient accent */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`,
          }}
        />

        <div className="p-6 sm:p-8 flex flex-col h-full">
          {/* Icon & Name */}
          <div className="text-center mb-6">
            <span className="text-4xl mb-3 block">{tier.icon}</span>
            <h3
              className="text-xl font-bold font-[family-name:var(--font-poppins)]"
              style={{ color: tier.color }}
            >
              {tier.name}
            </h3>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <p className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-poppins)]">
              {formatNaira(tier.price)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">per ticket</p>
          </div>

          {/* Benefits */}
          <ul className="space-y-3 mb-8 flex-grow">
            {tier.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: tier.color }}
                />
                {benefit}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href={`/tickets?tier=${tier.id}`}
            className={`w-full py-3 rounded-full text-center font-semibold text-sm transition-all duration-300 block ${
              isGoldOrAbove
                ? 'btn-gold'
                : 'btn-outline-gold'
            }`}
          >
            Get {tier.name} Ticket
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
