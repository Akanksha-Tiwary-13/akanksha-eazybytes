import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublicContext } from "@/components/layout/PublicLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SkillBar } from "@/components/public/SkillBar";
import { buttonClasses } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import type { ProjectDTO, SkillDTO } from "@shared/types";

export default function HomePage() {
  const { settings, loading: settingsLoading } = usePublicContext();
  usePageTitle(settings ? `${settings.siteTitle} — ${settings.tagline}` : "Portfolio");

  const { data: projects, loading: projectsLoading } = useApiResource<ProjectDTO[]>(
    "/projects?featured=true",
    ["projects"]
  );
  const { data: skills, loading: skillsLoading } = useApiResource<SkillDTO[]>("/skills", [
    "skills",
  ]);

  if (settingsLoading || !settings) return <FullPageSpinner />;

  const skillsByCategory = (skills ?? []).reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start gap-6 py-12"
      >
        {settings.avatarUrl && (
          <img
            src={settings.avatarUrl}
            alt={settings.siteTitle}
            className="h-24 w-24 rounded-full border border-[var(--color-border)] object-cover"
          />
        )}
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-accent)]">
            {settings.location ?? "Available for work"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{settings.siteTitle}</h1>
          <p className="mt-3 text-xl text-[var(--color-text-muted)]">{settings.tagline}</p>
        </div>
        <p className="max-w-2xl text-[var(--color-text-muted)]">{settings.aboutText}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/projects" className={buttonClasses("primary")}>
            View my work <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className={buttonClasses("secondary")}>
            Get in touch
          </Link>
          {settings.resumeUrl && (
            <a
              href={settings.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses("ghost")}
            >
              Resume
            </a>
          )}
        </div>
      </motion.section>

      <section className="py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Projects</h2>
          <Link to="/projects" className="text-sm font-medium text-[var(--color-accent)]">
            See all
          </Link>
        </div>
        {projectsLoading ? (
          <FullPageSpinner />
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-text-muted)]">No featured projects yet.</p>
        )}
      </section>

      <section className="py-12">
        <h2 className="mb-6 text-2xl font-semibold">Skills</h2>
        {skillsLoading ? (
          <FullPageSpinner />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  {category}
                </h3>
                <div className="space-y-4">
                  {items.map((skill) => (
                    <SkillBar key={skill.id} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
