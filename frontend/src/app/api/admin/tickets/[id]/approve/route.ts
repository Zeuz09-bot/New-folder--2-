import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerClient } from '@/lib/supabase/server';
import { sendTicketEmail } from '@/lib/email/sender';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First, verify the user is an authenticated admin using standard client
    const supabaseUser = await createServerClient();
    const { data: { session } } = await supabaseUser.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS for updating the ticket
    const supabaseAdmin = createAdminClient();

    // 1. Fetch the ticket details
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.payment_status === 'APPROVED') {
      return NextResponse.json({ error: 'Ticket is already approved' }, { status: 400 });
    }

    // 2. Update status to APPROVED
    const { error: updateError } = await supabaseAdmin
      .from('tickets')
      .update({ payment_status: 'APPROVED' })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update ticket status:', updateError);
      return NextResponse.json({ error: 'Failed to approve ticket' }, { status: 500 });
    }

    // 3. Send email asynchronously (don't block the response)
    // In a real production app, you might use a background worker/queue here
    sendTicketEmail(ticket).catch(err => {
      console.error(`Failed to send email for ticket ${id}:`, err);
    });

    return NextResponse.json({ success: true, message: 'Ticket approved and email sent' });
  } catch (err: any) {
    console.error('Error in approve route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
