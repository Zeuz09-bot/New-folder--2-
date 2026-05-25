import QRCode from 'qrcode';
import { Resend } from 'resend';
import TicketEmail from './template';
import { EVENT } from '../constants';
import { Ticket } from '../types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    throw new Error('Failed to generate QR code');
  }
}

export async function sendTicketEmail(ticket: Ticket) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email dispatch.');
    return;
  }

  try {
    // Generate QR Code data URL using the ticket verification URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const qrCodeUrl = `${siteUrl.replace(/\/$/, '')}/verify/${ticket.verification_token}`;
    const qrCodeDataUrl = await generateQRCode(qrCodeUrl);

    await resend.emails.send({
      from: 'ILEYA FEST <tickets@onboarding.resend.dev>', // In prod, use verified domain
      to: ticket.email,
      subject: `Your ILEYA FEST Ticket - ${ticket.ticket_code}`,
      react: TicketEmail({
        fullName: ticket.full_name,
        ticketType: ticket.ticket_type,
        ticketQuantity: ticket.ticket_quantity,
        ticketCode: ticket.ticket_code,
        amountPaid: ticket.amount_paid,
        qrCodeDataUrl,
        eventName: EVENT.name,
        eventDate: EVENT.dateDisplay,
        eventTime: EVENT.time,
        eventVenue: EVENT.venue,
        eventAddress: EVENT.address,
      }),
    });
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err; // Re-throw to handle in API route if necessary
  }
}
