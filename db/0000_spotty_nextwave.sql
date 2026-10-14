CREATE TABLE "clothing_checks" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clothing_checks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"temperature_c" numeric(4, 1) NOT NULL,
	"recommendation" text NOT NULL,
	"location" text NOT NULL
);
