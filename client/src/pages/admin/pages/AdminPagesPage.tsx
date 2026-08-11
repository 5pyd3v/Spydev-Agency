import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { pagesApi } from '@/api/entities.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/admin/Drawer';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Skeleton } from '@/components/ui/Skeleton';

const MANAGED_PAGES = [
  { slug: 'about', label: 'About', defaultTitle: 'About SpyDev' },
  { slug: 'privacy-policy', label: 'Privacy Policy', defaultTitle: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Service', defaultTitle: 'Terms of Service' },
];

export function AdminPagesPage() {
  const queryClient = useQueryClient();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const { data: pages, isLoading } = useQuery({ queryKey: ['pages', 'admin'], queryFn: pagesApi.listAdmin });
  const { data: activePage } = useQuery({
    queryKey: ['pages', 'admin', editingSlug],
    queryFn: () => pagesApi.getAdmin(editingSlug as string),
    enabled: !!editingSlug,
    retry: false,
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  useEffect(() => {
    if (!editingSlug) return;
    const managed = MANAGED_PAGES.find((p) => p.slug === editingSlug);
    if (activePage) {
      setTitle(activePage.title);
      setContent(activePage.content);
      setStatus(activePage.status);
      setSeoTitle(activePage.seo?.title ?? '');
      setSeoDescription(activePage.seo?.description ?? '');
    } else {
      setTitle(managed?.defaultTitle ?? '');
      setContent('');
      setStatus('active');
      setSeoTitle('');
      setSeoDescription('');
    }
  }, [editingSlug, activePage]);

  const saveMutation = useMutation({
    mutationFn: () =>
      pagesApi.save(editingSlug as string, { title, content, status, seo: { title: seoTitle, description: seoDescription } }),
    onSuccess: () => {
      toast.success('Page saved');
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setEditingSlug(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Edit the content of your static pages.</p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : (
          MANAGED_PAGES.map((managed) => {
            const existing = pages?.find((p) => p.slug === managed.slug);
            return (
              <div key={managed.slug} className="flex items-center justify-between border-b border-border px-5 py-4 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{managed.label}</p>
                  <p className="text-xs text-muted-foreground">/{managed.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  {existing ? (
                    <Badge variant={existing.status === 'active' ? 'success' : 'neutral'}>{existing.status}</Badge>
                  ) : (
                    <Badge variant="neutral">Not created</Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingSlug(managed.slug)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Drawer
        open={!!editingSlug}
        onClose={() => setEditingSlug(null)}
        title={`Edit ${MANAGED_PAGES.find((p) => p.slug === editingSlug)?.label ?? ''}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditingSlug(null)}>Cancel</Button>
            <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FieldWrapper label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Content">
            <RichTextEditor value={content} onChange={setContent} />
          </FieldWrapper>
          <FieldWrapper label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}>
              <option value="active">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="SEO title">
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="SEO description">
            <Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          </FieldWrapper>
        </div>
      </Drawer>
    </div>
  );
}
