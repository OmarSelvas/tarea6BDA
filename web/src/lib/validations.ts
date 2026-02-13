import { query } from '@/lib/db';
import { 
  CoursePerformance, 
  AtRiskStudent, 
  StudentRanking, 
  AttendanceSummary, 
  GroupDashboard 
} from '@/lib/definitions';

// REPORTE 1: Rendimiento por Curso
export async function getCoursePerformance() {
  const sql = 'SELECT * FROM v_course_performance ORDER BY avg_final_grade ASC';
  const result = await query(sql);
  return { data: result.rows as CoursePerformance[] };
}

// REPORTE 2: Estudiantes en Riesgo (Con Paginación y Filtro)
export async function getStudentsAtRisk(search: string = '', page: number = 1) {
  const itemsPerPage = 6;
  const offset = (page - 1) * itemsPerPage;
  const searchTerm = `%${search}%`;

  // 1. Obtener datos paginados
  const sqlData = `
    SELECT 
      name as nombre_estudiante,
      program as programa,
      global_average as promedio_final,
      status_academico as nivel_riesgo,
      0 as porcentaje_asistencia -- Nota: Tu vista SQL 2 no tiene asistencia, ponemos 0 o ajusta la vista
    FROM v_at_risk_students
    WHERE name ILIKE $1
    ORDER BY global_average ASC
    LIMIT $2 OFFSET $3
  `;
  
  // 2. Obtener total para paginación
  const sqlCount = `SELECT COUNT(*) FROM v_at_risk_students WHERE name ILIKE $1`;

  const [dataResult, countResult] = await Promise.all([
    query(sqlData, [searchTerm, itemsPerPage, offset]),
    query(sqlCount, [searchTerm])
  ]);

  const totalItems = parseInt(countResult.rows[0].count);
  
  return {
    data: dataResult.rows, // Ajustamos al tipo 'any' temporalmente porque la vista SQL difiere un poco de tu UI
    pagination: {
      page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems
    }
  };
}

// REPORTE 3: Ranking (Top Estudiantes)
export async function getStudentRankings() {
  const sql = `
    SELECT 
      name as nombre_estudiante, 
      program as programa, 
      final_average as promedio_periodo, 
      ranking as posicion_programa,
      'Excelente' as clasificacion_rendimiento, -- Campo simulado para UI
      5 as materias_cursadas -- Campo simulado para UI
    FROM v_student_rankings 
    ORDER BY program, ranking
  `;
  const result = await query(sql);
  return { data: result.rows };
}

// REPORTE 4: Asistencia
export async function getAttendanceSummary() {
  const sql = 'SELECT * FROM v_attendance_summary ORDER BY attendance_pct ASC';
  const result = await query(sql);
  return { data: result.rows as AttendanceSummary[] };
}

// REPORTE 5: Dashboard de Grupos
export async function getGroupsDashboard() {
  const sql = 'SELECT * FROM v_groups_dashboard ORDER BY enrolled DESC';
  const result = await query(sql);
  return { data: result.rows as GroupDashboard[] };
}