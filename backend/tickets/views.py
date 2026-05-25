import csv
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Sum, Count, Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Ticket
from .serializers import (
    TicketPurchaseSerializer,
    PaymentProofSerializer,
    TicketListSerializer,
    TicketPublicSerializer,
    TicketVerifySerializer,
)
from .services import generate_qr_code, send_ticket_email


# ═══════════════════════════════════════════════════
# PUBLIC ENDPOINTS
# ═══════════════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def purchase_ticket(request):
    """
    Create a new ticket purchase.
    Returns ticket details with payment instructions.
    """
    serializer = TicketPurchaseSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    ticket = serializer.save()

    return Response({
        'message': 'Ticket order created successfully. Please upload your payment proof.',
        'ticket': TicketPublicSerializer(ticket).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def upload_payment_proof(request, ticket_id):
    """
    Upload payment proof for an existing ticket order.
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if ticket.payment_status != Ticket.PaymentStatus.PENDING:
        return Response(
            {'error': 'Payment proof can only be uploaded for pending tickets.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = PaymentProofSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    ticket.payment_proof = serializer.validated_data['payment_proof']
    ticket.save()

    return Response({
        'message': 'Payment proof uploaded successfully. Awaiting admin approval.',
        'ticket': TicketPublicSerializer(ticket).data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def check_ticket_status(request, ticket_id):
    """
    Check the status of a ticket by ID (public endpoint).
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        'ticket': TicketPublicSerializer(ticket).data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_ticket(request, token):
    """
    Verify a ticket via QR code token.
    Used when scanning QR codes at the venue.
    """
    try:
        ticket = Ticket.objects.get(verification_token=token)
    except Ticket.DoesNotExist:
        return Response({
            'valid': False,
            'status': 'INVALID',
            'message': 'Invalid ticket. This QR code is not recognized.',
        }, status=status.HTTP_404_NOT_FOUND)

    # Check if payment is approved
    if ticket.payment_status != Ticket.PaymentStatus.APPROVED:
        return Response({
            'valid': False,
            'status': 'UNPAID',
            'message': 'This ticket has not been paid for or approved.',
            'ticket': TicketVerifySerializer(ticket).data,
        })

    # Check if already checked in
    if ticket.is_checked_in:
        return Response({
            'valid': False,
            'status': 'ALREADY_USED',
            'message': f'This ticket was already used on {ticket.checked_in_at.strftime("%b %d, %Y at %I:%M %p")}.',
            'ticket': TicketVerifySerializer(ticket).data,
        })

    # Valid ticket
    return Response({
        'valid': True,
        'status': 'VALID',
        'message': 'Valid ticket! Ready for check-in.',
        'ticket': TicketVerifySerializer(ticket).data,
    })


# ═══════════════════════════════════════════════════
# ADMIN ENDPOINTS
# ═══════════════════════════════════════════════════

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard(request):
    """
    Get dashboard statistics for the admin panel.
    """
    tickets = Ticket.objects.all()

    # Basic counts
    total_tickets = tickets.count()
    pending_count = tickets.filter(payment_status=Ticket.PaymentStatus.PENDING).count()
    approved_count = tickets.filter(payment_status=Ticket.PaymentStatus.APPROVED).count()
    rejected_count = tickets.filter(payment_status=Ticket.PaymentStatus.REJECTED).count()
    checked_in_count = tickets.filter(is_checked_in=True).count()

    # Revenue (approved tickets only)
    total_revenue = tickets.filter(
        payment_status=Ticket.PaymentStatus.APPROVED
    ).aggregate(total=Sum('amount_paid'))['total'] or 0

    # Revenue by tier
    revenue_by_tier = {}
    for tier_choice in Ticket.TicketType.choices:
        tier_key = tier_choice[0]
        tier_revenue = tickets.filter(
            payment_status=Ticket.PaymentStatus.APPROVED,
            ticket_type=tier_key
        ).aggregate(total=Sum('amount_paid'))['total'] or 0
        tier_count = tickets.filter(
            payment_status=Ticket.PaymentStatus.APPROVED,
            ticket_type=tier_key
        ).count()
        revenue_by_tier[tier_key] = {
            'revenue': float(tier_revenue),
            'count': tier_count,
        }

    # Recent tickets (last 10)
    recent_tickets = TicketListSerializer(
        tickets[:10],
        many=True,
        context={'request': request}
    ).data

    return Response({
        'total_tickets': total_tickets,
        'pending_count': pending_count,
        'approved_count': approved_count,
        'rejected_count': rejected_count,
        'checked_in_count': checked_in_count,
        'total_revenue': float(total_revenue),
        'revenue_by_tier': revenue_by_tier,
        'recent_tickets': recent_tickets,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_tickets(request):
    """
    List all tickets with search and filter support.
    """
    tickets = Ticket.objects.all()

    # Filters
    payment_status = request.query_params.get('status')
    ticket_type = request.query_params.get('type')
    checked_in = request.query_params.get('checked_in')
    search = request.query_params.get('search')

    if payment_status:
        tickets = tickets.filter(payment_status=payment_status.upper())
    if ticket_type:
        tickets = tickets.filter(ticket_type=ticket_type.upper())
    if checked_in is not None:
        tickets = tickets.filter(is_checked_in=checked_in.lower() == 'true')
    if search:
        tickets = tickets.filter(
            Q(full_name__icontains=search) |
            Q(email__icontains=search) |
            Q(phone_number__icontains=search) |
            Q(ticket_code__icontains=search)
        )

    serializer = TicketListSerializer(
        tickets,
        many=True,
        context={'request': request}
    )
    return Response({
        'count': tickets.count(),
        'tickets': serializer.data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_pending_payments(request):
    """
    List tickets with pending payment status (with proof uploaded).
    """
    tickets = Ticket.objects.filter(
        payment_status=Ticket.PaymentStatus.PENDING,
        payment_proof__isnull=False
    ).exclude(payment_proof='')

    serializer = TicketListSerializer(
        tickets,
        many=True,
        context={'request': request}
    )
    return Response({
        'count': tickets.count(),
        'tickets': serializer.data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_approve_ticket(request, ticket_id):
    """
    Approve a pending ticket payment.
    Triggers QR code generation and email delivery.
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if ticket.payment_status != Ticket.PaymentStatus.PENDING:
        return Response(
            {'error': f'Ticket is already {ticket.get_payment_status_display().lower()}.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Approve payment
    ticket.payment_status = Ticket.PaymentStatus.APPROVED
    ticket.payment_date = timezone.now()
    ticket.save()

    # Generate QR code
    try:
        generate_qr_code(ticket)
    except Exception as e:
        return Response({
            'message': 'Payment approved but QR generation failed.',
            'error': str(e),
            'ticket': TicketListSerializer(ticket, context={'request': request}).data,
        }, status=status.HTTP_207_MULTI_STATUS)

    # Send email with ticket
    email_sent = send_ticket_email(ticket)

    return Response({
        'message': 'Payment approved successfully!',
        'email_sent': email_sent,
        'ticket': TicketListSerializer(ticket, context={'request': request}).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_reject_ticket(request, ticket_id):
    """
    Reject a pending ticket payment with an optional reason.
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if ticket.payment_status != Ticket.PaymentStatus.PENDING:
        return Response(
            {'error': f'Ticket is already {ticket.get_payment_status_display().lower()}.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    reason = request.data.get('reason', '')

    ticket.payment_status = Ticket.PaymentStatus.REJECTED
    ticket.rejection_reason = reason
    ticket.save()

    return Response({
        'message': 'Payment rejected.',
        'ticket': TicketListSerializer(ticket, context={'request': request}).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_checkin_ticket(request, ticket_id):
    """
    Check in a ticket (mark as used at the venue).
    Can also be triggered via QR scan.
    """
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if ticket.payment_status != Ticket.PaymentStatus.APPROVED:
        return Response({
            'error': 'Cannot check in. Ticket payment has not been approved.',
            'status': 'UNPAID',
        }, status=status.HTTP_400_BAD_REQUEST)

    if ticket.is_checked_in:
        return Response({
            'error': 'Ticket already checked in.',
            'status': 'ALREADY_USED',
            'checked_in_at': ticket.checked_in_at,
            'ticket': TicketVerifySerializer(ticket).data,
        }, status=status.HTTP_409_CONFLICT)

    ticket.is_checked_in = True
    ticket.checked_in_at = timezone.now()
    ticket.save()

    return Response({
        'message': f'✅ {ticket.full_name} checked in successfully!',
        'status': 'CHECKED_IN',
        'ticket': TicketVerifySerializer(ticket).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_scan_verify(request):
    """
    Verify and check-in a ticket via QR scan token.
    Combined verify + check-in for scanner page.
    """
    token = request.data.get('token', '')

    if not token:
        return Response({
            'valid': False,
            'status': 'INVALID',
            'message': 'No token provided.',
        }, status=status.HTTP_400_BAD_REQUEST)

    # Extract token from URL if full URL was scanned
    if '/' in token:
        token = token.rstrip('/').split('/')[-1]

    try:
        ticket = Ticket.objects.get(verification_token=token)
    except Ticket.DoesNotExist:
        return Response({
            'valid': False,
            'status': 'INVALID',
            'message': 'Invalid ticket. QR code not recognized.',
        }, status=status.HTTP_404_NOT_FOUND)

    # Check payment status
    if ticket.payment_status != Ticket.PaymentStatus.APPROVED:
        return Response({
            'valid': False,
            'status': 'UNPAID',
            'message': 'This ticket has not been paid/approved.',
            'ticket': TicketVerifySerializer(ticket).data,
        })

    # Check if already checked in
    if ticket.is_checked_in:
        return Response({
            'valid': False,
            'status': 'ALREADY_USED',
            'message': f'Already checked in at {ticket.checked_in_at.strftime("%I:%M %p")}.',
            'ticket': TicketVerifySerializer(ticket).data,
        })

    # Check in the ticket
    ticket.is_checked_in = True
    ticket.checked_in_at = timezone.now()
    ticket.save()

    return Response({
        'valid': True,
        'status': 'VALID',
        'message': f'✅ Welcome, {ticket.full_name}!',
        'ticket': TicketVerifySerializer(ticket).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_export_csv(request):
    """
    Export all attendees as a CSV file.
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="ileya_fest_attendees.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Ticket Code', 'Full Name', 'Email', 'Phone',
        'Ticket Type', 'Quantity', 'Amount (NGN)',
        'Payment Status', 'Checked In', 'Checked In At',
        'Created At'
    ])

    tickets = Ticket.objects.all().order_by('ticket_code')
    for t in tickets:
        writer.writerow([
            t.ticket_code,
            t.full_name,
            t.email,
            t.phone_number,
            t.get_ticket_type_display(),
            t.ticket_quantity,
            t.amount_paid,
            t.get_payment_status_display(),
            'Yes' if t.is_checked_in else 'No',
            t.checked_in_at.strftime('%Y-%m-%d %H:%M') if t.checked_in_at else '',
            t.created_at.strftime('%Y-%m-%d %H:%M'),
        ])

    return response
