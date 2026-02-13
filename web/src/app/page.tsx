import Link from 'next/link';

export default function Dashboard() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">School Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          href="/reports/1" 
          title="Rendimiento de Cursos" 
          desc="Análisis de aprobación y calificaciones promedio por materia." 
        />
        <ReportCard 
          href="/reports/2" 
          title="Estudiantes en Riesgo" 
          desc="Alerta temprana de reprobación por faltas o bajas notas." 
          highlight 
        />
        <ReportCard 
          href="/reports/3" 
          title="Ranking por Programa" 
          desc="Top estudiantes organizados por carrera." 
        />
        {/* ... más tarjetas */}
      </div>
    </main>
  );
}

function ReportCard({ title, desc, href, highlight }: any) {
  return (
    <Link href={href} className={`block p-6 rounded-lg border hover:shadow-lg transition ${highlight ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{desc}</p>
    </Link>
  )
}