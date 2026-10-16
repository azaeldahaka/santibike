'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Store,
  MapPin,
  Clock,
  Building2,
  ArrowRight,
  X,
} from 'lucide-react';
import { Order } from '@/types';
import { STORE_CONFIG } from '@/data/mockData';
import { formatPrice } from '@/lib/storage';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);

  useEffect(() => {
    if (!order) return;

    window.history.pushState({ modal: 'order-success' }, '', '#reserva-confirmada');

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSafeClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#14b8a6', '#f59e0b', '#ffffff'],
      });
    } catch (e) {
      // Safe fallback if confetti fails
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [order, onClose]);

  if (!order) return null;

  const handleSafeClose = () => {
    if (typeof window !== 'undefined' && window.location.hash === '#reserva-confirmada') {
      window.history.back();
    } else {
      onClose();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(STORE_CONFIG.bankInfo.alias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const item = order.items[0];
  const colorName = item.color === 'negro' ? 'Negro Obsidiana' : 'Gris Melange';

  // Build formatted WhatsApp message with receipt prompt
  const whatsappText = `¡Hola SantyBike! 🚴‍♂️ Acabo de realizar la reserva de mi remera oficial en la web.

📌 *Código de Reserva:* ${order.orderCode}
👤 *Nombre:* ${order.customerName}
📱 *WhatsApp:* ${order.customerPhone}
👕 *Prenda:* ${item.quantity}x Remera Oficial SantyBike
🎨 *Color:* ${colorName}
📏 *Talle:* ${item.size}
💳 *Pago:* Transferencia Bancaria (Naranja X)
💰 *Seña Pagada:* ${formatPrice(order.depositAmount)}
💵 *Saldo al Retirar:* ${formatPrice(order.remainingAmount)}
📍 *Entrega:* Retiro en Local SantyBike (B° Limache, Salta)
🧾 *Comprobante:* Te adjunto la captura de la transferencia a continuación.

¡Muchas gracias!`;

  const whatsappUrl = `https://wa.me/${STORE_CONFIG.phoneWhatsApp.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleSafeClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="min-h-full flex items-start sm:items-center justify-center py-6 sm:py-10">
        <div
          className="relative w-full max-w-lg mx-auto bg-[#11141a] border border-emerald-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/20 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleSafeClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ¡Reserva Registrada con Éxito!
            </span>

            <h3 className="text-2xl font-black text-white mt-3">
              ¡Gracias, {order.customerName.split(' ')[0]}!
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Tu prenda está pre-reservada en la tanda oficial de SantyBike.
            </p>

            {/* Reservation Code Pill */}
            <div className="mt-5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Código Único de Reserva:
                </span>
                <span className="font-mono text-xl font-black text-emerald-400">
                  {order.orderCode}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="py-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transfer Reminder Box */}
          <div className="mt-5 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>Datos para la Transferencia de la Seña:</span>
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {formatPrice(order.depositAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Billetera:</span>
              <span className="font-semibold text-white">{STORE_CONFIG.bankInfo.bank}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Alias:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-400">{STORE_CONFIG.bankInfo.alias}</span>
                <button
                  type="button"
                  onClick={handleCopyAlias}
                  className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 transition-colors cursor-pointer"
                  title="Copiar alias"
                >
                  {copiedAlias ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Titular:</span>
              <span className="font-medium text-slate-200">{STORE_CONFIG.bankInfo.holder}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>CUIL:</span>
              <span className="font-mono text-slate-200">{STORE_CONFIG.bankInfo.cuil}</span>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Prenda:</span>
              <span className="font-semibold text-white">
                {item.quantity}x Remera Oficial SantyBike
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Color y Talle:</span>
              <span className="font-semibold text-white">
                {colorName} &bull; Talle <span className="text-emerald-400">{item.size}</span>
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Saldo a abonar al retirar:</span>
              <span className="font-semibold text-white">
                {formatPrice(order.remainingAmount)}
              </span>
            </div>
          </div>

          {/* Store / Pickup info */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{STORE_CONFIG.storeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{STORE_CONFIG.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{STORE_CONFIG.hours}</span>
            </div>
            <div className="pt-1">
              <a
                href={STORE_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] underline underline-offset-2"
              >
                <span>Ver cómo llegar en Google Maps</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Action Button: Send via WhatsApp */}
          <div className="mt-6 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Enviar Comprobante y Reserva por WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleSafeClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
