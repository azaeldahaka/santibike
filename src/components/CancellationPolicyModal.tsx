'use client';

import React, { useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  RotateCcw,
  Clock,
  Store,
  AlertTriangle,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { STORE_CONFIG } from '@/data/mockData';
import { CampaignDates } from '@/types';

interface CancellationPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignDates?: CampaignDates;
}

export function CancellationPolicyModal({ isOpen, onClose, campaignDates }: CancellationPolicyModalProps) {
  const graceDays = campaignDates?.pickupGraceDays || STORE_CONFIG.pickupGraceDays || 7;
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleClose = () => {
    onClose();
    if (typeof window !== 'undefined' && window.history.state?.modal === 'cancellation-policy') {
      window.history.back();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modal: 'cancellation-policy' }, '');

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
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="min-h-full flex items-start sm:items-center justify-center py-6 sm:py-10">
        <div
          className="relative w-full max-w-2xl mx-auto bg-[#11141a] border border-white/[0.1] rounded-2xl shadow-2xl p-5 sm:p-8 overflow-hidden text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    Política de Cancelaciones y Retiros
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Términos transparentes del modelo de preventa oficial SantyBike
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center -mr-2 -mt-2 text-slate-400 hover:text-white active:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Intro Badge */}
          <div className="mt-5 p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-200 leading-relaxed">
              <strong>Compromiso SantyBike:</strong> Confeccionamos tandas exclusivas a pedido para garantizar calidad máxima y precio justo sin sobrecostos de stock ocioso.
            </p>
          </div>

          {/* Policy Clauses List */}
          <div className="mt-6 space-y-4 text-xs">
            {/* Clause 1: Plazo de pago de seña */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-300 font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Plazo de Seña (24 a 48 hs)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Al generar tu reserva en la web, el pedido queda guardado como <span className="text-amber-400 font-semibold">Pendiente de Seña</span>. Tenés un plazo de <strong>24 a 48 horas</strong> para transferir el 50% y enviar el comprobante por WhatsApp. Vencido ese plazo, la reserva se cancela de forma automática para liberar el cupo del talle.
                  </p>
                </div>
              </div>
            </div>

            {/* Clause 2: Cancelación con preventa abierta */}
            <div className="p-4 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/20 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-emerald-300 text-sm">Cancelación con Preventa Abierta</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Reintegro 100%
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Podés cancelar tu pedido en cualquier momento <strong>mientras la tanda de preventa continúe abierta</strong> (antes de que la lista se envíe a corte y confección en taller). Te reintegraremos el <strong>100% de la seña por transferencia bancaria</strong> a tu CBU/CVU en un plazo de 24 a 48 hs hábiles.
                  </p>
                </div>
              </div>
            </div>

            {/* Clause 3: Pedido en taller / producción */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Pedido en Producción (Taller Activo)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Una vez cerrada la tanda y enviado el pedido a confección y estampado a medida, <strong>la seña del 50% no es reembolsable</strong>, ya que cubre el costo de materia prima e insumos DTF comprometidos. Si no pudieras retirarla, podés <strong>transferir tu reserva a otra persona</strong> sin costo avisándonos por WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Clause 4: Retiro en 7 días */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-amber-500/30 bg-amber-500/[0.02] hover:border-amber-500/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">Plazo de Retiro en Local</h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {graceDays} Días Corridos
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Cuando tu prenda esté lista en nuestro local de Barrio Limache, te notificaremos por WhatsApp. A partir de esa fecha disponés de <strong>{graceDays} días corridos</strong> para retirar y abonar el saldo restante del 50%.
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                    ⚠️ Cumplidos los {graceDays} días y tras avisos de cortesía, si la prenda no es retirada ni saldada, <strong>la reserva caducará</strong> y la remera se pondrá a la venta al público general en el local, reteniéndose la seña en compensación de gastos operativos.
                  </p>
                </div>
              </div>
            </div>

            {/* Clause 5: Garantía por demoras y fallas */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0 mt-0.5">
                  5
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Garantía SantyBike y Fallas de Fábrica</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Si por causas de fuerza mayor la disponibilidad para el retiro en local sufriera una demora mayor a <strong>15 días hábiles</strong> sobre la fecha estimada, tenés derecho a solicitar la <strong>devolución total de tu seña por transferencia bancaria</strong>. Cualquier defecto o falla de confección cuenta con reposición inmediata sin cargo o reintegro del 100%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <a
              href={`https://wa.me/${STORE_CONFIG.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                '¡Hola SantyBike! Tengo una duda sobre la política de cancelaciones y preventa de la remera oficial.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consultar por WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
