'use client';

import { useState } from 'react';
import QRScanner from '@/components/admin/QRScanner';
import { Ticket } from '@/lib/types';
import { formatNaira } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Scan, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ScanResultData {
  valid: boolean;
  status: 'VALID' | 'INVALID' | 'ALREADY_USED' | 'UNPAID';
  message: string;
  ticket?: Ticket;
}

export default function ScannerPage() {
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualToken, setManualToken] = useState('');

  const handleScan = async (decodedText: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: decodedText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        valid: false,
        status: 'INVALID',
        message: 'Network error or invalid QR code format.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      handleScan(manualToken.trim());
    }
  };

  const resetScanner = () => {
    setResult(null);
    setManualToken('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-white">
          Venue Check-In Scanner
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Scan attendee QR codes to verify and check them in.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scanner Section */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5">
            <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Scan className="w-4 h-4" /> Live Camera Scan
            </h2>
            <QRScanner onScanSuccess={handleScan} isProcessing={isProcessing} />
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Manual Entry
            </h2>
            <form onSubmit={handleManualSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="Enter ticket code or token..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="input-premium flex-1 rounded-xl px-4 py-2 text-sm"
              />
              <Button type="submit" disabled={!manualToken.trim() || isProcessing}>
                Verify
              </Button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col items-center justify-center min-h-[400px]">
          {!result ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scan className="w-10 h-10 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-300 mb-2">Ready to Scan</h3>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                Point the camera at a ticket QR code. The result will appear here.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  {result.status === 'VALID' && <CheckCircle2 className="w-16 h-16 text-emerald-500" />}
                  {result.status === 'ALREADY_USED' && <AlertTriangle className="w-16 h-16 text-yellow-500" />}
                  {(result.status === 'INVALID' || result.status === 'UNPAID') && <XCircle className="w-16 h-16 text-red-500" />}
                </div>
                
                <h3 className={`text-2xl font-bold font-[family-name:var(--font-poppins)] mb-2 ${
                  result.status === 'VALID' ? 'text-emerald-500' :
                  result.status === 'ALREADY_USED' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {result.status === 'VALID' ? 'ACCESS GRANTED' :
                   result.status === 'ALREADY_USED' ? 'ALREADY SCANNED' :
                   result.status === 'UNPAID' ? 'PAYMENT REQUIRED' : 'INVALID TICKET'}
                </h3>
                <p className="text-zinc-300">{result.message}</p>
              </div>

              {result.ticket && (
                <div className="bg-dark-100 rounded-2xl p-5 border border-white/5 flex-1 mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Attendee</p>
                      <p className="text-lg font-bold text-white">{result.ticket.full_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Ticket Code</p>
                      <p className="font-mono text-gold font-medium">{result.ticket.ticket_code}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-300 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-zinc-500 mb-1">Tier</p>
                      <p className="font-semibold text-white">{result.ticket.ticket_type}</p>
                    </div>
                    <div className="bg-dark-300 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-zinc-500 mb-1">Quantity</p>
                      <p className="font-semibold text-white">{result.ticket.ticket_quantity}</p>
                    </div>
                    <div className="bg-dark-300 rounded-xl p-3 border border-white/5 col-span-2">
                      <p className="text-xs text-zinc-500 mb-1">Amount</p>
                      <p className="font-semibold text-white">{formatNaira(result.ticket.amount_paid)}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                variant={result.status === 'VALID' ? 'gold' : 'outline'}
                className="w-full py-4 text-lg"
                onClick={resetScanner}
              >
                Scan Next Ticket
              </Button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
