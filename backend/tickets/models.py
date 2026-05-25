import uuid
from django.db import models
from django.utils import timezone


class Ticket(models.Model):
    """
    Core ticket model for ILEYA FEST.
    Represents a single ticket purchase/order with payment tracking.
    """

    # ── Ticket Type Choices ──
    class TicketType(models.TextChoices):
        REGULAR = 'REGULAR', 'Regular'
        VVIP = 'VVIP', 'VVIP'
        SILVER = 'SILVER', 'Silver'
        GOLD = 'GOLD', 'Gold'
        DIAMOND = 'DIAMOND', 'Diamond'

    # ── Payment Status Choices ──
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

    # ── Ticket Pricing (NGN) ──
    TIER_PRICES = {
        'REGULAR': 3000,
        'VVIP': 60000,
        'SILVER': 150000,
        'GOLD': 300000,
        'DIAMOND': 500000,
    }

    # ── Primary Key ──
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ── Attendee Information ──
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)

    # ── Ticket Details ──
    ticket_type = models.CharField(
        max_length=10,
        choices=TicketType.choices,
        default=TicketType.REGULAR
    )
    ticket_quantity = models.PositiveIntegerField(default=1)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # ── Payment ──
    payment_proof = models.ImageField(
        upload_to='payment_proofs/%Y/%m/',
        blank=True,
        null=True
    )
    payment_status = models.CharField(
        max_length=10,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    payment_date = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, default='')

    # ── Ticket Identification ──
    ticket_code = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        help_text='Auto-generated ticket code (EVT-2026-XXXXXX)'
    )
    verification_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text='UUID token used in QR code verification URL'
    )
    qr_code = models.ImageField(
        upload_to='qr_codes/%Y/%m/',
        blank=True,
        null=True
    )

    # ── Check-in ──
    is_checked_in = models.BooleanField(default=False)
    checked_in_at = models.DateTimeField(blank=True, null=True)

    # ── Timestamps ──
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'

    def __str__(self):
        return f'{self.ticket_code} — {self.full_name} ({self.ticket_type})'

    def save(self, *args, **kwargs):
        # Auto-generate ticket code on first save
        if not self.ticket_code:
            self.ticket_code = self._generate_ticket_code()
        # Auto-calculate amount if not set
        if self.amount_paid == 0:
            price = self.TIER_PRICES.get(self.ticket_type, 0)
            self.amount_paid = price * self.ticket_quantity
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_ticket_code():
        """Generate sequential ticket code: EVT-2026-XXXXXX"""
        last_ticket = Ticket.objects.order_by('-created_at').first()
        if last_ticket and last_ticket.ticket_code:
            try:
                last_num = int(last_ticket.ticket_code.split('-')[-1])
                new_num = last_num + 1
            except (ValueError, IndexError):
                new_num = 1
        else:
            new_num = 1
        return f'EVT-2026-{new_num:06d}'

    @property
    def tier_price(self):
        """Get the unit price for this ticket's tier."""
        return self.TIER_PRICES.get(self.ticket_type, 0)

    @property
    def status_display(self):
        """Human-readable status for the ticket."""
        if self.is_checked_in:
            return 'Checked In'
        return self.get_payment_status_display()
