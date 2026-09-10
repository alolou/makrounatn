CREATE TABLE "customers" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"phone" text NOT NULL UNIQUE,
	"order_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"status" text DEFAULT 'nouvelle' NOT NULL,
	"loyalty_reward" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id");