import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Convert to CSV
    const headers = [
      'Ticket Code',
      'Full Name',
      'Email',
      'Phone',
      'Ticket Type',
      'Quantity',
      'Amount Paid',
      'Payment Status',
      'Checked In',
      'Check-in Time',
      'Created At'
    ];

    const csvRows = [headers.join(',')];

    tickets.forEach(t => {
      const row = [
        t.ticket_code,
        `"${t.full_name.replace(/"/g, '""')}"`, // escape quotes and wrap
        t.email,
        t.phone_number,
        t.ticket_type,
        t.ticket_quantity,
        t.amount_paid,
        t.payment_status,
        t.is_checked_in ? 'YES' : 'NO',
        t.checked_in_at || 'N/A',
        t.created_at
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="ileya_fest_attendees.csv"',
      },
    });
  } catch (err: any) {
    console.error('Export API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
