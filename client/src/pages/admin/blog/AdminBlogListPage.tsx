import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { blogPostsApi } from '@/api/blogPosts.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/admin/form/FormField';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { BlogPost } from '@/types/entities';

function formatDate(date?: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString();
}

export function AdminBlogListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blog', 'posts', 'admin', debouncedSearch],
    queryFn: () => blogPostsApi.listAdmin({ search: debouncedSearch || undefined }),
  });
  const posts = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogPostsApi.remove(id),
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write and manage blog posts.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/admin/blog/new')}>
          <Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts…" className="pl-10" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-surface">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground/70">
                <th className="py-3 pl-4">Title</th>
                <th className="py-3">Status</th>
                <th className="py-3">Published</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-border last:border-0">
                  <td className="py-3 pl-4">
                    <Link to={`/admin/blog/${post._id}`} className="text-sm font-medium text-foreground hover:text-accent">
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3">
                    <Badge variant={post.status === 'published' ? 'success' : 'neutral'}>{post.status}</Badge>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{formatDate(post.publishedAt)}</td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/blog/${post._id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleting(post)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.title}"?`}
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
