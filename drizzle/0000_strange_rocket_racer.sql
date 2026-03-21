CREATE TYPE "public"."badge" AS ENUM('New', 'Sale', 'Exclusive', 'Limited', 'Best Seller');--> statement-breakpoint
CREATE TYPE "public"."inventory" AS ENUM('in-stock', 'out-of-stock', 'pre-order', 'back-order');--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"badge" "badge",
	"rate" numeric(3, 2),
	"reviews" integer,
	"image" varchar(512),
	"inventory" "inventory" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;