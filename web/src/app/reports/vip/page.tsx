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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition font-medium bg-white/50 px-4 py-2 rounded-lg border border-transparent hover:border-purple-200 hover:shadow-sm"
          >
            <span className="mr-2 text-xl">←</span> Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8 bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-purple-100">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">💎 Clientes VIP</h1>
          <p className="text-gray-600">Segmentación y análisis de mejores clientes por valor</p>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
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
    if (segmento === 'VIP Platino') return 'from-slate-300 to-gray-400';
    if (segmento === 'VIP Oro') return 'from-yellow-400 to-amber-500';
    if (segmento === 'VIP Plata') return 'from-gray-300 to-slate-400';
    return 'from-blue-400 to-cyan-400';
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg border-2 border-purple-200 transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Ranking y nombre */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-4xl">{getMedalEmoji(customer.ranking_por_gasto)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-bold text-purple-600">#{customer.ranking_por_gasto}</span>
              <h3 className="text-xl font-bold text-gray-800 truncate">{customer.nombre}</h3>
            </div>
            <p className="text-sm text-gray-600 truncate">{customer.email}</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="flex gap-3 flex-wrap">
          <MetricBox label="Total Gastado" value={`$${customer.total_gastado.toLocaleString()}`} color="green" />
          <MetricBox label="LTV Anual" value={`$${customer.ltv_proyectado_anual.toFixed(0)}`} color="blue" />
          <MetricBox label="Ticket Prom" value={`$${customer.ticket_promedio}`} color="purple" />
          <MetricBox label="Órdenes" value={customer.ordenes_completadas} color="orange" />
        </div>

        {/* Segmento */}
        <div className={`bg-gradient-to-r ${getSegmentColor(customer.segmento_cliente)} text-white rounded-full px-4 py-2`}>
          <p className="text-sm font-semibold">{customer.segmento_cliente}</p>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Frecuencia/mes</p>
          <p className="font-bold text-gray-800">{customer.frecuencia_mensual}</p>
        </div>
        <div>
          <p className="text-gray-600">Días como cliente</p>
          <p className="font-bold text-gray-800">{customer.dias_como_cliente}</p>
        </div>
        <div>
          <p className="text-gray-600">Última compra</p>
          <p className="font-bold text-gray-800">{new Date(customer.ultima_compra).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Decil de gasto</p>
          <p className="font-bold text-purple-600">Top {customer.decil_gasto}0%</p>
        </div>
      </div>
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
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-2xl px-4 py-3 text-center min-w-[100px]`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}

function KPICard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
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

function getSegmentIcon(segmento: string): string {
  if (segmento === 'VIP Platino') return '💎';
  if (segmento === 'VIP Oro') return '🥇';
  if (segmento === 'VIP Plata') return '🥈';
  return '👤';
}