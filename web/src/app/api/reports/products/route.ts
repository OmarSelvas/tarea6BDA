import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PaginationSchema } from '@/lib/validations';
import type { RankingProducto } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reports/products?page=1&limit=50
 * Obtiene ranking de productos con paginación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const validation = PaginationSchema.safeParse({
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 50,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const { page, limit } = validation.data;
    const offset = (page - 1) * limit;

    const result = await query<RankingProducto>(
      `SELECT * FROM v_ranking_productos 
       ORDER BY ranking_global 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM v_ranking_productos'
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
    console.error('Error fetching product rankings:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de productos' },
      { status: 500 }
    );
  }
}