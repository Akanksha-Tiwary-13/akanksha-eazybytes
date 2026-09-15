import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { BlogPostDTO } from "@shared/types";

const postFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  excerpt: z.string().min(2, "Excerpt is required").max(300),
  content: z.string().min(2, "Content is required"),
  coverImageUrl: z.string().url().or(z.literal("")),
  tags: z.string(),
  published: z.boolean(),
});

type PostForm = z.infer<typeof postFormSchema>;

function toFormValues(post?: BlogPostDTO): PostForm {
  return {
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImageUrl: post?.coverImageUrl ?? "",
    tags: post?.tags.join(", ") ?? "",
    published: post?.published ?? false,
  };
}

export default function BlogAdminPage() {
  usePageTitle("Manage Blog");
  const { data: posts, loading, refetch } = useApiResource<BlogPostDTO[]>("/blog", ["blog"]);
  const [editing, setEditing] = useState<BlogPostDTO | "new" | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({ resolver: zodResolver(postFormSchema) });

  function openNew() {
    reset(toFormValues());
    setEditing("new");
  }

  function openEdit(post: BlogPostDTO) {
    reset(toFormValues(post));
    setEditing(post);
  }

  async function onSubmit(values: PostForm) {
    const payload = {
      ...values,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editing === "new") {
      await api.post("/blog", payload);
    } else if (editing) {
      await api.put(`/blog/${editing.id}`, payload);
    }
    setEditing(null);
    refetch();
  }

  async function handleDelete(post: BlogPostDTO) {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await api.delete(`/blog/${post.id}`);
    refetch();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-[var(--color-text-muted)]">Write and publish updates.</p>
        </div>
        <Button onClick={openNew} className="inline-flex items-center gap-2">
          <Plus size={16} /> New post
        </Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editing === "new" ? "New post" : "Edit post"}</h2>
            <button onClick={() => setEditing(null)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input id="excerpt" {...register("excerpt")} />
              {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt.message}</p>}
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" rows={8} {...register("content")} />
              {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="coverImageUrl">Cover image URL</Label>
                <Input id="coverImageUrl" {...register("coverImageUrl")} />
                {errors.coverImageUrl && (
                  <p className="mt-1 text-xs text-red-500">Must be a valid URL</p>
                )}
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" {...register("tags")} placeholder="web-dev, react" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("published")} /> Published
            </label>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save post"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <FullPageSpinner />
      ) : (
        <div className="space-y-3">
          {posts?.map((post) => (
            <Card key={post.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <Badge className={post.published ? "border-green-500 text-green-600" : ""}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{post.excerpt}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEdit(post)}
                  aria-label="Edit"
                  className="rounded-lg p-2 hover:bg-[var(--color-bg-subtle)]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  aria-label="Delete"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
          {posts?.length === 0 && (
            <p className="text-[var(--color-text-muted)]">No posts yet. Write your first one.</p>
          )}
        </div>
      )}
    </div>
  );
}
