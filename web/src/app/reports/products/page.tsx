import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ProductsData {
  success: boolean;
  data: Array<{
    producto_id: number;
    codigo: string;
    nombre: string;
    categoria: string;
    precio: number;
    stock: number;
    unidades_vendidas: number;
    ingresos_totales: number;
    ordenes_con_producto: number;
    ranking_global: number;
    ranking_categoria: number;
    promedio_categoria: number;
    diferencia_vs_promedio: number;
    clasificacion_producto: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getProductRankings(page: number = 1): Promise<ProductsData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/products?page=${page}&limit=100`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function ProductRankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { data } = await getProductRankings(currentPage);

  const byCategory = data.reduce((acc: Record<string, typeof data>, product) => {
    if (!acc[product.categoria]) acc[product.categoria] = [];
    acc[product.categoria].push(product);
    return acc;
  }, {});

  const getMedalEmoji = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-amber-700 transition font-bold bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-amber-500 hover:shadow"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h1 className="text-3xl font-black text-gray-900 mb-2">🏆 Ranking de Productos</h1>
          <p className="text-gray-700 font-semibold">Top productos por ventas e ingresos organizados por categoría</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-4xl">🌟</span>
            Top 10 Global
          </h2>
          <div className="grid gap-4">
            {data.slice(0, 10).map((product) => (
              <ProductCard key={product.producto_id} product={product} showGlobalRank />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">📁 Por Categoría</h2>
          {Object.entries(byCategory).map(([categoria, products]) => (
            <div key={categoria}>
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">📦</span>
                {categoria}
              </h3>
              <div className="grid gap-4">
                {products.slice(0, 5).map((product) => (
                  <ProductCard key={product.producto_id} product={product} showCategoryRank />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  showGlobalRank,
  showCategoryRank,
}: {
  product: any;
  showGlobalRank?: boolean;
  showCategoryRank?: boolean;
}) {
  const getMedalEmoji = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '🏅';
  };

  const getClassificationColor = (clasificacion: string) => {
    if (clasificacion === 'Bestseller') return 'bg-green-600';
    if (clasificacion === 'Alto Rendimiento') return 'bg-blue-600';
    if (clasificacion === 'Rendimiento Medio') return 'bg-yellow-600';
    if (clasificacion === 'Bajo Rendimiento') return 'bg-orange-600';
    return 'bg-gray-600';
  };

  const rank = showGlobalRank ? product.ranking_global : product.ranking_categoria;
  const isTopThree = rank <= 3;
  const diff = Number(product.diferencia_vs_promedio);

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow border-2 ${
        isTopThree ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-4xl">{getMedalEmoji(rank)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-black text-amber-700">#{rank}</span>
              <h3 className="text-xl font-black text-gray-900 truncate">{product.nombre}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-300">{product.codigo}</span>
              <span className="text-sm text-gray-700 font-bold">{product.categoria}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <MetricBox label="Ingresos" value={`$${product.ingresos_totales.toLocaleString()}`} color="green" />
          <MetricBox label="Unidades" value={product.unidades_vendidas.toLocaleString()} color="blue" />
          <MetricBox label="Precio" value={`$${product.precio}`} color="purple" />
          <MetricBox label="Stock" value={product.stock} color="orange" />
        </div>

        <div
          className={`${getClassificationColor(product.clasificacion_producto)} text-white rounded px-4 py-2`}
        >
          <p className="text-sm font-black">{product.clasificacion_producto}</p>
        </div>
      </div>

      {diff !== 0 && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-700 font-bold">
            Diferencia vs promedio de categoría:{' '}
            <span className={`font-black ${diff > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {diff > 0 ? '+' : ''}${diff.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg px-4 py-3 text-center min-w-[90px] border-2`}>
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs font-bold">{label}</p>
    </div>
  );
}