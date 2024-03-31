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
CREATE TABLE IF NOT EXISTS "materials_to_invoices" (
	"materials_id" integer NOT NULL,
	"invoices_id" integer NOT NULL,
	CONSTRAINT "materials_to_invoices_materials_id_invoices_id_pk" PRIMARY KEY("materials_id","invoices_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_material" ON "materials" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials_to_invoices" ADD CONSTRAINT "materials_to_invoices_materials_id_materials_id_fk" FOREIGN KEY ("materials_id") REFERENCES "materials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials_to_invoices" ADD CONSTRAINT "materials_to_invoices_invoices_id_invoices_id_fk" FOREIGN KEY ("invoices_id") REFERENCES "invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
