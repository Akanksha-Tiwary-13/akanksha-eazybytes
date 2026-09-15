import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { Badge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { BlogPostDTO } from "@shared/types";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, loading, error } = useApiResource<BlogPostDTO>(`/blog/${slug}`, ["blog"]);

  usePageTitle(post ? post.title : "Blog post");

  if (loading) return <FullPageSpinner />;

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-[var(--color-text-muted)]">Post not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-[var(--color-accent)]">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        to="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={14} /> Back to blog
      </Link>

      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="mb-6 aspect-video w-full rounded-xl object-cover"
        />
      )}

      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
        {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-8 whitespace-pre-line leading-relaxed text-[var(--color-text)]">
        {post.content}
      </div>
    </article>
  );
}
