ALTER TABLE "itemGenres" DROP CONSTRAINT "itemGenres_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "itemGenres" DROP CONSTRAINT "itemGenres_genre_id_genres_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "userItems" DROP CONSTRAINT "userItems_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "userItems" DROP CONSTRAINT "userItems_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "itemGenres" ADD CONSTRAINT "itemGenres_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itemGenres" ADD CONSTRAINT "itemGenres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userItems" ADD CONSTRAINT "userItems_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userItems" ADD CONSTRAINT "userItems_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;