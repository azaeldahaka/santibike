'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bike, ShieldCheck, LayoutDashboard, Store, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '@/data/mockData';

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0d]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white uppercase">
                SAN IBIKE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Bicycles & Merchandising</p>
          </div>
        </Link>

        {/* Center / Right Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={`https://wa.me/${STORE_CONFIG.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              '¡Hola San Ibike! Tengo una consulta sobre la preventa de remeras oficiales.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consultar por WhatsApp</span>
          </a>

          {/* Toggle between Store and Admin Dashboard */}
          {isAdmin ? (
            <Link
              href="/"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Store className="w-4 h-4" />
              <span>Ver Tienda</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.1] hover:border-emerald-500/40 transition-all hover:scale-[1.02]"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Panel Dueño</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                Admin
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
