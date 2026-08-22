import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { blogPostsApi } from '@/api/blogPosts.api';
import { optimizedImageUrl } from '@/utils/cloudinary';

function formatDate(date?: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function BlogListPage() {
  const { data, isLoading } = useQuery({ queryKey: ['blog', 'posts', 'public'], queryFn: () => blogPostsApi.listPublic({ limit: 12 }) });
  const posts = data?.data ?? [];

  return (
    <>
      <Helmet>
        <title>Blog — SpyDev</title>
        <meta name="description" content="Insights on software engineering, AI, and cybersecurity from the SpyDev team." />
      </Helmet>

      <Container className="py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">Blog</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Notes on building technology.
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}

          {!isLoading && posts.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No posts published yet.</p>}

          {posts.map((post) => (
            <Reveal key={post._id}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-secondary/40"
              >
                <div className="aspect-[16/9] overflow-hidden bg-background">
                  {post.coverImage ? (
                    <img
                      src={optimizedImageUrl(post.coverImage, 700)}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-2xl font-semibold text-muted-foreground/30">SD</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {typeof post.category === 'object' && post.category && (
                    <span className="text-xs font-medium text-accent">{post.category.name}</span>
                  )}
                  <h2 className="mt-2 font-display text-lg font-semibold text-foreground">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 flex-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                  <p className="mt-4 text-xs text-muted-foreground/70">{formatDate(post.publishedAt)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
