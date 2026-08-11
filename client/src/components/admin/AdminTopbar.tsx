import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export function AdminTopbar({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-6">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Link
        to="/"
        target="_blank"
        className="hidden text-xs font-medium text-muted-foreground hover:text-foreground lg:block"
      >
        View live site ↗
      </Link>

      <div className="relative ml-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3 hover:bg-surface-hover"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
            {user?.name?.charAt(0)?.toUpperCase() ?? <UserIcon className="h-3.5 w-3.5" />}
          </span>
          <span className="hidden text-sm font-medium text-foreground sm:block">{user?.name}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', menuOpen && 'rotate-180')} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="glass absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl p-2 shadow-soft">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                <span className="mt-1.5 inline-block rounded-full bg-surface px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                  {user?.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
