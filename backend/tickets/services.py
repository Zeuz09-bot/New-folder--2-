"""
Service layer for ticket operations:
- QR code generation
- Ticket code generation
- Email sending with QR attachment
"""
import io
import qrcode
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def generate_qr_code(ticket):
    """
    Generate a QR code image for the given ticket.
    The QR code contains the verification URL.
    Returns the QR code as a Django ContentFile.
    """
    verification_url = f'{settings.TICKET_VERIFY_URL}/{ticket.verification_token}'

    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(verification_url)
    qr.make(fit=True)

    # Create image with gold/black theme
    img = qr.make_image(fill_color='#000000', back_color='#FFFFFF')

    # Save to bytes
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    # Save to ticket
    filename = f'qr_{ticket.ticket_code}.png'
    ticket.qr_code.save(filename, ContentFile(buffer.read()), save=True)

    return verification_url


def send_ticket_email(ticket):
    """
    Send a branded email with the ticket QR code after payment approval.
    """
    subject = f'🎉 Your ILEYA FEST Ticket — {ticket.ticket_code}'

    # Render HTML email template
    context = {
        'ticket': ticket,
        'event_name': settings.EVENT_NAME,
        'event_date': settings.EVENT_DATE,
        'event_time': settings.EVENT_TIME,
        'event_venue': settings.EVENT_VENUE,
        'verification_url': f'{settings.TICKET_VERIFY_URL}/{ticket.verification_token}',
    }

    try:
        html_content = render_to_string('email/ticket_email.html', context)
        text_content = strip_tags(html_content)
    except Exception:
        # Fallback plain text if template fails
        text_content = (
            f"Congratulations {ticket.full_name}!\n\n"
            f"Your ticket for {settings.EVENT_NAME} has been confirmed.\n\n"
            f"Ticket Code: {ticket.ticket_code}\n"
            f"Ticket Type: {ticket.get_ticket_type_display()}\n"
            f"Quantity: {ticket.ticket_quantity}\n"
            f"Amount: ₦{ticket.amount_paid:,.2f}\n\n"
            f"Event Details:\n"
            f"Date: {settings.EVENT_DATE}\n"
            f"Time: {settings.EVENT_TIME}\n"
            f"Venue: {settings.EVENT_VENUE}\n\n"
            f"Verify your ticket: {settings.TICKET_VERIFY_URL}/{ticket.verification_token}\n\n"
            f"Please present your QR code at the venue entrance.\n"
            f"See you there! 🎶"
        )
        html_content = None

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[ticket.email],
    )

    if html_content:
        email.attach_alternative(html_content, 'text/html')

    # Attach QR code image
    if ticket.qr_code:
        try:
            ticket.qr_code.open('rb')
            email.attach(
                f'ticket_qr_{ticket.ticket_code}.png',
                ticket.qr_code.read(),
                'image/png'
            )
            ticket.qr_code.close()
        except Exception:
            pass  # Send email without attachment if file read fails

    try:
        email.send(fail_silently=False)
        return True
    except Exception as e:
        print(f'Email send failed for ticket {ticket.ticket_code}: {e}')
        return False
