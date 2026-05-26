'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@/lib/types';
import { formatNaira, formatDateTime } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Search, Download, Filter, Eye } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function AttendeesPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedTicket) return;
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setTickets(tickets.filter(t => t.id !== selectedTicket.id));
      setViewOpen(false);
      setSelectedTicket(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete ticket');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/admin/tickets');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTickets(data.data.tickets);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch attendees');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ileya_fest_attendees.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.full_name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.ticket_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-white">
            Attendees
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage all ticket purchases and attendees.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-premium pl-10 pr-4 py-2 rounded-lg text-sm w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-dark-200 border border-white/5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={handleExport}
            className="p-2 bg-gold/10 border border-gold/20 rounded-lg text-gold hover:bg-gold/20 transition-colors"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ticket Code</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Attendee Info</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tier / Qty</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-gold">{ticket.ticket_code}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-white">{ticket.full_name}</p>
                      <p className="text-xs text-zinc-500">{ticket.email}</p>
                      <p className="text-xs text-zinc-500">{ticket.phone_number}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-white">{ticket.ticket_type}</p>
                      <p className="text-xs text-zinc-500">{ticket.ticket_quantity} × {formatNaira(ticket.amount_paid / ticket.ticket_quantity)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={ticket.is_checked_in ? 'CHECKED_IN' : ticket.payment_status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setViewOpen(true);
                        }}
                        className="p-2 bg-dark-300 rounded-lg text-zinc-400 hover:text-white transition-colors inline-block"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTickets.length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                No attendees found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Attendee Details" size="md">
        {selectedTicket && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge status={selectedTicket.is_checked_in ? 'CHECKED_IN' : selectedTicket.payment_status} className="px-3 py-1.5 text-sm" />
              <span className="font-mono text-lg text-gold font-bold">{selectedTicket.ticket_code}</span>
            </div>

            <div className="bg-dark-100 rounded-xl p-5 border border-white/5 space-y-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-white font-medium">{selectedTicket.full_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white text-sm">{selectedTicket.email}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-white text-sm">{selectedTicket.phone_number}</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-100 rounded-xl p-5 border border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Ticket Type</p>
                  <p className="text-white font-medium">{selectedTicket.ticket_type}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Quantity</p>
                  <p className="text-white font-medium">{selectedTicket.ticket_quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Amount Paid</p>
                  <p className="text-gold font-bold">{formatNaira(selectedTicket.amount_paid)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Purchase Date</p>
                  <p className="text-white text-sm">{formatDateTime(selectedTicket.created_at)}</p>
                </div>
              </div>
            </div>

            {selectedTicket.is_checked_in && (
              <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/20">
                <p className="text-xs text-emerald-500 uppercase tracking-wider mb-1">Check-in Time</p>
                <p className="text-emerald-400 font-medium">
                  {selectedTicket.checked_in_at ? formatDateTime(selectedTicket.checked_in_at) : 'N/A'}
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-white/5">
              <Button variant="danger" loading={actionLoading} onClick={handleDelete}>Delete Ticket</Button>
              <Button onClick={() => setViewOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
