import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import type { Express, Request, Response, NextFunction } from "express";

/**
 * Clerk Authentication Setup for TrueNorthUGC
 *
 * Environment variables required:
 *   CLERK_PUBLISHABLE_KEY - from Clerk dashboard
 *   CLERK_SECRET_KEY      - from Clerk dashboard
 *
 * @see https://clerk.com/docs/quickstarts/express
 */

/**
 * Initialize Clerk middleware on the Express app.
 * Call this early in your middleware chain (before routes).
 */
export function setupClerkAuth(app: Express): void {
  // Attach Clerk session data to every request
  app.use(clerkMiddleware());
}

/**
 * Middleware: require a signed-in Clerk user.
 * Use on routes that need authentication.
 *
 * @example
 *   app.get("/api/profile", requireSignedIn, handler);
 */
export function requireSignedIn(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

/**
 * Helper: extract the Clerk userId from a request.
 * Returns null when the user is not signed in.
 */
export function getUserId(req: Request): string | null {
  const auth = getAuth(req);
  return auth?.userId ?? null;
}

/**
 * Helper: check if the current request is from an admin.
 * Relies on Clerk session claims / publicMetadata.
 */
export function isAdmin(req: Request): boolean {
  const auth = getAuth(req);
  if (!auth?.userId) return false;
  const metadata = (auth as any).sessionClaims?.publicMetadata;
  return metadata?.role === "admin";
}
