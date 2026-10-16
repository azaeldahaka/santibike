'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  Store,
  ArrowRight,
  Upload,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { DeliveryMethod, Order, PaymentMethod, ProductColor, ProductSize } from '@/types';
import { STORE_CONFIG } from '@/data/mockData';
import { formatPrice } from '@/lib/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
  onSuccess: (order: Order) => void;
  currentPrice?: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  selectedColor,
  selectedSize,
  quantity,
  onSuccess,
  currentPrice,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [isCopiedAlias, setIsCopiedAlias] = useState(false);
  const [isCopiedCuil, setIsCopiedCuil] = useState(false);
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fixed business rules: Store pickup and Bank transfer only
  const deliveryMethod: DeliveryMethod = 'pickup';
  const paymentMethod: PaymentMethod = 'transfer';

  // Always keep latest onClose reference without causing useEffect to re-run
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Robust close handler: ALWAYS closes modal in React state immediately, then cleans history
  const handleClose = () => {
    onClose();
    if (typeof window !== 'undefined' && window.history.state?.modal === 'checkout') {
      window.history.back();
    }
  };

  // Back button (History API / popstate), Escape key, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Push state cleanly without changing pathname or hash so Next.js doesn't trigger route transitions
    window.history.pushState({ modal: 'checkout' }, '');

    const handlePopState = () => {
      // User tapped hardware back button or swipe gesture on phone
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

  const unitPrice = currentPrice || STORE_CONFIG.basePrice;
  const unitDeposit = (unitPrice * STORE_CONFIG.depositPercentage) / 100;
  const totalPrice = unitPrice * quantity;
  const depositAmount = unitDeposit * quantity;
  const remainingAmount = totalPrice - depositAmount;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(STORE_CONFIG.bankInfo.alias);
    setIsCopiedAlias(true);
    setTimeout(() => setIsCopiedAlias(false), 2500);
  };

  const handleCopyCuil = () => {
    navigator.clipboard.writeText(STORE_CONFIG.bankInfo.cuil);
    setIsCopiedCuil(true);
    setTimeout(() => setIsCopiedCuil(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Por favor ingresá tu nombre y apellido.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMsg('Por favor ingresá un número de WhatsApp válido.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate clean unique code
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const orderCode = `SAN-${randomId}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderCode,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'cliente@santibike.com',
        customerCity: customerCity.trim() || undefined,
        deliveryMethod,
        paymentMethod,
        status: 'pending_deposit',
        receiptNote: receiptFile ? 'Comprobante listo para enviar por WhatsApp' : undefined,
        items: [
          {
            color: selectedColor,
            size: selectedSize,
            quantity,
            unitPrice,
            unitDeposit,
          },
        ],
        totalAmount: totalPrice,
        depositAmount,
        remainingAmount,
      };

      setIsSubmitting(false);

      // Clean history state before showing success
      if (typeof window !== 'undefined' && window.history.state?.modal === 'checkout') {
        window.history.back();
      }

      onSuccess(newOrder);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Scroll container with items-start on mobile to prevent top cutoff in Firefox/Chrome */}
      <div className="min-h-full flex items-start sm:items-center justify-center py-6 sm:py-10">
        <div
          className="relative w-full max-w-xl mx-auto bg-[#11141a] border border-white/[0.1] rounded-2xl shadow-2xl p-5 sm:p-8 text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="pr-4">
              <h3 className="text-xl font-extrabold text-white">Completar Reserva de Preventa</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Asegurás tu tanda abonando la seña del 50%
              </p>
            </div>
            {/* Generous touch target for close button (min 44x44px for mobile) */}
            <button
              type="button"
              onClick={handleClose}
              className="w-11 h-11 flex items-center justify-center -mr-2 -mt-2 text-slate-400 hover:text-white active:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] transition-colors cursor-pointer shrink-0"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Item Summary Pill */}
          <div className="mt-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white text-sm">
                {quantity}x Remera Técnica SantyBike
              </p>
              <p className="text-slate-400 mt-0.5">
                Color: <span className="text-slate-200 font-semibold">{selectedColor === 'negro' ? 'Negro Obsidiana' : 'Gris Melange'}</span> &bull; Talle: <span className="text-emerald-400 font-bold">{selectedSize}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                Seña 50%
              </span>
              <p className="font-mono font-bold text-white text-sm mt-1 tabular-nums">
                {formatPrice(depositAmount)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer info */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Tus Datos de Contacto
              </label>

              <div>
                <input
                  type="text"
                  placeholder="Nombre y Apellido *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="tel"
                    placeholder="WhatsApp con código de área *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    maxLength={25}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email (opcional)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Barrio / Localidad (ej. Limache, Salta Capital...)"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Delivery Notice: Pickup Only */}
            <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Store className="w-4 h-4 shrink-0" />
                <span>Forma de Entrega: Retiro en Local Oficial</span>
              </div>
              <p className="text-xs text-white font-medium pl-6">
                Bicicletería SantyBike &bull; {STORE_CONFIG.address}
              </p>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                No realizamos envíos por el momento. Te avisaremos por WhatsApp apenas tu remera esté lista para retirar.
              </p>
            </div>

            {/* Payment Method: Bank Transfer Only */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Método de Pago: Transferencia Bancaria
                </label>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Sin comisión
                </span>
              </div>

              {/* Bank Transfer Details Box */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-emerald-500/30 space-y-3 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-slate-400">Entidad / Billetera:</span>
                  <span className="font-bold text-white text-sm">{STORE_CONFIG.bankInfo.bank}</span>
                </div>

                {/* Alias */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alias de transferencia:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {STORE_CONFIG.bankInfo.alias}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAlias}
                    className="py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copiar alias"
                  >
                    {isCopiedAlias ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Alias</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Titular */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                  <span className="text-slate-400">Titular de cuenta:</span>
                  <span className="font-medium text-slate-200">{STORE_CONFIG.bankInfo.holder}</span>
                </div>

                {/* CUIL */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                  <div>
                    <span className="text-slate-400 block text-[11px]">CUIL:</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {STORE_CONFIG.bankInfo.cuil}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCuil}
                    className="p-1.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors cursor-pointer"
                    title="Copiar CUIL"
                  >
                    {isCopiedCuil ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Mandatory WhatsApp receipt prompt */}
                <div className="pt-2.5 border-t border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 rounded-lg">
                  <p className="text-[11px] text-emerald-300 font-semibold leading-relaxed">
                    📌 <strong>Paso clave:</strong> Realizá la transferencia de la seña ({formatPrice(depositAmount)}) y al finalizar enviá el comprobante por WhatsApp para validar tu reserva en el taller.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Financial Breakdown */}
            <div className="pt-3 border-t border-white/[0.08] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Total de la prenda:</span>
                <span className="tabular-nums">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm text-emerald-400">
                <span>Seña a pagar hoy (50%):</span>
                <span className="text-base font-black tabular-nums">{formatPrice(depositAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Saldo a abonar al retirar (50%):</span>
                <span className="tabular-nums">{formatPrice(remainingAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generando reserva...</span>
              ) : (
                <>
                  <span>Confirmar Reserva de Preventa</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
