import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProjectDTO } from "@shared/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function ProjectCard({ project, index = 0 }: { project: ProjectDTO; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="flex h-full flex-col gap-4">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <Link to={`/projects/${project.slug}`} className="text-lg font-semibold hover:text-[var(--color-accent)]">
            {project.title}
          </Link>
          <p className="text-sm text-[var(--color-text-muted)]">{project.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-2 text-sm">
          <Link to={`/projects/${project.slug}`} className="font-medium text-[var(--color-accent)]">
            View details
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <ExternalLink size={14} /> Live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <Code2 size={14} /> Code
            </a>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
