import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { caseStudiesApi } from '@/api/caseStudies.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/admin/form/FormField';
import { CaseStudyFormDrawer, type CaseStudyFormValues } from './CaseStudyFormDrawer';
import type { CaseStudy } from '@/types/entities';

export function AdminCaseStudiesPage() {
  const resource = useAdminResource<CaseStudy>(caseStudiesApi, 'case-studies');
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [deleting, setDeleting] = useState<CaseStudy | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);

  const onSubmit = async (values: CaseStudyFormValues) => {
    if (editing) await resource.update({ id: editing._id, payload: values });
    else await resource.create(values);
    setDrawerOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Case Studies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage in-depth case studies.</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setDrawerOpen(true); }}>
          <Plus className="h-4 w-4" /> New case study
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search case studies…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No case studies yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((c, i) => ({ id: c._id, displayOrder: i })));
          }}
          onEdit={(cs) => { setEditing(cs); setDrawerOpen(true); }}
          onDelete={setDeleting}
          columns={[
            {
              header: 'Case study',
              render: (cs) => (
                <div>
                  <p className="text-sm font-medium text-foreground">{cs.title}</p>
                  <p className="text-xs text-muted-foreground">{cs.client}</p>
                </div>
              ),
            },
            { header: 'Status', render: (cs) => <Badge variant={cs.status === 'active' ? 'success' : cs.status === 'draft' ? 'warning' : 'neutral'}>{cs.status}</Badge> },
          ]}
        />
      </div>

      <CaseStudyFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={onSubmit}
        caseStudy={editing}
        isSubmitting={resource.isCreating || resource.isUpdating}
      />

      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.title}"?`}
        confirmLabel="Delete"
        isLoading={resource.isDeleting}
        onConfirm={async () => {
          if (deleting) await resource.remove(deleting._id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
