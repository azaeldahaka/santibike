import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULT_PIN = '4720';

async function getValidPin(): Promise<string> {
  if (supabase) {
    try {
      const { data } = await supabase
        .from('store_settings')
        .select('admin_pin')
        .eq('id', 'default_settings')
        .single();
      if (data?.admin_pin) {
        return String(data.admin_pin).trim();
      }
    } catch (e) {
      // safe fallback
    }
  }
  return String(process.env.ADMIN_PIN || DEFAULT_PIN).trim();
}

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const serverPin = await getValidPin();

    if (!pin || String(pin).trim() !== serverPin) {
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

export async function PUT(request: NextRequest) {
  try {
    const { currentPin, newPin } = await request.json();
    const serverPin = await getValidPin();

    if (!currentPin || String(currentPin).trim() !== serverPin) {
      return NextResponse.json(
        { success: false, message: 'El PIN actual ingresado no es correcto.' },
        { status: 401 }
      );
    }

    if (!newPin || String(newPin).trim().length < 4) {
      return NextResponse.json(
        { success: false, message: 'El nuevo PIN debe tener al menos 4 dígitos.' },
        { status: 400 }
      );
    }

    if (supabase) {
      const { error } = await supabase
        .from('store_settings')
        .update({
          admin_pin: String(newPin).trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default_settings');

      if (error) {
        return NextResponse.json(
          { success: false, message: 'No se pudo guardar el nuevo PIN en la base de datos.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'PIN actualizado correctamente en la base de datos.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al cambiar el PIN.' },
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
