import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const supabase = createAdminClient();

    let query = supabase
      .from('tickets')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('payment_status', status);
    }

    const { data: tickets, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: { tickets } });
  } catch (err: any) {
    console.error('Tickets API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
