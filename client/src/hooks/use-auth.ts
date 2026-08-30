import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

/**
 * Clerk-backed auth hook — drop-in replacement for the old Replit OIDC version.
 * Returns the same shape so consuming components don't need changes.
 */
export function useAuth() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const hasSynced = useRef(false);

  // Sync user profile to the backend DB on first sign-in
  useEffect(() => {
    if (!isSignedIn || !clerkUser || hasSynced.current) return;
    hasSynced.current = true;

    fetch("/api/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
        profileImageUrl: clerkUser.imageUrl,
      }),
    }).catch((err) => console.warn("User sync failed:", err));
  }, [isSignedIn, clerkUser]);

  const mappedUser = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
        firstName: clerkUser.firstName ?? null,
        lastName: clerkUser.lastName ?? null,
        profileImageUrl: clerkUser.imageUrl ?? null,
        createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt) : null,
        updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt) : null,
      }
    : null;

  return {
    user: mappedUser,
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    logout: () => signOut({ redirectUrl: "/" }),
    isLoggingOut: false,
  };
}
