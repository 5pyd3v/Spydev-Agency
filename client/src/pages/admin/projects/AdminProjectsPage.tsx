import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { projectsApi } from '@/api/projects.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/admin/form/FormField';
import { ProjectFormDrawer, type ProjectFormValues } from './ProjectFormDrawer';
import type { Project } from '@/types/entities';

export function AdminProjectsPage() {
  const resource = useAdminResource<Project>(projectsApi, 'projects');
  const [items, setItems] = useState<Project[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (project: Project) => {
    setEditing(project);
    setDrawerOpen(true);
  };
  const onSubmit = async (values: ProjectFormValues) => {
    if (editing) await resource.update({ id: editing._id, payload: values });
    else await resource.create(values);
    setDrawerOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio of past work.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New project
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search projects…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No projects yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((p, i) => ({ id: p._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            {
              header: 'Project',
              render: (p) => (
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.client || '/' + p.slug}</p>
                </div>
              ),
            },
            { header: 'Category', render: (p) => <span className="text-sm capitalize text-muted-foreground">{p.category}</span> },
            { header: 'Featured', render: (p) => (p.featured ? <Badge variant="accent">Featured</Badge> : null) },
            {
              header: 'Status',
              render: (p) => <Badge variant={p.status === 'active' ? 'success' : p.status === 'draft' ? 'warning' : 'neutral'}>{p.status}</Badge>,
            },
          ]}
        />
      </div>

      <ProjectFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={onSubmit}
        project={editing}
        isSubmitting={resource.isCreating || resource.isUpdating}
      />

      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.name}"?`}
        description="This cannot be undone."
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
