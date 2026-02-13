export const dynamic = 'force-dynamic';

interface CourseData {
  success: boolean;
  data: Array<{
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
  }>;
}

async function getCoursePerformance(): Promise<CourseData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/course`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function CoursePerformancePage() {
  const { data } = await getCoursePerformance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="mb-8 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-blue-100">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">📊 Rendimiento Académico por Curso</h1>
          <p className="text-gray-600">Análisis de desempeño estudiantil por materia, profesor y período</p>
        </div>

        {/* KPIs Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Total de Grupos"
            value={data.length}
            icon="📚"
            color="blue"
          />
          <KPICard
            label="Promedio General"
            value={`${(data.reduce((acc, c) => acc + c.promedio_final, 0) / data.length).toFixed(2)}`}
            icon="🎯"
            color="green"
          />
          <KPICard
            label="Tasa Aprobación Promedio"
            value={`${(data.reduce((acc, c) => acc + c.tasa_aprobacion, 0) / data.length).toFixed(1)}%`}
            icon="✅"
            color="purple"
          />
          <KPICard
            label="Estudiantes de Excelencia"
            value={data.reduce((acc, c) => acc + c.estudiantes_excelencia, 0)}
            icon="⭐"
            color="yellow"
          />
        </div>

        {/* Tabla de datos */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Código</th>
                  <th className="px-6 py-4 text-left">Curso</th>
                  <th className="px-6 py-4 text-left">Profesor</th>
                  <th className="px-6 py-4 text-left">Período</th>
                  <th className="px-6 py-4 text-center">Estudiantes</th>
                  <th className="px-6 py-4 text-center">Promedio</th>
                  <th className="px-6 py-4 text-center">Aprobación</th>
                  <th className="px-6 py-4 text-center">Reprobados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((course, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{course.codigo_curso}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{course.nombre_curso}</td>
                    <td className="px-6 py-4 text-gray-700">{course.nombre_profesor}</td>
                    <td className="px-6 py-4 text-gray-600">{course.periodo}</td>
                    <td className="px-6 py-4 text-center font-bold">{course.total_estudiantes}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${getGradeColor(course.promedio_final)}`}>
                        {course.promedio_final}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getApprovalColor(course.tasa_aprobacion)}`}>
                        {course.tasa_aprobacion}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-red-600 font-bold">{course.reprobados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackButton() {
  return (
    <div className="mb-6">
      
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-blue-200 hover:shadow-sm"
        <span className="mr-2 text-xl">←</span> Volver al Dashboard
    </div>
  );
}

function KPICard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <div className="text-right">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm opacity-90">{label}</p>
        </div>
      </div>
    </div>
  );
}

function getGradeColor(grade: number): string {
  if (grade >= 90) return 'text-green-600';
  if (grade >= 80) return 'text-blue-600';
  if (grade >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function getApprovalColor(rate: number): string {
  if (rate >= 90) return 'bg-green-100 text-green-700';
  if (rate >= 75) return 'bg-blue-100 text-blue-700';
  if (rate >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}