import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface StudentsData {
  success: boolean;
  data: Array<{
    estudiante_id: number;
    nombre_estudiante: string;
    email_estudiante: string;
    programa: string;
    anio_ingreso: number;
    promedio_final: number;
    porcentaje_asistencia: number;
    materias_cursadas: number;
    materias_reprobadas: number;
    nivel_riesgo: string;
    brecha_excelencia: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getStudentsAtRisk(query: string, page: number): Promise<StudentsData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/students?q=${query}&page=${page}&limit=9`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function StudentsAtRiskPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || '';
  const currentPage = Number(searchParams.page) || 1;
  const { data, pagination } = await getStudentsAtRisk(query, currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Botón de regresar */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-red-200 hover:shadow-sm"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        {/* Header con búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-red-100">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">⚠️ Estudiantes en Riesgo</h1>
            <p className="text-gray-600">Gestión y seguimiento de alumnos con alertas académicas</p>
          </div>

          <form className="w-full md:w-auto flex gap-2">
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre..."
              className="px-5 py-3 rounded-l-xl border border-gray-300 focus:border-red-400 outline-none w-full md:w-80"
            />
            {query && (
              <Link
                href="/reports/students"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-3 flex items-center hover:bg-gray-200 transition"
              >
                ✕
              </Link>
            )}
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded-r-xl font-bold hover:bg-red-600 transition"
            >
              🔍 Buscar
            </button>
          </form>
        </div>

        {/* Resultados */}
        {data.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {data.map((student) => (
                <StudentCard key={student.estudiante_id} student={student} />
              ))}
            </div>

            {/* Paginación */}
            <Pagination query={query} currentPage={currentPage} pagination={pagination} />
          </>
        )}
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: any }) {
  const getRiskColor = (nivel: string) => {
    if (nivel.includes('Crítico')) return 'from-red-400 to-pink-400';
    if (nivel.includes('Alerta')) return 'from-orange-400 to-yellow-400';
    if (nivel.includes('Prevención')) return 'from-yellow-300 to-green-300';
    return 'from-green-400 to-teal-400';
  };

  const getRiskBg = (nivel: string) => {
    if (nivel.includes('Crítico')) return 'bg-red-50 border-red-200';
    if (nivel.includes('Alerta')) return 'bg-orange-50 border-orange-200';
    if (nivel.includes('Prevención')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className={`rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 ${getRiskBg(student.nivel_riesgo)}`}>
      <div className={`bg-gradient-to-r ${getRiskColor(student.nivel_riesgo)} text-white rounded-full px-4 py-1 inline-block mb-4 text-xs font-bold uppercase`}>
        {student.nivel_riesgo}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">{student.nombre_estudiante}</h3>
          <p className="text-sm font-medium text-gray-500 bg-white/50 inline-block px-2 py-1 rounded-md">
            {student.programa}
          </p>
        </div>
        <div className="text-2xl">🎓</div>
      </div>

      <div className="space-y-4 border-t border-black/5 pt-4">
        <MetricBar label="Promedio Final" value={student.promedio_final} max={100} color="blue" />
        <MetricBar label="Asistencia" value={student.porcentaje_asistencia} max={100} color="green" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Materias Reprobadas</span>
          <span className="font-bold text-red-600">{student.materias_reprobadas}</span>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = (value / max) * 100;
  const colorClass = color === 'blue' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={`font-bold text-${color}-600 text-lg`}>{value}</span>
      </div>
      <div className="bg-white/50 h-2 rounded-full overflow-hidden">
        <div className={`${colorClass} h-full rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-red-200">
      <div className="text-4xl mb-4">🤷‍♂️</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron estudiantes</h3>
      <p className="text-gray-500">
        Intenta con otro nombre o{' '}
        <Link href="/reports/students" className="text-red-500 font-bold underline">
          limpia el filtro
        </Link>
        .
      </p>
    </div>
  );
}

function Pagination({ query, currentPage, pagination }: any) {
  return (
    <div className="flex justify-center items-center gap-6 bg-white/80 p-4 rounded-2xl backdrop-blur shadow-sm max-w-md mx-auto">
      {currentPage > 1 ? (
        <Link
          href={`/reports/students?q=${query}&page=${currentPage - 1}`}
          className="bg-white px-5 py-2 rounded-xl shadow border border-gray-200 text-red-600 font-bold hover:bg-red-50"
        >
          ← Anterior
        </Link>
      ) : (
        <button disabled className="px-5 py-2 text-gray-300 font-bold cursor-not-allowed">
          ← Anterior
        </button>
      )}

      <span className="text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-lg">
        Página <span className="text-red-600 font-bold">{pagination.page}</span> de {pagination.totalPages}
      </span>

      {currentPage < pagination.totalPages ? (
        <Link
          href={`/reports/students?q=${query}&page=${currentPage + 1}`}
          className="bg-white px-5 py-2 rounded-xl shadow border border-gray-200 text-red-600 font-bold hover:bg-red-50"
        >
          Siguiente →
        </Link>
      ) : (
        <button disabled className="px-5 py-2 text-gray-300 font-bold cursor-not-allowed">
          Siguiente →
        </button>
      )}
    </div>
  );
}