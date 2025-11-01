CREATE TABLE "answer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"fk_response_id" uuid NOT NULL,
	"fk_form_id" uuid NOT NULL,
	"fk_section_id" uuid NOT NULL,
	"answer" varchar(2000)
);
--> statement-breakpoint
CREATE TABLE "form" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"email" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "response" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"fk_form_id" uuid NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
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
	"description" varchar(1000) NOT NULL,
	"required" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_fk_response_id_response_id_fk" FOREIGN KEY ("fk_response_id") REFERENCES "public"."response"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_fk_form_id_form_id_fk" FOREIGN KEY ("fk_form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_fk_section_id_section_id_fk" FOREIGN KEY ("fk_section_id") REFERENCES "public"."section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_fk_form_id_form_id_fk" FOREIGN KEY ("fk_form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_fk_form_id_form_id_fk" FOREIGN KEY ("fk_form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;