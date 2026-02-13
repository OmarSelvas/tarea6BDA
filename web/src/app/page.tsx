import { query } from '@/lib/db';
import Link from 'next/link';

export default async function Home() {
  const { rows } = await query('SELECT * FROM v_groups_dashboard ORDER BY term DESC LIMIT 10');

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">🏛️ Dashboard Académico</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/reports/performance" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-600">📊 Rendimiento por Curso</h2>
          <p className="text-gray-600">Ver promedios y reprobados por materia.</p>
        </Link>
        <Link href="/reports/risk" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-red-600">⚠️ Alumnos en Riesgo</h2>
          <p className="text-gray-600">Listado de alumnos con bajo rendimiento.</p>
        </Link>
      </div>

      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Grupos Activos Recientes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Periodo</th>
                <th className="p-3 text-left">Curso</th>
                <th className="p-3 text-left">Inscritos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g: any) => (
                <tr key={g.group_id} className="border-b">
                  <td className="p-3">{g.term}</td>
                  <td className="p-3 font-medium">{g.code} - {g.course}</td>
                  <td className="p-3">{g.enrolled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}