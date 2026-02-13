DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_pass_123';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE "tiendita_db" TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
GRANT SELECT ON v_course_performance TO app_user;
GRANT SELECT ON v_at_risk_students TO app_user;
GRANT SELECT ON v_student_rankings TO app_user;
GRANT SELECT ON v_attendance_summary TO app_user;
GRANT SELECT ON v_groups_dashboard TO app_user;