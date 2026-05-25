import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const supabaseAdmin = createAdminClient();
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('payment_proof') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    // Get ticket to ensure it exists and is pending
    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('payment_status')
      .eq('id', id)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.payment_status !== 'PENDING') {
      return NextResponse.json({ error: `Cannot upload proof for a ticket that is ${ticket.payment_status}` }, { status: 400 });
    }

    // Convert file to array buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate unique filename
    const fileExt = file.type.split('/')[1];
    const fileName = `${id}_${uuidv4()}.${fileExt}`;

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('payment-proofs')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image: ' + uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('payment-proofs')
      .getPublicUrl(fileName);

    // Update ticket with proof URL using admin client
    const { error: updateError } = await supabaseAdmin
      .from('tickets')
      .update({ payment_proof_url: publicUrl })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to link image to ticket' }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Error uploading proof:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
