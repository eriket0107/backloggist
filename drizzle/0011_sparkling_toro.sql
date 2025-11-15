CREATE TYPE "public"."user_roles" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
ALTER TABLE "items" RENAME COLUMN "note" TO "description";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{"USER"}'::"public"."user_roles"[];--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "roles" SET DATA TYPE "public"."user_roles"[] USING "roles"::"public"."user_roles"[];--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "isPublic" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "userItems" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_items" ON "items" USING btree ("user_id");