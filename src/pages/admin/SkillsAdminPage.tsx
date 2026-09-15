import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { SkillDTO } from "@shared/types";

const skillFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.coerce.number().min(1).max(5),
  order: z.coerce.number(),
});

type SkillForm = z.infer<typeof skillFormSchema>;

function toFormValues(skill?: SkillDTO): SkillForm {
  return {
    name: skill?.name ?? "",
    category: skill?.category ?? "",
    level: skill?.level ?? 3,
    order: skill?.order ?? 0,
  };
}

export default function SkillsAdminPage() {
  usePageTitle("Manage Skills");
  const { data: skills, loading, refetch } = useApiResource<SkillDTO[]>("/skills", ["skills"]);
  const [editing, setEditing] = useState<SkillDTO | "new" | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillForm>({ resolver: zodResolver(skillFormSchema) });

  function openNew() {
    reset(toFormValues());
    setEditing("new");
  }

  function openEdit(skill: SkillDTO) {
    reset(toFormValues(skill));
    setEditing(skill);
  }

  async function onSubmit(values: SkillForm) {
    if (editing === "new") {
      await api.post("/skills", values);
    } else if (editing) {
      await api.put(`/skills/${editing.id}`, values);
    }
    setEditing(null);
    refetch();
  }

  async function handleDelete(skill: SkillDTO) {
    if (!confirm(`Delete "${skill.name}"?`)) return;
    await api.delete(`/skills/${skill.id}`);
    refetch();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-[var(--color-text-muted)]">Grouped by category on your home page.</p>
        </div>
        <Button onClick={openNew} className="inline-flex items-center gap-2">
          <Plus size={16} /> New skill
        </Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editing === "new" ? "New skill" : "Edit skill"}</h2>
            <button onClick={() => setEditing(null)} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} placeholder="Frontend" />
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="level">Level (1-5)</Label>
              <Input id="level" type="number" min={1} max={5} {...register("level")} />
            </div>
            <div className="sm:col-span-4 flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save skill"}
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
          {skills?.map((skill) => (
            <Card key={skill.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{skill.name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {skill.category} · Level {skill.level}/5
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEdit(skill)}
                  aria-label="Edit"
                  className="rounded-lg p-2 hover:bg-[var(--color-bg-subtle)]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(skill)}
                  aria-label="Delete"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
          {skills?.length === 0 && (
            <p className="text-[var(--color-text-muted)]">No skills yet. Add your first one.</p>
          )}
        </div>
      )}
    </div>
  );
}
