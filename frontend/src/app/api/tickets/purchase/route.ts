import { NextResponse } from 'next/ NextResponse';
import { createServerClient } from '@/lib/supabase/server';
import { TICKET_TIERS } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
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

    // We don't generate the code or token here, the database default functions handle it!
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        full_name,
        email,
        phone_number,
        ticket_type,
        ticket_quantity,
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
