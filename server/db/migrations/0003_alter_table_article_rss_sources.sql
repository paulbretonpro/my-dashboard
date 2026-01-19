CREATE TABLE "user_articles" (
	"user_id" uuid NOT NULL,
	"article_id" integer NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sources" (
	"user_id" uuid NOT NULL,
	"rss_source_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rss_sources" DROP CONSTRAINT "rss_sources_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_articles" ADD CONSTRAINT "user_articles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_articles" ADD CONSTRAINT "user_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sources" ADD CONSTRAINT "user_sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sources" ADD CONSTRAINT "user_sources_rss_source_id_rss_sources_id_fk" FOREIGN KEY ("rss_source_id") REFERENCES "public"."rss_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "is_read";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "is_favorite";--> statement-breakpoint
ALTER TABLE "rss_sources" DROP COLUMN "user_id";