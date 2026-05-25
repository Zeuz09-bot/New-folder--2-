import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TICKET_TIERS } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    const { full_name, email, phone_number, ticket_type, ticket_quantity } = body;

    // Validate inputs
    if (!full_name || !email || !phone_number || !ticket_type || !ticket_quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tier = TICKET_TIERS.find(t => t.id === ticket_type);
    if (!tier) {
      return NextResponse.json({ error: 'Invalid ticket tier' }, { status: 400 });
    }

    const amount = tier.price * ticket_quantity;

    // Generate ticket code using the database function, with fallback
    let ticket_code: string;
    try {
      const { data: codeData, error: codeError } = await supabase.rpc('get_next_ticket_code');
      if (codeError || !codeData) {
        // Fallback: generate a random ticket code
        const rand = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        ticket_code = `EVT-2026-${rand}`;
      } else {
        ticket_code = codeData;
      }
    } catch {
      const rand = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      ticket_code = `EVT-2026-${rand}`;
    }

    // We don't generate the verification_token here, the database default handles it!
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        full_name,
        email,
        phone_number,
        ticket_type,
        ticket_quantity,
        ticket_code,
        amount_paid: amount,
        payment_status: 'PENDING',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting ticket:', error);
      return NextResponse.json({ error: 'Failed to create ticket order' }, { status: 500 });
    }

    return NextResponse.json({ data: ticket });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
