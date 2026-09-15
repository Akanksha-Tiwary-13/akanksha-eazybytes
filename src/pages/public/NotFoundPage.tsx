import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page not found");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-6xl font-bold text-[var(--color-accent)]">404</p>
      <p className="text-[var(--color-text-muted)]">This page doesn't exist.</p>
      <Link to="/" className="text-[var(--color-accent)]">
        Go back home
      </Link>
    </div>
  );
}
