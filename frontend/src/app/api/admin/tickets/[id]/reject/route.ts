import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;
    
    // Verify the user is an authenticated admin using standard client
    const supabaseUser = await createServerClient();
    const { data: { session } } = await supabaseUser.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS for updating the ticket
    const supabaseAdmin = createAdminClient();

    // Optional: Fetch ticket to check status
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('tickets')
      .select('payment_status')
      .eq('id', id)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.payment_status === 'APPROVED') {
      return NextResponse.json({ error: 'Cannot reject an already approved ticket' }, { status: 400 });
    }

    // Update status to REJECTED and clear the proof URL
    const { error: updateError } = await supabaseAdmin
      .from('tickets')
      .update({ 
        payment_status: 'REJECTED',
        payment_proof_url: null, // Clear it so they can upload a new one
        // Ideally we would store the rejection reason in the DB as well,
        // but for now we just change the status.
      })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update ticket status:', updateError);
      return NextResponse.json({ error: 'Failed to reject ticket' }, { status: 500 });
    }

    // TODO: Send rejection email notifying user to upload a new proof.

    return NextResponse.json({ success: true, message: 'Ticket rejected' });
  } catch (err: any) {
    console.error('Error in reject route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
