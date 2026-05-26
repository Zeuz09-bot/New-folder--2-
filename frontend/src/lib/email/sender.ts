import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import TicketEmail from './template';
import { EVENT } from '../constants';
import { Ticket } from '../types';

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

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
  if (!process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD) {
    console.warn('Email credentials are not set. Skipping email dispatch.');
    return;
  }

  try {
    // Generate QR Code data URL using the ticket verification URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const qrCodeUrl = `${siteUrl.replace(/\/$/, '')}/verify/${ticket.verification_token}`;
    const qrCodeDataUrl = await generateQRCode(qrCodeUrl);

    const emailHtml = await render(
      TicketEmail({
        fullName: ticket.full_name,
        ticketType: ticket.ticket_type,
        ticketQuantity: ticket.ticket_quantity,
        ticketCode: ticket.ticket_code,
        amountPaid: ticket.amount_paid,
        qrCodeDataUrl: 'cid:ticket-qrcode', // Use Content-ID reference instead of raw base64
        eventName: EVENT.name,
        eventDate: EVENT.dateDisplay,
        eventTime: EVENT.time,
        eventVenue: EVENT.venue,
        eventAddress: EVENT.address,
      })
    );

    // Extract base64 part for the attachment
    const base64Data = qrCodeDataUrl.split(',')[1];

    await transporter.sendMail({
      from: process.env.DEFAULT_FROM_EMAIL || 'ILEYA FEST <tickets@ileyafest.com>',
      to: ticket.email,
      subject: `Your ILEYA FEST Ticket - ${ticket.ticket_code}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'ticket-qrcode.png',
          content: base64Data,
          encoding: 'base64',
          cid: 'ticket-qrcode', // matches the cid in the src above
        },
      ],
    });
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err; // Re-throw to handle in API route if necessary
  }
}
