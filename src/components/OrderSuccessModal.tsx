'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Store,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Order } from '@/types';
import { STORE_CONFIG } from '@/data/mockData';
import { formatPrice } from '@/lib/storage';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  const [copiedCode, setCopiedCode] = React.useState(false);

  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#14b8a6', '#f59e0b', '#ffffff'],
        });
      } catch (e) {
        // Safe fallback if confetti canvas fails
      }
    }
  }, [order]);

  if (!order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const item = order.items[0];
  const colorName = item.color === 'negro' ? 'Negro Obsidiana' : 'Gris Melange';

  // Build formatted WhatsApp message
  const whatsappText = `¡Hola San Ibike! 🚴‍♂️ Acabo de realizar la reserva de mi remera oficial en la web.

📌 *Código de Reserva:* ${order.orderCode}
👤 *Nombre:* ${order.customerName}
📱 *WhatsApp:* ${order.customerPhone}
👕 *Prenda:* ${item.quantity}x Remera Oficial San Ibike
🎨 *Color:* ${colorName}
📏 *Talle:* ${item.size}
💳 *Método de Pago:* ${order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria'}
💰 *Seña Pagada:* ${formatPrice(order.depositAmount)}
💵 *Saldo a Pagar al Retirar:* ${formatPrice(order.remainingAmount)}
📍 *Entrega:* ${order.deliveryMethod === 'pickup' ? 'Retiro en Local San Ibike' : 'Envío a coordinar'}

¡Quedo a la espera de la confirmación! Gracias.`;

  const whatsappUrl = `https://wa.me/${STORE_CONFIG.phoneWhatsApp.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg my-8 bg-[#11141a] border border-emerald-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="text-center relative">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ¡Reserva Confirmada con Éxito!
          </span>

          <h3 className="text-2xl font-black text-white mt-3">
            ¡Gracias, {order.customerName.split(' ')[0]}!
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            Tu lugar en la tanda de preventa oficial ya está registrado.
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
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
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

        {/* Order Details Breakdown */}
        <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Prenda:</span>
            <span className="font-semibold text-white">
              {item.quantity}x Remera Oficial San Ibike
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Color y Talle:</span>
            <span className="font-semibold text-white">
              {colorName} &bull; Talle <span className="text-emerald-400">{item.size}</span>
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Seña (50%):</span>
            <span className="font-bold text-emerald-400">
              {formatPrice(order.depositAmount)}
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
            <span>Enviar Reserva por WhatsApp a San Ibike</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}
