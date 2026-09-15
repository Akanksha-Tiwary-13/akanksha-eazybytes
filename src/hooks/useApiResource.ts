import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useContentUpdates } from "@/hooks/useContentUpdates";

type ContentTopic = "projects" | "skills" | "blog" | "settings" | "messages";

export function useApiResource<T>(url: string, topics: ContentTopic[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get<T>(url);
      setData(data);
    } catch {
      setError("Something went wrong loading this content.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useContentUpdates(topics, fetchData);

  return { data, loading, error, refetch: fetchData };
}
