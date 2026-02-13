import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { FilterPaginationSchema } from '@/lib/validations';
import type { ClienteRiesgo } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reports/customers?q=search&page=1&limit=10
 * Obtiene clientes en riesgo con búsqueda y paginación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validar parámetros con Zod
    const validation = FilterPaginationSchema.safeParse({
      q: searchParams.get('q') || '',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const { q, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    // Query con búsqueda parametrizada
    const searchCondition = q 
      ? 'AND (nombre ILIKE $1 OR email ILIKE $1)' 
      : '';
    
    const params = q ? [`%${q}%`, limit, offset] : [limit, offset];
    const paramIndex = q ? 2 : 1;

    const result = await query<ClienteRiesgo>(
      `SELECT * FROM v_clientes_riesgo 
       WHERE 1=1 ${searchCondition}
       ORDER BY nivel_riesgo, dias_sin_comprar DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    // Contar total para paginación
    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM v_clientes_riesgo 
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
    console.error('Error fetching at-risk customers:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de clientes' },
      { status: 500 }
    );
  }
}