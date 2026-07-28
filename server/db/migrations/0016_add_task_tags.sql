CREATE TABLE "task_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#3b82f6' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "tag_id" integer;
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tag_id_task_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."task_tags"("id") ON DELETE set null ON UPDATE no action;
