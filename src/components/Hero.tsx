'use client';

import React from 'react';
import { Calendar, ShieldCheck, Sparkles, Truck, CheckCircle2 } from 'lucide-react';
import { STORE_CONFIG } from '@/data/mockData';

interface HeroProps {
  onScrollToProduct: () => void;
}

export function Hero({ onScrollToProduct }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-white/[0.06]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 animate-pulse-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Preventa Abierta &bull; Tanda Exclusiva Limitada</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]">
          Remera Oficial <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            San Ibike Bicycles
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Diseñada para rodar y vestir la pasión ciclista. Asegurá tu talle con el{' '}
          <span className="text-white font-bold underline decoration-emerald-500 underline-offset-4">
            50% de seña
          </span>{' '}
          y aboná el resto al momento de retirar en el local.
        </p>

        {/* Bullet Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Cierre: <strong>{STORE_CONFIG.preorderEndDateFormatted}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Entrega: <strong>{STORE_CONFIG.estimatedDeliveryDate}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Reserva segura garantizada</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={onScrollToProduct}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-base uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Reservar Mi Remera &bull; Seña 50%
          </button>
        </div>
      </div>
    </section>
  );
}
