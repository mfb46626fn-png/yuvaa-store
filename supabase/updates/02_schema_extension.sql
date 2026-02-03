-- Enable RLS on all tables

-- 1. Create PROFILES table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('admin', 'customer')) default 'customer',
  full_name text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- 2. Create Trigger for Auto Profile Creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication error on rerun
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Update ORDERS table (Fixing the missing user_id error)
alter table public.orders 
add column if not exists user_id uuid references auth.users(id),
add column if not exists tracking_number text,
add column if not exists carrier text;

-- 4. Create RETURNS table
create table if not exists public.returns (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) not null,
  user_id uuid references auth.users(id) not null,
  reason text not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.returns enable row level security;

-- 5. RLS Policies

-- Profiles Policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" 
  on profiles for select 
  using ( true );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- Orders Policies
drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders" 
  on orders for select 
  using ( auth.uid() = user_id );

-- Returns Policies
drop policy if exists "Users can view own returns" on returns;
create policy "Users can view own returns" 
  on returns for select 
  using ( auth.uid() = user_id );

drop policy if exists "Users can create returns" on returns;
create policy "Users can create returns" 
  on returns for insert 
  with check ( auth.uid() = user_id );

-- ADMIN POLICIES & HELPER
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Apply Admin Access (Drop existing policies first to be safe)
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles" on profiles for select using ( is_admin() );

drop policy if exists "Admins can update all profiles" on profiles;
create policy "Admins can update all profiles" on profiles for update using ( is_admin() );

drop policy if exists "Admins can view all returns" on returns;
create policy "Admins can view all returns" on returns for select using ( is_admin() );

drop policy if exists "Admins can update returns" on returns;
create policy "Admins can update returns" on returns for update using ( is_admin() );

drop policy if exists "Admins can view all orders" on orders;
create policy "Admins can view all orders" on orders for select using ( is_admin() );

drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders" on orders for update using ( is_admin() );
