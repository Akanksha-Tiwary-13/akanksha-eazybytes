import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { FullPageSpinner } from "@/components/ui/Spinner";

import HomePage from "@/pages/public/HomePage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetailPage from "@/pages/public/ProjectDetailPage";
import BlogPage from "@/pages/public/BlogPage";
import BlogPostPage from "@/pages/public/BlogPostPage";
import ContactPage from "@/pages/public/ContactPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

const AdminLayout = lazy(() =>
  import("@/components/layout/AdminLayout").then((m) => ({ default: m.AdminLayout }))
);
const LoginPage = lazy(() => import("@/pages/admin/LoginPage"));
const DashboardHome = lazy(() => import("@/pages/admin/DashboardHome"));
const ProjectsAdminPage = lazy(() => import("@/pages/admin/ProjectsAdminPage"));
const SkillsAdminPage = lazy(() => import("@/pages/admin/SkillsAdminPage"));
const BlogAdminPage = lazy(() => import("@/pages/admin/BlogAdminPage"));
const MessagesAdminPage = lazy(() => import("@/pages/admin/MessagesAdminPage"));
const SettingsAdminPage = lazy(() => import("@/pages/admin/SettingsAdminPage"));

export default function App() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsAdminPage />} />
          <Route path="skills" element={<SkillsAdminPage />} />
          <Route path="blog" element={<BlogAdminPage />} />
          <Route path="messages" element={<MessagesAdminPage />} />
          <Route path="settings" element={<SettingsAdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
