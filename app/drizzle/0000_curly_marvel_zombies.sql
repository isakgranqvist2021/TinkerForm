CREATE TABLE "form" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"fk_form_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"index" integer NOT NULL,
	"description" varchar(1000),
	"required" boolean DEFAULT false,
	"min_length" integer DEFAULT 0,
	"max_length" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_fk_form_id_form_id_fk" FOREIGN KEY ("fk_form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;