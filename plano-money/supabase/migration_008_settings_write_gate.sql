-- Plano.Money — close a self-reactivation hole
-- The admin's "owner_all" policy on settings was deliberately left
-- unsuspended so the app could always read access_suspended and show the
-- suspension screen — but "for all" also covers UPDATE, which meant a
-- suspended admin could write access_suspended = false to their own row
-- directly (e.g. via the REST API, bypassing the UI) and reactivate
-- themselves without paying. Split it: reads stay always-on, writes get
-- gated by household_access_active like every other table already is.

drop policy if exists "owner_all" on public.settings;

create policy "owner_read_settings" on public.settings for select
  using (user_id = auth.uid());

create policy "owner_insert_settings" on public.settings for insert
  with check (user_id = auth.uid() and public.household_access_active(user_id));

create policy "owner_update_settings" on public.settings for update
  using (user_id = auth.uid() and public.household_access_active(user_id))
  with check (user_id = auth.uid() and public.household_access_active(user_id));

create policy "owner_delete_settings" on public.settings for delete
  using (user_id = auth.uid() and public.household_access_active(user_id));
