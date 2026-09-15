import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { ProjectCard } from "@/components/public/ProjectCard";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { ProjectDTO } from "@shared/types";

export default function ProjectsPage() {
  usePageTitle("Projects");
  const { data: projects, loading } = useApiResource<ProjectDTO[]>("/projects", ["projects"]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold">Projects</h1>
      <p className="mb-10 text-[var(--color-text-muted)]">
        A selection of things I've built, big and small.
      </p>

      {loading ? (
        <FullPageSpinner />
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--color-text-muted)]">No projects published yet.</p>
      )}
    </div>
  );
}
