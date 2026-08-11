import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { homepageSectionsApi } from '@/api/homepageSections.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { Switch } from '@/components/admin/Switch';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Drawer } from '@/components/admin/Drawer';
import { Select, FieldWrapper } from '@/components/admin/form/FormField';
import { SectionContentEditor, type SectionFormState } from './SectionContentEditor';
import type { HomepageSection, HomepageSectionType } from '@/types';

const SECTION_TYPE_LABELS: Record<HomepageSectionType, string> = {
  hero: 'Hero',
  clients: 'Clients',
  services: 'Services',
  stats: 'Statistics',
  projects: 'Projects',
  process: 'Process',
  technologies: 'Technologies',
  about: 'About',
  testimonials: 'Testimonials',
  pricing: 'Pricing',
  faq: 'FAQ',
  cta: 'Call to action',
  custom: 'Custom',
};

function SortableSectionRow({
  section,
  onToggle,
  onEdit,
}: {
  section: HomepageSection;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3.5 last:border-0"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{section.heading || SECTION_TYPE_LABELS[section.type]}</p>
          <Badge variant="neutral">{SECTION_TYPE_LABELS[section.type]}</Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{section.key}</p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        aria-label="Edit section"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <Switch checked={section.enabled} onChange={onToggle} label={`Toggle ${section.type} section`} />
    </div>
  );
}

export function AdminHomepageSectionsPage() {
  const queryClient = useQueryClient();
  const { data: sections, isLoading } = useQuery({
    queryKey: ['homepage-sections', 'admin'],
    queryFn: homepageSectionsApi.listAll,
  });

  const [ordered, setOrdered] = useState<HomepageSection[]>([]);
  const [editing, setEditing] = useState<HomepageSection | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newType, setNewType] = useState<HomepageSectionType>('custom');

  useEffect(() => setOrdered(sections ?? []), [sections]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['homepage-sections'] });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<HomepageSection> }) =>
      homepageSectionsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Section updated');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<HomepageSection>) => homepageSectionsApi.create(payload),
    onSuccess: () => {
      toast.success('Section added');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; order: number; enabled?: boolean }[]) => homepageSectionsApi.reorder(items),
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to save order'));
      invalidate();
    },
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((s) => s._id === active.id);
    const newIndex = ordered.findIndex((s) => s._id === over.id);
    const reordered = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(reordered);
    reorderMutation.mutate(reordered.map((s, i) => ({ id: s._id, order: i })));
  };

  const handleToggle = (section: HomepageSection, enabled: boolean) => {
    setOrdered((prev) => prev.map((s) => (s._id === section._id ? { ...s, enabled } : s)));
    updateMutation.mutate({ id: section._id, payload: { enabled } });
  };

  const [editState, setEditState] = useState<SectionFormState>({ heading: '', subheading: '', content: {} });

  useEffect(() => {
    if (editing) {
      setEditState({ heading: editing.heading, subheading: editing.subheading, content: editing.content });
    }
  }, [editing]);

  const handleSaveEdit = async () => {
    if (!editing) return;
    await updateMutation.mutateAsync({ id: editing._id, payload: editState });
    setEditing(null);
  };

  const handleAddSection = async () => {
    const key = `${newType}-${Date.now()}`;
    await createMutation.mutateAsync({ type: newType, key, heading: '', subheading: '', content: {}, enabled: true });
    setAddOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Homepage sections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder, toggle to show or hide, and edit copy — changes reflect on the homepage immediately.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add section
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ordered.map((s) => s._id)} strategy={verticalListSortingStrategy}>
              {ordered.map((section) => (
                <SortableSectionRow
                  key={section._id}
                  section={section}
                  onToggle={(enabled) => handleToggle(section, enabled)}
                  onEdit={() => setEditing(section)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit ${editing ? SECTION_TYPE_LABELS[editing.type] : ''} section`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        {editing && <SectionContentEditor type={editing.type} state={editState} onChange={setEditState} />}
      </Drawer>

      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add homepage section"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddSection} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding…' : 'Add section'}
            </Button>
          </div>
        }
      >
        <FieldWrapper label="Section type">
          <Select value={newType} onChange={(e) => setNewType(e.target.value as HomepageSectionType)}>
            {Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      </Drawer>
    </div>
  );
}
