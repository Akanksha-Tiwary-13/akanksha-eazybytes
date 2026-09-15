import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { ProjectDTO } from "@shared/types";

const projectFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  summary: z.string().min(2, "Summary is required").max(240),
  description: z.string().min(2, "Description is required"),
  techStack: z.string(),
  imageUrl: z.string().url().or(z.literal("")),
  liveUrl: z.string().url().or(z.literal("")),
  repoUrl: z.string().url().or(z.literal("")),
  featured: z.boolean(),
  order: z.coerce.number(),
});

type ProjectForm = z.infer<typeof projectFormSchema>;

function toFormValues(project?: ProjectDTO): ProjectForm {
  return {
    title: project?.title ?? "",
    summary: project?.summary ?? "",
    description: project?.description ?? "",
    techStack: project?.techStack.join(", ") ?? "",
    imageUrl: project?.imageUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    repoUrl: project?.repoUrl ?? "",
    featured: project?.featured ?? false,
    order: project?.order ?? 0,
  };
}

export default function ProjectsAdminPage() {
  usePageTitle("Manage Projects");
  const { data: projects, loading, refetch } = useApiResource<ProjectDTO[]>("/projects", [
    "projects",
  ]);
  const [editing, setEditing] = useState<ProjectDTO | "new" | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({ resolver: zodResolver(projectFormSchema) });

  function openNew() {
    reset(toFormValues());
    setEditing("new");
  }

  function openEdit(project: ProjectDTO) {
    reset(toFormValues(project));
    setEditing(project);
  }

  async function onSubmit(values: ProjectForm) {
    const payload = {
      ...values,
      techStack: values.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editing === "new") {
      await api.post("/projects", payload);
    } else if (editing) {
      await api.put(`/projects/${editing.id}`, payload);
    }
    setEditing(null);
    refetch();
  }

  async function handleDelete(project: ProjectDTO) {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    await api.delete(`/projects/${project.id}`);
    refetch();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-[var(--color-text-muted)]">Showcase what you've built.</p>
        </div>
        <Button onClick={openNew} className="inline-flex items-center gap-2">
          <Plus size={16} /> New project
        </Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editing === "new" ? "New project" : "Edit project"}</h2>
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
              <Label htmlFor="summary">Summary</Label>
              <Input id="summary" {...register("summary")} />
              {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={5} {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="techStack">Tech stack (comma-separated)</Label>
              <Input id="techStack" {...register("techStack")} placeholder="React, Node.js, MySQL" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" {...register("imageUrl")} />
                {errors.imageUrl && <p className="mt-1 text-xs text-red-500">Must be a valid URL</p>}
              </div>
              <div>
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input id="liveUrl" {...register("liveUrl")} />
                {errors.liveUrl && <p className="mt-1 text-xs text-red-500">Must be a valid URL</p>}
              </div>
              <div>
                <Label htmlFor="repoUrl">Repo URL</Label>
                <Input id="repoUrl" {...register("repoUrl")} />
                {errors.repoUrl && <p className="mt-1 text-xs text-red-500">Must be a valid URL</p>}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("featured")} /> Featured on home page
              </label>
              <div className="flex items-center gap-2">
                <Label htmlFor="order" className="mb-0">
                  Order
                </Label>
                <Input id="order" type="number" className="w-20" {...register("order")} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save project"}
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
          {projects?.map((project) => (
            <Card key={project.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.featured && <Star size={14} className="text-[var(--color-accent)]" />}
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{project.summary}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEdit(project)}
                  aria-label="Edit"
                  className="rounded-lg p-2 hover:bg-[var(--color-bg-subtle)]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  aria-label="Delete"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
          {projects?.length === 0 && (
            <p className="text-[var(--color-text-muted)]">No projects yet. Add your first one.</p>
          )}
        </div>
      )}
    </div>
  );
}
