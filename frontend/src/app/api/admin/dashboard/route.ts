import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // In a real large-scale app, you'd want to use RPC or database views
    // to aggregate this data efficiently rather than fetching all tickets.
    // For this scope, fetching selected fields is acceptable.
    
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('id, payment_status, is_checked_in, amount_paid, ticket_type, full_name, email, ticket_quantity, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const stats = {
      total_tickets: tickets.length,
      pending_count: 0,
      approved_count: 0,
      rejected_count: 0,
      checked_in_count: 0,
      total_revenue: 0,
      revenue_by_tier: {} as Record<string, { revenue: number, count: number }>,
      recent_tickets: tickets.slice(0, 5), // Get top 5 recent
    };

    tickets.forEach(t => {
      // Status counts
      if (t.payment_status === 'PENDING') stats.pending_count++;
      else if (t.payment_status === 'APPROVED') {
        stats.approved_count++;
        // Only count revenue for approved tickets
        stats.total_revenue += t.amount_paid;
        
        // Tier stats
        if (!stats.revenue_by_tier[t.ticket_type]) {
          stats.revenue_by_tier[t.ticket_type] = { revenue: 0, count: 0 };
        }
        stats.revenue_by_tier[t.ticket_type].revenue += t.amount_paid;
        stats.revenue_by_tier[t.ticket_type].count += t.ticket_quantity;
      }
      else if (t.payment_status === 'REJECTED') stats.rejected_count++;

      // Check-in counts
      if (t.is_checked_in) stats.checked_in_count++;
    });

    return NextResponse.json({ data: stats });
  } catch (err: any) {
    console.error('Dashboard API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
