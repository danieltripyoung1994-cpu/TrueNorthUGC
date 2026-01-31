import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Query key constants for consistency across the application
export const QUERY_KEYS = {
  // Auth
  AUTH_USER: ["/api/auth/user"],

  // Creators
  CREATORS_LIST: ["/api/creators"],
  CREATORS_BY_HANDLE: (handle: string) => ["/api/creators", handle],
  CREATOR_ME: ["/api/me/creator"],

  // Brands
  BRAND_ME: ["/api/me/brand"],

  // Campaigns
  CAMPAIGNS_LIST: ["/api/campaigns"],
  CAMPAIGNS_FILTERED: (status?: string) => ["/api/campaigns", status],
  CAMPAIGN_DETAIL: (id: number | string) => ["/api/campaigns", id],
  CAMPAIGNS_MY_LIST: ["/api/campaigns/my/list"],

  // Messages
  MESSAGES_INBOX: ["/api/messages/inbox"],
  MESSAGES_SENT: ["/api/messages/sent"],

  // Notifications
  NOTIFICATIONS_LIST: ["/api/notifications"],
  NOTIFICATIONS_UNREAD_COUNT: ["/api/notifications/unread-count"],

  // Reviews
  REVIEWS_LIST: ["/api/reviews"],
  REVIEWS_BY_CREATOR: (userId: string) => ["/api/reviews/creators", userId],
  REVIEWS_BY_BRAND: (userId: string) => ["/api/reviews/brands", userId],
  REVIEWS_MY_LIST: ["/api/reviews/me"],
  REVIEWS_SUMMARY: (userId: string) => ["/api/reviews/summary", userId],
};

// Cache time constants
export const CACHE_TIME = {
  INSTANT: 0,
  SHORT: 1000 * 60, // 1 minute
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 10, // 10 minutes
} as const;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: CACHE_TIME.MEDIUM, // 5 minutes - balance between freshness and performance
      gcTime: CACHE_TIME.LONG * 2, // 20 minutes - keep data longer than staleTime for offline support
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Helper function to prefetch data for routes or components
 * Improves perceived performance by loading data before user navigation
 *
 * @example
 * // Prefetch creator data when hovering over a creator link
 * prefetchQuery({
 *   queryKey: QUERY_KEYS.CREATORS_BY_HANDLE('handle'),
 *   queryFn: async () => {
 *     const res = await fetch('/api/creators/handle');
 *     return res.json();
 *   }
 * })
 */
export async function prefetchQuery<T>({
  queryKey,
  queryFn,
}: {
  queryKey: (string | number | object)[];
  queryFn: () => Promise<T>;
}): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: CACHE_TIME.MEDIUM,
  });
}
