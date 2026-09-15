import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApiResource } from "@/hooks/useApiResource";
import { Card } from "@/components/ui/Card";
import type { ProjectDTO, SkillDTO, BlogPostDTO, MessageDTO } from "@shared/types";

export default function DashboardHome() {
  usePageTitle("Admin Overview");

  const { data: projects } = useApiResource<ProjectDTO[]>("/projects", ["projects"]);
  const { data: skills } = useApiResource<SkillDTO[]>("/skills", ["skills"]);
  const { data: posts } = useApiResource<BlogPostDTO[]>("/blog", ["blog"]);
  const { data: messages } = useApiResource<MessageDTO[]>("/messages", ["messages"]);

  const unreadCount = messages?.filter((m) => !m.read).length ?? 0;

  const stats = [
    { label: "Projects", value: projects?.length ?? 0, to: "/admin/projects" },
    { label: "Skills", value: skills?.length ?? 0, to: "/admin/skills" },
    { label: "Blog posts", value: posts?.length ?? 0, to: "/admin/blog" },
    { label: "Unread messages", value: unreadCount, to: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Overview</h1>
      <p className="mb-8 text-[var(--color-text-muted)]">
        Manage everything that shows up on your public portfolio.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="transition hover:border-[var(--color-accent)]">
              <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
