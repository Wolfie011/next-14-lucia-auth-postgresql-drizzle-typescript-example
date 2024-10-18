CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'mod');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'blocked', 'disabled', 'not-activated', 'canceled');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "domain" (
	"id" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"db_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "domain_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_data" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"status" "status" DEFAULT 'not-activated' NOT NULL,
	CONSTRAINT "user_data_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"hashed_password" text,
	"domain_id" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_data" ADD CONSTRAINT "user_data_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_domain_id_domain_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domain"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
