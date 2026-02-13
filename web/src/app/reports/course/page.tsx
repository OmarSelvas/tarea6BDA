import { getCoursePerformance } from '@/services/reportservice';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PerformancePage() {
  const { data } = await getCoursePerformance();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-600 mb-4 inline-block hover:underline">← Volver al Dashboard</Link>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rendimiento por Curso</h1>
        
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Materia</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Profesor</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Periodo</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Alumnos</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.course_name}</td>
                  <td className="px-6 py-4 text-gray-600">{row.teacher_name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{row.term}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{row.total_students}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{row.average_grade.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}