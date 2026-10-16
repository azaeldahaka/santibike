'use client';

import React from 'react';
import { ProductColor, ProductSize } from '@/types';
import { STORE_CONFIG } from '@/data/mockData';
import { formatPrice } from '@/lib/storage';
import { ArrowRight } from 'lucide-react';

interface MobileStickyBarProps {
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
  onOpenCheckout: () => void;
  currentPrice?: number;
}

export function MobileStickyBar({
  selectedColor,
  selectedSize,
  quantity,
  onOpenCheckout,
  currentPrice,
}: MobileStickyBarProps) {
  const unitPrice = currentPrice || STORE_CONFIG.basePrice;
  const unitDeposit = (unitPrice * STORE_CONFIG.depositPercentage) / 100;
  const totalDeposit = unitDeposit * quantity;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090a0d]/95 backdrop-blur-lg border-t border-white/[0.08] p-3 px-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          Seña hoy ({selectedSize} &bull; {selectedColor === 'negro' ? 'Negro' : 'Gris'}):
        </p>
        <p className="text-lg font-black text-emerald-400 leading-none mt-0.5">
          {formatPrice(totalDeposit)}
        </p>
        <p className="text-[9px] text-slate-500">Saldo restante al retirar</p>
      </div>

      <button
        onClick={onOpenCheckout}
        className="py-3 px-5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
      >
        <span>Reservar</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
