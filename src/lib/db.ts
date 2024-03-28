// import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { users } from "./schema";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export const db = drizzle(sql, { schema });

export const getUsers = async () => {
  const selectResult = await db.select().from(users).where(eq(users.id, 1));
  console.log(selectResult);
  return selectResult;
};

export type NewUser = typeof users.$inferInsert;

export const createUser = async (user: NewUser) => {
  const insertResult = await db.insert(users).values(user).returning();
  console.log(insertResult);
  return insertResult;
};

export const getUsers2 = async () => {
  const result = await db.query.users.findMany();
  return result;
};
