import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { blogPostsApi } from '@/api/blogPosts.api';

function formatDate(date?: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog', 'posts', 'public', slug],
    queryFn: () => blogPostsApi.getPublicBySlug(slug as string),
    enabled: !!slug,
  });

  if (isError) return <Navigate to="/404" replace />;
  if (isLoading) {
    return (
      <Container className="max-w-3xl py-20">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-10 h-96 w-full rounded-3xl" />
      </Container>
    );
  }
  if (!post) return null;

  const author = typeof post.author === 'object' ? post.author : null;
  const category = typeof post.category === 'object' ? post.category : null;

  return (
    <>
      <Helmet>
        <title>{post.seo?.title || `${post.title} — SpyDev`}</title>
        <meta name="description" content={post.seo?.description || post.excerpt} />
      </Helmet>

      <Container className="max-w-3xl py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>

        <Reveal className="mt-6">
          {category && <span className="text-sm font-medium text-accent">{category.name}</span>}
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            {author && (
              <span className="flex items-center gap-2">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[10px] font-semibold text-accent">
                    {author.name.charAt(0)}
                  </span>
                )}
                {author.name}
              </span>
            )}
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </Reveal>

        {post.coverImage && (
          <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border">
            <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
          </Reveal>
        )}

        <Reveal
          className="prose prose-neutral dark:prose-invert mt-10 max-w-none [&_a]:text-accent [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-foreground [&_h3]:font-display [&_h3]:text-foreground [&_p]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-surface [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
