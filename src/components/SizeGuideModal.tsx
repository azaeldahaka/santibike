'use client';

import React, { useEffect } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { SIZE_CHART } from '@/data/mockData';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#11141a] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Guía de Talles Oficial</h3>
              <p className="text-xs text-slate-400">Medidas en centímetros tomadas sobre prenda plana</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-400 font-semibold bg-white/[0.02]">
                <th className="py-3 px-4">Talle</th>
                <th className="py-3 px-4 text-center">Ancho (Axila a Axila)</th>
                <th className="py-3 px-4 text-center">Largo Total</th>
                <th className="py-3 px-4 text-right">Referencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {SIZE_CHART.map((item) => (
                <tr key={item.size} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4 font-black text-emerald-400 text-base">{item.size}</td>
                  <td className="py-3.5 px-4 text-center font-medium">{item.chestWidthCm} cm</td>
                  <td className="py-3.5 px-4 text-center font-medium">{item.lengthCm} cm</td>
                  <td className="py-3.5 px-4 text-right text-xs text-slate-400">{item.recommendedWeightKg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip Box */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1">¿Cómo medirte correctamente?</strong>
            Colocá una remera que te quede cómoda sobre una superficie plana. Medí de costura a costura por debajo de las axilas para el ancho, y desde el punto más alto del hombro hasta el dobladillo inferior para el largo.
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Entendido, volver a elegir mi talle
          </button>
        </div>
      </div>
    </div>
  );
}
