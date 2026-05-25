import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Verify admin
    const supabaseUser = await createServerSupabaseClient();
    const { data: { session } } = await supabaseUser.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let { token } = body; // This could be the verification_token or the ticket_code

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Extract the token if scanned value is a full verification URL
    if (token.startsWith('http://') || token.startsWith('https://')) {
      try {
        const url = new URL(token);
        const pathParts = url.pathname.split('/');
        // URL format is typically: /verify/<token>
        const verifyIndex = pathParts.indexOf('verify');
        if (verifyIndex !== -1 && pathParts[verifyIndex + 1]) {
          token = pathParts[verifyIndex + 1];
        } else {
          const lastPart = pathParts[pathParts.length - 1];
          if (lastPart) {
            token = lastPart;
          }
        }
      } catch (e) {
        console.error('Failed to parse URL in scanner token:', e);
      }
    }

    const supabaseAdmin = createAdminClient();

    // 2. Find ticket by token OR code
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from('tickets')
      .select('*')
      .or(`verification_token.eq.${token},ticket_code.eq.${token}`)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ 
        valid: false, 
        status: 'INVALID', 
        message: 'Invalid ticket code or token. Not found in system.' 
      });
    }

    // 3. Check payment status
    if (ticket.payment_status !== 'APPROVED') {
      return NextResponse.json({
        valid: false,
        status: 'UNPAID',
        message: 'Payment for this ticket has not been approved.',
        ticket,
      });
    }

    // 4. Check if already used
    if (ticket.is_checked_in) {
      return NextResponse.json({
        valid: false,
        status: 'ALREADY_USED',
        message: 'This ticket has already been scanned and checked in.',
        ticket,
      });
    }

    // 5. Check in the ticket
    const { error: updateError } = await supabaseAdmin
      .from('tickets')
      .update({ 
        is_checked_in: true,
        checked_in_at: new Date().toISOString()
      })
      .eq('id', ticket.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      valid: true,
      status: 'VALID',
      message: 'Access granted. Attendee checked in successfully.',
      ticket: { ...ticket, is_checked_in: true, checked_in_at: new Date().toISOString() },
    });

  } catch (err: any) {
    console.error('Scan API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
