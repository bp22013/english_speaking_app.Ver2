CREATE TABLE "admin_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_id" text NOT NULL,
	"student_id" text NOT NULL,
	"content" text,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"registered_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"last_password_change_at" timestamp with time zone,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"message_type" text,
	"message_priority" text,
	"title" text,
	"content" text,
	"is_read" boolean,
	"sent_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_statistics" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"total_study_time" integer,
	"weekly_study_time" integer,
	"accuracy_rate" real,
	"today_words_learned" integer,
	"consecutive_days" integer,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "student_word_status" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"word_id" text NOT NULL,
	"is_correct" boolean,
	"answered_at" timestamp with time zone,
	"answered_flag" boolean
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"grade" text,
	"registered_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"image" text,
	CONSTRAINT "user_student_id_unique" UNIQUE("student_id")
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" text PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"meaning" text,
	"level" integer,
	"added_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "admin_messages" ADD CONSTRAINT "admin_messages_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_messages" ADD CONSTRAINT "admin_messages_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_admins_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_statistics" ADD CONSTRAINT "student_statistics_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_word_status" ADD CONSTRAINT "student_word_status_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_word_status" ADD CONSTRAINT "student_word_status_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE no action ON UPDATE no action;