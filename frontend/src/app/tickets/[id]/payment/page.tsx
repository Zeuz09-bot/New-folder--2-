'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BankDetails from '@/components/payment/BankDetails';
import FileUpload from '@/components/payment/FileUpload';
import SuccessState from '@/components/payment/SuccessState';
import { ShieldAlert, Receipt } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { Ticket } from '@/lib/types';

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch ticket details to verify it exists and is pending
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}/status`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Ticket not found');
        
        if (data.data.payment_status !== 'PENDING') {
          throw new Error(`This ticket is already ${data.data.payment_status.toLowerCase()}. Cannot upload payment proof.`);
        }

        setTicket(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('payment_proof', file);

    try {
      const res = await fetch(`/api/tickets/${id}/upload-proof`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to upload payment proof');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-24 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {error && !success && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && ticket ? (
            <SuccessState ticketCode={ticket.ticket_code} />
          ) : ticket ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Left Column: Instructions & Bank Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-poppins)] text-white mb-2">
                    Complete Your Payment
                  </h1>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Please transfer the exact amount below to our bank account. Once done, upload a screenshot or PDF of the receipt.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                  <p className="text-xs text-gold uppercase tracking-wider mb-1 font-semibold">Amount to Pay</p>
                  <p className="text-4xl font-bold font-[family-name:var(--font-poppins)] text-white">
                    {formatNaira(ticket.amount_paid)}
                  </p>
                </div>

                <BankDetails />
              </div>

              {/* Right Column: File Upload */}
              <div className="lg:col-span-3">
                <div className="bg-dark-100 border border-white/5 rounded-3xl p-6 sm:p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold font-[family-name:var(--font-poppins)] text-white">
                      Upload Receipt
                    </h2>
                  </div>
                  
                  <FileUpload onUpload={handleUpload} loading={uploading} />
                  
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <h3 className="text-sm font-semibold text-white mb-2">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-zinc-400">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        Admin will verify your payment
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        You will receive an email with your QR ticket
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        Present the QR code at the venue
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">Ticket Not Found</h2>
              <button onClick={() => router.push('/')} className="text-gold hover:underline">
                Return to Home
              </button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
