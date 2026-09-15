import { lazy, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const AccessDeniedPage = lazy(() => import("@/pages/admin/AccessDeniedPage"));

/**
 * Gates a route behind authentication and, by default, the ADMIN role.
 * This is a UX convenience only - the backend independently enforces the
 * same rule on every CMS API route via requireAuth + requireAdmin, so a
 * user can't get real access just by bypassing this component.
 */
export function ProtectedRoute({
  children,
  requireAdmin = true,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && user?.role !== "ADMIN") {
    return <AccessDeniedPage />;
  }

  return children;
}
