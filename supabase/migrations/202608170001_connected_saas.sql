create extension if not exists pgcrypto;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks(user_id);

create table public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  polar_order_id text,
  updated_at timestamptz not null default now()
);

create table public.webhook_events (
  event_id text primary key,
  event_type text not null,
  app_instance_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  received_at timestamptz not null default now()
);

alter table public.tasks enable row level security;
alter table public.entitlements enable row level security;
alter table public.webhook_events enable row level security;

create policy "users select own tasks"
on public.tasks for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users insert own tasks"
on public.tasks for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "users update own tasks"
on public.tasks for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users delete own tasks"
on public.tasks for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "users select own entitlement"
on public.entitlements for select to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.enforce_free_task_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(
    (select e.plan from public.entitlements e where e.user_id = new.user_id),
    'free'
  ) = 'free' and (
    select count(*) from public.tasks t where t.user_id = new.user_id
  ) >= 3 then
    raise exception 'free plan limit reached';
  end if;

  return new;
end;
$$;

create trigger enforce_free_task_limit_before_insert
before insert on public.tasks
for each row execute function public.enforce_free_task_limit();

revoke all on function public.enforce_free_task_limit() from public;

create or replace function public.apply_polar_order_paid(
  p_event_id text,
  p_user_id uuid,
  p_order_id text,
  p_app_instance_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.webhook_events(event_id, event_type, app_instance_id, user_id)
  values (p_event_id, 'order.paid', p_app_instance_id, p_user_id)
  on conflict (event_id) do nothing;

  if not found then
    return false;
  end if;

  insert into public.entitlements(user_id, plan, polar_order_id, updated_at)
  values (p_user_id, 'pro', p_order_id, now())
  on conflict (user_id) do update
  set plan = excluded.plan,
      polar_order_id = excluded.polar_order_id,
      updated_at = excluded.updated_at;

  return true;
end;
$$;

revoke all on function public.apply_polar_order_paid(text, uuid, text, text) from public, anon, authenticated;
grant execute on function public.apply_polar_order_paid(text, uuid, text, text) to service_role;

grant select, insert, update, delete on public.tasks to authenticated;
grant select on public.entitlements to authenticated;
grant all on public.entitlements, public.webhook_events to service_role;
