CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"number" integer NOT NULL,
	"object" text NOT NULL,
	"workNumber" integer NOT NULL,
	"costOfMaterials" double precision NOT NULL,
	"costOfLabor" double precision NOT NULL,
	"costOfRepromaterials" double precision NOT NULL,
	"costOfMargin" double precision NOT NULL,
	"costOfTotal" double precision NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_line/origin" text NOT NULL,
	"invoice_line/name" text NOT NULL,
	"invoice_line/quantity" text NOT NULL,
	"invoice_line/uos_id/name" text NOT NULL,
	"invoice_line/price_unit" text NOT NULL,
	"invoice_line/discount" text NOT NULL,
	"invoice_line/price_subtotal" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_material" ON "materials" ("id");