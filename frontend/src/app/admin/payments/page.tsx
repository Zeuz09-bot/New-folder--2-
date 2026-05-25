'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatNaira, formatDateTime } from '@/lib/utils';
import { Ticket } from '@/lib/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Search, ShieldAlert, Check, X, FileImage, CreditCard } from 'lucide-react';

export default function PaymentApprovalsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/tickets?status=PENDING');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Filter only tickets that have uploaded proof
      const withProof = data.data.tickets.filter((t: Ticket) => t.payment_proof_url);
      setTickets(withProof);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Remove from list
      setTickets(tickets.filter(t => t.id !== id));
      setPreviewOpen(false);
      setSelectedTicket(null);
    } catch (err: any) {
      alert(err.message || 'Failed to approve ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTicket) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setTickets(tickets.filter(t => t.id !== selectedTicket.id));
      setRejectOpen(false);
      setPreviewOpen(false);
      setSelectedTicket(null);
      setRejectionReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reject ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.full_name.toLowerCase().includes(search.toLowerCase()) || 
    t.ticket_code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-white">
            Payment Approvals
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Review and approve uploaded payment proofs.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search attendees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium pl-10 pr-4 py-2 rounded-lg text-sm w-full sm:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {filteredTickets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-dark-200 flex items-center justify-center mb-4 border border-white/10">
            <Check className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
          <p className="text-zinc-400 max-w-md mx-auto">
            There are no pending payment approvals at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-white truncate w-40">{ticket.full_name}</h3>
                  <p className="text-xs text-zinc-500">{ticket.ticket_code}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">{formatNaira(ticket.amount_paid)}</p>
                  <p className="text-xs text-zinc-400">{ticket.ticket_type} x{ticket.ticket_quantity}</p>
                </div>
              </div>

              <div className="text-xs text-zinc-500 mb-4 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Submitted {formatDateTime(ticket.updated_at)}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex-1"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setPreviewOpen(true);
                  }}
                >
                  <FileImage className="w-4 h-4" />
                  View Receipt
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  className="w-full flex-1 bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 text-white"
                  onClick={() => handleApprove(ticket.id)}
                  loading={actionLoading && selectedTicket?.id === ticket.id}
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Review Payment" size="lg">
        {selectedTicket && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-dark-100 p-4 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-zinc-500 uppercase">Attendee</p>
                <p className="text-sm font-medium text-white truncate" title={selectedTicket.full_name}>{selectedTicket.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase">Tier</p>
                <p className="text-sm font-medium text-white">{selectedTicket.ticket_type} x{selectedTicket.ticket_quantity}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase">Amount</p>
                <p className="text-sm font-bold text-gold">{formatNaira(selectedTicket.amount_paid)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase">Code</p>
                <p className="text-sm font-medium text-white">{selectedTicket.ticket_code}</p>
              </div>
            </div>

            <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
              <Image
                src={selectedTicket.payment_proof_url!}
                alt="Payment Proof"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => setRejectOpen(true)}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                loading={actionLoading}
                onClick={() => handleApprove(selectedTicket.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Payment" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Are you sure you want to reject this payment? The attendee will need to upload a new proof of payment.
          </p>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Reason (Optional)</label>
            <textarea
              className="input-premium w-full rounded-xl p-3 text-sm h-24 resize-none"
              placeholder="e.g. Image is blurry, wrong amount transferred..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" className="flex-1" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" loading={actionLoading} onClick={handleReject}>Confirm Reject</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
