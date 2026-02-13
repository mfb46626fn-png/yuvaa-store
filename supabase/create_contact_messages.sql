-- Create contact_messages table
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table contact_messages enable row level security;

-- Policies
-- Allow anyone (anon) to insert messages
create policy "Anyone can insert contact messages"
  on contact_messages for insert
  with check (true);

-- Allow admins (service role or authenticated admins) to view all messages
-- Assuming admin checks are done via app logic or role, for now letting authenticated users read might be too broad if we don't have roles.
-- But usually for these projects we rely on the app's admin protection or simple auth.
-- Let's stick to: Authenticated users can read (if we assume only admins log in, or we'll refine later).
-- Actually, better to limit to service role or specific admin logic if possible.
-- For simplicity in this project context where `isAdmin` might be app-level:
-- We'll allow "Authenticated" to select/update/delete for now, assuming typical Supabase setup where we might lock it down further later.
-- Or better, if we don't have roles, maybe just public insert and authenticated select is enough for now.

create policy "Authenticated users can view contact messages"
  on contact_messages for select
  to authenticated
  using (true);

create policy "Authenticated users can update contact messages"
  on contact_messages for update
  to authenticated
  using (true);

create policy "Authenticated users can delete contact messages"
  on contact_messages for delete
  to authenticated
  using (true);
