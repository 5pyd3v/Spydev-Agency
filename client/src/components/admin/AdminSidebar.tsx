import { NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { ADMIN_NAV } from './adminNav.data';
import { useAuth } from '@/contexts/AuthContext';
import { SpyDevMark } from '@/components/brand/SpyDevMark';
import { cn } from '@/utils/cn';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const { user } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <SpyDevMark size={28} />
            <span className="font-display text-base font-bold uppercase tracking-wide text-foreground">SpyDev</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {ADMIN_NAV.map((group) => {
          const items = group.items.filter((item) => !item.roles || (user && item.roles.includes(user.role)));
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group.label}
                </p>
              )}
              <div className="mt-2 space-y-0.5">
                {items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/admin'}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground',
                        isActive && 'bg-accent/10 text-accent hover:bg-accent/10 hover:text-accent',
                        collapsed && 'justify-center'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'sticky top-0 hidden h-screen-safe shrink-0 border-r border-border bg-surface transition-all duration-200 lg:block',
          collapsed ? 'w-[76px]' : 'w-64'
        )}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-surface shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
