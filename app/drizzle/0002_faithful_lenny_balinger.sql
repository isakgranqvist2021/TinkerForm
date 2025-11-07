CREATE TABLE "multiple_choice_option" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"fk_section_id" uuid NOT NULL,
	"text" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "multiple_choice_option" ADD CONSTRAINT "multiple_choice_option_fk_section_id_section_id_fk" FOREIGN KEY ("fk_section_id") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;