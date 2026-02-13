CREATE INDEX IF NOT EXISTS idx_grades_enrollment_final 
ON grades(enrollment_id, final)
WHERE final IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_grades_final_below_80 
ON grades(final)
WHERE final < 80;

CREATE INDEX IF NOT EXISTS idx_attendance_enrollment_present 
ON attendance(enrollment_id, present, date);

CREATE INDEX IF NOT EXISTS idx_students_program 
ON students(program, id);

CREATE INDEX IF NOT EXISTS idx_groups_teacher_course 
ON groups(teacher_id, course_id, term);
ON students USING gin(name gin_trgm_ops);
CREATE EXTENSION IF NOT EXISTS pg_trgm;