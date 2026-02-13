import Link from 'next/link';

export default function Dashboard() {
  const reports = [
    {
      href: '/reports/course',
      title: 'Rendimiento Académico',
      desc: 'Análisis de desempeño por curso, profesor y período.',
      icon: '📊',
      color: 'blue',
    },
    {
      href: '/reports/students',
      title: 'Estudiantes en Riesgo',
      desc: 'Alerta temprana de reprobación por faltas o bajas notas.',
      icon: '⚠️',
      color: 'red',
      highlight: true,
    },
    {
      href: '/reports/ranking',
      title: 'Ranking Estudiantil',
      desc: 'Top estudiantes organizados por programa académico.',
      icon: '🏆',
      color: 'yellow',
    },
    {
      href: '/reports/attendance',
      title: 'Resumen de Asistencia',
      desc: 'Análisis de asistencia por estudiante y curso.',
      icon: '📅',
      color: 'green',
    },
    {
      href: '/reports/teachers',
      title: 'Desempeño de Profesores',
      desc: 'Evaluación de rendimiento docente según resultados.',
      icon: '👨‍🏫',
      color: 'purple',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 School Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de reportes académicos y seguimiento estudiantil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.href} {...report} />
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Desarrollado con Next.js 16 + PostgreSQL + Docker</p>
        </footer>
      </div>
    </main>
  );
}

interface ReportCardProps {
  title: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
  highlight?: boolean;
}

function ReportCard({ title, desc, href, icon, color, highlight }: ReportCardProps) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
    red: 'border-red-500 bg-red-50 hover:bg-red-100',
    yellow: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
    green: 'border-green-500 bg-green-50 hover:bg-green-100',
    purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
  };

  return (
    <Link
      href={href}
      className={`block p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
        highlight ? 'ring-4 ring-red-300 shadow-lg' : 'shadow-md'
      } ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </Link>
  );
}