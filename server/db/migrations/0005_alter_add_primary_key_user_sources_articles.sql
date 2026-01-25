ALTER TABLE "articles" DROP CONSTRAINT "articles_title_unique";--> statement-breakpoint
ALTER TABLE "user_articles" ADD CONSTRAINT "user_articles_user_id_article_id_pk" PRIMARY KEY("user_id","article_id");--> statement-breakpoint
ALTER TABLE "user_sources" ADD CONSTRAINT "user_sources_user_id_rss_source_id_pk" PRIMARY KEY("user_id","rss_source_id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_link_unique" UNIQUE("link");