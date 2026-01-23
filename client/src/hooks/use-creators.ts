import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCreator } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCreators(filters?: { search?: string; niche?: string }) {
  return useQuery({
    queryKey: [api.creators.list.path, filters],
    queryFn: async () => {
      const url = filters
        ? `${api.creators.list.path}?${new URLSearchParams(filters as Record<string, string>).toString()}`
        : api.creators.list.path;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch creators");
      return api.creators.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreator(handle: string) {
  return useQuery({
    queryKey: [api.creators.getByHandle.path, handle],
    queryFn: async () => {
      const url = buildUrl(api.creators.getByHandle.path, { handle });
      const res = await fetch(url, { credentials: "include" });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch creator");

      return api.creators.getByHandle.responses[200].parse(await res.json());
    },
    enabled: !!handle,
  });
}

export function useMyCreatorProfile() {
  return useQuery({
    queryKey: [api.creators.me.path],
    queryFn: async () => {
      const res = await fetch(api.creators.me.path, { credentials: "include" });

      if (res.status === 401) return null;
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");

      return api.creators.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertCreator, "userId">) => {
      // Validate with schema first if needed, but api handles it
      const res = await fetch(api.creators.updateMe.path, {
        method: api.creators.updateMe.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to update profile");
      }

      return api.creators.updateMe.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.creators.me.path] });
      queryClient.invalidateQueries({
        queryKey: [api.creators.getByHandle.path, data.handle],
      });
      queryClient.invalidateQueries({ queryKey: [api.creators.list.path] });
      toast({
        title: "Profile Updated",
        description: "Your creator profile has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
