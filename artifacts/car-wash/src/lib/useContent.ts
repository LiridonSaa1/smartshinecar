import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = "/api/content";

export function useContentSection<T>(key: string, fallback: T) {
  const { data } = useQuery<T>({
    queryKey: ["content", key],
    queryFn: async () => {
      const res = await fetch(`${API}/${key}`);
      if (!res.ok) return fallback;
      const json = await res.json();
      return json ?? fallback;
    },
    staleTime: 30_000,
  });
  return (data ?? fallback) as T;
}

export function useUpdateContent(key: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const res = await fetch(`${API}/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content", key] }),
  });
}
