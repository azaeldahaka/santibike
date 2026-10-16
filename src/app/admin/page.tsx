'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Order, OrderStatus, FinancialCosts, ProductColor, ProductSize } from '@/types';
import {
  getStoredOrders,
  saveStoredOrders,
  updateOrderStatus,
  getStoredCosts,
  saveStoredCosts,
  formatPrice,
} from '@/lib/storage';
import {
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  Truck,
  TrendingUp,
  Calculator,
  Search,
  Filter,
  Copy,
  Check,
  Download,
  Store,
  Phone,
  MessageCircle,
  Scissors,
  ArrowUpRight,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_ORDERS } from '@/data/mockData';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [costs, setCosts] = useState<FinancialCosts>(getStoredCosts());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedBatch, setCopiedBatch] = useState(false);

  useEffect(() => {
    setOrders(getStoredOrders());
    setCosts(getStoredCosts());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders([...updated]);
  };

  const handleResetData = () => {
    if (confirm('¿Restablecer las órdenes de demostración iniciales?')) {
      saveStoredOrders(INITIAL_ORDERS);
      setOrders([...INITIAL_ORDERS]);
    }
  };

  const handleCostChange = (field: keyof FinancialCosts, value: number) => {
    const updated = { ...costs, [field]: value };
    setCosts(updated);
    saveStoredCosts(updated);
  };

  // Unit Economics calculations
  const directCosts = costs.blankGarmentCost + costs.printingCost + costs.packagingCost;
  const gatewayFeeAmount = (costs.salePrice * costs.gatewayFeePercent) / 100;
  const totalUnitCost = directCosts + gatewayFeeAmount;
  const currentUnitProfit = costs.salePrice - totalUnitCost;
  const currentMarginPercent =
    costs.salePrice > 0 ? (currentUnitProfit / costs.salePrice) * 100 : 0;

  // Suggested price based on target margin formula: Suggested = DirectCost / (1 - (TargetMargin + Fee)/100)
  const combinedPercent = (costs.targetMarginPercent + costs.gatewayFeePercent) / 100;
  const suggestedPrice =
    combinedPercent < 1 ? directCosts / (1 - combinedPercent) : directCosts * 2;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level KPIs
  const totalUnits = orders.reduce((sum, ord) => {
    return sum + ord.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const totalDepositsCollected = orders
    .filter((ord) => ord.status !== 'cancelled' && ord.status !== 'pending_deposit')
    .reduce((sum, ord) => sum + ord.depositAmount, 0);

  const pendingCollection = orders
    .filter((ord) => ord.status !== 'cancelled' && ord.status !== 'completed')
    .reduce((sum, ord) => sum + ord.remainingAmount, 0);

  const projectedTotalProfit = currentUnitProfit * totalUnits;

  // Consolidated Production Matrix
  const SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const productionCount = {
    negro: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    gris: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  };

  orders
    .filter((ord) => ord.status !== 'cancelled')
    .forEach((ord) => {
      ord.items.forEach((item) => {
        if (productionCount[item.color] && productionCount[item.color][item.size] !== undefined) {
          productionCount[item.color][item.size] += item.quantity;
        }
      });
    });

  const totalNegro = Object.values(productionCount.negro).reduce((a, b) => a + b, 0);
  const totalGris = Object.values(productionCount.gris).reduce((a, b) => a + b, 0);
  const grandTotalProduction = totalNegro + totalGris;

  // Copy production batch summary to clipboard
  const handleCopyProduction = () => {
    const text = `📋 *PEDIDO DE PRODUCCIÓN - TANDA SANTYBIKE*
----------------------------------------
👕 *REMERAS NEGRAS (Total: ${totalNegro}):*
- S: ${productionCount.negro.S}
- M: ${productionCount.negro.M}
- L: ${productionCount.negro.L}
- XL: ${productionCount.negro.XL}
- XXL: ${productionCount.negro.XXL}

👕 *REMERAS GRISES (Total: ${totalGris}):*
- S: ${productionCount.gris.S}
- M: ${productionCount.gris.M}
- L: ${productionCount.gris.L}
- XL: ${productionCount.gris.XL}
- XXL: ${productionCount.gris.XXL}

🔥 *GRAN TOTAL A PRODUCIR: ${grandTotalProduction} prendas*`;

    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_deposit':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Pendiente Seña
          </span>
        );
      case 'deposit_paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Seña Pagada
          </span>
        );
      case 'in_production':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            En Producción
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Listo p/ Retirar
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            Entregado
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            Cancelado
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0d] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Panel de Control Financiero
              </span>
              <span className="text-xs text-slate-400">Tanda #1 Preventa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Dashboard de Producción & Ganancias
            </h1>
            <p className="text-xs text-slate-400">
              Control en tiempo real de señas cobradas, pedidos para taller y rentabilidad neta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/[0.08] flex items-center gap-1.5 transition-colors"
              title="Restablecer órdenes iniciales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Demo</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Store className="w-4 h-4" />
              <span>Ver Tienda en Vivo</span>
            </Link>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Prendas Reservadas</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{totalUnits} un.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {orders.length} pedidos registrados
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#11141a] border border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Señas Recaudadas</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatPrice(totalDepositsCollected)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Dinero en caja para pagar taller
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Saldo por Cobrar</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300">
              {formatPrice(pendingCollection)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Cobro restante contra entrega en local
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Ganancia Proyectada</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {formatPrice(projectedTotalProfit)}
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">
              Margen neto actual: {currentMarginPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Middle Section: Consolidated Production Matrix & Unit Economics Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Production Matrix for the Screen Printer (7 cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Consolidado para el Taller</h3>
                  <p className="text-xs text-slate-400">Talles exactos a estampar en la tanda</p>
                </div>
              </div>

              <button
                onClick={handleCopyProduction}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedBatch ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Lista</span>
                  </>
                )}
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider bg-white/[0.02]">
                    <th className="py-2.5 px-3">Color</th>
                    {SIZES.map((s) => (
                      <th key={s} className="py-2.5 px-3 text-center">{s}</th>
                    ))}
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-black border border-white/30" />
                      <span>Negro</span>
                    </td>
                    {SIZES.map((s) => (
                      <td key={s} className="py-3 px-3 text-center font-bold text-slate-200">
                        {productionCount.negro[s]}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-right font-black text-emerald-400">
                      {totalNegro} un.
                    </td>
                  </tr>

                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400 border border-white/30" />
                      <span>Gris</span>
                    </td>
                    {SIZES.map((s) => (
                      <td key={s} className="py-3 px-3 text-center font-bold text-slate-200">
                        {productionCount.gris[s]}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-right font-black text-emerald-400">
                      {totalGris} un.
                    </td>
                  </tr>

                  <tr className="bg-white/[0.04] font-black text-sm">
                    <td className="py-3 px-3 text-white">TOTAL TANDA</td>
                    {SIZES.map((s) => (
                      <td key={s} className="py-3 px-3 text-center text-emerald-400">
                        {productionCount.negro[s] + productionCount.gris[s]}
                      </td>
                    ))}
                    <td className="py-3 px-3 text-right text-emerald-300">
                      {grandTotalProduction} un.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400">
              💡 <strong>Tip para el taller:</strong> Podés hacer clic en &quot;Copiar Lista&quot; y pegarla directamente en WhatsApp para encargar la tela y el estampado al taller sin errores de conteo.
            </div>
          </div>

          {/* Unit Economics & Margin Calculator (5 cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Calculadora de Márgenes & Precios</h3>
                <p className="text-xs text-slate-400">Ajustá costos unitarios y observá el precio sugerido</p>
              </div>
            </div>

            {/* Cost inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Prenda base lisa ($):</label>
                <input
                  type="number"
                  value={costs.blankGarmentCost}
                  onChange={(e) => handleCostChange('blankGarmentCost', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estampado frente/dorso ($):</label>
                <input
                  type="number"
                  value={costs.printingCost}
                  onChange={(e) => handleCostChange('printingCost', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Packaging y etiquetas ($):</label>
                <input
                  type="number"
                  value={costs.packagingCost}
                  onChange={(e) => handleCostChange('packagingCost', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Comisión Mercado Pago (%):</label>
                <input
                  type="number"
                  step="0.5"
                  value={costs.gatewayFeePercent}
                  onChange={(e) => handleCostChange('gatewayFeePercent', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Margin Slider / Input */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Margen de Ganancia Deseado:</span>
                <span className="text-emerald-400 font-bold">{costs.targetMarginPercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={costs.targetMarginPercent}
                onChange={(e) => handleCostChange('targetMarginPercent', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Calculated Results Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-[#0e1117] border border-emerald-500/20 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Costo Total Unitario (con comisión):</span>
                <span className="font-bold text-white">{formatPrice(totalUnitCost)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Precio de Venta Sugerido:</span>
                <span className="font-black text-emerald-400 text-sm">{formatPrice(suggestedPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-white/[0.08] pt-2">
                <span>Ganancia Neta por Prenda:</span>
                <span className="font-bold text-emerald-300">{formatPrice(currentUnitProfit)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ganancia Proyectada ({totalUnits} prendas):</span>
                <span className="font-black text-white text-sm">{formatPrice(projectedTotalProfit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Management Table */}
        <div className="p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-lg font-bold text-white">Listado de Reservas y Clientes</h3>
              <p className="text-xs text-slate-400">
                Actualizá el estado de los pedidos y comunicate con los clientes
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none w-56"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="all" className="bg-[#11141a]">Todos los estados</option>
                <option value="pending_deposit" className="bg-[#11141a]">Pendiente de Seña</option>
                <option value="deposit_paid" className="bg-[#11141a]">Seña Pagada</option>
                <option value="in_production" className="bg-[#11141a]">En Producción</option>
                <option value="ready_for_pickup" className="bg-[#11141a]">Listo p/ Retirar</option>
                <option value="completed" className="bg-[#11141a]">Entregado</option>
                <option value="cancelled" className="bg-[#11141a]">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Detalle Prenda</th>
                  <th className="py-3 px-3">Seña / Saldo</th>
                  <th className="py-3 px-3">Pago</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      No se encontraron reservas con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const item = order.items[0];
                    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
                    const waNotifyText = `¡Hola ${order.customerName}! Te contactamos de SantyBike por tu reserva ${order.orderCode}. ¡Tu remera ya está lista para retirar en el local!`;

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Code */}
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                          {order.orderCode}
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white">{order.customerName}</p>
                          <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-200">
                            {item.quantity}x {item.color === 'negro' ? 'Negro' : 'Gris'}
                          </span>{' '}
                          &bull; Talle <span className="font-bold text-emerald-400">{item.size}</span>
                        </td>

                        {/* Financial */}
                        <td className="py-3.5 px-3">
                          <p className="text-emerald-400 font-bold">
                            Seña: {formatPrice(order.depositAmount)}
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            Resta: {formatPrice(order.remainingAmount)}
                          </p>
                        </td>

                        {/* Method */}
                        <td className="py-3.5 px-3 text-slate-300">
                          <span className="capitalize">
                            {order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia'}
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="text-[11px] font-bold rounded-lg px-2 py-1 bg-white/[0.06] border border-white/[0.1] text-white focus:outline-none cursor-pointer"
                          >
                            <option value="pending_deposit" className="bg-[#11141a]">
                              Pendiente Seña
                            </option>
                            <option value="deposit_paid" className="bg-[#11141a]">
                              Seña Pagada
                            </option>
                            <option value="in_production" className="bg-[#11141a]">
                              En Producción
                            </option>
                            <option value="ready_for_pickup" className="bg-[#11141a]">
                              Listo p/ Retirar
                            </option>
                            <option value="completed" className="bg-[#11141a]">
                              Entregado
                            </option>
                            <option value="cancelled" className="bg-[#11141a]">
                              Cancelado
                            </option>
                          </select>
                        </td>

                        {/* WhatsApp Action */}
                        <td className="py-3.5 px-3 text-right">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waNotifyText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-[11px] font-semibold transition-colors"
                            title="Avisar por WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
