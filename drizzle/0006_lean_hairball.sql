ALTER TABLE "materials" ALTER COLUMN "invoice_line/quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "invoice_line/discount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "invoice_line/price_subtotal" SET NOT NULL;