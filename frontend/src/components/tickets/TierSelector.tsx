import { motion } from 'framer-motion';
import { TICKET_TIERS } from '@/lib/constants';
import { TicketType } from '@/lib/types';
import { formatNaira } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TierSelectorProps {
  selected: TicketType | null;
  onSelect: (tier: TicketType) => void;
}

export default function TierSelector({ selected, onSelect }: TierSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-poppins)] text-white mb-6">
        Select Ticket Tier
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {TICKET_TIERS.map((tier, i) => {
          const isSelected = selected === tier.id;
          
          return (
            <motion.button
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(tier.id as TicketType)}
              className={`relative w-full text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 border ${
                isSelected 
                  ? 'bg-gradient-to-br from-gold/10 to-transparent border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                  : 'glass hover:bg-white/5 border-white/5 hover:border-gold/30'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">{tier.icon}</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: tier.color }}>
                      {tier.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {tier.benefits[0]} {tier.benefits.length > 1 && `+ ${tier.benefits.length - 1} more`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-white font-[family-name:var(--font-poppins)]">
                    {formatNaira(tier.price)}
                  </p>
                </div>
              </div>

              {isSelected && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gold/20"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tier.benefits.map(benefit => (
                      <li key={benefit} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                        <Check className="w-3 h-3 text-gold" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
