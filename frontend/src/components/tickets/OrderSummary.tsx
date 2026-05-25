import { formatNaira } from '@/lib/utils';
import { PurchaseFormData } from '@/lib/types';
import { TICKET_TIERS } from '@/lib/constants';

interface OrderSummaryProps {
  data: PurchaseFormData;
}

export default function OrderSummary({ data }: OrderSummaryProps) {
  const tier = TICKET_TIERS.find(t => t.id === data.ticket_type);
  
  if (!tier) return null;
  
  const subtotal = tier.price * data.ticket_quantity;

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-poppins)] text-white mb-6">
        Review Your Order
      </h2>
      
      <div className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-[20px]" />

        <div className="space-y-6 relative z-10">
          
          {/* Ticket Details */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Ticket Details</h3>
            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tier.icon}</span>
                <div>
                  <p className="font-bold text-white">{tier.name} Ticket</p>
                  <p className="text-sm text-zinc-400">Qty: {data.ticket_quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{formatNaira(subtotal)}</p>
                <p className="text-xs text-zinc-500">{formatNaira(tier.price)} each</p>
              </div>
            </div>
          </div>

          {/* Attendee Details */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Attendee Information</h3>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-zinc-500 text-sm">Name</span>
                <span className="text-white text-sm font-medium col-span-2">{data.full_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-zinc-500 text-sm">Email</span>
                <span className="text-white text-sm font-medium col-span-2 truncate" title={data.email}>{data.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-zinc-500 text-sm">Phone</span>
                <span className="text-white text-sm font-medium col-span-2">{data.phone_number}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total to pay</p>
              <p className="text-xs text-gold mt-1">Via Bank Transfer</p>
            </div>
            <p className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-white">
              {formatNaira(subtotal)}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
