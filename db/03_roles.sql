DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_pass_123';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE "school_db" TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
