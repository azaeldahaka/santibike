'use client';

import React, { useEffect, useRef } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { SIZE_CHART } from '@/data/mockData';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleClose = () => {
    onClose();
    if (typeof window !== 'undefined' && window.history.state?.modal === 'size-guide') {
      window.history.back();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modal: 'size-guide' }, '');

    const handlePopState = () => {
      onCloseRef.current();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="min-h-full flex items-start sm:items-center justify-center py-6 sm:py-10">
        <div
          className="relative w-full max-w-xl mx-auto bg-[#11141a] border border-white/[0.1] rounded-2xl shadow-2xl p-5 sm:p-8 overflow-hidden text-slate-100"
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
              type="button"
              onClick={handleClose}
              className="w-11 h-11 flex items-center justify-center -mr-2 -mt-2 text-slate-400 hover:text-white active:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-400 font-semibold bg-white/[0.02]">
                  <th className="py-3 px-4">Talle</th>
                  <th className="py-3 px-4">Ancho de Pecho</th>
                  <th className="py-3 px-4">Largo Total</th>
                  <th className="py-3 px-4">Peso Sugerido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {SIZE_CHART.map((item) => (
                  <tr key={item.size} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{item.size}</td>
                    <td className="py-3.5 px-4 text-slate-200">{item.chestWidthCm} cm</td>
                    <td className="py-3.5 px-4 text-slate-200">{item.lengthCm} cm</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{item.recommendedWeightKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">¿Cómo medirte correctamente?</p>
              <p>
                Colocá una remera que te quede cómoda sobre una superficie plana. Medí de axila a axila
                (ancho) y desde la parte más alta del hombro hasta el dobladillo inferior (largo).
              </p>
            </div>
          </div>

          {/* Footer action */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
