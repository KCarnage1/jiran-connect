-- ============================================================================
-- SANAD · JIRAN CONNECT — Core schema
-- File: supabase/migrations/0001_sanad_core.sql
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL editor)
-- Requires:    a fresh Supabase project (auth schema present).
--
-- Privacy contract:
--   * `uae_pass_verifications` stores ONLY a peppered SHA-256 hash of the
--     Emirates ID plus status/timestamps. No name, no raw ID, no document.
--   * Every table has RLS ENABLED. Access is denied unless a policy allows it.
--   * Staff (moderator/admin) powers are checked through SECURITY DEFINER
--     helpers so policies never recurse into `profiles`.
-- ============================================================================

create extension if not exists pgcrypto; -- gen_random_uuid()
create extension if not exists citext;   -- case-insensitive slugs/usernames

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

create type public.app_role as enum ('member', 'moderator', 'admin');
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.emirate as enum (
  'abu_dhabi', 'dubai', 'sharjah', 'ajman',
  'umm_al_quwain', 'ras_al_khaimah', 'fujairah'
);
create type public.community_category as enum (
  'neighbourhood', 'families', 'newcomers', 'heritage',
  'arts', 'sports', 'business', 'volunteering'
);
create type public.community_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.community_member_role as enum ('member', 'moderator', 'owner');
create type public.event_kind as enum ('social', 'cultural', 'workshop', 'heritage');
create type public.event_status as enum ('draft', 'pending', 'published', 'cancelled');
create type public.rsvp_status as enum ('going', 'waitlist', 'cancelled');
create type public.moderation_target as enum ('profile', 'community', 'event');
create type public.moderation_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.moderation_action_kind as enum (
  'warn_user', 'suspend_user', 'remove_content',
  'approve_community', 'reject_community',
  'verify_user', 'reject_verification',
  'dismiss_report', 'other'
);
create type public.locale as enum ('en', 'ar');

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- 2.1 Users ------------------------------------------------------------------
-- Supabase owns `auth.users` (email, password, sessions). Public, app-facing
-- data lives here. No phone number and no Emirates ID are ever stored.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username citext unique,
  display_name text check (char_length(display_name) between 2 and 80),
  bio text check (char_length(bio) <= 500),
  emirate public.emirate,
  locale public.locale not null default 'en',
  avatar_url text,
  languages text[] not null default '{}',
  interests text[] not null default '{}',
  is_newcomer boolean not null default false,
  role public.app_role not null default 'member',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format
    check (username is null or username::text ~ '^[a-z0-9_]{3,24}$')
);

comment on column public.profiles.role is
  'RBAC. Changeable only by admins (see guard_profile_role trigger).';

-- 2.2 UAE PASS verifications -------------------------------------------------
create table public.uae_pass_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  id_hash bytea not null, -- sha256(bytes(emirates_id) || pepper)
  hash_algorithm text not null default 'sha256'
    check (hash_algorithm in ('sha256')),
  pepper_version smallint not null default 1,
  status public.verification_status not null default 'pending',
  requested_at timestamptz not null default now(),
  verified_at timestamptz,
  expires_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  rejection_reason text check (char_length(rejection_reason) <= 280),
  constraint uae_hash_len check (octet_length(id_hash) = 32),
  constraint uae_verified_at_matches_status
    check ((status = 'verified') = (verified_at is not null))
);

comment on column public.uae_pass_verifications.id_hash is
  'Irreversible pepper+SHA-256 of the Emirates ID. Column privilege is revoked for authenticated/anon users; only the verifier can read it.';

-- 2.3 Majlis (communities) ---------------------------------------------------
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique
    check (slug::text ~ '^[a-z0-9-]{3,48}$'),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name_en text not null check (char_length(name_en) between 2 and 80),
  name_ar text check (char_length(name_ar) between 2 and 80),
  description_en text check (char_length(description_en) <= 1200),
  description_ar text check (char_length(description_ar) <= 1200),
  category public.community_category not null default 'neighbourhood',
  emirate public.emirate not null,
  cover_url text,
  is_public boolean not null default true,
  status public.community_status not null default 'pending',
  member_count integer not null default 0 check (member_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_members (
  community_id uuid not null references public.communities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.community_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

-- 2.4 Events (incl. Cultural Exchange hub entries) ---------------------------
-- Cultural exchange workshops are `kind = 'workshop' | 'heritage'` events in a
-- community whose category is `heritage`. One model, no duplicate tables.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  title_en text not null check (char_length(title_en) between 3 and 120),
  title_ar text check (char_length(title_ar) between 3 and 120),
  description_en text check (char_length(description_en) <= 2000),
  description_ar text check (char_length(description_ar) <= 2000),
  kind public.event_kind not null default 'social',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Asia/Dubai',
  venue_name text,
  address text,
  emirate public.emirate not null,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  capacity integer check (capacity is null or capacity > 0),
  is_free boolean not null default true,
  price_aed numeric(8, 2) check (price_aed is null or price_aed >= 0),
  cover_url text,
  status public.event_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_time_order check (ends_at > starts_at),
  constraint events_price_consistency
    check (is_free or price_aed is not null)
);

create table public.event_attendees (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.rsvp_status not null default 'going',
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- 2.5 Moderation -------------------------------------------------------------
create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type public.moderation_target not null,
  target_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 120),
  details text check (char_length(details) <= 1000),
  status public.moderation_status not null default 'open',
  assigned_to uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- Append-only audit trail. No UPDATE/DELETE policies, by design.
create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles (id) on delete cascade,
  action public.moderation_action_kind not null,
  target_type public.moderation_target not null,
  target_id uuid not null,
  notes text check (char_length(notes) <= 1000),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

create index profiles_emirate_idx on public.profiles (emirate);
create index profiles_interests_idx on public.profiles using gin (interests);
create index profiles_languages_idx on public.profiles using gin (languages);

create index communities_status_emirate_idx
  on public.communities (status, emirate, created_at desc);
create index communities_owner_idx on public.communities (owner_id);
create index communities_category_idx on public.communities (category);

create index community_members_user_idx on public.community_members (user_id);

create index events_status_starts_idx on public.events (status, starts_at);
create index events_community_idx on public.events (community_id, starts_at desc);
create index events_kind_idx on public.events (kind, starts_at);

create index event_attendees_going_idx
  on public.event_attendees (event_id)
  where status = 'going';

create index verification_status_idx on public.uae_pass_verifications (status);

create index moderation_reports_status_idx
  on public.moderation_reports (status, created_at desc);
create index moderation_actions_created_idx
  on public.moderation_actions (created_at desc);

-- ============================================================================
-- 4. RBAC HELPERS (SECURITY DEFINER → no RLS recursion)
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('moderator', 'admin')
  );
$$;

create or replace function public.is_community_member(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.community_members m
    where m.community_id = cid and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.can_manage_community(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.is_staff()
    or exists (
      select 1 from public.communities c
      where c.id = cid and c.owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.community_members m
      where m.community_id = cid
        and m.user_id = (select auth.uid())
        and m.role in ('owner', 'moderator')
    );
$$;

create or replace function public.can_manage_event(eid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.events e
    where e.id = eid
      and (
        e.created_by = (select auth.uid())
        or public.can_manage_community(e.community_id)
      )
  );
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_community_member(uuid) to authenticated;
grant execute on function public.can_manage_community(uuid) to authenticated;
grant execute on function public.can_manage_event(uuid) to authenticated;

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- 5.1 timestamps -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 5.2 new auth user → profile row -------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 5.3 privilege guards -------------------------------------------------------
-- `auth.uid()` is NULL for trusted server contexts (service role, SQL editor),
-- so migrations and back-office tooling can still administer the platform.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only admins may change a user role' using errcode = '42501';
  end if;
  return new;
end;
$$;

create or replace function public.guard_verification_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status
     and (select auth.uid()) is not null
     and not public.is_staff() then
    raise exception 'Only moderators can change a verification status' using errcode = '42501';
  end if;
  -- A rejection must clear the verified timestamp to satisfy the CHECK.
  if new.status <> 'verified' then
    new.verified_at := null;
  end if;
  return new;
end;
$$;

create or replace function public.guard_community_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only admins can approve or suspend a community' using errcode = '42501';
  end if;
  if new.owner_id is distinct from old.owner_id
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only admins can transfer a community' using errcode = '42501';
  end if;
  return new;
end;
$$;

create or replace function public.guard_event_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('published', 'cancelled') and old.status is distinct from new.status then
    if (select auth.uid()) is not null and not public.can_manage_event(old.id) then
      raise exception 'Not allowed to publish this event' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

-- 5.4 denormalised counters --------------------------------------------------
create or replace function public.sync_community_member_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.communities
       set member_count = member_count + 1
     where id = new.community_id;
  elsif tg_op = 'DELETE' then
    update public.communities
       set member_count = greatest(member_count - 1, 0)
     where id = old.community_id;
  end if;
  return null;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger communities_set_updated_at
  before update on public.communities
  for each row execute function public.set_updated_at();

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

create trigger verifications_guard_status
  before update on public.uae_pass_verifications
  for each row execute function public.guard_verification_status();

create trigger communities_guard_status
  before update on public.communities
  for each row execute function public.guard_community_status();

create trigger events_guard_status
  before update on public.events
  for each row execute function public.guard_event_status();

create trigger community_members_sync_count
  after insert or delete on public.community_members
  for each row execute function public.sync_community_member_count();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 6. RPCs (capacity-safe RSVP)
-- ============================================================================

create or replace function public.rsvp_to_event(p_event_id uuid)
returns public.rsvp_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_capacity integer;
  v_status public.event_status;
  v_going integer;
  v_target public.rsvp_status;
  v_result public.rsvp_status;
begin
  if (select auth.uid()) is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  -- Lock the event row so two concurrent RSVPs cannot overfill it.
  select e.capacity, e.status
    into v_capacity, v_status
  from public.events e
  where e.id = p_event_id
  for update;

  if not found then
    raise exception 'Event not found' using errcode = 'P0002';
  end if;

  if v_status <> 'published' then
    raise exception 'Event is not open for registration' using errcode = '42501';
  end if;

  select status into v_result
  from public.event_attendees
  where event_id = p_event_id and user_id = (select auth.uid());

  if v_result = 'going' then
    return 'going';
  end if;

  select count(*) into v_going
  from public.event_attendees
  where event_id = p_event_id and status = 'going';

  v_target := case
    when v_capacity is null or v_going < v_capacity then 'going'::public.rsvp_status
    else 'waitlist'::public.rsvp_status
  end;

  if v_result is null then
    insert into public.event_attendees (event_id, user_id, status)
    values (p_event_id, (select auth.uid()), v_target);
  else
    update public.event_attendees
       set status = v_target
     where event_id = p_event_id and user_id = (select auth.uid());
  end if;

  return v_target;
end;
$$;

create or replace function public.cancel_rsvp(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.event_attendees
     set status = 'cancelled'
   where event_id = p_event_id and user_id = (select auth.uid());
end;
$$;

grant execute on function public.rsvp_to_event(uuid) to authenticated;
grant execute on function public.cancel_rsvp(uuid) to authenticated;

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.uae_pass_verifications enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.moderation_reports enable row level security;
alter table public.moderation_actions enable row level security;

-- 7.1 profiles --------------------------------------------------------------
create policy "profiles: read own"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "profiles: read onboarded members"
  on public.profiles for select to authenticated
  using (onboarded_at is not null);

create policy "profiles: staff read all"
  on public.profiles for select to authenticated
  using (public.is_staff());

create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles: admin manage"
  on public.profiles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 7.2 uae_pass_verifications ------------------------------------------------
create policy "verifications: read own"
  on public.uae_pass_verifications for select to authenticated
  using (user_id = (select auth.uid()));

create policy "verifications: request own"
  on public.uae_pass_verifications for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');

create policy "verifications: staff read all"
  on public.uae_pass_verifications for select to authenticated
  using (public.is_staff());

create policy "verifications: staff review"
  on public.uae_pass_verifications for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- 7.3 communities -----------------------------------------------------------
create policy "communities: read approved public"
  on public.communities for select to authenticated
  using (status = 'approved' and is_public);

create policy "communities: members read their own"
  on public.communities for select to authenticated
  using (
    owner_id = (select auth.uid())
    or public.is_community_member(id)
    or public.can_manage_community(id)
  );

create policy "communities: staff read all"
  on public.communities for select to authenticated
  using (public.is_staff());

create policy "communities: create as pending"
  on public.communities for insert to authenticated
  with check (owner_id = (select auth.uid()) and status = 'pending');

create policy "communities: owners update"
  on public.communities for update to authenticated
  using (public.can_manage_community(id))
  with check (public.can_manage_community(id));

create policy "communities: admin manage"
  on public.communities for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 7.4 community_members -----------------------------------------------------
create policy "members: read own"
  on public.community_members for select to authenticated
  using (user_id = (select auth.uid()));

create policy "members: read peers in joined community"
  on public.community_members for select to authenticated
  using (public.is_community_member(community_id));

create policy "members: join approved community"
  on public.community_members for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and role = 'member'
    and exists (
      select 1 from public.communities c
      where c.id = community_id and c.status = 'approved'
    )
  );

create policy "members: leave"
  on public.community_members for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "members: staff read all"
  on public.community_members for select to authenticated
  using (public.is_staff());

create policy "members: admin manage"
  on public.community_members for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 7.5 events ----------------------------------------------------------------
create policy "events: read published"
  on public.events for select to authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.communities c
      where c.id = community_id and c.status = 'approved'
    )
  );

create policy "events: read own or managed"
  on public.events for select to authenticated
  using (created_by = (select auth.uid()) or public.can_manage_event(id));

create policy "events: staff read all"
  on public.events for select to authenticated
  using (public.is_staff());

create policy "events: create in managed community"
  on public.events for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and public.can_manage_community(community_id)
    and status in ('draft', 'pending')
  );

create policy "events: managers update"
  on public.events for update to authenticated
  using (public.can_manage_event(id))
  with check (public.can_manage_event(id));

create policy "events: admin manage"
  on public.events for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 7.6 event_attendees -------------------------------------------------------
-- Writes go through public.rsvp_to_event() / public.cancel_rsvp() only.
create policy "attendees: read own"
  on public.event_attendees for select to authenticated
  using (user_id = (select auth.uid()));

create policy "attendees: organisers read roster"
  on public.event_attendees for select to authenticated
  using (public.can_manage_event(event_id) or public.is_staff());

-- 7.7 moderation_reports ----------------------------------------------------
create policy "reports: create own"
  on public.moderation_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));

create policy "reports: read own"
  on public.moderation_reports for select to authenticated
  using (reporter_id = (select auth.uid()));

create policy "reports: staff read all"
  on public.moderation_reports for select to authenticated
  using (public.is_staff());

create policy "reports: staff triage"
  on public.moderation_reports for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- 7.8 moderation_actions (append-only audit log) ----------------------------
create policy "actions: staff read"
  on public.moderation_actions for select to authenticated
  using (public.is_staff());

create policy "actions: staff append as self"
  on public.moderation_actions for insert to authenticated
  with check (actor_id = (select auth.uid()) and public.is_staff());

-- ============================================================================
-- 8. COLUMN-LEVEL PRIVILEGES (privacy hardening)
-- ============================================================================

-- Default Supabase grants give `authenticated` every column. Claw back the
-- identity hash so that no client can ever read it, even with a valid JWT.
revoke all on public.uae_pass_verifications from anon, authenticated;
grant select (id, user_id, status, requested_at, verified_at, expires_at,
              reviewed_by, rejection_reason, hash_algorithm)
  on public.uae_pass_verifications to authenticated;
grant insert (user_id, id_hash, hash_algorithm, pepper_version)
  on public.uae_pass_verifications to authenticated;
grant update (status, verified_at, reviewed_by, rejection_reason, expires_at)
  on public.uae_pass_verifications to authenticated;

-- Users never write profiles directly (the auth trigger creates them).
revoke insert, delete on public.profiles from anon, authenticated;

-- RSVPs are RPC-only.
revoke insert, update, delete on public.event_attendees from anon, authenticated;
grant select on public.event_attendees to authenticated;

-- ============================================================================
-- 9. PUBLIC VIEWS
-- ============================================================================

-- Safe projection for directory/search screens. `security_invoker` keeps the
-- caller's RLS in force.
create view public.public_profiles
with (security_invoker = true)
as
select
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.emirate,
  p.bio,
  p.locale,
  p.languages,
  p.interests,
  p.is_newcomer,
  p.created_at,
  exists (
    select 1 from public.uae_pass_verifications v
    where v.user_id = p.id and v.status = 'verified'
  ) as is_verified
from public.profiles p
where p.onboarded_at is not null;

grant select on public.public_profiles to authenticated;

-- The caller's own verification record, minus the hash.
create view public.my_verification
with (security_invoker = true)
as
select id, user_id, status, requested_at, verified_at, expires_at, rejection_reason
from public.uae_pass_verifications
where user_id = (select auth.uid());

grant select on public.my_verification to authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
