import React from 'react';
import Link from 'next/link';
import { Bike, ShieldCheck, Heart, MapPin, Clock, Phone } from 'lucide-react';
import { STORE_CONFIG } from '@/data/mockData';

export function Footer() {
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
                San Ibike
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
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{STORE_CONFIG.phoneWhatsAppDisplay}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="w-4 h-4 text-pink-400 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>{STORE_CONFIG.instagram}</span>
            </div>
          </div>

          {/* Col 4: Preorder rules */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Modelo de Preventa</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Al reservar con el 50% de seña asegurás tu prenda en la tanda de producción oficial sin riesgo de quedarte sin talle.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                Acceso al Panel Administrativo
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 San Ibike Bicycles. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desarrollado con dedicación para San Ibike</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
