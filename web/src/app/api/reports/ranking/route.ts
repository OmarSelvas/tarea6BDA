import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { StudentRanking } from '@/types';
import { PaginationSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const validation = PaginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit') || 70,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const { page, limit } = validation.data;
    const offset = (page - 1) * limit;

    const data = await query<StudentRanking>(
      `SELECT * FROM v_ranking_estudiantes
       ORDER BY programa, posicion_programa
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const [{ count }] = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM v_ranking_estudiantes'
    );

    const total = parseInt(count, 10);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching student rankings:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener ranking de estudiantes' },
      { status: 500 }
    );
  }
}