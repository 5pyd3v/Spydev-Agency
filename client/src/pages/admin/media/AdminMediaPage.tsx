import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Copy, Search, Trash2, Upload } from 'lucide-react';
import { mediaApi } from '@/api/media.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/admin/form/FormField';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { Media } from '@/types';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminMediaPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [deleting, setDeleting] = useState<Media | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['media', debouncedSearch],
    queryFn: () => mediaApi.list({ search: debouncedSearch || undefined, limit: 48 }),
  });
  const items = data?.data ?? [];

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => mediaApi.upload(files),
    onSuccess: (uploaded) => {
      toast.success(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? 's' : ''}`);
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Upload failed')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.remove(id),
    onSuccess: () => {
      toast.success('Media deleted');
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadMutation.mutate(Array.from(files));
  };

  const copyUrl = (item: Media) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item._id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Media Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload and manage images used across the site.</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
            <Upload className="h-4 w-4" />
            {uploadMutation.isPending ? 'Uploading…' : 'Upload'}
          </Button>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="mt-6 rounded-2xl border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground"
      >
        Drag and drop images here, or use the Upload button.
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media…" className="pl-10" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading && Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}

        {!isLoading && items.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No media uploaded yet.</p>
        )}

        {items.map((item) => (
          <div key={item._id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
            <img src={item.url} alt={item.altText || item.originalName} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => copyUrl(item)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-foreground hover:bg-white"
                  aria-label="Copy URL"
                >
                  {copiedId === item._id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(item)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-danger hover:bg-white"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="truncate text-[10px] text-white">{formatBytes(item.bytes)}</p>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this file?"
        description="This cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleting) await deleteMutation.mutateAsync(deleting._id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
