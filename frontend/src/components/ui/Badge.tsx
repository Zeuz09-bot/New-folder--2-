import { cn } from '@/lib/utils';

interface BadgeProps {
  status: string;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: {
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      text: 'text-yellow-400',
      label: 'Pending',
    },
    APPROVED: {
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'text-emerald-400',
      label: 'Approved',
    },
    REJECTED: {
      bg: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-400',
      label: 'Rejected',
    },
    CHECKED_IN: {
      bg: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-blue-400',
      label: 'Checked In',
    },
  };

  const style = styles[status] || styles.PENDING;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', style.text.replace('text-', 'bg-'))} />
      {style.label}
    </span>
  );
}
