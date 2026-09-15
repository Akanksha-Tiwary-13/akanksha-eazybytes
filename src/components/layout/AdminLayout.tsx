import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Newspaper,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-subtle)]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4 sm:flex">
        <div className="mb-6 px-2">
          <p className="text-sm font-semibold">Portfolio CMS</p>
          <p className="text-xs text-[var(--color-text-muted)]">{user?.email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-subtle)]",
                  isActive && "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-[var(--color-border)] pt-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
          >
            <ExternalLink size={16} /> View site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 sm:hidden">
          <p className="font-semibold">Portfolio CMS</p>
          <button onClick={handleLogout} className="text-sm text-[var(--color-text-muted)]">
            Log out
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-2 sm:hidden">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)]",
                  isActive && "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
