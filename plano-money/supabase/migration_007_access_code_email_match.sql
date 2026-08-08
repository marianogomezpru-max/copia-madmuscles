-- Plano.Money — an access code can only be redeemed with the same email
-- the purchase was made under, so a code can't be handed off to someone
-- else's email address.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_invite_code text := new.raw_user_meta_data->>'invite_code';
  v_access_code text := new.raw_user_meta_data->>'access_code';
  v_code public.access_codes%rowtype;
begin
  if v_invite_code is null or v_invite_code = '' then
    if v_access_code is null or v_access_code = '' then
      raise exception 'access_code_required';
    end if;

    select * into v_code from public.access_codes
      where code = lower(v_access_code) and used = false
      for update;

    if v_code.id is null then
      raise exception 'invalid_access_code';
    end if;

    if v_code.email is not null and lower(trim(v_code.email)) <> lower(trim(new.email)) then
      raise exception 'access_code_email_mismatch';
    end if;

    update public.access_codes set used = true, used_by = new.id, used_at = now()
      where id = v_code.id;
  end if;

  insert into public.settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  insert into public.profiles (user_id, name, role, visible_categories)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Admin'), 'admin', null);

  return new;
end;
$$;
