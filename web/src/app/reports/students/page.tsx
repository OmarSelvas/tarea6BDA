import { getStudentsAtRisk } from '@/services/reportservice';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StudentsAtRiskPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || '';
  const currentPage = Number(searchParams.page) || 1;
  const { data: reports, pagination } = await getStudentsAtRisk(query, currentPage);

  const getRiskColor = (nivel: string) => {
    if (nivel.includes('Alto')) return 'from-red-400 to-pink-400';
    if (nivel.includes('Medio')) return 'from-orange-400 to-yellow-400';
    if (nivel.includes('Bajo')) return 'from-yellow-300 to-green-300';
    return 'from-green-400 to-teal-400';
  };

  const getRiskBg = (nivel: string) => {
    if (nivel.includes('Alto')) return 'bg-red-50 border-red-200';
    if (nivel.includes('Medio')) return 'bg-orange-50 border-orange-200';
    if (nivel.includes('Bajo')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- BOTÓN DE REGRESAR --- */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-red-200 hover:shadow-sm"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        {/* --- HEADER Y BUSCADOR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-red-100">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              Estudiantes en Riesgo
            </h1>
            <p className="text-gray-600">
              Gestión y seguimiento de alumnos con alertas académicas
            </p>
          </div>

          {/* Formulario de Búsqueda (Funciona vía URL) */}
          <form className="w-full md:w-auto flex gap-2 shadow-sm rounded-xl">
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre..."
              className="px-5 py-3 rounded-l-xl border-y border-l border-gray-200 focus:border-red-400 outline-none w-full md:w-80 text-gray-700 placeholder-gray-400"
            />
            {/* Si hay búsqueda, mostramos botón de limpiar */}
            {query && (
              <Link 
                href="/reports/students" 
                className="bg-gray-100 border-y border-gray-200 text-gray-500 px-3 flex items-center hover:bg-gray-200 transition"
                title="Limpiar búsqueda"
              >
                ✕
              </Link>
            )}
            <button 
              type="submit" 
              className="bg-red-500 text-white px-6 py-3 rounded-r-xl font-bold hover:bg-red-600 transition shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>🔍</span> Buscar
            </button>
          </form>
        </div>

        {/* --- ESTADO VACÍO (SIN RESULTADOS) --- */}
        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-red-200">
            <div className="text-4xl mb-4">🤷‍♂️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron estudiantes</h3>
            <p className="text-gray-500">
              Intenta con otro nombre o <Link href="/reports/students" className="text-red-500 font-bold underline">limpia el filtro</Link>.
            </p>
          </div>
        ) : (
          /* --- GRID DE RESULTADOS --- */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {reports.map((s, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 relative overflow-hidden group ${getRiskBg(s.nivel_riesgo)}`}
              >
                <div className={`bg-gradient-to-r ${getRiskColor(s.nivel_riesgo)} text-white rounded-full px-4 py-1 inline-block mb-4 text-xs font-bold uppercase tracking-wider shadow-sm`}>
                  {s.nivel_riesgo}
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-red-700 transition-colors">
                      {s.nombre_estudiante}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mb-4 bg-white/50 inline-block px-2 py-1 rounded-md">
                      {s.programa}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-full shadow-sm text-2xl">
                    🎓
                  </div>
                </div>

                <div className="space-y-4 border-t border-black/5 pt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Promedio Final</span>
                      <span className="font-bold text-blue-600 text-lg">{s.promedio_final}</span>
                    </div>
                    <div className="bg-white/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${Number(s.promedio_final)}%` }} // Asumiendo escala 0-100 para la barra
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Asistencia</span>
                      <span className="font-bold text-green-600 text-lg">{s.porcentaje_asistencia}%</span>
                    </div>
                    <div className="bg-white/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${s.porcentaje_asistencia}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PAGINACIÓN --- */}
        {reports.length > 0 && (
          <div className="flex justify-center items-center gap-6 bg-white/80 p-4 rounded-2xl backdrop-blur shadow-sm max-w-md mx-auto">
            {currentPage > 1 ? (
              <Link
                href={`/reports/students?q=${query}&page=${currentPage - 1}`}
                className="bg-white px-5 py-2 rounded-xl shadow border border-gray-200 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition"
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
                className="bg-white px-5 py-2 rounded-xl shadow border border-gray-200 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition"
              >
                Siguiente →
              </Link>
            ) : (
              <button disabled className="px-5 py-2 text-gray-300 font-bold cursor-not-allowed">
                Siguiente →
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}