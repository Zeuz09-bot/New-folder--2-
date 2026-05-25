import { Ticket } from '@/lib/types';
import { formatNaira, formatDateTime, getStatusColor } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface RecentTicketsTableProps {
  tickets: Ticket[];
}

export default function RecentTicketsTable({ tickets }: RecentTicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No recent tickets found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            <th className="py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Attendee</th>
            <th className="py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tier / Qty</th>
            <th className="py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
            <th className="py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-4 px-4">
                <p className="text-sm font-medium text-white">{ticket.full_name}</p>
                <p className="text-xs text-zinc-500">{ticket.email}</p>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-white">{ticket.ticket_type}</p>
                <p className="text-xs text-zinc-500">x{ticket.ticket_quantity}</p>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm font-medium text-white">{formatNaira(ticket.amount_paid)}</p>
              </td>
              <td className="py-4 px-4">
                <Badge status={ticket.is_checked_in ? 'CHECKED_IN' : ticket.payment_status} />
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-zinc-400">{formatDateTime(ticket.created_at).split(',')[0]}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
