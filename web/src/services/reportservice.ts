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
  const sql = `
    SELECT 
      course_name, 
      teacher_name, 
      term, 
      total_students, 
      avg_final_grade, 
      failed_count 
    FROM v_course_performance 
    ORDER BY avg_final_grade ASC
  `;
  const result = await query(sql);
  
  return { 
    data: result.rows.map((row: any) => ({
      course_name: row.course_name,
      course_code: 'N/A', // La vista no tiene código, ponemos default
      term: row.term,
      teacher_name: row.teacher_name,
      total_students: parseInt(row.total_students),
      average_grade: parseFloat(row.avg_final_grade),
      approval_rate: 0 // La vista no tiene este cálculo, lo dejamos en 0 o se calcula aquí
    })) as CoursePerformance[] 
  };
}

// REPORTE 2: Estudiantes en Riesgo
export async function getStudentsAtRisk(search: string = '', page: number = 1) {
  const itemsPerPage = 6;
  const offset = (page - 1) * itemsPerPage;
  const searchTerm = `%${search}%`;

  // Tu vista v_at_risk_students agrupa por estudiante, no tiene 'curso' ni 'asistencia'
  const sqlData = `
    SELECT name, program, global_average, status_academico
    FROM v_at_risk_students
    WHERE name ILIKE $1
    ORDER BY global_average ASC
    LIMIT $2 OFFSET $3
  `;
  
  const sqlCount = `SELECT COUNT(*) FROM v_at_risk_students WHERE name ILIKE $1`;

  const [dataResult, countResult] = await Promise.all([
    query(sqlData, [searchTerm, itemsPerPage, offset]),
    query(sqlCount, [searchTerm])
  ]);

  const totalItems = parseInt(countResult.rows[0].count);
  
  return {
    data: dataResult.rows.map((row: any) => ({
      student_id: 0, // La vista no devuelve ID
      student_name: row.name,
      email: 'No disponible', // La vista no devuelve email
      course_name: row.program, // Usamos el programa como contexto
      attendance_pct: 0, // La vista no tiene asistencia
      current_grade: parseFloat(row.global_average)
    })) as AtRiskStudent[],
    pagination: {
      page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems
    }
  };
}

// REPORTE 3: Ranking
export async function getStudentRankings() {
  const sql = `SELECT * FROM v_student_rankings ORDER BY program, ranking`;
  const result = await query(sql);
  
  return { 
    data: result.rows.map((row: any) => ({
      student_id: 0,
      name: row.name,
      program: row.program,
      average_grade: parseFloat(row.final_average),
      rank: parseInt(row.ranking)
    })) as StudentRanking[] 
  };
}

// REPORTE 4: Asistencia
export async function getAttendanceSummary() {
  const sql = 'SELECT * FROM v_attendance_summary ORDER BY attendance_pct ASC';
  const result = await query(sql);
  return { 
    data: result.rows.map((row: any) => ({
      student_id: 0,
      student_name: row.student,
      course_name: row.course,
      attendance_pct: parseFloat(row.attendance_pct)
    })) as AttendanceSummary[] 
  };
}

// REPORTE 5: Dashboard de Grupos
export async function getGroupsDashboard() {
  const sql = 'SELECT * FROM v_groups_dashboard ORDER BY enrolled DESC';
  const result = await query(sql);
  return { 
    data: result.rows.map((row: any) => ({
      group_id: row.group_id,
      course_code: row.code,
      course_name: row.course,
      term: row.term,
      total_students: parseInt(row.enrolled)
    })) as GroupDashboard[] 
  };
}