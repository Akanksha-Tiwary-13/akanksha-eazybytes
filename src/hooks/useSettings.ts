import { useCallback, useEffect, useState } from "react";
import type { SettingsDTO } from "@shared/types";
import { api } from "@/lib/api";
import { useThemeStore } from "@/store/themeStore";
import { useContentUpdates } from "@/hooks/useContentUpdates";

export function useSettings() {
  const [settings, setSettings] = useState<SettingsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const initFromSettings = useThemeStore((s) => s.initFromSettings);

  const fetchSettings = useCallback(async () => {
    const { data } = await api.get<SettingsDTO>("/settings");
    setSettings(data);
    initFromSettings(data.theme.mode, data.theme.accentColor);
    setLoading(false);
  }, [initFromSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useContentUpdates(["settings"], fetchSettings);

  return { settings, loading, refetch: fetchSettings };
}
