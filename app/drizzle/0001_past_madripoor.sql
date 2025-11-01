ALTER TABLE "answer" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "answer" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form" ALTER COLUMN "description" SET DATA TYPE varchar(5000);--> statement-breakpoint
ALTER TABLE "response" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "response" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "response" DROP COLUMN "started_at";