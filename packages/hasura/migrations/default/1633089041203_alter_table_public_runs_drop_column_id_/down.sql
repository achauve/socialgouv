alter table "public"."runs" alter column "id_" drop not null;
alter table "public"."runs" add column "id_" numeric;
