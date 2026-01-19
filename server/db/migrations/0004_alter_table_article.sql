ALTER TABLE "articles" DROP CONSTRAINT "articles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "user_id";