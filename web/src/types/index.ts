export interface VentasPorCategoria {
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
  clasificacion_ventas: 'Top Seller' | 'Alto Volumen' | 'Medio' | 'Bajo Volumen';
}

export interface ClienteRiesgo {
  usuario_id: number;
  nombre: string;
  email: string;
  total_ordenes: number;
  ordenes_canceladas: number;
  ordenes_completadas: number;
  total_gastado: number;
  dias_sin_comprar: number;
  tasa_cancelacion: number;
  nivel_riesgo: 'Riesgo Crítico' | 'Riesgo Alto' | 'Riesgo Moderado' | 'Cliente Activo';
  valor_potencial_perdido: number;
}

export interface RankingProducto {
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
  clasificacion_producto: 'Bestseller' | 'Alto Rendimiento' | 'Rendimiento Medio' | 'Bajo Rendimiento' | 'Sin Ventas';
}

export interface EstadoInventario {
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
  estado_stock: 'Agotado' | 'Crítico - Reorden Urgente' | 'Bajo - Reorden Próximo' | 'Normal' | 'Sobrestock';
  punto_reorden_sugerido: number;
}

export interface UsuarioVIP {
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
  segmento_cliente: 'VIP Platino' | 'VIP Oro' | 'VIP Plata' | 'Cliente Regular';
  ltv_proyectado_anual: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  error?: string;
}