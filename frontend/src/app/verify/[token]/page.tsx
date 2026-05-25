'use client';

import { useEffect, useState, use } from 'react';
import { Ticket } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Ticket as TicketIcon } from 'lucide-react';
import Header from '@/components/ui/Header';

export default function TicketVerificationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    valid: boolean;
    status: 'VALID' | 'INVALID' | 'ALREADY_USED' | 'UNPAID';
    message: string;
    ticket?: Ticket;
  } | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/tickets/verify/${token}`);
        const data = await res.json();
        setResult(data);
      } catch (err) {
        setResult({
          valid: false,
          status: 'INVALID',
          message: 'An error occurred while verifying the ticket. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
        <p className="text-zinc-500 font-medium animate-pulse">Verifying Ticket...</p>
      </div>
    );
  }

  const getStatusConfig = () => {
    if (!result) return { bg: 'bg-zinc-900', icon: null, title: 'Error' };

    switch (result.status) {
      case 'VALID':
        return {
          bg: 'bg-emerald-950/30',
          border: 'border-emerald-500/20',
          text: 'text-emerald-500',
          icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" />,
          title: 'Valid Ticket',
        };
      case 'ALREADY_USED':
        return {
          bg: 'bg-yellow-950/30',
          border: 'border-yellow-500/20',
          text: 'text-yellow-500',
          icon: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
          title: 'Already Checked In',
        };
      case 'UNPAID':
        return {
          bg: 'bg-red-950/30',
          border: 'border-red-500/20',
          text: 'text-red-500',
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Not Approved',
        };
      case 'INVALID':
      default:
        return {
          bg: 'bg-red-950/30',
          border: 'border-red-500/20',
          text: 'text-red-500',
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Invalid Ticket',
        };
    }
  };

  const config = getStatusConfig();
  const t = result?.ticket;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className={`w-full max-w-md rounded-3xl border ${config.border} ${config.bg} p-8 relative overflow-hidden backdrop-blur-xl`}>
          
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="mb-6">{config.icon}</div>
            <h1 className={`text-2xl font-bold font-[family-name:var(--font-poppins)] mb-2 ${config.text}`}>
              {config.title}
            </h1>
            <p className="text-zinc-300">{result?.message}</p>
          </div>

          {t && (
            <div className="relative z-10 space-y-4">
              <div className="h-px bg-white/10 w-full mb-6" />
              
              <div className="bg-black/40 rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <TicketIcon className="w-5 h-5 text-gold" />
                  <span className="font-bold font-[family-name:var(--font-poppins)] text-lg text-white">
                    {t.ticket_code}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-zinc-500 uppercase">Attendee</span>
                    <p className="font-medium text-white">{t.full_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-zinc-500 uppercase">Ticket Tier</span>
                      <p className="font-medium text-white">{t.ticket_type}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 uppercase">Quantity</span>
                      <p className="font-medium text-white">{t.ticket_quantity}</p>
                    </div>
                  </div>

                  {t.is_checked_in && t.checked_in_at && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-xs text-zinc-500 uppercase">Checked In At</span>
                      <p className="font-medium text-yellow-400">
                        {formatDateTime(t.checked_in_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {result?.status === 'VALID' && (
                <div className="flex items-center justify-center gap-2 mt-6 text-emerald-500/80 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Ready for admission
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
