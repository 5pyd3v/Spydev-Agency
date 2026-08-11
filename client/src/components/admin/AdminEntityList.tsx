import type { ReactNode } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface Identified {
  _id: string;
}

interface AdminEntityListProps<T extends Identified> {
  items: T[];
  isLoading: boolean;
  emptyLabel: string;
  columns: { header: string; render: (item: T) => ReactNode; className?: string }[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onReorder?: (reordered: T[]) => void;
}

function SortableRow<T extends Identified>({
  item,
  columns,
  onEdit,
  onDelete,
  draggable,
}: {
  item: T;
  columns: AdminEntityListProps<T>['columns'];
  onEdit: () => void;
  onDelete: () => void;
  draggable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item._id,
    disabled: !draggable,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-border last:border-0"
    >
      {draggable && (
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
      )}
      {columns.map((col) => (
        <td key={col.header} className={col.className ?? 'py-3'}>
          {col.render(item)}
        </td>
      ))}
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

export function AdminEntityList<T extends Identified>({
  items,
  isLoading,
  emptyLabel,
  columns,
  onEdit,
  onDelete,
  onReorder,
}: AdminEntityListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const draggable = !!onReorder;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;
    const oldIndex = items.findIndex((i) => i._id === active.id);
    const newIndex = items.findIndex((i) => i._id === over.id);
    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onReorder(reordered);
  };

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-3xl border border-border bg-surface p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  const table = (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground/70">
          {draggable && <th className="py-3 pl-4"></th>}
          {columns.map((col) => (
            <th key={col.header} className="py-3">
              {col.header}
            </th>
          ))}
          <th className="py-3 pr-4"></th>
        </tr>
      </thead>
      <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy} disabled={!draggable}>
        <tbody>
          {items.map((item) => (
            <SortableRow
              key={item._id}
              item={item}
              columns={columns}
              draggable={draggable}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}
            />
          ))}
        </tbody>
      </SortableContext>
    </table>
  );

  return (
    <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
      {draggable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {table}
        </DndContext>
      ) : (
        table
      )}
    </div>
  );
}
