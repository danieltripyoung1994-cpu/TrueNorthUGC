import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";
import { authStorage } from "./storage";

export function registerAuthRoutes(app: Express) {
  // Get current authenticated user's profile
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const user = await authStorage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Clerk handles login/signup via its frontend components.
  // Provide a logout redirect for backwards compatibility.
  app.get("/api/logout", (_req, res) => {
    res.redirect("/");
  });

  // Legacy login route redirects to home (Clerk handles auth UI)
  app.get("/api/login", (_req, res) => {
    res.redirect("/");
  });

  // Legacy callback route redirects to home
  app.get("/api/callback", (_req, res) => {
    res.redirect("/");
  });
}
