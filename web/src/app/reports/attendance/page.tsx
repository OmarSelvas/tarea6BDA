import { getAttendanceSummary } from '@/services/reportservice';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
  const { data } = await getAttendanceSummary();

  return (
    <div className="min-h-screen bg-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-emerald-700 mb-4 inline-block hover:underline">← Volver al Dashboard</Link>
        <h1 className="text-3xl font-bold text-emerald-900 mb-6">Reporte de Asistencia</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((row, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{row.student_name}</h3>
                  <p className="text-sm text-gray-500">{row.course_name}</p>
                </div>
                <div className={`text-xl font-bold ${row.attendance_pct < 75 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {row.attendance_pct.toFixed(1)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${row.attendance_pct < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${row.attendance_pct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}