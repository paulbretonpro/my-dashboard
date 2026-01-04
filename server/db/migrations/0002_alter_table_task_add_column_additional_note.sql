ALTER TABLE "tasks" ADD COLUMN "additional_notes" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;