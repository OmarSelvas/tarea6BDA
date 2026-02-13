import { query } from './db';
import { CoursePerformance, AtRiskStudent } from './definitions';
import { z } from 'zod';

// Schema de validación para filtros
const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

// REPORTE 1: Rendimiento (Simple, sin filtros complejos)
export async function fetchCoursePerformance() {
  try {
    // IMPORTANTE: SELECT a la VIEW, no query compleja
    const result = await query('SELECT * FROM report_course_performance ORDER BY approval_rate ASC');
    return result.rows as CoursePerformance[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch course performance data.');
  }
}

// REPORTE 2: Estudiantes en Riesgo (Con Paginación y Filtros)
export async function fetchAtRiskStudents(currentPage: number, queryStr: string) {
  const parsedPage = PaginationSchema.safeParse({ page: currentPage });
  if (!parsedPage.success) throw new Error("Invalid page");
  
  const offset = (parsedPage.data.page - 1) * 6; 
  const searchTerm = `%${queryStr}%`;

  try {
    const result = await query(`
      SELECT * FROM report_at_risk_students
      WHERE course_name ILIKE $1 OR student_name ILIKE $1
      ORDER BY attendance_pct ASC
      LIMIT 6 OFFSET $2
    `, [searchTerm, offset]);
    
    return result.rows as AtRiskStudent[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch at-risk students.');
  }
}

export async function fetchTotalAtRiskStudents(queryStr: string) {
  const searchTerm = `%${queryStr}%`;

  try {
    const result = await query(`
      SELECT COUNT(*) FROM report_at_risk_students
      WHERE course_name ILIKE $1 OR student_name ILIKE $1
    `, [searchTerm]);
    
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total count of at-risk students.');
  }
}

export async function fetchTotalPagesAtRiskStudents(queryStr: string) {
  const totalCount = await fetchTotalAtRiskStudents(queryStr);
  return Math.ceil(totalCount / 6); 
}   

export async function fetchAtRiskStudentsByCourse(courseName: string) {
  try {
    const result = await query(`
      SELECT * FROM report_at_risk_students
      WHERE course_name = $1
      ORDER BY attendance_pct ASC
    `, [courseName]);
    
    return result.rows as AtRiskStudent[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch at-risk students by course.');
  }
}   

export async function fetchAtRiskStudentsByStudent(studentName: string) {
  try {
    const result = await query(`
      SELECT * FROM report_at_risk_students
      WHERE student_name = $1
      ORDER BY attendance_pct ASC
    `, [studentName]);
    
    return result.rows as AtRiskStudent[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch at-risk students by student name.');
  }
}
