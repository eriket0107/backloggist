DROP INDEX "genr_name_idx";--> statement-breakpoint
CREATE INDEX "genre_name_idx" ON "genres" USING btree ("name");