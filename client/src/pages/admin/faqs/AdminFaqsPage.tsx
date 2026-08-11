import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { faqsApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import type { FAQ } from '@/types/entities';

interface FormState {
  question: string;
  answer: string;
  category: string;
  status: 'active' | 'inactive';
}
const EMPTY: FormState = { question: '', answer: '', category: 'General', status: 'active' };

export function AdminFaqsPage() {
  const resource = useAdminResource<FAQ>(faqsApi, 'faqs');
  const [items, setItems] = useState<FAQ[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [deleting, setDeleting] = useState<FAQ | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);
  const { register, handleSubmit, reset } = useForm<FormState>({ defaultValues: EMPTY });

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };
  const openEdit = (faq: FAQ) => {
    setEditing(faq);
    reset({ question: faq.question, answer: faq.answer, category: faq.category, status: faq.status });
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
          <h1 className="font-display text-2xl font-semibold text-foreground">FAQs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage frequently asked questions.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> New FAQ
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search FAQs…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No FAQs yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((f, i) => ({ id: f._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            { header: 'Question', render: (f) => <span className="text-sm font-medium text-foreground line-clamp-1">{f.question}</span> },
            { header: 'Category', render: (f) => <span className="text-sm text-muted-foreground">{f.category}</span> },
            { header: 'Status', render: (f) => <Badge variant={f.status === 'active' ? 'success' : 'neutral'}>{f.status}</Badge> },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit FAQ' : 'New FAQ'}
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
          <FieldWrapper label="Question" required>
            <Input {...register('question', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Answer" required>
            <Textarea rows={4} {...register('answer', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Category">
            <Input {...register('category')} />
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
        title="Delete this FAQ?"
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
