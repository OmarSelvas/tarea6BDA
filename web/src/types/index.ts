export interface RendimientoAcademico {
  codigo_curso: string;
  nombre_curso: string;
  creditos: number;
  nombre_profesor: string;
  periodo: string;
  total_estudiantes: number;
  promedio_final: number;
  tasa_aprobacion: number;
  reprobados: number;
  estudiantes_excelencia: number;
  promedio_parcial1: number;
  promedio_parcial2: number;
  variacion_parciales: number;
}

export interface EstudianteRiesgo {
  estudiante_id: number;
  nombre_estudiante: string;
  email_estudiante: string;
  programa: string;
  anio_ingreso: number;
  promedio_final: number;
  porcentaje_asistencia: number;
  materias_cursadas: number;
  materias_reprobadas: number;
  calificacion_minima: number;
  calificacion_maxima: number;
  nivel_riesgo: string;
  brecha_excelencia: number;
}

export interface StudentRanking {
  estudiante_id: number;
  nombre_estudiante: string;
  email_estudiante: string;
  programa: string;
  anio_ingreso: number;
  promedio_periodo: number;
  materias_cursadas: number;
  nota_minima: number;
  nota_maxima: number;
  posicion_programa: number;
  posicion_general: number;
  clasificacion_rendimiento: string;
  diferencia_vs_promedio_programa: number;
}

export interface ResumenAsistencia {
  estudiante_id: number;
  nombre_estudiante: string;
  email_estudiante: string;
  programa: string;
  codigo_curso: string;
  nombre_curso: string;
  periodo: string;
  total_clases: number;
  clases_asistidas: number;
  clases_faltadas: number;
  porcentaje_asistencia: number;
  asistencia_segura: number;
  estado_asistencia: string;
}

export interface DesempenoProfesores {
  profesor_id: number;
  nombre_profesor: string;
  grupos_impartidos: number;
  total_estudiantes: number;
  promedio_general: number;
  tasa_aprobacion: number;
  estudiantes_destacados: number;
  grupo_menor_rendimiento: number;
  grupo_mayor_rendimiento: number;
  ranking_profesores: number;
  evaluacion_desempeno: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}