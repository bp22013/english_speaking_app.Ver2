CREATE TABLE `admin_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text,
	`student_id` text,
	`content` text,
	`sent_at` integer,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(100),
	`email` text(100),
	`password_hash` text,
	`registered_at` integer,
	`last_login_at` integer,
	`last_password_change_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`sender_id` text,
	`message_type` text(50),
	`content` text,
	`is_read` integer,
	`sent_at` integer,
	`scheduled_at` integer,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `student_statistics` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`total_study_time` integer,
	`weekly_study_time` integer,
	`total_words_learned` integer,
	`accuracy_rate` real,
	`today_words_learned` integer,
	`consecutive_days` integer,
	`updated_at` integer,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `student_word_status` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`word_id` text,
	`is_correct` integer,
	`answered_at` integer,
	`answered_flag` integer,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text(20),
	`name` text(100),
	`password_hash` text,
	`grade` integer,
	`registered_at` integer,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_student_id_unique` ON `students` (`student_id`);--> statement-breakpoint
CREATE TABLE `words` (
	`id` text PRIMARY KEY NOT NULL,
	`word` text,
	`meaning` text,
	`level` integer,
	`added_at` integer
);
