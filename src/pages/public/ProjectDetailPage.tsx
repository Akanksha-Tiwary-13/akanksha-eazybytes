import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { Badge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { ProjectDTO } from "@shared/types";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, loading, error } = useApiResource<ProjectDTO>(
    `/projects/${slug}`,
    ["projects"]
  );

  usePageTitle(project ? project.title : "Project");

  if (loading) return <FullPageSpinner />;

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-[var(--color-text-muted)]">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-block text-[var(--color-accent)]">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="mb-6 aspect-video w-full rounded-xl object-cover"
        />
      )}

      <h1 className="text-3xl font-bold">{project.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <p className="mt-6 whitespace-pre-line leading-relaxed text-[var(--color-text-muted)]">
        {project.description}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-accent)]"
          >
            <ExternalLink size={16} /> View live
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-accent)]"
          >
            <Code2 size={16} /> Source code
          </a>
        )}
      </div>
    </div>
  );
}
