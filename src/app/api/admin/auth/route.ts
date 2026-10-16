import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PIN = '4720';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const serverPin = process.env.ADMIN_PIN || DEFAULT_PIN;

    if (!pin || String(pin).trim() !== String(serverPin).trim()) {
      return NextResponse.json(
        { success: false, message: 'PIN incorrecto. Verificá los números ingresados.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Acceso autorizado al panel de administración.',
    });

    // 30 days session cookie
    response.cookies.set({
      name: 'santybike_admin_session',
      value: 'authenticated_santy_owner',
      httpOnly: false, // Accessible to client check for state sync
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error en la verificación del PIN.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada.' });
  response.cookies.set({
    name: 'santybike_admin_session',
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
