import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { navigationApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select } from '@/components/admin/form/FormField';
import { Switch } from '@/components/admin/Switch';
import type { NavigationItem } from '@/types/entities';

interface FormState {
  label: string;
  url: string;
  location: 'header' | 'footer';
  openInNewTab: boolean;
  status: 'active' | 'inactive';
}
const EMPTY: FormState = { label: '', url: '', location: 'header', openInNewTab: false, status: 'active' };

export function AdminNavigationPage() {
  const resource = useAdminResource<NavigationItem>(navigationApi, 'navigation');
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<NavigationItem | null>(null);
  const [deleting, setDeleting] = useState<NavigationItem | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({ defaultValues: EMPTY });
  const openInNewTab = watch('openInNewTab');

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (item: NavigationItem) => {
    setEditing(item);
    reset({ label: item.label, url: item.url, location: item.location, openInNewTab: item.openInNewTab, status: item.status });
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
          <h1 className="font-display text-2xl font-semibold text-foreground">Navigation</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage header and footer navigation links.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New link
        </Button>
      </div>

      <div className="mt-6">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No navigation items yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((n, i) => ({ id: n._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            { header: 'Label', render: (n) => <span className="text-sm font-medium text-foreground">{n.label}</span> },
            { header: 'URL', render: (n) => <span className="text-sm text-muted-foreground">{n.url}</span> },
            { header: 'Location', render: (n) => <Badge variant="neutral">{n.location}</Badge> },
            { header: 'Status', render: (n) => <Badge variant={n.status === 'active' ? 'success' : 'neutral'}>{n.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit link' : 'New link'}
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
          <FieldWrapper label="Label" required>
            <Input {...register('label', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="URL" required>
            <Input {...register('url', { required: true })} placeholder="/services" />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Location">
              <Select {...register('location')}>
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Status">
              <Select {...register('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FieldWrapper>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="text-sm font-medium text-foreground">Open in new tab</span>
            <Switch checked={openInNewTab} onChange={(v) => setValue('openInNewTab', v)} />
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.label}"?`}
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
