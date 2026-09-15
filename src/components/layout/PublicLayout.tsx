import { Outlet, useOutletContext } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSettings } from "@/hooks/useSettings";
import type { SettingsDTO } from "@shared/types";

interface PublicContext {
  settings: SettingsDTO | null;
  loading: boolean;
}

export function PublicLayout() {
  const { settings, loading } = useSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar siteTitle={settings?.siteTitle ?? "Portfolio"} />
      <main className="flex-1">
        <Outlet context={{ settings, loading } satisfies PublicContext} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}

export function usePublicContext() {
  return useOutletContext<PublicContext>();
}
