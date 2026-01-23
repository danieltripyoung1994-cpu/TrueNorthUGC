import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Brand, InsertBrand } from "@shared/schema";
import { api } from "@shared/routes";

export function useBrand() {
  const { data: brand, isLoading, error } = useQuery<Brand>({
    queryKey: [api.brands.me.path],
  });

  const updateBrandMutation = useMutation({
    mutationFn: async (data: Partial<InsertBrand>) => {
      const res = await apiRequest(api.brands.updateMe.method, api.brands.updateMe.path, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.brands.me.path] });
    },
  });

  return {
    brand,
    isLoading,
    error,
    updateBrand: updateBrandMutation.mutateAsync,
    isUpdating: updateBrandMutation.isPending,
  };
}
