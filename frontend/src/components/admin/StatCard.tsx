import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'gold' | 'emerald' | 'blue' | 'yellow' | 'red';
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'gold',
  className,
}: StatCardProps) {
  const colorMap = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className={cn('glass-card rounded-2xl p-6 border border-white/5', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl border', colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={cn(
              'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1',
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-poppins)] text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
