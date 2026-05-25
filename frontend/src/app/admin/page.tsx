'use client';

import { useEffect, useState } from 'react';
import { Ticket, DollarSign, Clock, CheckCircle, Users } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import RecentTicketsTable from '@/components/admin/RecentTicketsTable';
import { DashboardStats } from '@/lib/types';
import { formatNaira } from '@/lib/utils';
import { TICKET_TIERS } from '@/lib/constants';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard data');
        
        setStats({
          total_tickets: data.data.total_tickets,
          pending_count: data.data.pending_count,
          approved_count: data.data.approved_count,
          rejected_count: data.data.rejected_count,
          checked_in_count: data.data.checked_in_count,
          total_revenue: data.data.total_revenue,
          revenue_by_tier: data.data.revenue_by_tier
        });
        setRecentTickets(data.data.recent_tickets);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        {error || 'Failed to load dashboard data'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-white">
          Dashboard Overview
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Real-time statistics for ILEYA FEST.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Revenue"
          value={formatNaira(stats.total_revenue)}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pending_count}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Approved Tickets"
          value={stats.approved_count}
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Checked In"
          value={stats.checked_in_count}
          icon={Users}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Revenue by Tier */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-1 h-fit">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-white mb-6">
            Revenue by Tier
          </h2>
          <div className="space-y-5">
            {TICKET_TIERS.map(tier => {
              const tierData = stats.revenue_by_tier[tier.id] || { revenue: 0, count: 0 };
              const percentage = stats.total_revenue > 0 ? (tierData.revenue / stats.total_revenue) * 100 : 0;
              
              return (
                <div key={tier.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-300 font-medium">{tier.name}</span>
                    <span className="text-white font-semibold">{formatNaira(tierData.revenue)}</span>
                  </div>
                  <div className="w-full h-2 bg-dark-300 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: tier.color 
                      }} 
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5 text-right">{tierData.count} tickets sold</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-poppins)] text-white">
              Recent Transactions
            </h2>
            <a href="/admin/attendees" className="text-sm text-gold hover:underline">
              View All
            </a>
          </div>
          <RecentTicketsTable tickets={recentTickets} />
        </div>

      </div>
    </div>
  );
}
