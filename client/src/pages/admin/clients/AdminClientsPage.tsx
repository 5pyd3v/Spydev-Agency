import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { clientsApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select } from '@/components/admin/form/FormField';
import type { Client } from '@/types/entities';

interface FormState {
  name: string;
  logoUrl: string;
  logoDarkUrl: string;
  websiteUrl: string;
  status: 'active' | 'inactive';
}
const EMPTY: FormState = { name: '', logoUrl: '', logoDarkUrl: '', websiteUrl: '', status: 'active' };

export function AdminClientsPage() {
  const resource = useAdminResource<Client>(clientsApi, 'clients');
  const [items, setItems] = useState<Client[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState<Client | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset } = useForm<FormState>({ defaultValues: EMPTY });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (client: Client) => {
    setEditing(client);
    reset({ name: client.name, logoUrl: client.logoUrl, logoDarkUrl: client.logoDarkUrl, websiteUrl: client.websiteUrl, status: client.status });
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
          <h1 className="font-display text-2xl font-semibold text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the client logos shown in the "Trusted by" section.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New client
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search clients…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No clients yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((c, i) => ({ id: c._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            {
              header: 'Client',
              render: (c) => (
                <div className="flex items-center gap-3">
                  {c.logoUrl && <img src={c.logoUrl} alt={c.name} className="h-6 w-auto object-contain" />}
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                </div>
              ),
            },
            { header: 'Status', render: (c) => <Badge variant={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit client' : 'New client'}
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
          <FieldWrapper label="Client name" required>
            <Input {...register('name', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Logo URL" required>
            <Input {...register('logoUrl', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Dark-mode logo URL" hint="Optional — falls back to the default logo">
            <Input {...register('logoDarkUrl')} />
          </FieldWrapper>
          <FieldWrapper label="Website URL">
            <Input {...register('websiteUrl')} />
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
