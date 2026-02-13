import { getStudentRankings } from '@/services/reportservice';
import { StudentRanking } from '@/types';

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const { data: reports } = await getStudentRankings();
  const byProgram = reports.reduce((acc: Record<string, StudentRanking[]>, student) => {
    if (!acc[student.programa]) acc[student.programa] = [];
    acc[student.programa].push(student);
    return acc;
  }, {});

  const getMedalEmoji = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-600 mb-2">Ranking de Estudiantes</h1>
          <p className="text-gray-600">Clasificación por rendimiento académico</p>
        </div>

        <div className="space-y-8">
          {Object.entries(byProgram).map(([programa, students]) => (
            <div key={programa}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{programa}</h2>
              <div className="grid gap-4">
                {students.slice(0, 10).map((s, i) => (
                  <div key={i} className={`bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg border-2 ${s.posicion_programa <= 3 ? 'border-amber-300 bg-gradient-to-r from-yellow-50 to-amber-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{getMedalEmoji(s.posicion_programa)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-amber-600">#{s.posicion_programa}</span>
                            <h3 className="text-xl font-bold text-gray-800">{s.nombre_estudiante}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{s.email_estudiante}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="bg-blue-100 rounded-2xl px-6 py-3 text-center">
                          <p className="text-2xl font-bold text-blue-600">{s.promedio_periodo}</p>
                          <p className="text-xs text-gray-600">Promedio</p>
                        </div>
                        <div className="bg-purple-100 rounded-2xl px-6 py-3 text-center">
                          <p className="text-2xl font-bold text-purple-600">{s.materias_cursadas}</p>
                          <p className="text-xs text-gray-600">Materias</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-full px-4 py-2">
                        <p className="text-sm font-semibold text-green-700">{s.clasificacion_rendimiento}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}