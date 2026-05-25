from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """Django admin configuration for Ticket model."""
    list_display = [
        'ticket_code', 'full_name', 'email', 'ticket_type',
        'ticket_quantity', 'amount_paid', 'payment_status',
        'is_checked_in', 'created_at'
    ]
    list_filter = ['payment_status', 'ticket_type', 'is_checked_in']
    search_fields = ['full_name', 'email', 'phone_number', 'ticket_code']
    readonly_fields = ['id', 'ticket_code', 'verification_token', 'created_at', 'updated_at']
    list_per_page = 25
    ordering = ['-created_at']

    fieldsets = (
        ('Attendee Info', {
            'fields': ('full_name', 'email', 'phone_number')
        }),
        ('Ticket Details', {
            'fields': ('ticket_type', 'ticket_quantity', 'amount_paid', 'ticket_code', 'verification_token')
        }),
        ('Payment', {
            'fields': ('payment_proof', 'payment_status', 'payment_date', 'rejection_reason')
        }),
        ('QR Code', {
            'fields': ('qr_code',)
        }),
        ('Check-in', {
            'fields': ('is_checked_in', 'checked_in_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
