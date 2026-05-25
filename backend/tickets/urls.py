from django.urls import path
from . import views

urlpatterns = [
    # ── Public Endpoints ──
    path('tickets/purchase/', views.purchase_ticket, name='ticket-purchase'),
    path('tickets/<uuid:ticket_id>/upload-proof/', views.upload_payment_proof, name='ticket-upload-proof'),
    path('tickets/<uuid:ticket_id>/status/', views.check_ticket_status, name='ticket-status'),
    path('tickets/verify/<uuid:token>/', views.verify_ticket, name='ticket-verify'),

    # ── Admin Endpoints ──
    path('admin/dashboard/', views.admin_dashboard, name='admin-dashboard'),
    path('admin/tickets/', views.admin_tickets, name='admin-tickets'),
    path('admin/pending/', views.admin_pending_payments, name='admin-pending'),
    path('admin/tickets/<uuid:ticket_id>/approve/', views.admin_approve_ticket, name='admin-approve'),
    path('admin/tickets/<uuid:ticket_id>/reject/', views.admin_reject_ticket, name='admin-reject'),
    path('admin/tickets/<uuid:ticket_id>/checkin/', views.admin_checkin_ticket, name='admin-checkin'),
    path('admin/scan/', views.admin_scan_verify, name='admin-scan'),
    path('admin/export/', views.admin_export_csv, name='admin-export'),
]
