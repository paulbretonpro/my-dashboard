CREATE TABLE "summary_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"summary_id" integer NOT NULL,
	"article_id" integer,
	"url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "summary_articles" ADD CONSTRAINT "summary_articles_summary_id_summary_id_fk" FOREIGN KEY ("summary_id") REFERENCES "public"."summary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summary_articles" ADD CONSTRAINT "summary_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;