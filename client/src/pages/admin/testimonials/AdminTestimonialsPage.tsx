import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Star } from 'lucide-react';
import { testimonialsApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { Switch } from '@/components/admin/Switch';
import type { Testimonial } from '@/types/entities';

interface FormState {
  clientName: string;
  company: string;
  position: string;
  avatar: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  status: 'active' | 'inactive';
}
const EMPTY: FormState = {
  clientName: '', company: '', position: '', avatar: '', testimonial: '', rating: 5, featured: false, status: 'active',
};

export function AdminTestimonialsPage() {
  const resource = useAdminResource<Testimonial>(testimonialsApi, 'testimonials');
  const [items, setItems] = useState<Testimonial[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({ defaultValues: EMPTY });
  const featured = watch('featured');

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset({
      clientName: t.clientName, company: t.company, position: t.position, avatar: t.avatar,
      testimonial: t.testimonial, rating: t.rating, featured: t.featured, status: t.status,
    });
    setDrawerOpen(true);
  };
  const onSubmit = async (values: FormState) => {
    const payload = { ...values, rating: Number(values.rating) };
    if (editing) await resource.update({ id: editing._id, payload });
    else await resource.create(payload);
    setDrawerOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Testimonials</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage client testimonials shown across the site.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New testimonial
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search testimonials…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No testimonials yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((t, i) => ({ id: t._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            {
              header: 'Client',
              render: (t) => (
                <div>
                  <p className="text-sm font-medium text-foreground">{t.clientName}</p>
                  <p className="text-xs text-muted-foreground">{t.company}</p>
                </div>
              ),
            },
            {
              header: 'Rating',
              render: (t) => (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
              ),
            },
            { header: 'Featured', render: (t) => (t.featured ? <Badge variant="accent">Featured</Badge> : null) },
            { header: 'Status', render: (t) => <Badge variant={t.status === 'active' ? 'success' : 'neutral'}>{t.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit testimonial' : 'New testimonial'}
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
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Client name" required>
              <Input {...register('clientName', { required: true })} />
            </FieldWrapper>
            <FieldWrapper label="Company">
              <Input {...register('company')} />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Position">
            <Input {...register('position')} placeholder="CEO" />
          </FieldWrapper>
          <FieldWrapper label="Avatar URL">
            <Input {...register('avatar')} />
          </FieldWrapper>
          <FieldWrapper label="Testimonial" required>
            <Textarea rows={4} {...register('testimonial', { required: true })} />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Rating (1–5)">
              <Select {...register('rating', { valueAsNumber: true })}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
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
            <span className="text-sm font-medium text-foreground">Featured</span>
            <Switch checked={featured} onChange={(v) => setValue('featured', v)} />
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete testimonial from "${deleting?.clientName}"?`}
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
