'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Building2,
  Copy,
  Check,
  Truck,
  Store,
  ArrowRight,
  Upload,
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
}

export function CheckoutModal({
  isOpen,
  onClose,
  selectedColor,
  selectedSize,
  quantity,
  onSuccess,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const [isCopiedAlias, setIsCopiedAlias] = useState(false);
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const unitPrice = STORE_CONFIG.basePrice;
  const unitDeposit = (unitPrice * STORE_CONFIG.depositPercentage) / 100;
  const totalPrice = unitPrice * quantity;
  const depositAmount = unitDeposit * quantity;
  const remainingAmount = totalPrice - depositAmount;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(STORE_CONFIG.bankInfo.alias);
    setIsCopiedAlias(true);
    setTimeout(() => setIsCopiedAlias(false), 2500);
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
        customerEmail: customerEmail.trim() || 'cliente@sanibike.com',
        customerCity: customerCity.trim() || undefined,
        deliveryMethod,
        paymentMethod,
        status: paymentMethod === 'mercadopago' ? 'deposit_paid' : 'pending_deposit',
        receiptNote: receiptFile ? 'Comprobante adjuntado por el cliente' : undefined,
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
      onSuccess(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl my-8 bg-[#11141a] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-xl font-extrabold text-white">Completar Reserva de Preventa</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Asegurás tu tanda abonando la seña del 50%
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
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
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Seña a abonar:</p>
            <p className="text-base font-black text-emerald-400">{formatPrice(depositAmount)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {errorMsg}
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Ciudad / Localidad (ej. San Isidro, CABA...)"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-emerald-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Forma de Entrega
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  deliveryMethod === 'pickup'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Retiro en Local</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">Gratis en SantyBike (Salta)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('shipping')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  deliveryMethod === 'shipping'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Envío a Coordinar</p>
                  <p className="text-[10px] text-slate-400">Por moto o correo</p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Método de Pago para la Seña
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('mercadopago')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  paymentMethod === 'mercadopago'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Mercado Pago</p>
                  <p className="text-[10px] text-slate-400">Tarjetas o saldo</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Transferencia</p>
                  <p className="text-[10px] text-slate-400">Alias / CBU directo</p>
                </div>
              </button>
            </div>

            {/* Bank Transfer Details Box */}
            {paymentMethod === 'transfer' && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-emerald-500/30 space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-slate-400">Banco / Entidad:</span>
                  <span className="font-semibold text-white">{STORE_CONFIG.bankInfo.bank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Alias CBU/CVU:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">
                      {STORE_CONFIG.bankInfo.alias}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAlias}
                      className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 transition-colors"
                      title="Copiar alias"
                    >
                      {isCopiedAlias ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Titular de cuenta:</span>
                  <span className="font-medium text-slate-200">{STORE_CONFIG.bankInfo.holder}</span>
                </div>

                <div className="pt-2 border-t border-white/[0.06]">
                  <label className="block text-[11px] text-slate-400 mb-1.5">
                    ¿Ya transferiste? Podés adjuntar o avisar el comprobante:
                  </label>
                  <button
                    type="button"
                    onClick={() => setReceiptFile('comprobante_transferencia.jpg')}
                    className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {receiptFile ? '✓ Comprobante listo para adjuntar' : 'Simular adjuntar comprobante'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Final Financial Breakdown */}
          <div className="pt-3 border-t border-white/[0.08] space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Total de la prenda:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-sm text-emerald-400">
              <span>Seña a pagar hoy (50%):</span>
              <span className="text-base font-black">{formatPrice(depositAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Saldo al retirar (50%):</span>
              <span>{formatPrice(remainingAmount)}</span>
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
  );
}
