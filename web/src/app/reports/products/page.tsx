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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-amber-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-amber-200 hover:shadow-sm"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-amber-100">
          <h1 className="text-4xl font-bold text-amber-600 mb-2">🏆 Ranking de Productos</h1>
          <p className="text-gray-600">Top productos por ventas e ingresos organizados por categoría</p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📁 Por Categoría</h2>
          {Object.entries(byCategory).map(([categoria, products]) => (
            <div key={categoria}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
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
    if (clasificacion === 'Bestseller') return 'from-green-400 to-teal-400';
    if (clasificacion === 'Alto Rendimiento') return 'from-blue-400 to-cyan-400';
    if (clasificacion === 'Rendimiento Medio') return 'from-yellow-400 to-orange-400';
    if (clasificacion === 'Bajo Rendimiento') return 'from-orange-400 to-red-400';
    return 'from-gray-400 to-slate-400';
  };

  const rank = showGlobalRank ? product.ranking_global : product.ranking_categoria;
  const isTopThree = rank <= 3;
  const diff = Number(product.diferencia_vs_promedio);

  return (
    <div
      className={`bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg border-2 transition-all hover:scale-[1.02] ${
        isTopThree ? 'border-amber-300 bg-gradient-to-r from-yellow-50 to-amber-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-4xl">{getMedalEmoji(rank)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-bold text-amber-600">#{rank}</span>
              <h3 className="text-xl font-bold text-gray-800 truncate">{product.nombre}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.codigo}</span>
              <span className="text-sm text-gray-600">{product.categoria}</span>
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
          className={`bg-gradient-to-r ${getClassificationColor(product.clasificacion_producto)} text-white rounded-full px-4 py-2`}
        >
          <p className="text-sm font-semibold">{product.clasificacion_producto}</p>
        </div>
      </div>

      {diff !== 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Diferencia vs promedio de categoría:{' '}
            <span className={`font-bold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-2xl px-4 py-3 text-center min-w-[90px]`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}