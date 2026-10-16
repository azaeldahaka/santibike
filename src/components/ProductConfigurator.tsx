'use client';

import { CampaignDates, ProductColor, ProductSize } from '@/types';
import { STORE_CONFIG } from '@/data/mockData';
import { formatPrice } from '@/lib/storage';
import {
  Ruler,
  ShieldCheck,
  Check,
  Layers,
  Sparkles,
  Award,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface ProductConfiguratorProps {
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
  selectedSize: ProductSize;
  onSelectSize: (size: ProductSize) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onOpenSizeGuide: () => void;
  onOpenCheckout: () => void;
  currentPrice?: number;
  campaignDates?: CampaignDates;
}

export function ProductConfigurator({
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
  quantity,
  onQuantityChange,
  onOpenSizeGuide,
  onOpenCheckout,
  currentPrice,
  campaignDates,
}: ProductConfiguratorProps) {
  const SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  const unitPrice = currentPrice || STORE_CONFIG.basePrice;
  const unitDeposit = (unitPrice * STORE_CONFIG.depositPercentage) / 100;
  const totalPrice = unitPrice * quantity;
  const totalDeposit = unitDeposit * quantity;
  const remainingTotal = totalPrice - totalDeposit;

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Brand Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Merchandising Oficial SantyBike
          </span>
          <span className="text-xs font-semibold text-slate-400">Edición Limitada 2026</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Remera Técnica / Urbana SantyBike
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Prenda técnica de corte regular con el logo frontal oficial y los sponsors del equipo en el dorso. Confeccionada con algodón peinado premium para rodar en bici o vestir con estilo urbano.
        </p>
      </div>

      {/* Color Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Color seleccionado:
          </label>
          <span className="text-xs font-semibold text-emerald-400">
            {selectedColor === 'negro' ? 'Negro Obsidiana' : 'Gris Melange'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelectColor('negro')}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              selectedColor === 'negro'
                ? 'bg-white/[0.08] border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#111111] border border-white/30 flex items-center justify-center shrink-0">
              {selectedColor === 'negro' && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white uppercase">Negro Obsidiana</p>
              <p className="text-[10px] text-slate-400">Estampas en contraste blanco</p>
            </div>
          </button>

          <button
            onClick={() => onSelectColor('gris')}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              selectedColor === 'gris'
                ? 'bg-white/[0.08] border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#64748b] border border-white/30 flex items-center justify-center shrink-0">
              {selectedColor === 'gris' && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white uppercase">Gris Melange</p>
              <p className="text-[10px] text-slate-400">Estampas contorneadas</p>
            </div>
          </button>
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Elegí tu Talle:
          </label>
          <button
            onClick={onOpenSizeGuide}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Ver Tabla de Talles (cm)</span>
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSelectSize(size)}
                className={`py-3.5 rounded-xl font-black text-sm tracking-wide border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.03]'
                    : 'bg-white/[0.03] text-slate-200 border-white/[0.08] hover:border-white/30 hover:bg-white/[0.06]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Cantidad:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-base flex items-center justify-center transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="text-base font-black text-white w-6 text-center tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
              className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-base flex items-center justify-center transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
        {quantity >= 10 && (
          <p className="text-[11px] text-emerald-400 pl-1">
            Máximo 10 prendas por reserva web. Para compras mayoristas de equipos o clubes, consultanos por WhatsApp.
          </p>
        )}
      </div>

      {/* Preorder Financial Breakdown Card (The 50% Deposit Model) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#11141a] to-[#11141a] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Esquema de Seña Previa
            </span>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            50% AHORA / 50% AL RETIRAR
          </span>
        </div>

        {/* Pricing numbers */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span>Precio Total de la prenda:</span>
            <span className="font-semibold text-slate-200 tabular-nums">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Seña a abonar hoy (50%):
              </p>
              <p className="text-[11px] text-slate-400">Asegura la confección de tu prenda</p>
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
              {formatPrice(totalDeposit)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-1">
            <span>Saldo restante a pagar al retirar:</span>
            <span className="font-semibold text-slate-300 tabular-nums">{formatPrice(remainingTotal)}</span>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-400 border-t border-white/[0.06]">
          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Preventa abierta hasta el <strong>{campaignDates?.preorderEndDateFormatted || STORE_CONFIG.preorderEndDateFormatted}</strong>. Retiro estimado en <strong>{campaignDates?.estimatedPickupDate || STORE_CONFIG.estimatedPickupDate}</strong> en Bicicletería SantyBike.
          </span>
        </div>
      </div>

      {/* Main CTA */}
      <button
        onClick={onOpenCheckout}
        className="w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <span className="[overflow-wrap:anywhere]">
          Reservar con Seña (<span className="tabular-nums">{formatPrice(totalDeposit)}</span>)
        </span>
        <ArrowRight className="w-5 h-5 shrink-0" />
      </button>

      {/* Quality specs and badges */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs text-slate-300">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02]">
          <Award className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Algodón Peinado 24/1 Premium</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02]">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Estampa DTF de Alta Definición</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02]">
          <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Sponsors: SRAM, SARS, AWA, WKNS</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Garantía Oficial Bicicletería</span>
        </div>
      </div>
    </div>
  );
}
