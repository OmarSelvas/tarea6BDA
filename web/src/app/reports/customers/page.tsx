import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CustomersData {
  success: boolean;
  data: Array<{
    usuario_id: number;
    nombre: string;
    email: string;
    total_ordenes: number;
    ordenes_canceladas: number;
    ordenes_completadas: number;
    total_gastado: number;
    dias_sin_comprar: number;
    tasa_cancelacion: number;
    nivel_riesgo: string;
    valor_potencial_perdido: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getAtRiskCustomers(query: string, page: number): Promise<CustomersData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/customers?q=${query}&page=${page}&limit=9`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function AtRiskCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const currentPage = Number(params.page) || 1;
  const { data, pagination } = await getAtRiskCustomers(query, currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-red-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-red-200 hover:shadow-sm"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-red-100">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">⚠️ Clientes en Riesgo de Abandono</h1>
            <p className="text-gray-600">Gestión proactiva de retención de clientes</p>
          </div>

          <form className="w-full md:w-auto flex gap-2">
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre o email..."
              className="px-5 py-3 rounded-l-xl border border-gray-300 focus:border-red-400 outline-none w-full md:w-80"
            />
            {query && (
              <Link
                href="/reports/customers"
                className="bg-gray-100 border border-gray-300 text-gray-500 px-3 flex items-center hover:bg-gray-200 transition"
              >
                ✕
              </Link>
            )}
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded-r-xl font-bold hover:bg-red-600 transition"
            >
              🔍 Buscar
            </button>
          </form>
        </div>

        {data.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {data.map((customer) => (
                <CustomerCard key={customer.usuario_id} customer={customer} />
              ))}
            </div>

            <Pagination query={query} currentPage={currentPage} pagination={pagination} />
          </>
        )}
      </div>
    </div>
  );
}

function CustomerCard({ customer }: { customer: any }) {
  const getRiskColor = (nivel: string) => {
    if (nivel === 'Riesgo Crítico') return 'from-red-500 to-pink-500';
    if (nivel === 'Riesgo Alto') return 'from-orange-500 to-red-400';
    if (nivel === 'Riesgo Moderado') return 'from-yellow-400 to-orange-400';
    return 'from-green-400 to-teal-400';
  };

  const getRiskBg = (nivel: string) => {
    if (nivel === 'Riesgo Crítico') return 'bg-red-50 border-red-300';
    if (nivel === 'Riesgo Alto') return 'bg-orange-50 border-orange-300';
    if (nivel === 'Riesgo Moderado') return 'bg-yellow-50 border-yellow-300';
    return 'bg-green-50 border-green-300';
  };

  return (
    <div className={`rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 ${getRiskBg(customer.nivel_riesgo)}`}>
      <div className={`bg-gradient-to-r ${getRiskColor(customer.nivel_riesgo)} text-white rounded-full px-4 py-1 inline-block mb-4 text-xs font-bold uppercase`}>
        {customer.nivel_riesgo}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{customer.nombre}</h3>
        <p className="text-sm text-gray-600">{customer.email}</p>
      </div>

      <div className="space-y-3 border-t border-black/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Gastado</span>
          <span className="font-bold text-green-600">${customer.total_gastado.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Días sin comprar</span>
          <span className="font-bold text-red-600">{customer.dias_sin_comprar}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Órdenes Canceladas</span>
          <span className="font-bold text-orange-600">{customer.ordenes_canceladas}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tasa Cancelación</span>
          <span className="font-bold text-purple-600">{customer.tasa_cancelacion}%</span>
        </div>
        <div className="pt-3 border-t border-black/10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Valor en Riesgo</span>
            <span className="font-bold text-red-600 text-lg">${customer.valor_potencial_perdido.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-red-200">
      <div className="text-4xl mb-4">🎉</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {query ? 'No se encontraron clientes' : '¡Excelente! No hay clientes en riesgo'}
      </h3>
      {query && (
        <p className="text-gray-500">
          Intenta con otro término o{' '}
          <Link href="/reports/customers" className="text-red-500 font-bold underline">
            limpia el filtro
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function Pagination({ query, currentPage, pagination }: any) {
  return (
    <div className="flex justify-center items-center gap-6 bg-white/80 p-4 rounded-2xl backdrop-blur shadow-sm max-w-md mx-auto">
      {currentPage > 1 ? (
        <Link
          href={`/reports/customers?q=${query}&page=${currentPage - 1}`}
          className="bg-white px-5 py-2 rounded-xl shadow border border-gray-200 text-red-600 font-bold hover:bg-red-50"
        >
          ← Anterior
        </Link>
      ) : (
        <button disabled className="px-5 py-2 text-gray-300 font-bold cursor-not-allowed">
          ← Anterior
        </button>
      )}

      <span className="text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-lg">
        Página <span className="text-red-600 font-bold">{pagination.page}</span> de {pagination.totalPages}
      </span>

      {currentPage < pagination.totalPages ? (
        <Link
          href={`/reports/customers?q=${query}&page=${currentPage + 1}`}
          className="bg-white px-5 py-2 rounded-xl shadow border border-gray-200 text-red-600 font-bold hover:bg-red-50"
        >
          Siguiente →
        </Link>
      ) : (
        <button disabled className="px-5 py-2 text-gray-300 font-bold cursor-not-allowed">
          Siguiente →
        </button>
      )}
    </div>
  );
}