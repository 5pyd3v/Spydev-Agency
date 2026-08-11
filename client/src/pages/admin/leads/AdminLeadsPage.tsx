import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Mail, Search, Trash2 } from 'lucide-react';
import { LEAD_STATUSES, leadsApi } from '@/api/leads.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input, Select, Textarea } from '@/components/admin/form/FormField';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Drawer } from '@/components/admin/Drawer';
import { cn } from '@/utils/cn';
import type { Lead, LeadStatus } from '@/types/entities';

const STATUS_VARIANT: Record<LeadStatus, 'neutral' | 'info' | 'accent' | 'warning' | 'success' | 'danger'> = {
  new: 'info',
  contacted: 'accent',
  qualified: 'warning',
  'proposal-sent': 'warning',
  won: 'success',
  lost: 'danger',
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leads', debouncedSearch, statusFilter],
    queryFn: () => leadsApi.list({ search: debouncedSearch || undefined, status: statusFilter || undefined }),
  });
  const leads = data?.data ?? [];
  const unreadCount = (data?.meta?.unreadCount as number) ?? 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['leads'] });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<Lead, 'status' | 'isRead'>> }) =>
      leadsApi.update(id, payload),
    onSuccess: (updated) => {
      invalidate();
      setSelected(updated);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => leadsApi.addNote(id, text),
    onSuccess: (updated) => {
      toast.success('Note added');
      setNoteText('');
      invalidate();
      setSelected(updated);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.remove(id),
    onSuccess: () => {
      toast.success('Lead deleted');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const openLead = (lead: Lead) => {
    setSelected(lead);
    if (!lead.isRead) updateMutation.mutate({ id: lead._id, payload: { isRead: true } });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} — contact form and project inquiry submissions.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads…" className="pl-10" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-surface">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : leads.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No leads yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground/70">
                <th className="py-3 pl-4">From</th>
                <th className="py-3">Source</th>
                <th className="py-3">Status</th>
                <th className="py-3">Received</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => openLead(lead)}
                  className={cn('cursor-pointer border-b border-border last:border-0 hover:bg-surface-hover', !lead.isRead && 'bg-accent/5')}
                >
                  <td className="py-3 pl-4">
                    <p className={cn('text-sm text-foreground', !lead.isRead && 'font-semibold')}>{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{lead.source === 'contact' ? 'Contact form' : 'Project inquiry'}</td>
                  <td className="py-3">
                    <Badge variant={STATUS_VARIANT[lead.status]}>{lead.status}</Badge>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{formatDate(lead.createdAt)}</td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleting(lead);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} description={selected?.email}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Select
                value={selected.status}
                onChange={(e) => updateMutation.mutate({ id: selected._id, payload: { status: e.target.value as LeadStatus } })}
                className="w-44"
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-sm text-accent hover:underline">
                <Mail className="h-3.5 w-3.5" /> Reply
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {selected.phone && <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-foreground">{selected.phone}</p></div>}
              {selected.company && <div><p className="text-xs text-muted-foreground">Company</p><p className="text-foreground">{selected.company}</p></div>}
              {selected.service && <div><p className="text-xs text-muted-foreground">Service</p><p className="text-foreground">{selected.service}</p></div>}
              {selected.projectType && <div><p className="text-xs text-muted-foreground">Project type</p><p className="text-foreground">{selected.projectType}</p></div>}
              {selected.budget && <div><p className="text-xs text-muted-foreground">Budget</p><p className="text-foreground">{selected.budget}</p></div>}
              {selected.timeline && <div><p className="text-xs text-muted-foreground">Timeline</p><p className="text-foreground">{selected.timeline}</p></div>}
            </div>

            {(selected.message || selected.projectDescription) && (
              <div>
                <p className="text-xs text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground">{selected.message || selected.projectDescription}</p>
              </div>
            )}

            {selected.requiredTechnologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selected.requiredTechnologies.map((t) => (
                  <span key={t} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-sm font-semibold text-foreground">Internal notes</p>
              <div className="mt-3 space-y-2">
                {selected.notes.map((note, i) => (
                  <div key={i} className="rounded-xl bg-surface p-3 text-sm">
                    <p className="text-foreground">{note.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2} placeholder="Add a note…" />
              </div>
              <Button
                size="sm"
                className="mt-2"
                disabled={!noteText || noteMutation.isPending}
                onClick={() => noteMutation.mutate({ id: selected._id, text: noteText })}
              >
                Add note
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete lead from "${deleting?.name}"?`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleting) await deleteMutation.mutateAsync(deleting._id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
