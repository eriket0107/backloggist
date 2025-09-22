CREATE TABLE "genres" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itemGenres" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"genre_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"type" varchar(200) NOT NULL,
	"note" text,
	"img_url" text
);
--> statement-breakpoint
CREATE TABLE "userItems" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	"order" integer,
	"status" varchar(100),
	"ranting" integer,
	"added_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "userItems" ADD CONSTRAINT "userItems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userItems" ADD CONSTRAINT "userItems_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "item_genre_idx" ON "itemGenres" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "genre_idx" ON "itemGenres" USING btree ("genre_id");--> statement-breakpoint
CREATE INDEX "type_idx" ON "items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "user_idx" ON "userItems" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "item_idx" ON "userItems" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "status_idx" ON "userItems" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_item_unique_idx" ON "userItems" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");