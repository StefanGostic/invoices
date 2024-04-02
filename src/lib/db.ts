import "@/lib/config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { materials } from "./schema";
import * as schema from "./schema";
import { eq, asc } from "drizzle-orm";

export const db = drizzle(sql, { schema });

export const getAllMaterials = async () => {
  const result = await db.select().from(materials).orderBy(asc(materials.id));
  return result;
};

export const insertMaterials = async (data: any) => {
  await db.insert(materials).values(data);
};

export const deleteMaterial = async (id: number) => {
  await db.delete(materials).where(eq(materials.id, id));
};

export const updateMaterialQuantity = async (id: number, quantity: number) => {
  return await db
    .update(materials)
    .set({ "invoice_line/quantity": quantity.toString() })
    .where(eq(materials.id, id))
    .returning();
};

export const updateMaterial = async (id: number, data: any) => {
  return await db
    .update(materials)
    .set(data)
    .where(eq(materials.id, id))
    .returning();
};
