import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/Button";

export default function AccessDeniedPage() {
  usePageTitle("Access Denied");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <ShieldAlert size={22} />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-1 max-w-sm text-sm text-[var(--color-text-muted)]">
          {user?.email ? `${user.email} is` : "Your account is"} signed in, but this dashboard is
          restricted to admin accounts only.
        </p>
      </div>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="secondary">Back to site</Button>
        </Link>
        <Button variant="danger" onClick={logout}>
          Log out
        </Button>
      </div>
    </div>
  );
}
