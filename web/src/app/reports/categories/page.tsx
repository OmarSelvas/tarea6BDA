import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CategoryData {
  success: boolean;
  data: Array<{
    categoria_id: number;
    categoria: string;
    descripcion_categoria: string | null;
    total_productos: number;
    ordenes_con_categoria: number;
    unidades_vendidas: number;
    total_vendido: number;
    precio_promedio: number;
    producto_mas_caro: number;
    producto_mas_barato: number;
    ticket_promedio: number;
    clasificacion_ventas: string;
  }>;
}

async function getCategorySales(): Promise<CategoryData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/categories`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function CategorySalesPage() {
  const { data } = await getCategorySales();

  const totalVentas = data.reduce((acc, c) => acc + c.total_vendido, 0);
  const totalUnidades = data.reduce((acc, c) => acc + c.unidades_vendidas, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="mb-8 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-blue-100">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">📊 Ventas por Categoría</h1>
          <p className="text-gray-600">Análisis de rendimiento comercial por categoría de producto</p>
        </div>

        {/* KPIs Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard label="Total Categorías" value={data.length} icon="📁" color="blue" />
          <KPICard label="Ventas Totales" value={`$${totalVentas.toLocaleString()}`} icon="💰" color="green" />
          <KPICard label="Unidades Vendidas" value={totalUnidades.toLocaleString()} icon="📦" color="purple" />
          <KPICard
            label="Ticket Promedio"
            value={`$${(totalVentas / data.reduce((acc, c) => acc + c.ordenes_con_categoria, 0)).toFixed(2)}`}
            icon="🎯"
            color="yellow"
          />
        </div>

        {/* Grid de categorías */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((category) => (
            <CategoryCard key={category.categoria_id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: any }) {
  const getClassificationColor = (clasificacion: string) => {
    if (clasificacion === 'Top Seller') return 'from-green-400 to-teal-400';
    if (clasificacion === 'Alto Volumen') return 'from-blue-400 to-cyan-400';
    if (clasificacion === 'Medio') return 'from-yellow-400 to-orange-400';
    return 'from-gray-400 to-slate-400';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-200">
      <div
        className={`bg-gradient-to-r ${getClassificationColor(category.clasificacion_ventas)} text-white rounded-full px-4 py-1 inline-block mb-4 text-xs font-bold uppercase`}
      >
        {category.clasificacion_ventas}
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.categoria}</h3>
      <p className="text-sm text-gray-500 mb-4">{category.descripcion_categoria}</p>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <MetricRow label="Total Vendido" value={`$${category.total_vendido.toLocaleString()}`} highlight />
        <MetricRow label="Unidades" value={category.unidades_vendidas.toLocaleString()} />
        <MetricRow label="Productos" value={category.total_productos} />
        <MetricRow label="Ticket Promedio" value={`$${category.ticket_promedio}`} />
        <MetricRow label="Precio Promedio" value={`$${category.precio_promedio}`} />
      </div>
    </div>
  );
}

function MetricRow({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`font-bold ${highlight ? 'text-green-600 text-lg' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}

function BackButton() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-blue-200 hover:shadow-sm"
      >
        <span className="mr-2 text-xl">←</span> Volver al Dashboard
      </Link>
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