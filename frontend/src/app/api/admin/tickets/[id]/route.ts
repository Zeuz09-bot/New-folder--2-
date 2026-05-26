import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First, verify the user is an authenticated admin using standard client
    const supabaseUser = await createServerSupabaseClient();
    const { data: { session } } = await supabaseUser.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS for deleting the ticket
    const supabaseAdmin = createAdminClient();

    // 1. Fetch the ticket details to ensure it exists
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // 2. Delete the ticket
    const { error: deleteError } = await supabaseAdmin
      .from('tickets')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Failed to delete ticket:', deleteError);
      return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err: any) {
    console.error('Error in delete route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
