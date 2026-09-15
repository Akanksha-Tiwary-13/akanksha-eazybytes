import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { BlogCard } from "@/components/public/BlogCard";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { BlogPostDTO } from "@shared/types";

export default function BlogPage() {
  usePageTitle("Blog");
  const { data: posts, loading } = useApiResource<BlogPostDTO[]>("/blog", ["blog"]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold">Blog</h1>
      <p className="mb-10 text-[var(--color-text-muted)]">
        Notes on what I'm building and learning.
      </p>

      {loading ? (
        <FullPageSpinner />
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--color-text-muted)]">No posts published yet.</p>
      )}
    </div>
  );
}
