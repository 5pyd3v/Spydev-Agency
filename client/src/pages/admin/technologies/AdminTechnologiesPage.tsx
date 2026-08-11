import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { technologiesApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select } from '@/components/admin/form/FormField';
import type { Technology } from '@/types/entities';

interface FormState {
  name: string;
  icon: string;
  category: Technology['category'];
  status: 'active' | 'inactive';
}

const EMPTY: FormState = { name: '', icon: '', category: 'other', status: 'active' };
const CATEGORIES: Technology['category'][] = ['frontend', 'backend', 'mobile', 'database', 'ai', 'devops', 'security', 'other'];

export function AdminTechnologiesPage() {
  const resource = useAdminResource<Technology>(technologiesApi, 'technologies');
  const [items, setItems] = useState<Technology[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Technology | null>(null);
  const [deleting, setDeleting] = useState<Technology | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset } = useForm<FormState>({ defaultValues: EMPTY });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (tech: Technology) => {
    setEditing(tech);
    reset({ name: tech.name, icon: tech.icon, category: tech.category, status: tech.status });
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
          <h1 className="font-display text-2xl font-semibold text-foreground">Technologies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the tech stack shown on your homepage.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New technology
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search technologies…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No technologies yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((t, i) => ({ id: t._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            { header: 'Name', render: (t) => <span className="text-sm font-medium text-foreground">{t.name}</span> },
            { header: 'Category', render: (t) => <span className="text-sm capitalize text-muted-foreground">{t.category}</span> },
            { header: 'Status', render: (t) => <Badge variant={t.status === 'active' ? 'success' : 'neutral'}>{t.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit technology' : 'New technology'}
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
          <FieldWrapper label="Name" required>
            <Input {...register('name', { required: true })} placeholder="React" />
          </FieldWrapper>
          <FieldWrapper label="Icon" hint="lucide.dev name (optional)">
            <Input {...register('icon')} placeholder="atom" />
          </FieldWrapper>
          <FieldWrapper label="Category">
            <Select {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
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
        title={`Delete "${deleting?.name}"?`}
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
