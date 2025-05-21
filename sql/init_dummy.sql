ALTER SYSTEM SET max_wal_size = '4GB';
SELECT pg_reload_conf();

-- Enable the uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Create account table
CREATE TABLE account (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  client_id UUID NOT NULL,
  registration_method VARCHAR(50),
  shard_region VARCHAR(50),
  create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  display_name VARCHAR(100),
  email_is_verified BOOLEAN DEFAULT FALSE
);

-- Step 2: Create account_setting table WITHOUT foreign key
CREATE TABLE account_setting (
  id UUID PRIMARY KEY,
  avatar_url VARCHAR(255),
  lang_code VARCHAR(10),
  create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create dummy data
COPY account(id, account, email, client_id, registration_method, shard_region, create_time, modify_time, display_name, email_is_verified)
FROM '/docker-entrypoint-initdb.d/data/account.csv' WITH (FORMAT csv, HEADER false);

COPY account_setting(id, avatar_url, lang_code, create_time, modify_time)
FROM '/docker-entrypoint-initdb.d/data/account_setting.csv' WITH (FORMAT csv, HEADER false);

-- Step 4: Add the foreign key constraint separately
ALTER TABLE public.account_setting
ADD CONSTRAINT fk_account_setting_account
FOREIGN KEY (id) REFERENCES public.account(id)
ON DELETE CASCADE;
