import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ResumenAsistencia } from '@/types';
import { FilterPaginationSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const validation = FilterPaginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      q: searchParams.get('q'),
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    const { page, limit, q } = validation.data;
    const offset = (page - 1) * limit;
    const searchTerm = `%${q}%`;

    const data = await query<ResumenAsistencia>(
      `SELECT * FROM v_resumen_asistencia
       WHERE nombre_estudiante ILIKE $1 OR nombre_curso ILIKE $1
       ORDER BY porcentaje_asistencia ASC
       LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset]
    );

    const [{ count }] = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM v_resumen_asistencia
       WHERE nombre_estudiante ILIKE $1 OR nombre_curso ILIKE $1`,
      [searchTerm]
    );

    const total = parseInt(count, 10);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener resumen de asistencia' },
      { status: 500 }
    );
  }
}