import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { pricingApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import { Switch } from '@/components/admin/Switch';
import type { PricingPlan } from '@/types/entities';

interface FormState {
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaUrl: string;
  status: 'active' | 'inactive';
}
const EMPTY: FormState = {
  name: '', price: '', billingPeriod: 'one-time', description: '', features: [], isPopular: false,
  ctaText: 'Get started', ctaUrl: '/start-project', status: 'active',
};

export function AdminPricingPage() {
  const resource = useAdminResource<PricingPlan>(pricingApi, 'pricing');
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [deleting, setDeleting] = useState<PricingPlan | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({ defaultValues: EMPTY });
  const features = watch('features');
  const isPopular = watch('isPopular');

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (plan: PricingPlan) => {
    setEditing(plan);
    reset({
      name: plan.name, price: plan.price, billingPeriod: plan.billingPeriod, description: plan.description,
      features: plan.features, isPopular: plan.isPopular, ctaText: plan.ctaText, ctaUrl: plan.ctaUrl, status: plan.status,
    });
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
          <h1 className="font-display text-2xl font-semibold text-foreground">Pricing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage pricing packages. Enable the Pricing homepage section to display them publicly.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New plan
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search plans…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No pricing plans yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((p, i) => ({ id: p._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            { header: 'Plan', render: (p) => <span className="text-sm font-medium text-foreground">{p.name}</span> },
            { header: 'Price', render: (p) => <span className="text-sm text-muted-foreground">{p.price} / {p.billingPeriod}</span> },
            { header: 'Popular', render: (p) => (p.isPopular ? <Badge variant="accent">Popular</Badge> : null) },
            { header: 'Status', render: (p) => <Badge variant={p.status === 'active' ? 'success' : 'neutral'}>{p.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit plan' : 'New plan'}
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
          <FieldWrapper label="Plan name" required>
            <Input {...register('name', { required: true })} placeholder="Starter" />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Price" required>
              <Input {...register('price', { required: true })} placeholder="$4,999" />
            </FieldWrapper>
            <FieldWrapper label="Billing period">
              <Input {...register('billingPeriod')} placeholder="one-time" />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Description">
            <Textarea rows={2} {...register('description')} />
          </FieldWrapper>
          <FieldWrapper label="Features">
            <TagInput value={features} onChange={(f) => setValue('features', f)} placeholder="Add and press Enter" />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="CTA text">
              <Input {...register('ctaText')} />
            </FieldWrapper>
            <FieldWrapper label="CTA URL">
              <Input {...register('ctaUrl')} />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Status">
            <Select {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FieldWrapper>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="text-sm font-medium text-foreground">Mark as popular</span>
            <Switch checked={isPopular} onChange={(v) => setValue('isPopular', v)} />
          </div>
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
