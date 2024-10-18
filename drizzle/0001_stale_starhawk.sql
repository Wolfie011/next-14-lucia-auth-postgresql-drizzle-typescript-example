ALTER TABLE "user_data" RENAME TO "userdata";--> statement-breakpoint
ALTER TABLE "userdata" DROP CONSTRAINT "user_data_email_unique";--> statement-breakpoint
ALTER TABLE "userdata" DROP CONSTRAINT "user_data_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userdata" ADD CONSTRAINT "userdata_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "userdata" ADD CONSTRAINT "userdata_email_unique" UNIQUE("email");