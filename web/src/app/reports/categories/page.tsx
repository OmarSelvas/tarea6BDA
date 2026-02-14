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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-black text-gray-900 mb-2">📊 Ventas por Categoría</h1>
          <p className="text-gray-700 font-semibold">Análisis de rendimiento comercial por categoría de producto</p>
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
    if (clasificacion === 'Top Seller') return 'bg-green-600';
    if (clasificacion === 'Alto Volumen') return 'bg-blue-600';
    if (clasificacion === 'Medio') return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow border border-gray-200">
      <div
        className={`${getClassificationColor(category.clasificacion_ventas)} text-white rounded px-3 py-1 inline-block mb-4 text-xs font-black uppercase`}
      >
        {category.clasificacion_ventas}
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-2">{category.categoria}</h3>
      <p className="text-sm text-gray-600 font-semibold mb-4">{category.descripcion_categoria}</p>

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
      <span className="text-sm text-gray-700 font-bold">{label}</span>
      <span className={`font-black ${highlight ? 'text-green-700 text-lg' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

function BackButton() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center text-gray-700 hover:text-blue-700 transition font-bold bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow"
      >
        <span className="mr-2 text-xl">←</span> Volver al Dashboard
      </Link>
    </div>
  );
}

function KPICard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} text-white rounded-lg p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <div className="text-right">
          <p className="text-3xl font-black">{value}</p>
          <p className="text-sm font-bold">{label}</p>
        </div>
      </div>
    </div>
  );
}