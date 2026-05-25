import { Minus, Plus, Ticket } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { TICKET_TIERS } from '@/lib/constants';
import { TicketType } from '@/lib/types';

interface QuantitySelectorProps {
  tierId: TicketType;
  quantity: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({ tierId, quantity, onChange }: QuantitySelectorProps) {
  const tier = TICKET_TIERS.find(t => t.id === tierId);
  
  if (!tier) return null;

  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < 10) onChange(quantity + 1);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Tier Info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-dark-200 flex items-center justify-center text-2xl border border-white/5">
            {tier.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: tier.color }}>{tier.name} Ticket</h3>
            <p className="text-sm text-zinc-400">{formatNaira(tier.price)} each</p>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-4 bg-dark-200 rounded-full p-2 border border-white/5 w-full sm:w-auto justify-center">
          <button 
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-bold text-lg font-[family-name:var(--font-poppins)]">
            {quantity}
          </span>
          <button 
            onClick={handleIncrement}
            disabled={quantity >= 10}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Total Preview */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        <span className="text-zinc-400 font-medium">Subtotal</span>
        <span className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-white">
          {formatNaira(tier.price * quantity)}
        </span>
      </div>
    </div>
  );
}
