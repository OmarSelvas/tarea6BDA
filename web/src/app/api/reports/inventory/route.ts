import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { FilterPaginationSchema } from '@/lib/validations';
import type { EstadoInventario } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reports/inventory?q=search&page=1&limit=12
 * Obtiene estado de inventario con búsqueda y paginación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const validation = FilterPaginationSchema.safeParse({
      q: searchParams.get('q') || '',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const { q, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    const searchCondition = q 
      ? 'AND (nombre ILIKE $1 OR codigo ILIKE $1 OR categoria ILIKE $1)' 
      : '';
    
    const params = q ? [`%${q}%`, limit, offset] : [limit, offset];
    const paramIndex = q ? 2 : 1;

    const result = await query<EstadoInventario>(
      `SELECT * FROM v_estado_inventario 
       WHERE 1=1 ${searchCondition}
       ORDER BY estado_stock, stock_actual ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM v_estado_inventario 
       WHERE 1=1 ${searchCondition}`,
      q ? [`%${q}%`] : []
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory status:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de inventario' },
      { status: 500 }
    );
  }
}