#!/bin/bash

# setup-db.sh
echo "Waiting for PostgreSQL to start..."
sleep 5

# Connect to PostgreSQL and set up the database
PGPASSWORD=eventify_password psql -h localhost -U postgres -d postgres -c "
DROP DATABASE IF EXISTS eventify;
DROP USER IF EXISTS eventify_admin;

CREATE USER eventify_admin WITH PASSWORD 'eventify_password';
CREATE DATABASE eventify OWNER eventify_admin;

\c eventify

CREATE SCHEMA IF NOT EXISTS public;
ALTER SCHEMA public OWNER TO eventify_admin;

GRANT ALL PRIVILEGES ON DATABASE eventify TO eventify_admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO eventify_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO eventify_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO eventify_admin;
"

echo "Database setup completed!"