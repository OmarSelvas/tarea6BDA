import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface InventoryData {
  success: boolean;
  data: Array<{
    producto_id: number;
    codigo: string;
    nombre: string;
    categoria: string;
    precio: number;
    stock_actual: number;
    unidades_vendidas_30dias: number;
    ordenes_30dias: number;
    velocidad_venta_diaria: number;
    dias_inventario_restante: number;
    estado_stock: string;
    punto_reorden_sugerido: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getInventoryStatus(query: string, page: number): Promise<InventoryData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/inventory?q=${query}&page=${page}&limit=12`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function InventoryStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const currentPage = Number(params.page) || 1;
  const { data, pagination } = await getInventoryStatus(query, currentPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-green-700 transition font-bold bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-green-500 hover:shadow"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">📦 Estado de Inventario</h1>
            <p className="text-gray-700 font-semibold">Monitoreo de stock y alertas de reorden automáticas</p>
          </div>

          <form className="w-full md:w-auto flex gap-2">
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar producto o categoría..."
              className="px-5 py-3 rounded-l-lg border-2 border-gray-300 focus:border-green-500 outline-none w-full md:w-80 font-bold"
            />
            {query && (
              <Link
                href="/reports/inventory"
                className="bg-gray-200 border-2 border-gray-300 text-gray-700 px-3 flex items-center hover:bg-gray-300 transition font-black"
              >
                ✕
              </Link>
            )}
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-r-lg font-black hover:bg-green-700 transition"
            >
              🔍 Buscar
            </button>
          </form>
        </div>

        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {data.map((item) => (
                <InventoryCard key={item.producto_id} item={item} />
              ))}
            </div>

            <Pagination query={query} currentPage={currentPage} pagination={pagination} />
          </>
        )}
      </div>
    </div>
  );
}

function InventoryCard({ item }: { item: any }) {
  const getStockColor = (estado: string) => {
    if (estado === 'Agotado') return 'bg-red-600';
    if (estado.includes('Crítico')) return 'bg-orange-600';
    if (estado.includes('Bajo')) return 'bg-yellow-600';
    if (estado === 'Normal') return 'bg-green-600';
    return 'bg-blue-600';
  };

  const getStockBg = (estado: string) => {
    if (estado === 'Agotado') return 'bg-red-50 border-red-400';
    if (estado.includes('Crítico')) return 'bg-orange-50 border-orange-400';
    if (estado.includes('Bajo')) return 'bg-yellow-50 border-yellow-400';
    if (estado === 'Normal') return 'bg-green-50 border-green-400';
    return 'bg-blue-50 border-blue-400';
  };

  return (
    <div className={`rounded-lg p-6 shadow hover:shadow-lg transition-shadow border-2 ${getStockBg(item.estado_stock)}`}>
      <div
        className={`${getStockColor(item.estado_stock)} text-white rounded px-3 py-1 inline-block mb-4 text-xs font-black uppercase`}
      >
        {item.estado_stock}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black text-gray-900 mb-1">{item.nombre}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-700 bg-white px-2 py-1 rounded border border-gray-300">{item.codigo}</span>
          <span className="text-sm text-gray-700 font-bold">{item.categoria}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700 font-bold">Stock Actual</span>
          <span className="text-3xl font-black text-gray-900">{item.stock_actual}</span>
        </div>
        <div className="bg-gray-300 h-2 rounded-full overflow-hidden">
          <div
            className="bg-green-600 h-full rounded-full transition-all"
            style={{
              width: `${Math.min((item.stock_actual / item.punto_reorden_sugerido) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-300 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-bold">Precio</span>
          <span className="font-black text-gray-900">${item.precio}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-bold">Vendidos (30d)</span>
          <span className="font-black text-blue-700">{item.unidades_vendidas_30dias}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-bold">Velocidad/día</span>
          <span className="font-black text-purple-700">{item.velocidad_venta_diaria}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-bold">Días restantes</span>
          <span className={`font-black ${item.dias_inventario_restante < 30 ? 'text-red-700' : 'text-green-700'}`}>
            {item.dias_inventario_restante === 9999 ? '∞' : item.dias_inventario_restante}
          </span>
        </div>
        <div className="pt-3 border-t border-gray-300">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-black">Punto de Reorden</span>
            <span className="font-black text-orange-700 text-lg">{item.punto_reorden_sugerido}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-4xl mb-4">✅</div>
      <h3 className="text-xl font-black text-gray-900 mb-2">¡Inventario en orden!</h3>
      <p className="text-gray-700 font-semibold">No hay productos que requieran reorden urgente.</p>
    </div>
  );
}

function Pagination({ query, currentPage, pagination }: any) {
  return (
    <div className="flex justify-center items-center gap-6 bg-white p-4 rounded-lg shadow border border-gray-200 max-w-md mx-auto">
      {currentPage > 1 ? (
        <Link
          href={`/reports/inventory?q=${query}&page=${currentPage - 1}`}
          className="bg-white px-5 py-2 rounded-lg shadow border-2 border-gray-300 text-green-700 font-black hover:bg-green-50"
        >
          ← Anterior
        </Link>
      ) : (
        <button disabled className="px-5 py-2 text-gray-400 font-black cursor-not-allowed">
          ← Anterior
        </button>
      )}

      <span className="text-gray-700 font-bold bg-gray-100 px-4 py-2 rounded-lg">
        Página <span className="text-green-700 font-black">{pagination.page}</span> de {pagination.totalPages}
      </span>

      {currentPage < pagination.totalPages ? (
        <Link
          href={`/reports/inventory?q=${query}&page=${currentPage + 1}`}
          className="bg-white px-5 py-2 rounded-lg shadow border-2 border-gray-300 text-green-700 font-black hover:bg-green-50"
        >
          Siguiente →
        </Link>
      ) : (
        <button disabled className="px-5 py-2 text-gray-400 font-black cursor-not-allowed">
          Siguiente →
        </button>
      )}
    </div>
  );
}