import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { DesempenoProfesores } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await query<DesempenoProfesores>(
      'SELECT * FROM v_desempeno_profesores ORDER BY promedio_general DESC'
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching teacher performance:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener desempeño de profesores' },
      { status: 500 }
    );
  }
}