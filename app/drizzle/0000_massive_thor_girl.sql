CREATE TABLE "answer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"response_id" uuid NOT NULL,
	"fk_form_id" uuid NOT NULL,
	"fk_section_id" uuid NOT NULL,
	"answer" varchar(2000)
);

--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_fk_form_id_form_id_fk" FOREIGN KEY ("fk_form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_fk_section_id_section_id_fk" FOREIGN KEY ("fk_section_id") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint