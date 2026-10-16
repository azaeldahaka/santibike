import React from 'react';
import Link from 'next/link';
import { Bike, ShieldCheck, Heart, MapPin, Clock, Phone, RotateCcw } from 'lucide-react';
import { STORE_CONFIG } from '@/data/mockData';

interface FooterProps {
  onOpenPolicy?: () => void;
}

export function Footer({ onOpenPolicy }: FooterProps = {}) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080a] text-slate-400 text-xs py-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bike className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-white uppercase">
                SantyBike
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bicicletería, taller especializado y merchandising oficial de ciclismo urbano y montaña.
            </p>
          </div>

          {/* Col 2: Store Info */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">{STORE_CONFIG.storeName}</h4>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{STORE_CONFIG.address}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{STORE_CONFIG.hours}</span>
            </div>
            <div className="pt-1">
              <a
                href={STORE_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                <span>Abrir en Google Maps</span>
                <span className="text-[10px]">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Col 3: Contact & Social */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Contacto Directo</h4>
            <a
              href={`https://wa.me/${STORE_CONFIG.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                '¡Hola SantyBike! Tengo una consulta sobre la preventa de remeras oficiales.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{STORE_CONFIG.phoneWhatsAppDisplay}</span>
            </a>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Atención personalizada y recepción de comprobantes de transferencia vía WhatsApp.
            </p>
          </div>

          {/* Col 4: Preorder rules */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Modelo de Preventa</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Al reservar con el 50% de seña asegurás tu prenda en la tanda de producción oficial sin riesgo de quedarte sin talle.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              {onOpenPolicy && (
                <button
                  type="button"
                  onClick={onOpenPolicy}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 text-left cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Política de Cancelaciones y Retiros (7 días)</span>
                </button>
              )}
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 underline underline-offset-2"
              >
                Acceso al Panel Administrativo
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>© 2026 SantyBike Bicycles. Todos los derechos reservados.</p>
            {onOpenPolicy && (
              <button
                type="button"
                onClick={onOpenPolicy}
                className="text-slate-400 hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Política de Cancelaciones
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desarrollado con dedicación para SantyBike</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
