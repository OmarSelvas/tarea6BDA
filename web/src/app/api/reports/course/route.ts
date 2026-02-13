import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RendimientoAcademico } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await query<RendimientoAcademico>(
      'SELECT * FROM v_rendimiento_academico ORDER BY tasa_aprobacion ASC, promedio_final DESC'
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching course performance:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de rendimiento académico' },
      { status: 500 }
    );
  }
}