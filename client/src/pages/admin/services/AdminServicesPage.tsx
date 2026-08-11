import { useEffect, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { servicesApi } from '@/api/services.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/admin/form/FormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ServiceFormDrawer, serviceFormToPayload, type ServiceFormValues } from './ServiceFormDrawer';
import { getApiErrorMessage } from '@/api/axiosClient';
import { getIcon } from '@/utils/icons';
import type { Service } from '@/types';

function SortableRow({ service, onEdit, onDelete }: { service: Service; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service._id });
  const Icon = getIcon(service.icon);

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-border last:border-0"
    >
      <td className="w-10 py-3 pl-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-accent">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{service.title}</p>
            <p className="text-xs text-muted-foreground">/{service.slug}</p>
          </div>
        </div>
      </td>
      <td className="py-3 text-sm text-muted-foreground">
        {service.technologies.slice(0, 3).join(', ') || '—'}
      </td>
      <td className="py-3">
        <Badge variant={service.status === 'active' ? 'success' : service.status === 'draft' ? 'warning' : 'neutral'}>
          {service.status}
        </Badge>
      </td>
      <td className="py-3 pr-4 text-right">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminServicesPage() {
  const resource = useAdminResource<Service>(servicesApi, 'services');
  const [orderedServices, setOrderedServices] = useState<Service[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  useEffect(() => setOrderedServices(resource.items), [resource.items]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedServices.findIndex((s) => s._id === active.id);
    const newIndex = orderedServices.findIndex((s) => s._id === over.id);
    const reordered = arrayMove(orderedServices, oldIndex, newIndex);
    setOrderedServices(reordered);

    try {
      await resource.reorder(reordered.map((s, i) => ({ id: s._id, displayOrder: i })));
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save order'));
      setOrderedServices(resource.items);
    }
  };

  const openCreate = () => {
    setEditingService(null);
    setDrawerOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    const payload = serviceFormToPayload(values);
    if (editingService) {
      await resource.update({ id: editingService._id, payload });
    } else {
      await resource.create(payload);
    }
    setDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    await resource.remove(deletingService._id);
    setDeletingService(null);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the services shown on your public site.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          New service
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={resource.search}
            onChange={(e) => resource.setSearch(e.target.value)}
            placeholder="Search services…"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-surface">
        {resource.isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : orderedServices.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No services found.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground/70">
                  <th className="py-3 pl-4"></th>
                  <th className="py-3">Service</th>
                  <th className="py-3">Technologies</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 pr-4"></th>
                </tr>
              </thead>
              <SortableContext items={orderedServices.map((s) => s._id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {orderedServices.map((service) => (
                    <SortableRow
                      key={service._id}
                      service={service}
                      onEdit={() => openEdit(service)}
                      onDelete={() => setDeletingService(service)}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        )}
      </div>

      <ServiceFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        service={editingService}
        isSubmitting={resource.isCreating || resource.isUpdating}
      />

      <ConfirmDialog
        open={!!deletingService}
        title={`Delete "${deletingService?.title}"?`}
        description="This cannot be undone. The service will be removed from the public site immediately."
        confirmLabel="Delete"
        isLoading={resource.isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingService(null)}
      />
    </div>
  );
}
