"""
Management command to create the initial superadmin user.
Usage: python manage.py createsuperadmin
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create the initial superadmin user for ILEYA FEST admin panel'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin', help='Admin username')
        parser.add_argument('--email', type=str, default='admin@ileyafest.com', help='Admin email')
        parser.add_argument('--password', type=str, default='IleyaFest2026!', help='Admin password')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists.'))
            return

        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name='ILEYA FEST',
            last_name='Admin',
        )

        self.stdout.write(self.style.SUCCESS(
            f'\n✅ Superadmin created successfully!\n'
            f'   Username: {username}\n'
            f'   Email: {email}\n'
            f'   Password: {password}\n'
            f'\n⚠️  Please change the password after first login!\n'
        ))
