import { useQuery } from "@tanstack/react-query";
import { type Transaction } from "@shared/schema";

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions", { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
    retry: false,
  });
}
