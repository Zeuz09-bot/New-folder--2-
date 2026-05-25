import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Img,
  Preview,
  Section,
  Text,
  Column,
  Row,
} from '@react-email/components';
import { formatNaira, formatDateTime } from '../utils';

interface TicketEmailProps {
  fullName: string;
  ticketType: string;
  ticketQuantity: number;
  ticketCode: string;
  amountPaid: number;
  qrCodeDataUrl: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventAddress: string;
}

export default function TicketEmail({
  fullName,
  ticketType,
  ticketQuantity,
  ticketCode,
  amountPaid,
  qrCodeDataUrl,
  eventName,
  eventDate,
  eventTime,
  eventVenue,
  eventAddress,
}: TicketEmailProps) {
  return (
    <Html>
      <Head>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </Head>
      <Preview>Your ILEYA FEST Ticket is Here!</Preview>
      <Body style={{ backgroundColor: '#f5f5f5', padding: '20px 0' }}>
        <Container
          style={{
            margin: '0 auto',
            padding: '0',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            maxWidth: '600px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header Banner */}
          <Section
            style={{
              backgroundColor: '#000000',
              padding: '30px 20px',
              textAlign: 'center',
            }}
          >
            <Heading
              style={{
                color: '#D4AF37',
                fontSize: '28px',
                margin: '0 0 10px 0',
                fontWeight: 'bold',
                letterSpacing: '2px',
              }}
            >
              ILEYA FEST
            </Heading>
            <Text style={{ color: '#ffffff', margin: 0, fontSize: '16px' }}>
              Your payment is confirmed!
            </Text>
          </Section>

          {/* Ticket Body */}
          <Section style={{ padding: '30px', borderBottom: '2px dashed #e5e7eb' }}>
            <Text style={{ fontSize: '18px', color: '#111827', marginBottom: '20px' }}>
              Hi {fullName},
            </Text>
            <Text style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.5' }}>
              Thank you for purchasing your ticket to <strong>{eventName}</strong>. 
              Please present the QR code below at the venue entrance.
            </Text>

            {/* QR Code */}
            <Section style={{ textAlign: 'center', margin: '30px 0' }}>
              <div style={{ padding: '15px', border: '2px solid #D4AF37', borderRadius: '16px', display: 'inline-block', backgroundColor: '#ffffff' }}>
                <Img
                  src={qrCodeDataUrl}
                  width="200"
                  height="200"
                  alt="Ticket QR Code"
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
              <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
                Ref: {ticketCode}
              </Text>
            </Section>

            {/* Details Grid */}
            <Section style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <Row>
                <Column>
                  <Text style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Ticket Tier</Text>
                  <Text style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#111827', fontWeight: 'bold' }}>{ticketType}</Text>
                </Column>
                <Column>
                  <Text style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Quantity</Text>
                  <Text style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#111827', fontWeight: 'bold' }}>{ticketQuantity}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Amount Paid</Text>
                  <Text style={{ margin: '0 0 0 0', fontSize: '16px', color: '#111827', fontWeight: 'bold' }}>{formatNaira(amountPaid)}</Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Event Details */}
          <Section style={{ padding: '30px', backgroundColor: '#ffffff' }}>
            <Heading as="h3" style={{ fontSize: '18px', color: '#111827', margin: '0 0 15px 0' }}>
              Event Details
            </Heading>
            <Text style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '15px' }}>
              <strong>Date:</strong> {eventDate}
            </Text>
            <Text style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '15px' }}>
              <strong>Time:</strong> {eventTime}
            </Text>
            <Text style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '15px' }}>
              <strong>Venue:</strong> {eventVenue}
            </Text>
            <Text style={{ margin: '0 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {eventAddress}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#111827', padding: '20px', textAlign: 'center' }}>
            <Text style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
              This email and ticket are non-transferable unless specified.
            </Text>
            <Text style={{ color: '#D4AF37', fontSize: '12px', margin: '5px 0 0 0' }}>
              © 2026 GT Hotel and Event Center.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
