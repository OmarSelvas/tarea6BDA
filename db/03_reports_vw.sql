-- VISTA 1: Rendimiento Académico por Curso
CREATE OR REPLACE VIEW v_rendimiento_academico AS
SELECT 
    c.code AS codigo_curso,
    c.name AS nombre_curso,
    c.credits AS creditos,
    t.name AS nombre_profesor,
    g.term AS periodo,
    COUNT(DISTINCT e.student_id) AS total_estudiantes,
    ROUND(AVG(gr.final), 2) AS promedio_final,
    ROUND(
        (COUNT(CASE WHEN gr.final >= 70 THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(gr.final), 0)) * 100, 
        2
    ) AS tasa_aprobacion,
    COUNT(CASE WHEN gr.final < 70 THEN 1 END) AS reprobados,
    COUNT(CASE WHEN gr.final >= 90 THEN 1 END) AS estudiantes_excelencia,
    ROUND(AVG(gr.partial1), 2) AS promedio_parcial1,
    ROUND(AVG(gr.partial2), 2) AS promedio_parcial2,
    ROUND(AVG(gr.partial2) - AVG(gr.partial1), 2) AS variacion_parciales
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN teachers t ON g.teacher_id = t.id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.code, c.name, c.credits, t.name, g.term
ORDER BY tasa_aprobacion ASC, promedio_final DESC;
CREATE OR REPLACE VIEW v_estudiantes_riesgo AS
WITH asistencia_estudiante AS (
    SELECT 
        e.student_id,
        COUNT(*) AS total_clases,
        SUM(CASE WHEN a.present THEN 1 ELSE 0 END) AS clases_asistidas,
        ROUND(
            (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / 
             NULLIF(COUNT(*), 0)) * 100, 
            2
        ) AS porcentaje_asistencia
    FROM enrollments e
    JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY e.student_id
),
rendimiento_estudiante AS (
    SELECT 
        e.student_id,
        COUNT(DISTINCT e.group_id) AS materias_cursadas,
        COUNT(CASE WHEN gr.final < 70 THEN 1 END) AS materias_reprobadas,
        ROUND(AVG(gr.final), 2) AS promedio_final,
        MIN(gr.final) AS calificacion_minima,
        MAX(gr.final) AS calificacion_maxima
    FROM enrollments e
    JOIN grades gr ON e.id = gr.enrollment_id
    GROUP BY e.student_id
)
SELECT 
    s.id AS estudiante_id,
    s.name AS nombre_estudiante,
    s.email AS email_estudiante,
    s.program AS programa,
    s.enrollment_year AS anio_ingreso,
    COALESCE(r.promedio_final, 0) AS promedio_final,
    COALESCE(a.porcentaje_asistencia, 0) AS porcentaje_asistencia,
    COALESCE(r.materias_cursadas, 0) AS materias_cursadas,
    COALESCE(r.materias_reprobadas, 0) AS materias_reprobadas,
    r.calificacion_minima,
    r.calificacion_maxima,
    CASE 
        WHEN r.promedio_final < 60 OR a.porcentaje_asistencia < 50 THEN 'Crítico - Riesgo Alto'
        WHEN r.promedio_final < 70 OR a.porcentaje_asistencia < 65 THEN 'Alerta - Riesgo Medio'
        WHEN r.promedio_final < 80 OR a.porcentaje_asistencia < 75 THEN 'Prevención - Riesgo Bajo'
        ELSE 'Estable'
    END AS nivel_riesgo,
    ROUND(90 - COALESCE(r.promedio_final, 0), 2) AS brecha_excelencia
FROM students s
LEFT JOIN rendimiento_estudiante r ON s.id = r.student_id
LEFT JOIN asistencia_estudiante a ON s.id = a.student_id
WHERE r.promedio_final < 80 OR a.porcentaje_asistencia < 75
GROUP BY s.id, s.name, s.email, s.program, s.enrollment_year, 
         r.promedio_final, a.porcentaje_asistencia, r.materias_cursadas, 
         r.materias_reprobadas, r.calificacion_minima, r.calificacion_maxima
HAVING COALESCE(r.promedio_final, 0) < 80 OR COALESCE(a.porcentaje_asistencia, 0) < 75
ORDER BY nivel_riesgo, promedio_final ASC;

-- VISTA 3: Ranking Estudiantes por Programa 
CREATE OR REPLACE VIEW v_ranking_estudiantes AS
WITH promedios_estudiante AS (
    SELECT 
        s.id AS estudiante_id,
        s.name AS nombre_estudiante,
        s.email AS email_estudiante,
        s.program AS programa,
        s.enrollment_year AS anio_ingreso,
        COUNT(DISTINCT e.group_id) AS materias_cursadas,
        ROUND(AVG(gr.final), 2) AS promedio_periodo,
        MIN(gr.final) AS nota_minima,
        MAX(gr.final) AS nota_maxima
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    JOIN grades gr ON e.id = gr.enrollment_id
    GROUP BY s.id, s.name, s.email, s.program, s.enrollment_year
)
SELECT 
    estudiante_id,
    nombre_estudiante,
    email_estudiante,
    programa,
    anio_ingreso,
    promedio_periodo,
    materias_cursadas,
    nota_minima,
    nota_maxima,
    RANK() OVER (
        PARTITION BY programa 
        ORDER BY promedio_periodo DESC
    ) AS posicion_programa,
    RANK() OVER (
        ORDER BY promedio_periodo DESC
    ) AS posicion_general,
    CASE 
        WHEN promedio_periodo >= 95 THEN 'Excelencia'
        WHEN promedio_periodo >= 85 THEN 'Sobresaliente'
        WHEN promedio_periodo >= 75 THEN 'Bueno'
        WHEN promedio_periodo >= 70 THEN 'Aprobado'
        ELSE 'Reprobado'
    END AS clasificacion_rendimiento,
    ROUND(
        promedio_periodo - AVG(promedio_periodo) OVER (PARTITION BY programa),
        2
    ) AS diferencia_vs_promedio_programa
FROM promedios_estudiante
ORDER BY programa, posicion_programa;

-- VISTA 4: Resumen de Asistencia por Estudiante y Curso
CREATE OR REPLACE VIEW v_resumen_asistencia AS
SELECT 
    s.id AS estudiante_id,
    s.name AS nombre_estudiante,
    s.email AS email_estudiante,
    s.program AS programa,
    c.code AS codigo_curso,
    c.name AS nombre_curso,
    g.term AS periodo,
    COUNT(*) AS total_clases,
    SUM(CASE WHEN a.present THEN 1 ELSE 0 END) AS clases_asistidas,
    COUNT(*) - SUM(CASE WHEN a.present THEN 1 ELSE 0 END) AS clases_faltadas,
    ROUND(
        (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100,
        2
    ) AS porcentaje_asistencia,
    COALESCE(
        ROUND(
            (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / 
             NULLIF(COUNT(*), 0)) * 100,
            2
        ),
        0
    ) AS asistencia_segura,
    CASE 
        WHEN (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100 >= 90 THEN 'Excelente'
        WHEN (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100 >= 75 THEN 'Buena'
        WHEN (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100 >= 60 THEN 'Regular'
        ELSE 'Crítica'
    END AS estado_asistencia
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN courses c ON g.course_id = c.id
JOIN attendance a ON e.id = a.enrollment_id
GROUP BY s.id, s.name, s.email, s.program, c.code, c.name, g.term
HAVING (SUM(CASE WHEN a.present THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100 < 100
ORDER BY porcentaje_asistencia ASC, nombre_estudiante;

-- VISTA 5: Desempeño de Profesores
CREATE OR REPLACE VIEW v_desempeno_profesores AS
WITH stats_por_grupo AS (
    SELECT 
        t.id AS profesor_id,
        t.name AS nombre_profesor,
        g.id AS grupo_id,
        c.name AS nombre_curso,
        g.term AS periodo,
        COUNT(DISTINCT e.student_id) AS estudiantes_grupo,
        ROUND(AVG(gr.final), 2) AS promedio_grupo,
        COUNT(CASE WHEN gr.final >= 70 THEN 1 END) AS aprobados_grupo,
        COUNT(CASE WHEN gr.final >= 90 THEN 1 END) AS destacados_grupo
    FROM teachers t
    JOIN groups g ON t.id = g.teacher_id
    JOIN courses c ON g.course_id = c.id
    LEFT JOIN enrollments e ON g.id = e.group_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    GROUP BY t.id, t.name, g.id, c.name, g.term
)
SELECT 
    profesor_id,
    nombre_profesor,
    COUNT(DISTINCT grupo_id) AS grupos_impartidos,
    SUM(estudiantes_grupo) AS total_estudiantes,
    ROUND(AVG(promedio_grupo), 2) AS promedio_general,
    ROUND(
        (SUM(aprobados_grupo)::DECIMAL / NULLIF(SUM(estudiantes_grupo), 0)) * 100,
        2
    ) AS tasa_aprobacion,
    SUM(destacados_grupo) AS estudiantes_destacados,
    MIN(promedio_grupo) AS grupo_menor_rendimiento,
    MAX(promedio_grupo) AS grupo_mayor_rendimiento,
    RANK() OVER (ORDER BY AVG(promedio_grupo) DESC) AS ranking_profesores,
    CASE 
        WHEN AVG(promedio_grupo) >= 85 THEN 'Destacado'
        WHEN AVG(promedio_grupo) >= 75 THEN 'Competente'
        WHEN AVG(promedio_grupo) >= 70 THEN 'Aceptable'
        ELSE 'Requiere Mejora'
    END AS evaluacion_desempeno
FROM stats_por_grupo
GROUP BY profesor_id, nombre_profesor
HAVING COUNT(DISTINCT grupo_id) > 0
ORDER BY promedio_general DESC, tasa_aprobacion DESC;