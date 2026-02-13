-- VISTA 1: Rendimiento por Curso (Agregaciones + Group By)
-- Responde: ¿Qué materias tienen peor promedio y cuántos reprobados?
CREATE OR REPLACE VIEW v_course_performance AS
SELECT 
    c.name AS course_name,
    t.name AS teacher_name,
    g.term,
    COUNT(e.student_id) as total_students,
    ROUND(AVG(gr.final), 2) as avg_final_grade,
    SUM(CASE WHEN gr.final < 70 THEN 1 ELSE 0 END) as failed_count -- Campo calculado
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN teachers t ON g.teacher_id = t.id
JOIN enrollments e ON g.id = e.group_id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.name, t.name, g.term;

-- VISTA 2: Estudiantes en Riesgo (HAVING + CASE + COALESCE)
-- Responde: ¿Qué alumnos tienen mal promedio o muchas faltas?
CREATE OR REPLACE VIEW v_at_risk_students AS
SELECT 
    s.name,
    s.program,
    COALESCE(AVG(gr.final), 0) as global_average,
    CASE 
        WHEN AVG(gr.final) < 70 THEN 'CRITICO_ACADEMICO'
        WHEN AVG(gr.final) < 80 THEN 'RIESGO_BAJO'
        ELSE 'OK'
    END as status_academico
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.id, s.name, s.program
HAVING AVG(gr.final) < 80; -- Requisito: HAVING

-- VISTA 3: Ranking de Mejores Promedios (Window Function)
-- Responde: ¿Quiénes son los top 3 estudiantes por carrera?
CREATE OR REPLACE VIEW v_student_rankings AS
SELECT 
    s.name,
    s.program,
    ROUND(AVG(gr.final), 2) as final_average,
    RANK() OVER (PARTITION BY s.program ORDER BY AVG(gr.final) DESC) as ranking -- Requisito: Window Function
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.id, s.name, s.program;

-- VISTA 4: Reporte de Asistencia 
-- Responde: Porcentaje de asistencia por alumno usando CTE
CREATE OR REPLACE VIEW v_attendance_summary AS
WITH attendance_counts AS (
    SELECT 
        enrollment_id,
        COUNT(*) as total_classes,
        SUM(CASE WHEN present THEN 1 ELSE 0 END) as days_present
    FROM attendance
    GROUP BY enrollment_id
)
SELECT 
    s.name as student,
    c.name as course,
    ac.days_present,
    ac.total_classes,
    (ac.days_present::decimal / NULLIF(ac.total_classes, 0)) * 100 as attendance_pct
FROM attendance_counts ac
JOIN enrollments e ON ac.enrollment_id = e.id
JOIN students s ON e.student_id = s.id
JOIN groups g ON e.group_id = g.id
JOIN courses c ON g.course_id = c.id;

-- VISTA 5: Dashboard General de Grupos
CREATE OR REPLACE VIEW v_groups_dashboard AS
SELECT 
    g.id as group_id,
    c.code,
    c.name as course,
    g.term,
    COUNT(e.id) as enrolled
FROM groups g
JOIN courses c ON g.course_id = c.id
LEFT JOIN enrollments e ON g.id = e.group_id
GROUP BY g.id, c.code, c.name, g.term;

-- Dar permiso al usuario de la app SOLO para ver estas vistas
GRANT SELECT ON v_course_performance TO app_user;
GRANT SELECT ON v_at_risk_students TO app_user;
GRANT SELECT ON v_student_rankings TO app_user;
GRANT SELECT ON v_attendance_summary TO app_user;
GRANT SELECT ON v_groups_dashboard TO app_user;