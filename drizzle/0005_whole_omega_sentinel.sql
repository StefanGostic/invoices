ALTER TABLE "materials" ALTER COLUMN "invoice_line/quantity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "invoice_line/discount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "invoice_line/price_subtotal" DROP NOT NULL;