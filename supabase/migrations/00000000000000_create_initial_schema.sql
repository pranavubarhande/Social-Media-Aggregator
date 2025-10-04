-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Platform Types enum
create type platform_type as enum (
  'youtube',
  'instagram',
  'linkedin',
  'facebook',
  'twitter',
  'medium',
  'google_analytics'
);

-- API Credentials table
create table api_credentials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  platform platform_type not null,
  credentials jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, platform)
);

-- Enable Row Level Security
alter table api_credentials enable row level security;

-- Create policy to only allow users to see their own credentials
create policy "Users can only view their own credentials"
  on api_credentials for select
  using (auth.uid() = user_id);

-- Create policy to only allow users to insert their own credentials
create policy "Users can only insert their own credentials"
  on api_credentials for insert
  with check (auth.uid() = user_id);

-- Create policy to only allow users to update their own credentials
create policy "Users can only update their own credentials"
  on api_credentials for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy to only allow users to delete their own credentials
create policy "Users can only delete their own credentials"
  on api_credentials for delete
  using (auth.uid() = user_id);

-- Cached Metrics table
create table cached_metrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  platform platform_type not null,
  metrics jsonb not null,
  cache_time timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, platform)
);

-- Enable Row Level Security
alter table cached_metrics enable row level security;

-- Create policy to only allow users to see their own metrics
create policy "Users can only view their own metrics"
  on cached_metrics for select
  using (auth.uid() = user_id);

-- Create policy to only allow users to insert their own metrics
create policy "Users can only insert their own metrics"
  on cached_metrics for insert
  with check (auth.uid() = user_id);

-- Create policy to only allow users to update their own metrics
create policy "Users can only update their own metrics"
  on cached_metrics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy to only allow users to delete their own metrics
create policy "Users can only delete their own metrics"
  on cached_metrics for delete
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index api_credentials_user_id_idx on api_credentials(user_id);
create index api_credentials_platform_idx on api_credentials(platform);
create index cached_metrics_user_id_idx on cached_metrics(user_id);
create index cached_metrics_platform_idx on cached_metrics(platform);
create index cached_metrics_cache_time_idx on cached_metrics(cache_time);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at columns
create trigger update_api_credentials_updated_at
  before update on api_credentials
  for each row
  execute function update_updated_at_column();

create trigger update_cached_metrics_updated_at
  before update on cached_metrics
  for each row
  execute function update_updated_at_column();