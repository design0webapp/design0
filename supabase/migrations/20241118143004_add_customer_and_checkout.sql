create table "public"."checkouts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "session_id" character varying not null,
    "user_id" uuid not null default auth.uid(),
    "price_id" character varying not null,
    "quantity" integer not null,
    "credit" integer not null,
    "is_completed" boolean not null default false
);


alter table "public"."checkouts" enable row level security;

create table "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "customer_id" character varying not null,
    "user_id" uuid default auth.uid()
);


alter table "public"."customers" enable row level security;

CREATE UNIQUE INDEX checkouts_pkey ON public.checkouts USING btree (id);

CREATE UNIQUE INDEX checkouts_session_id_key ON public.checkouts USING btree (session_id);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

alter table "public"."checkouts" add constraint "checkouts_pkey" PRIMARY KEY using index "checkouts_pkey";

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."checkouts" add constraint "checkouts_session_id_key" UNIQUE using index "checkouts_session_id_key";

alter table "public"."checkouts" add constraint "checkouts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."checkouts" validate constraint "checkouts_user_id_fkey";

alter table "public"."customers" add constraint "customers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."customers" validate constraint "customers_user_id_fkey";

grant delete on table "public"."checkouts" to "anon";

grant insert on table "public"."checkouts" to "anon";

grant references on table "public"."checkouts" to "anon";

grant select on table "public"."checkouts" to "anon";

grant trigger on table "public"."checkouts" to "anon";

grant truncate on table "public"."checkouts" to "anon";

grant update on table "public"."checkouts" to "anon";

grant delete on table "public"."checkouts" to "authenticated";

grant insert on table "public"."checkouts" to "authenticated";

grant references on table "public"."checkouts" to "authenticated";

grant select on table "public"."checkouts" to "authenticated";

grant trigger on table "public"."checkouts" to "authenticated";

grant truncate on table "public"."checkouts" to "authenticated";

grant update on table "public"."checkouts" to "authenticated";

grant delete on table "public"."checkouts" to "service_role";

grant insert on table "public"."checkouts" to "service_role";

grant references on table "public"."checkouts" to "service_role";

grant select on table "public"."checkouts" to "service_role";

grant trigger on table "public"."checkouts" to "service_role";

grant truncate on table "public"."checkouts" to "service_role";

grant update on table "public"."checkouts" to "service_role";

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."checkouts"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."customers"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."customers"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));




