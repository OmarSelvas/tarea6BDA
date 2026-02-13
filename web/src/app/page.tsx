import Link from "next/link";

export default function Home() {
  const cards = [
    { title: "Rendimiento Cursos", desc: "Análisis de reprobados y promedios", href: "/reports/performance", color: "bg-blue-500" },
    { title: "Estudiantes en Riesgo", desc: "Alertas académicas (Filtros + Paginación)", href: "/reports/students", color: "bg-red-500" },
    { title: "Ranking Mejores", desc: "Top estudiantes por carrera", href: "/reports/RankStudents", color: "bg-amber-500" },
    { title: "Asistencia", desc: "Porcentajes por alumno y materia", href: "/reports/attendance", color: "bg-green-500" },
    { title: "Resumen Grupos", desc: "Inscripciones activas por periodo", href: "/reports/groups", color: "bg-indigo-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">School Analytics 📊</h1>
      <p className="text-gray-600 mb-10">Sistema de Reportes Académicos Next.js + PostgreSQL</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
            <div className={`h-2 w-full ${c.color}`} />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{c.title}</h2>
              <p className="text-gray-500 mt-2 text-sm">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}