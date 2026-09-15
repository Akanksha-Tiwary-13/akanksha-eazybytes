import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LockKeyhole,
  FolderKanban,
  Sparkles,
  Newspaper,
  Mail,
  Settings,
  Radio,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const panels = [
  { icon: FolderKanban, label: "Projects", description: "Showcase your work" },
  { icon: Sparkles, label: "Skills", description: "Track your stack" },
  { icon: Newspaper, label: "Blog", description: "Publish updates" },
  { icon: Mail, label: "Messages", description: "Contact form inbox" },
  { icon: Settings, label: "Settings", description: "Theme & profile" },
];

export default function LoginPage() {
  usePageTitle("Admin Login");
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  if (token) {
    const from = (location.state as { from?: string } | null)?.from ?? "/admin";
    return <Navigate to={from} replace />;
  }

  async function onSubmit(values: LoginForm) {
    setServerError(null);
    try {
      const { data } = await api.post("/auth/login", values);
      login(data.token, data.user);
      navigate("/admin", { replace: true });
    } catch {
      setServerError("Invalid email or password.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: branded panel preview */}
      <div className="relative hidden overflow-hidden bg-[var(--color-bg-subtle)] p-10 lg:flex lg:flex-col lg:justify-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--color-accent), transparent 45%), radial-gradient(circle at 80% 70%, var(--color-accent), transparent 40%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
              <LockKeyhole size={16} />
            </div>
            Portfolio CMS
          </div>

          <h1 className="mt-8 text-3xl font-bold leading-tight">
            Everything your site shows, managed from one place.
          </h1>
          <p className="mt-3 max-w-sm text-[var(--color-text-muted)]">
            Projects, skills, blog posts, and messages — update any of it here and it's live
            instantly, no redeploy needed.
          </p>

          <div className="relative z-10 mt-8 grid grid-cols-2 gap-3">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <panel.icon size={18} className="text-[var(--color-accent)]" />
              <p className="mt-2 text-sm font-semibold">{panel.label}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{panel.description}</p>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: panels.length * 0.06 }}
            className="flex flex-col justify-center rounded-xl border border-dashed border-[var(--color-border)] p-4"
          >
            <Radio size={16} className="text-[var(--color-accent)]" />
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Changes push live over websockets — no refresh needed.
            </p>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center bg-[var(--color-bg)] px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white lg:hidden">
              <LockKeyhole size={18} />
            </div>
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Sign in to manage your portfolio content.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="akanksha@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-red-500">{serverError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Compact panel list for mobile, where the branded column is hidden */}
          <div className="mt-10 grid grid-cols-3 gap-2 lg:hidden">
            {panels.map((panel) => (
              <div
                key={panel.label}
                className="flex flex-col items-center gap-1 rounded-lg border border-[var(--color-border)] py-3 text-center"
              >
                <panel.icon size={16} className="text-[var(--color-accent)]" />
                <p className="text-[11px] font-medium text-[var(--color-text-muted)]">
                  {panel.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
