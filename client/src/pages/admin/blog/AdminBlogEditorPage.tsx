import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { blogPostsApi } from '@/api/blogPosts.api';
import { blogCategoriesApi } from '@/api/entities.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Skeleton } from '@/components/ui/Skeleton';

export function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', 'posts', 'admin', id],
    queryFn: () => blogPostsApi.getById(id as string),
    enabled: !isNew,
  });
  const { data: categories } = useQuery({ queryKey: ['blog', 'categories', 'admin'], queryFn: () => blogCategoriesApi.listAdmin() });

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setCoverImage(post.coverImage);
      setCategory(typeof post.category === 'object' ? post.category?._id ?? '' : post.category ?? '');
      setTags(post.tags);
      setStatus(post.status);
      setPublishedAt(post.publishedAt ? post.publishedAt.slice(0, 16) : '');
      setSeoTitle(post.seo?.title ?? '');
      setSeoDescription(post.seo?.description ?? '');
    }
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        excerpt,
        content,
        coverImage,
        category: category || undefined,
        tags,
        status,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        seo: { title: seoTitle, description: seoDescription },
      };
      if (isNew) return blogPostsApi.create(payload);
      return blogPostsApi.update(id as string, payload);
    },
    onSuccess: (saved) => {
      toast.success('Post saved');
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      if (isNew) navigate(`/admin/blog/${saved._id}`, { replace: true });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to save post')),
  });

  if (!isNew && isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-20">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to posts
        </button>
        <div className="flex items-center gap-2">
          <Select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className="w-36">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !title}>
            {saveMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="border-none bg-transparent px-0 font-display text-3xl font-semibold focus:ring-0"
        />

        <FieldWrapper label="Excerpt">
          <Textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary for previews" />
        </FieldWrapper>

        <FieldWrapper label="Content">
          <RichTextEditor value={content} onChange={setContent} />
        </FieldWrapper>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldWrapper label="Cover image URL">
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
          </FieldWrapper>
          <FieldWrapper label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">None</option>
              {categories?.data.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Select>
          </FieldWrapper>
        </div>

        <FieldWrapper label="Tags">
          <TagInput value={tags} onChange={setTags} placeholder="Add and press Enter" />
        </FieldWrapper>

        <FieldWrapper label="Publish date" hint="Set a future date to schedule this post">
          <Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
        </FieldWrapper>

        <div className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">SEO</h3>
          <div className="mt-3 space-y-3">
            <FieldWrapper label="SEO title">
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </FieldWrapper>
            <FieldWrapper label="SEO description">
              <Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
            </FieldWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
