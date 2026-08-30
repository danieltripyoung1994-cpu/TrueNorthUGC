import { clerkMiddleware, requireAuth, getAuth, clerkClient } from "@clerk/express";
import type { Express, Request, RequestHandler } from "express";
import { authStorage } from "./replit_integrations/auth/storage";

export { clerkMiddleware, getAuth };

/**
 * Drop-in replacement for the old Replit isAuthenticated middleware.
 * Uses Clerk's requireAuth() which returns 401 if no valid session.
 */
export const isAuthenticated: RequestHandler = requireAuth();

/**
 * Helper to extract the verified Clerk userId from a request.
 * Must be called after clerkMiddleware() has run.
 */
export function getUserId(req: Request): string {
  const auth = getAuth(req);
  if (!auth.userId) {
    throw new Error("Not authenticated");
  }
  return auth.userId;
}

/**
 * Register Clerk-specific auth routes on the Express app.
 */
export function registerAuthRoutes(app: Express): void {
  // GET /api/auth/user — return the current user's profile (synced to our DB)
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);

      // Check if user already exists in our DB
      let user = await authStorage.getUser(userId);
      if (user) {
        return res.json(user);
      }

      // First-time sign-in: fetch profile from Clerk and upsert
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await authStorage.upsertUser({
        id: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? null,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImageUrl: clerkUser.imageUrl,
      });

      res.json(user);
    } catch (error) {
      console.error("Error fetching/syncing user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // POST /api/auth/sync — lightweight sync from frontend Clerk data
  app.post("/api/auth/sync", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { firstName, lastName, email, profileImageUrl } = req.body;

      await authStorage.upsertUser({
        id: userId,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        email: email ?? null,
        profileImageUrl: profileImageUrl ?? null,
      });

      res.json({ synced: true });
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Failed to sync user" });
    }
  });

  // Redirect legacy Replit auth routes to Clerk's client-side pages
  app.get("/api/login", (_req, res) => res.redirect("/sign-in"));
  app.get("/api/logout", (_req, res) => res.redirect("/"));
  app.get("/api/callback", (_req, res) => res.redirect("/"));
}
