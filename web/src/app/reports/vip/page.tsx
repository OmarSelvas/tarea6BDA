import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface VIPData {
  success: boolean;
  data: Array<{
    usuario_id: number;
    nombre: string;
    email: string;
    total_ordenes: number;
    ordenes_completadas: number;
    ordenes_canceladas: number;
    total_gastado: number;
    ticket_promedio: number;
    ultima_compra: string;
    dias_como_cliente: number;
    ranking_por_gasto: number;
    decil_gasto: number;
    frecuencia_mensual: number;
    segmento_cliente: string;
    ltv_proyectado_anual: number;
  }>;
}

async function getVIPCustomers(): Promise<VIPData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/vip`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Error al obtener datos');
  return res.json();
}

export default async function VIPCustomersPage() {
  const { data } = await getVIPCustomers();

  // Agrupar por segmento
  const bySegment = data.reduce((acc: Record<string, typeof data>, customer) => {
    if (!acc[customer.segmento_cliente]) acc[customer.segmento_cliente] = [];
    acc[customer.segmento_cliente].push(customer);
    return acc;
  }, {});

  const segmentOrder = ['VIP Platino', 'VIP Oro', 'VIP Plata', 'Cliente Regular'];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-purple-700 transition font-bold bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-purple-500 hover:shadow"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h1 className="text-3xl font-black text-gray-900 mb-2">💎 Clientes VIP</h1>
          <p className="text-gray-700 font-semibold">Segmentación y análisis de mejores clientes por valor</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard label="Total Clientes VIP" value={data.length} icon="👥" color="purple" />
          <KPICard
            label="Ventas Totales"
            value={`$${data.reduce((acc, c) => acc + c.total_gastado, 0).toLocaleString()}`}
            icon="💰"
            color="green"
          />
          <KPICard
            label="LTV Promedio"
            value={`$${(data.reduce((acc, c) => acc + c.ltv_proyectado_anual, 0) / data.length).toFixed(0)}`}
            icon="📈"
            color="blue"
          />
          <KPICard
            label="Ticket Promedio"
            value={`$${(data.reduce((acc, c) => acc + c.ticket_promedio, 0) / data.length).toFixed(2)}`}
            icon="🎯"
            color="yellow"
          />
        </div>

        {/* Por Segmento */}
        <div className="space-y-8">
          {segmentOrder.map((segmento) => {
            const customers = bySegment[segmento];
            if (!customers || customers.length === 0) return null;

            return (
              <div key={segmento}>
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  {getSegmentIcon(segmento)}
                  {segmento} ({customers.length})
                </h2>
                <div className="grid gap-4">
                  {customers.map((customer) => (
                    <VIPCard key={customer.usuario_id} customer={customer} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VIPCard({ customer }: { customer: any }) {
  const getSegmentColor = (segmento: string) => {
    if (segmento === 'VIP Platino') return 'bg-gray-600';
    if (segmento === 'VIP Oro') return 'bg-yellow-600';
    if (segmento === 'VIP Plata') return 'bg-gray-500';
    return 'bg-blue-600';
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow border-2 border-gray-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Ranking y nombre */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-4xl">{getMedalEmoji(customer.ranking_por_gasto)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-black text-purple-700">#{customer.ranking_por_gasto}</span>
              <h3 className="text-xl font-black text-gray-900 truncate">{customer.nombre}</h3>
            </div>
            <p className="text-sm text-gray-700 font-bold truncate">{customer.email}</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="flex gap-3 flex-wrap">
          <MetricBox label="Total Gastado" value={`$${Number(customer.total_gastado).toLocaleString()}`} color="green" />
          <MetricBox label="LTV Anual" value={`$${Number(customer.ltv_proyectado_anual).toFixed(0)}`} color="blue" />
          <MetricBox label="Ticket Prom" value={`$${Number(customer.ticket_promedio).toFixed(2)}`} color="purple" />
          <MetricBox label="Órdenes" value={customer.ordenes_completadas} color="orange" />
        </div>

        {/* Segmento */}
        <div className={`${getSegmentColor(customer.segmento_cliente)} text-white rounded px-4 py-2`}>
          <p className="text-sm font-black">{customer.segmento_cliente}</p>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-700 font-bold">Frecuencia/mes</p>
          <p className="font-black text-gray-900">{customer.frecuencia_mensual}</p>
        </div>
        <div>
          <p className="text-gray-700 font-bold">Días como cliente</p>
          <p className="font-black text-gray-900">{customer.dias_como_cliente}</p>
        </div>
        <div>
          <p className="text-gray-700 font-bold">Última compra</p>
          <p className="font-black text-gray-900">{new Date(customer.ultima_compra).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-700 font-bold">Decil de gasto</p>
          <p className="font-black text-purple-700">Top {customer.decil_gasto}0%</p>
        </div>
      </div>
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
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg px-4 py-3 text-center min-w-[100px] border-2`}>
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs font-bold">{label}</p>
    </div>
  );
}

function KPICard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
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

function getSegmentIcon(segmento: string): string {
  if (segmento === 'VIP Platino') return '💎';
  if (segmento === 'VIP Oro') return '🥇';
  if (segmento === 'VIP Plata') return '🥈';
  return '👤';
}