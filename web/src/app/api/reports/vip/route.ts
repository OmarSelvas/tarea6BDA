import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { UsuarioVIP } from '@/types';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const result = await query<UsuarioVIP>(
      'SELECT * FROM v_usuarios_vip ORDER BY ranking_por_gasto'
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching VIP users:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de usuarios VIP' },
      { status: 500 }
    );
  }
}