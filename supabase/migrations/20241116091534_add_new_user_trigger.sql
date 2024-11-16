alter table "public"."users" alter column "credit" set default 6;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
  insert into public.users (id, email)
  values (
    new.id,
    new.email
  );
  return new;
end;$function$
;



