import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Campaign, type InsertCampaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, QUERY_KEYS, CACHE_TIME } from "@/lib/queryClient";

export function useCampaigns(status?: string) {
  return useQuery<Campaign[]>({
    queryKey: QUERY_KEYS.CAMPAIGNS_FILTERED(status),
    queryFn: async () => {
      const url = status ? `/api/campaigns?status=${status}` : "/api/campaigns";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useCampaign(id: number | string) {
  return useQuery<Campaign>({
    queryKey: QUERY_KEYS.CAMPAIGN_DETAIL(id),
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
    enabled: !!id,
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useMyCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: QUERY_KEYS.CAMPAIGNS_MY_LIST,
    queryFn: async () => {
      const res = await fetch("/api/campaigns/my/list", { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertCampaign, "brandUserId" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/campaigns", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create campaign");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGNS_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGNS_MY_LIST });
      toast({
        title: "Campaign Created",
        description: "Your campaign has been posted successfully.",
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

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCampaign> }) => {
      const res = await apiRequest("PATCH", `/api/campaigns/${id}`, data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update campaign");
      }
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGNS_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGN_DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGNS_MY_LIST });
      toast({
        title: "Campaign Updated",
        description: "Your campaign has been updated successfully.",
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

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/campaigns/${id}`, {});
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete campaign");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGNS_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAMPAIGNS_MY_LIST });
      toast({
        title: "Campaign Deleted",
        description: "Your campaign has been removed.",
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
