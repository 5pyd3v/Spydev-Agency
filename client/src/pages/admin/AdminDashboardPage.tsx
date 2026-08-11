import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, Image, LayoutTemplate, Users } from 'lucide-react';
import { dashboardApi } from '@/api/dashboard.api';
import { StatCard } from '@/components/admin/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.stats });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Here's what's happening across your site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)
        ) : (
          <>
            <StatCard
              label="Services"
              value={stats?.services.total ?? 0}
              hint={`${stats?.services.active ?? 0} active`}
              icon={Briefcase}
              accent
            />
            <StatCard
              label="Homepage sections"
              value={stats?.homepageSections.total ?? 0}
              hint={`${stats?.homepageSections.enabled ?? 0} enabled`}
              icon={LayoutTemplate}
            />
            <StatCard label="Media assets" value={stats?.media.total ?? 0} icon={Image} />
            <StatCard label="Admin users" value={stats?.users.total ?? 0} icon={Users} />
          </>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent services</h2>
          <Link to="/admin/services" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 divide-y divide-border">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="my-2 h-12 rounded-xl" />)}

          {!isLoading && stats?.recentServices.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">No services yet.</p>
          )}

          {stats?.recentServices.map((service) => (
            <div key={service._id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{service.title}</p>
                <p className="text-xs text-muted-foreground">/{service.slug}</p>
              </div>
              <Badge variant={service.status === 'active' ? 'success' : 'neutral'}>{service.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
