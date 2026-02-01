import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized connection pool settings for performance (configurable via env)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.PG_POOL_MAX || "10", 10), // Maximum connections in pool
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || "30000", 10), // Close idle connections
  connectionTimeoutMillis: 5000, // Fail fast if connection takes > 5 seconds
});

export const db = drizzle(pool, { schema });
