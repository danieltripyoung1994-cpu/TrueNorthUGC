import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error: any) {
      // Handle duplicate email gracefully - if email exists for different user, 
      // just return the existing user by ID or update without email
      if (error.code === '23505' && error.constraint?.includes('email')) {
        console.warn('Email conflict during upsert, attempting to find user by ID');
        if (!userData.id) throw error;
        const existingUser = await this.getUser(userData.id);
        if (existingUser) {
          return existingUser;
        }
        // If user doesn't exist by ID, create without the conflicting email
        const [userWithoutEmail] = await db
          .insert(users)
          .values({ ...userData, email: null })
          .onConflictDoUpdate({
            target: users.id,
            set: { ...userData, email: null, updatedAt: new Date() },
          })
          .returning();
        return userWithoutEmail;
      }
      throw error;
    }
  }
}

export const authStorage = new AuthStorage();
