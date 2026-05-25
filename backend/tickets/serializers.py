from rest_framework import serializers
from .models import Ticket


class TicketPurchaseSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new ticket purchase.
    Validates attendee info and ticket selection.
    """
    class Meta:
        model = Ticket
        fields = [
            'full_name', 'email', 'phone_number',
            'ticket_type', 'ticket_quantity'
        ]

    def validate_ticket_quantity(self, value):
        if value < 1 or value > 10:
            raise serializers.ValidationError('Quantity must be between 1 and 10.')
        return value

    def validate_ticket_type(self, value):
        if value not in Ticket.TIER_PRICES:
            raise serializers.ValidationError('Invalid ticket type.')
        return value

    def create(self, validated_data):
        ticket = Ticket(**validated_data)
        ticket.save()
        return ticket


class PaymentProofSerializer(serializers.Serializer):
    """Serializer for uploading payment proof image."""
    payment_proof = serializers.ImageField()

    def validate_payment_proof(self, value):
        # Max 10MB
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError('File size must not exceed 10MB.')
        # Allowed formats
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Only JPEG, PNG, and WebP images are allowed.')
        return value


class TicketListSerializer(serializers.ModelSerializer):
    """Full ticket serializer for admin views."""
    payment_proof_url = serializers.SerializerMethodField()
    qr_code_url = serializers.SerializerMethodField()
    tier_price = serializers.ReadOnlyField()
    status_display = serializers.ReadOnlyField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'full_name', 'email', 'phone_number',
            'ticket_type', 'ticket_quantity', 'amount_paid',
            'payment_proof', 'payment_proof_url',
            'payment_status', 'status_display',
            'ticket_code', 'verification_token',
            'qr_code', 'qr_code_url',
            'is_checked_in', 'checked_in_at',
            'payment_date', 'rejection_reason',
            'created_at', 'updated_at',
            'tier_price',
        ]

    def get_payment_proof_url(self, obj):
        if obj.payment_proof:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.payment_proof.url)
            return obj.payment_proof.url
        return None

    def get_qr_code_url(self, obj):
        if obj.qr_code:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.qr_code.url)
            return obj.qr_code.url
        return None


class TicketPublicSerializer(serializers.ModelSerializer):
    """Limited ticket info for public views (after purchase)."""
    tier_price = serializers.ReadOnlyField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'full_name', 'email', 'phone_number',
            'ticket_type', 'ticket_quantity', 'amount_paid',
            'payment_status', 'ticket_code',
            'created_at', 'tier_price',
        ]


class TicketVerifySerializer(serializers.ModelSerializer):
    """Serializer for QR code verification response."""
    class Meta:
        model = Ticket
        fields = [
            'id', 'full_name', 'email', 'phone_number',
            'ticket_type', 'ticket_quantity', 'amount_paid',
            'payment_status', 'ticket_code',
            'is_checked_in', 'checked_in_at',
            'payment_date', 'created_at',
        ]
