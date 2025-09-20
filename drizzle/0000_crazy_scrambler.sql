CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `itemGenres` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`genre_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `item_genre_idx` ON `itemGenres` (`item_id`);--> statement-breakpoint
CREATE INDEX `genre_idx` ON `itemGenres` (`genre_id`);--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(200) NOT NULL,
	`type` text(200) NOT NULL,
	`note` text,
	`img_url` text
);
--> statement-breakpoint
CREATE INDEX `type_idx` ON `items` (`type`);--> statement-breakpoint
CREATE TABLE `userItems` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`item_id` text,
	`order` integer,
	`status` text(100),
	`ranting` integer,
	`added_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userItems_user_id_unique` ON `userItems` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `userItems_item_id_unique` ON `userItems` (`item_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `userItems` (`user_id`);--> statement-breakpoint
CREATE INDEX `item_idx` ON `userItems` (`item_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `userItems` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_item_unique_idx` ON `userItems` (`user_id`,`item_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(150) NOT NULL,
	`email` text(100) NOT NULL,
	`password` text(150) NOT NULL,
	`created_at` integer DEFAULT (current_timestamp),
	`updated_at` integer DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);