create table "public"."users" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "credit" integer not null default 10,
    "email" character varying
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX user_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."users" add constraint "user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "user_id_fkey";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "All users to their own data only"
on "public"."users"
as permissive
for all
to authenticated
using ((auth.uid() = id))
with check (true);




