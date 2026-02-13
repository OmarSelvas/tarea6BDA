import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { VentasPorCategoria } from '@/types';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const result = await query<VentasPorCategoria>(
      'SELECT * FROM v_ventas_por_categoria ORDER BY total_vendido DESC'
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching category sales:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de categorías' },
      { status: 500 }
    );
  }
}