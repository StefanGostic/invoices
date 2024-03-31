import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { materials } from "./schema";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export const db = drizzle(sql, { schema });

export const getAllMaterials = async () => {
  const result = await db.query.materials.findMany();
  return result;
};

export const insertMaterials = async (data: any) => {
  await db.insert(materials).values(data);
};

export const deleteMaterial = async (id: number) => {
  await db.delete(materials).where(eq(materials.id, id));
};
