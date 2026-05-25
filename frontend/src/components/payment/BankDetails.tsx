import { Copy, Check, Building2 } from 'lucide-react';
import { useState } from 'react';
import { BANK_DETAILS } from '@/lib/constants';

export default function BankDetails() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/5 rounded-full blur-[30px]" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gold" />
          </div>
          <h3 className="text-lg font-bold text-white font-[family-name:var(--font-poppins)]">
            Bank Transfer Details
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Bank Name</p>
            <p className="text-white font-medium">{BANK_DETAILS.bankName}</p>
          </div>
          
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Account Number</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold font-[family-name:var(--font-poppins)] tracking-wider text-gold">
                {BANK_DETAILS.accountNumber}
              </p>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                title="Copy account number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Account Name</p>
            <p className="text-white font-medium">{BANK_DETAILS.accountName}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-300 leading-relaxed">
            <strong className="text-blue-400 font-semibold block mb-1">Important:</strong>
            {BANK_DETAILS.note}
          </p>
        </div>
      </div>
    </div>
  );
}
