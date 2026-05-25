import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabaseAdmin = createAdminClient();

    const { data: ticket, error } = await supabaseAdmin
      .from('tickets')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (error || !ticket) {
      return NextResponse.json({ 
        valid: false, 
        status: 'INVALID', 
        message: 'Invalid ticket token. Not found in system.' 
      });
    }

    // This route is purely for the public verification page (read-only)
    // It does not check the person in.

    if (ticket.payment_status !== 'APPROVED') {
      return NextResponse.json({
        valid: false,
        status: 'UNPAID',
        message: 'Payment for this ticket has not been approved.',
        ticket,
      });
    }

    if (ticket.is_checked_in) {
      return NextResponse.json({
        valid: false,
        status: 'ALREADY_USED',
        message: 'This ticket has already been used.',
        ticket,
      });
    }

    return NextResponse.json({
      valid: true,
      status: 'VALID',
      message: 'Ticket is valid and ready for use.',
      ticket,
    });

  } catch (err: any) {
    console.error('Verify API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
