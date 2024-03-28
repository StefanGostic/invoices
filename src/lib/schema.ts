import { int, real } from "drizzle-orm/mysql-core";
import {
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",

  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },

  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const materials = pgTable(
  "materials",
  {
    id: serial("id").primaryKey(),
    "invoice_line/origin": text("invoice_line/origin").notNull(),
    "invoice_line/name": text("invoice_line/name").notNull(),
    "invoice_line/quantity": text("invoice_line/quantity").notNull(),
    "invoice_line/uos_id/name": text("invoice_line/uos_id/name").notNull(),
    "invoice_line/price_unit": text("invoice_line/price_unit").notNull(),
    "invoice_line/discount": text("invoice_line/discount").notNull(),
    "invoice_line/price_subtotal": text(
      "invoice_line/price_subtotal"
    ).notNull(),
  },

  (materials) => {
    return {
      uniqueIdx: uniqueIndex("unique_material").on(materials.id),
    };
  }
);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  number: integer("number").notNull(),
  object: text("object").notNull(),
  workNumber: integer("workNumber").notNull(),
  costOfMaterials: doublePrecision("costOfMaterials").notNull(),
  costOfLabor: doublePrecision("costOfLabor").notNull(),
  costOfRepromaterials: doublePrecision("costOfRepromaterials").notNull(),
  costOfMargin: doublePrecision("costOfMargin").notNull(),
  costOfTotal: doublePrecision("costOfTotal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const invoicesRelations = relations(invoices, ({ many }) => ({
  materials: many(materials),
}));
