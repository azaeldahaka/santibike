'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Bike, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminPinLoginProps {
  onSuccess: () => void;
}

export function AdminPinLogin({ onSuccess }: AdminPinLoginProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin.trim()) {
      setError('Por favor ingresá tu PIN de acceso.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Also save in localStorage for instant client reload sync
        localStorage.setItem('santybike_admin_session', 'authenticated_santy_owner');
        onSuccess();
      } else {
        setError(data.message || 'PIN incorrecto. Verificá los números ingresados.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Reintentá en unos segundos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#11141a] border border-white/[0.08] rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Brand Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Área Restringida
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
            Panel de Administración
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
            Hola Santiago. Ingresá tu PIN de seguridad para gestionar las reservas, pedidos de taller y finanzas.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Código PIN de Administrador:
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoFocus
                  required
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-white placeholder-slate-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
                  title={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 text-center">
                PIN predeterminado: <span className="font-mono text-emerald-400 font-semibold">4720</span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Recordar sesión en este celular por 30 días</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verificando...</span>
              ) : (
                <>
                  <span>Desbloquear Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              &larr; Volver a la Tienda Oficial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
