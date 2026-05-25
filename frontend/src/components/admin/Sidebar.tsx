'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  ScanLine, 
  Settings,
  Ticket
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/payments', label: 'Payment Approvals', icon: CreditCard },
    { href: '/admin/attendees', label: 'Attendees', icon: Users },
    { href: '/admin/scanner', label: 'QR Scanner', icon: ScanLine },
  ];

  return (
    <aside className="w-64 bg-dark-200 border-r border-white/5 flex flex-col h-full sticky top-0 hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-gold" />
          <span className="font-bold font-[family-name:var(--font-poppins)] text-white tracking-wide">
            ADMIN PANEL
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-gold' : 'text-zinc-500')} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
          <Settings className="w-5 h-5 text-zinc-500" />
          Settings
        </button>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Home', icon: LayoutDashboard },
    { href: '/admin/payments', label: 'Approve', icon: CreditCard },
    { href: '/admin/attendees', label: 'Users', icon: Users },
    { href: '/admin/scanner', label: 'Scan', icon: ScanLine },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-white/10 z-50 px-2 py-2 pb-safe flex items-center justify-around">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 min-w-[64px]',
              isActive ? 'text-gold' : 'text-zinc-500'
            )}
          >
            <Icon className={cn('w-6 h-6 mb-0.5', isActive ? 'text-gold' : 'text-zinc-500')} />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
