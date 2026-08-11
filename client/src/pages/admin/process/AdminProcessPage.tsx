import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { processApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import type { ProcessStep } from '@/types/entities';

interface FormState {
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
}
const EMPTY: FormState = { title: '', description: '', icon: 'circle-dot', status: 'active' };

export function AdminProcessPage() {
  const resource = useAdminResource<ProcessStep>(processApi, 'process');
  const [items, setItems] = useState<ProcessStep[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProcessStep | null>(null);
  const [deleting, setDeleting] = useState<ProcessStep | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset } = useForm<FormState>({ defaultValues: EMPTY });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (step: ProcessStep) => {
    setEditing(step);
    reset({ title: step.title, description: step.description, icon: step.icon, status: step.status });
    setDrawerOpen(true);
  };
  const onSubmit = async (values: FormState) => {
    if (editing) await resource.update({ id: editing._id, payload: values });
    else await resource.create(values);
    setDrawerOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Process</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your development process steps.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New step
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search steps…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No process steps yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((s, i) => ({ id: s._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            { header: 'Title', render: (s) => <span className="text-sm font-medium text-foreground">{s.title}</span> },
            { header: 'Description', render: (s) => <span className="text-sm text-muted-foreground line-clamp-1">{s.description}</span> },
            { header: 'Status', render: (s) => <Badge variant={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit step' : 'New step'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={resource.isCreating || resource.isUpdating}>
              {resource.isCreating || resource.isUpdating ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldWrapper label="Title" required>
            <Input {...register('title', { required: true })} placeholder="Discover" />
          </FieldWrapper>
          <FieldWrapper label="Description">
            <Textarea rows={3} {...register('description')} />
          </FieldWrapper>
          <FieldWrapper label="Icon" hint="lucide.dev name">
            <Input {...register('icon')} />
          </FieldWrapper>
          <FieldWrapper label="Status">
            <Select {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FieldWrapper>
        </form>
      </Drawer>

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
