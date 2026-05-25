import { motion } from 'framer-motion';
import { CheckCircle2, Ticket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SuccessStateProps {
  ticketCode: string;
}

export default function SuccessState({ ticketCode }: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-poppins)] text-white mb-4">
          Payment Proof Submitted
        </h2>
        
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Thank you! We've received your payment proof. Our team will verify the transfer and approve your ticket shortly.
        </p>

        <div className="bg-dark-200 border border-white/5 rounded-xl p-6 w-full max-w-sm mb-10">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Your Ticket Reference</p>
          <div className="flex items-center justify-center gap-2">
            <Ticket className="w-5 h-5 text-gold" />
            <p className="text-xl font-bold font-[family-name:var(--font-poppins)] text-white tracking-wider">
              {ticketCode}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          Return to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
