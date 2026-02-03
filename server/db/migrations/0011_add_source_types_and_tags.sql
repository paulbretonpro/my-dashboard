CREATE TABLE "source_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "source_tags_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "source_tags_relationship" (
	"source_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "source_tags_relationship_source_id_tag_id_pk" PRIMARY KEY("source_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "source_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "source_types_label_unique" UNIQUE("label")
);
--> statement-breakpoint
ALTER TABLE "rss_sources" ADD COLUMN "source_type_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_connection" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "previous_connection" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "source_tags_relationship" ADD CONSTRAINT "source_tags_relationship_source_id_rss_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."rss_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_tags_relationship" ADD CONSTRAINT "source_tags_relationship_tag_id_source_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."source_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rss_sources" ADD CONSTRAINT "rss_sources_source_type_id_source_types_id_fk" FOREIGN KEY ("source_type_id") REFERENCES "public"."source_types"("id") ON DELETE set null ON UPDATE no action;