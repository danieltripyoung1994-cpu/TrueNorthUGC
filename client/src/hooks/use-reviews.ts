import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Review } from "@shared/schema";

export function useReviewsByCreator(userId: string | undefined) {
  return useQuery<Review[]>({
    queryKey: [`/api/reviews/creators/${userId}`],
    enabled: !!userId,
  });
}

export function useReviewsByBrand(userId: string | undefined) {
  return useQuery<Review[]>({
    queryKey: [`/api/reviews/brands/${userId}`],
    enabled: !!userId,
  });
}

export function useMyReviews() {
  return useQuery<Review[]>({
    queryKey: ["/api/reviews/me"],
  });
}

export function useReviewSummary(userId: string | undefined) {
  return useQuery<{ averageRating: number; totalReviews: number }>({
    queryKey: [`/api/reviews/summary/${userId}`],
    enabled: !!userId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      revieweeUserId: string;
      revieweeType: "creator" | "brand";
      rating: number;
      title?: string;
      body: string;
    }) => {
      const res = await apiRequest("POST", "/api/reviews", data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/creators/${variables.revieweeUserId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/brands/${variables.revieweeUserId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/summary/${variables.revieweeUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/me"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/reviews/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/me"] });
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && (
            key.startsWith('/api/reviews/creators/') ||
            key.startsWith('/api/reviews/brands/') ||
            key.startsWith('/api/reviews/summary/')
          );
        }
      });
    },
  });
}
