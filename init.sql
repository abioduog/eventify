-- init.sql
CREATE USER eventify_admin WITH PASSWORD 'eventify_password' SUPERUSER;
CREATE DATABASE eventify;
\c eventify;

-- Create schema and set permissions
CREATE SCHEMA IF NOT EXISTS public;
ALTER SCHEMA public OWNER TO eventify_admin;
GRANT ALL ON SCHEMA public TO eventify_admin;
