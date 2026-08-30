import { clerkMiddleware, getAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/express";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  // Clerk middleware attaches auth info to every request
  app.use(clerkMiddleware());
}

/**
 * Middleware that verifies the request is authenticated via Clerk.
 * Populates req.user with { claims: { sub: userId } } for backwards
 * compatibility with existing route handlers.
 */
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Ensure user exists in local DB; sync from Clerk on first visit
  try {
    const existing = await authStorage.getUser(auth.userId);
    if (!existing) {
      const clerkUser = await clerk.users.getUser(auth.userId);
      await authStorage.upsertUser({
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImageUrl: clerkUser.imageUrl,
      });
    }
  } catch (error) {
    console.error("Error syncing Clerk user to local DB:", error);
    // Non-fatal: authentication still succeeded
  }

  // Backwards compatibility for (req.user as any).claims.sub
  (req as any).user = {
    claims: { sub: auth.userId },
  };

  return next();
};
