alter table "public"."runs" add constraint "runs_check_id_key" unique (check_id);
alter table "public"."runs" alter column "check_id" drop not null;
alter table "public"."runs" add column "check_id" text;
