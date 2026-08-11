import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/api/axiosClient';
import { useDebounce } from '@/hooks/useDebounce';
import type { ApiSuccess } from '@/types';

interface Identified {
  _id: string;
}

interface AdminResourceApi<T> {
  listAdmin: (params?: { page?: number; limit?: number; search?: string }) => Promise<ApiSuccess<T[]>>;
  create: (payload: Partial<T>) => Promise<T>;
  update: (id: string, payload: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<ApiSuccess<null>>;
  reorder: (items: { id: string; displayOrder: number }[]) => Promise<ApiSuccess<null>>;
}

/**
 * Pairs a resource API client with the paginated-list + CRUD + reorder UX
 * shared by every admin resource screen (search, page state, invalidation,
 * and toast feedback on every mutation). Only depends on the admin-facing
 * methods, so it accepts any client shaped like one from `createResourceApi`
 * — including ones with a customized `listPublic` (e.g. Projects).
 */
export function useAdminResource<T extends Identified>(api: AdminResourceApi<T>, resourceKey: string) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const listQuery = useQuery({
    queryKey: [resourceKey, 'admin', page, debouncedSearch],
    queryFn: () => api.listAdmin({ page, search: debouncedSearch || undefined }),
    placeholderData: (prev) => prev,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [resourceKey] });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<T>) => api.create(payload),
    onSuccess: () => {
      toast.success('Created successfully');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to create')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<T> }) => api.update(id, payload),
    onSuccess: () => {
      toast.success('Updated successfully');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to update')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => {
      toast.success('Deleted successfully');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete')),
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; displayOrder: number }[]) => api.reorder(items),
    onSuccess: invalidate,
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to reorder')),
  });

  const items = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  return useMemo(
    () => ({
      items,
      meta,
      isLoading: listQuery.isLoading,
      isFetching: listQuery.isFetching,
      page,
      setPage,
      search,
      setSearch,
      create: createMutation.mutateAsync,
      isCreating: createMutation.isPending,
      update: updateMutation.mutateAsync,
      isUpdating: updateMutation.isPending,
      remove: deleteMutation.mutateAsync,
      isDeleting: deleteMutation.isPending,
      reorder: reorderMutation.mutateAsync,
    }),
    [
      items,
      meta,
      listQuery.isLoading,
      listQuery.isFetching,
      page,
      search,
      createMutation.mutateAsync,
      createMutation.isPending,
      updateMutation.mutateAsync,
      updateMutation.isPending,
      deleteMutation.mutateAsync,
      deleteMutation.isPending,
      reorderMutation.mutateAsync,
    ]
  );
}
