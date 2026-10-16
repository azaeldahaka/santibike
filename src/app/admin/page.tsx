'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { DevDataToggle } from '@/components/DevDataToggle';
import { Order, OrderStatus, FinancialCosts, ProductColor, ProductSize } from '@/types';
import {
  getStoredOrders,
  saveStoredOrders,
  updateOrderStatus,
  getStoredCosts,
  saveStoredCosts,
  updateStorePrice,
  formatPrice,
  fetchLiveOrders,
  fetchLiveCosts,
} from '@/lib/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AdminPinLogin } from '@/components/AdminPinLogin';
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
  ShieldCheck,
  RotateCcw,
  LogOut,
  Database,
  Key,
  Tag,
  Activity,
  Sparkles,
  Save,
  AlertCircle,
  Lightbulb,
  Settings,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_ORDERS } from '@/data/mockData';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [costs, setCosts] = useState<FinancialCosts>(getStoredCosts());
  const [simCosts, setSimCosts] = useState<FinancialCosts>(getStoredCosts());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;
  const [copiedBatch, setCopiedBatch] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Listen for dev fixture changes
  useEffect(() => {
    const handleFixtureChange = () => {
      setOrders(getStoredOrders());
      setCurrentPage(1);
    };
    window.addEventListener('santybike_fixture_change', handleFixtureChange);
    return () => {
      window.removeEventListener('santybike_fixture_change', handleFixtureChange);
    };
  }, []);

  // Reset page when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const [activeTab, setActiveTab] = useState<'orders' | 'calculator'>('orders');

  // Official Store Price state (independent from experimental calculator)
  const [officialPriceInput, setOfficialPriceInput] = useState<number>(costs.salePrice);
  const [isSavingOfficialPrice, setIsSavingOfficialPrice] = useState(false);
  const [officialPriceSaveMsg, setOfficialPriceSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Diagnostic modal state
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    ordersCount: number | null;
    cloudPrice: number | null;
    status: 'success' | 'error';
    errorMsg?: string;
  } | null>(null);

  // Change PIN modal state
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Settings dropdown state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Check existing session on load
  useEffect(() => {
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('santybike_admin_session=authenticated_santy_owner');
    const hasLocal = typeof window !== 'undefined' && localStorage.getItem('santybike_admin_session') === 'authenticated_santy_owner';
    setIsAuthenticated(hasCookie || hasLocal);
  }, []);

  // Fetch live orders and costs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const initialCosts = getStoredCosts();
      setOrders(getStoredOrders());
      setCosts(initialCosts);
      setSimCosts(initialCosts);
      setOfficialPriceInput(initialCosts.salePrice);

      if (isSupabaseConfigured) {
        setIsCloudSyncing(true);
        fetchLiveOrders().then((liveOrders) => {
          setOrders(liveOrders);
          setIsCloudSyncing(false);
        });
        fetchLiveCosts().then((liveCosts) => {
          setCosts(liveCosts);
          setSimCosts(liveCosts);
          setOfficialPriceInput(liveCosts.salePrice);
        });
      }
    }
  }, [isAuthenticated]);

  const handleSaveOfficialPrice = async (priceToSave?: number) => {
    const targetPrice = priceToSave !== undefined ? priceToSave : officialPriceInput;
    if (!targetPrice || targetPrice < 1000) {
      setOfficialPriceSaveMsg({ type: 'error', text: 'Por favor ingresá un precio válido mayor a $1.000.' });
      return;
    }
    setIsSavingOfficialPrice(true);
    setOfficialPriceSaveMsg(null);
    try {
      const ok = await updateStorePrice(targetPrice);
      if (ok) {
        setCosts((prev) => ({ ...prev, salePrice: targetPrice }));
        setSimCosts((prev) => ({ ...prev, salePrice: targetPrice }));
        setOfficialPriceInput(targetPrice);
        setOfficialPriceSaveMsg({
          type: 'success',
          text: `¡Precio oficial actualizado a ${formatPrice(targetPrice)}! Ya se ve reflejado en la tienda de los clientes.`,
        });
      } else {
        setOfficialPriceSaveMsg({
          type: 'error',
          text: 'Se guardó en este navegador, pero no se pudo sincronizar con Supabase.',
        });
      }
    } catch (e) {
      setOfficialPriceSaveMsg({ type: 'error', text: 'Error al actualizar el precio oficial.' });
    } finally {
      setIsSavingOfficialPrice(false);
      setTimeout(() => setOfficialPriceSaveMsg(null), 5000);
    }
  };

  const runDiagnostic = async () => {
    setIsDiagnosticOpen(true);
    setDiagnosticLoading(true);
    setDiagnosticResult(null);

    if (!supabase) {
      setDiagnosticLoading(false);
      setDiagnosticResult({
        ordersCount: null,
        cloudPrice: null,
        status: 'error',
        errorMsg: 'Supabase no está configurado en las variables de entorno de este navegador.',
      });
      return;
    }

    try {
      const [ordersRes, settingsRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('store_settings').select('*').eq('id', 'default_settings').single(),
      ]);

      if (ordersRes.error || settingsRes.error) {
        setDiagnosticResult({
          ordersCount: ordersRes.count || null,
          cloudPrice: settingsRes.data?.sale_price || null,
          status: 'error',
          errorMsg: ordersRes.error?.message || settingsRes.error?.message,
        });
      } else {
        setDiagnosticResult({
          ordersCount: ordersRes.count ?? (ordersRes.data ? ordersRes.data.length : 0),
          cloudPrice: Number(settingsRes.data.sale_price),
          status: 'success',
        });
      }
    } catch (err: any) {
      setDiagnosticResult({
        ordersCount: null,
        cloudPrice: null,
        status: 'error',
        errorMsg: err?.message || 'Error de conexión de red con Supabase.',
      });
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      // safe fallback
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('santybike_admin_session');
    }
    setIsAuthenticated(false);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);
    if (!currentPinInput.trim() || !newPinInput.trim()) {
      setPinChangeMsg({ type: 'error', text: 'Por favor completá ambos campos.' });
      return;
    }
    if (newPinInput.trim().length < 4) {
      setPinChangeMsg({ type: 'error', text: 'El nuevo PIN debe tener al menos 4 números.' });
      return;
    }
    setIsChangingPin(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPin: currentPinInput.trim(),
          newPin: newPinInput.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPinChangeMsg({ type: 'success', text: '¡PIN cambiado correctamente en la base de datos!' });
        setCurrentPinInput('');
        setNewPinInput('');
        setTimeout(() => {
          setIsChangePinOpen(false);
          setPinChangeMsg(null);
        }, 2200);
      } else {
        setPinChangeMsg({ type: 'error', text: data.message || 'Error al cambiar PIN.' });
      }
    } catch (err) {
      setPinChangeMsg({ type: 'error', text: 'Error de red o conexión.' });
    } finally {
      setIsChangingPin(false);
    }
  };

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

  const handleSimCostChange = (field: keyof FinancialCosts, value: number) => {
    setSimCosts((prev) => ({ ...prev, [field]: value }));
  };

  // Active orders (excluding cancelled) for realistic production & revenue KPIs
  const activeOrders = orders.filter((ord) => ord.status !== 'cancelled');

  // Official Unit Economics calculations (0% gateway fee for bank transfers)
  const directCosts = costs.blankGarmentCost + costs.printingCost + costs.packagingCost;
  const totalUnitCost = directCosts; // Sin comisión de pasarela
  const currentUnitProfit = costs.salePrice - totalUnitCost;
  const currentMarginPercent =
    costs.salePrice > 0 ? (currentUnitProfit / costs.salePrice) * 100 : 0;

  // Simulator Unit Economics calculations (Tab 2)
  const simDirectCosts = simCosts.blankGarmentCost + simCosts.printingCost + simCosts.packagingCost;
  const simTotalUnitCost = simDirectCosts;
  const simUnitProfit = simCosts.salePrice - simTotalUnitCost;
  const simMarginPercent =
    simCosts.salePrice > 0 ? (simUnitProfit / simCosts.salePrice) * 100 : 0;
  const simTargetMarginDecimal = (simCosts.targetMarginPercent || 50) / 100;
  const simSuggestedPrice =
    simTargetMarginDecimal < 1 ? simDirectCosts / (1 - simTargetMarginDecimal) : simDirectCosts * 2;

  // Suggested price based on target margin formula: Suggested = DirectCost / (1 - TargetMargin/100)
  const targetMarginDecimal = (costs.targetMarginPercent || 50) / 100;
  const suggestedPrice =
    targetMarginDecimal < 1 ? directCosts / (1 - targetMarginDecimal) : directCosts * 2;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.orderCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerPhone || '').includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Calculate high-level KPIs based on active orders
  const totalUnits = activeOrders.reduce((sum, ord) => {
    return sum + (ord.items || []).reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const totalDepositsCollected = activeOrders
    .filter((ord) => ord.status !== 'pending_deposit')
    .reduce((sum, ord) => sum + (ord.depositAmount || 0), 0);

  const pendingCollection = activeOrders
    .filter((ord) => ord.status !== 'completed')
    .reduce((sum, ord) => sum + (ord.remainingAmount || 0), 0);

  const projectedTotalProfit = currentUnitProfit * totalUnits;
  const simProjectedProfit = simUnitProfit * totalUnits;

  // Consolidated Production Matrix
  const SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const productionCount = {
    negro: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    gris: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  };

  orders
    .filter((ord) => ord.status !== 'cancelled')
    .forEach((ord) => {
      (ord.items || []).forEach((item) => {
        if (item && productionCount[item.color] && productionCount[item.color][item.size] !== undefined) {
          productionCount[item.color][item.size] += item.quantity;
        }
      });
    });

  const totalNegro = Object.values(productionCount.negro).reduce((a, b) => a + b, 0);
  const totalGris = Object.values(productionCount.gris).reduce((a, b) => a + b, 0);
  const grandTotalProduction = totalNegro + totalGris;

  // Copy production batch summary to clipboard
  const handleCopyProduction = () => {
    const prendasPlural = grandTotalProduction === 1 ? 'prenda' : 'prendas';
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

🔥 *GRAN TOTAL A PRODUCIR: ${grandTotalProduction} ${prendasPlural}*`;

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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a0d] text-slate-100">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Verificando acceso al panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#090a0d] text-slate-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <AdminPinLogin onSuccess={() => setIsAuthenticated(true)} />
        </main>
      </div>
    );
  }

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

          <div className="flex items-center gap-2.5">
            {/* Supabase Status Pill - Fixed Width & Zero Layout Shift */}
            <button
              onClick={runDiagnostic}
              className="h-9 px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none"
              title={
                isCloudSyncing
                  ? 'Sincronizando con Supabase...'
                  : isSupabaseConfigured
                  ? 'Base de datos Supabase conectada en vivo. Clic para diagnóstico.'
                  : 'Modo local activo (sin nube). Clic para diagnóstico.'
              }
            >
              <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                {isCloudSyncing ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </>
                ) : isSupabaseConfigured ? (
                  <span className="inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                ) : (
                  <span className="inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                )}
              </div>
              <Database className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-200 font-medium">Supabase</span>
              {isCloudSyncing && (
                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin shrink-0 ml-0.5" />
              )}
            </button>

            {/* Settings & Tools Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  isSettingsOpen
                    ? 'bg-white/[0.1] text-white border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08] hover:border-white/20'
                }`}
                title="Herramientas y configuración del taller"
              >
                <Settings className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span>Ajustes</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isSettingsOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#11141a]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Opciones del Taller
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsChangePinOpen(true);
                      setPinChangeMsg(null);
                      setCurrentPinInput('');
                      setNewPinInput('');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block">Cambiar PIN</span>
                      <span className="text-[10px] text-slate-400 block">Seguridad de acceso al panel</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      runDiagnostic();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block">Diagnóstico de Nube</span>
                      <span className="text-[10px] text-slate-400 block">Verificar tablas de Supabase</span>
                    </div>
                  </button>

                  <div className="my-1 border-t border-white/[0.06]" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      handleResetData();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold block">Restablecer Demo</span>
                      <span className="text-[10px] text-amber-400/70 block">Recargar órdenes iniciales</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="h-9 px-3 sm:px-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* View Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Pedidos & Producción Taller</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>2. Calculadora & Simulador</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-bold lowercase">
              lab
            </span>
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="space-y-8 animate-in fade-in">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Prendas Reservadas</span>
                  <Package className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">{totalUnits} un.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {orders.length} {orders.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#11141a] border border-emerald-500/30 shadow-lg">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Señas Recaudadas</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
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
                <p className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
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
                <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {formatPrice(projectedTotalProfit)}
                </p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  Margen neto actual: {currentMarginPercent.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Dedicated Official Store Price Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#11141a] via-[#11141a] to-emerald-950/20 border border-emerald-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Precio Oficial de la Remera en la Tienda</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                        Visible en Vivo
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Modificá el precio oficial que ven los clientes. Al guardarlo, impacta en Supabase y en la web al instante.
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-white/[0.02] sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/[0.06] sm:border-0">
                  <span className="text-xs text-slate-400 block">Precio actual activo:</span>
                  <p className="text-2xl font-black text-emerald-400 font-mono">
                    {formatPrice(costs.salePrice)}
                  </p>
                </div>
              </div>

              {officialPriceSaveMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                    officialPriceSaveMsg.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{officialPriceSaveMsg.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-1">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Modificar Precio de Venta al Público ($):
                  </label>
                  <input
                    type="number"
                    step="500"
                    placeholder="0"
                    value={officialPriceInput === 0 ? '' : officialPriceInput}
                    onChange={(e) =>
                      setOfficialPriceInput(e.target.value === '' ? 0 : Number(e.target.value))
                    }
                    className="w-full text-xl font-mono font-bold py-2.5 px-4 rounded-xl bg-white/[0.04] border border-emerald-500/40 text-emerald-300 focus:border-emerald-500 focus:outline-none placeholder-slate-600"
                  />
                </div>

                <div className="sm:col-span-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Seña previa (50%):</span>
                    <strong className="text-emerald-400 font-mono">
                      {formatPrice((officialPriceInput || 0) * 0.5)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Saldo a pagar al retirar (50%):</span>
                    <span className="font-mono">{formatPrice((officialPriceInput || 0) * 0.5)}</span>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <button
                    onClick={() => handleSaveOfficialPrice()}
                    disabled={isSavingOfficialPrice}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingOfficialPrice ? 'Guardando...' : 'Guardar en Tienda'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Consolidado para el Taller */}
            <div className="p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl space-y-5">
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
                  paginatedOrders.map((order) => {
                    const items = order.items && order.items.length > 0 ? order.items : [];
                    const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
                    const itemsSummary = items.length > 0
                      ? items.map((it) => `${it.quantity}x ${it.color === 'negro' ? 'Negro' : 'Gris'} (${it.size})`).join(', ')
                      : 'remera';
                    const waNotifyText = `¡Hola ${order.customerName?.trim() || 'cliente'}! Te contactamos de SantyBike por tu reserva ${order.orderCode} (${itemsSummary}). ¡Tu pedido ya está listo para retirar en el local!`;

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Code */}
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 text-xs whitespace-nowrap">
                          {order.orderCode}
                        </td>

                        {/* Customer - Wrap applied */}
                        <td className="py-3.5 px-3 min-w-[140px] max-w-[220px]">
                          <p className="font-bold text-white [overflow-wrap:anywhere] leading-snug">
                            {order.customerName || <span className="text-slate-500 italic">Sin nombre</span>}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {order.customerPhone || <span className="text-slate-600 italic">Sin teléfono</span>}
                          </p>
                          {order.customerEmail && (
                            <p className="text-[10px] text-slate-500 [overflow-wrap:anywhere] mt-0.5">
                              {order.customerEmail}
                            </p>
                          )}
                          {order.customerCity && (
                            <p className="text-[10px] text-slate-500 [overflow-wrap:anywhere] mt-0.5 italic">
                              {order.customerCity}
                            </p>
                          )}
                        </td>

                        {/* Items - Option A: Stacked list / sub-rows */}
                        <td className="py-3.5 px-3 min-w-[160px]">
                          {items.length === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              Sin prendas asignadas
                            </span>
                          ) : (
                            <div className="space-y-1.5">
                              {items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                                    style={{ backgroundColor: it.color === 'negro' ? '#111111' : '#64748b' }}
                                  />
                                  <span className="font-semibold text-slate-200">
                                    {it.quantity}x {it.color === 'negro' ? 'Negro' : 'Gris'}
                                  </span>
                                  <span className="text-slate-500">&bull;</span>
                                  <span className="font-bold text-emerald-400 font-mono">Talle {it.size}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Financial */}
                        <td className="py-3.5 px-3 tabular-nums whitespace-nowrap">
                          <p className="text-emerald-400 font-bold">
                            Seña: {formatPrice(order.depositAmount)}
                          </p>
                          <p className="text-slate-400 text-[10px]">
                            Resta: {formatPrice(order.remainingAmount)}
                          </p>
                        </td>

                        {/* Method */}
                        <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                          <span className="capitalize">
                            {order.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia'}
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
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
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {cleanPhone ? (
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
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-500 text-[11px] italic bg-white/[0.02]">
                              Sin teléfono
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredOrders.length > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs text-slate-400">
              <div>
                Mostrando <span className="font-semibold text-white tabular-nums">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                <span className="font-semibold text-white tabular-nums">
                  {Math.min(currentPage * pageSize, filteredOrders.length)}
                </span>{' '}
                de <span className="font-semibold text-white tabular-nums">{filteredOrders.length}</span> reservas
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none text-white font-medium transition-colors cursor-pointer"
                >
                  &larr; Anterior
                </button>
                <span className="px-2 font-mono text-slate-300 tabular-nums">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none text-white font-medium transition-colors cursor-pointer"
                >
                  Siguiente &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
        {/* Simulator Header / Intro Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#11141a] via-[#11141a] to-emerald-950/20 border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Simulador de Costos & Márgenes</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                    Modo Laboratorio
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Espacio para probar y simular precios sin alterar la tienda. Modificá los valores libremente. Si querés que este precio sea el oficial que ven los clientes, hacé clic en &ldquo;Aplicar a la Tienda&rdquo;.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSaveOfficialPrice(simCosts.salePrice)}
                disabled={isSavingOfficialPrice}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingOfficialPrice ? 'Guardando...' : `Aplicar ${formatPrice(simCosts.salePrice)} a la Tienda`}</span>
              </button>
            </div>
          </div>

          {officialPriceSaveMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                officialPriceSaveMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{officialPriceSaveMsg.text}</span>
            </div>
          )}
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Costos de Fabricación */}
          <div className="p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Costos Directos por Prenda</h3>
                  <p className="text-[11px] text-slate-400">Lo que te cobra el taller y proveedores</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                Total: {formatPrice(simDirectCosts)}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  1. Prenda Lisa / Confección ($):
                </label>
                <input
                  type="number"
                  step="500"
                  placeholder="0"
                  value={simCosts.blankGarmentCost === 0 ? '' : simCosts.blankGarmentCost}
                  onChange={(e) =>
                    handleSimCostChange(
                      'blankGarmentCost',
                      e.target.value === '' ? 0 : Number(e.target.value)
                    )
                  }
                  className="w-full font-mono py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none placeholder-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Costo de la tela y armado de la remera.</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  2. Estampado / DTF / Serigrafía ($):
                </label>
                <input
                  type="number"
                  step="500"
                  placeholder="0"
                  value={simCosts.printingCost === 0 ? '' : simCosts.printingCost}
                  onChange={(e) =>
                    handleSimCostChange(
                      'printingCost',
                      e.target.value === '' ? 0 : Number(e.target.value)
                    )
                  }
                  className="w-full font-mono py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none placeholder-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Costo de estampa delantera y trasera.</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  3. Packaging / Bolsa / Etiquetas ($):
                </label>
                <input
                  type="number"
                  step="100"
                  placeholder="0"
                  value={simCosts.packagingCost === 0 ? '' : simCosts.packagingCost}
                  onChange={(e) =>
                    handleSimCostChange(
                      'packagingCost',
                      e.target.value === '' ? 0 : Number(e.target.value)
                    )
                  }
                  className="w-full font-mono py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none placeholder-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Bolsa plástica cristal, calcos o tarjeta.</p>
              </div>

              <div className="pt-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Costo de Pasarela de Pago:</span>
                  <strong className="text-emerald-400 text-xs">0% Comisión (Transferencia Bancaria Directa)</strong>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">
                  Ahorro $0 en comisiones
                </span>
              </div>
            </div>
          </div>

          {/* Margen y Precio Simulado */}
          <div className="p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Margen y Precio Simulado</h3>
                  <p className="text-[11px] text-slate-400">Calculá tu ganancia limpia por remera</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">
                    Margen de Ganancia Deseado (%):
                  </label>
                  <span className="font-mono font-bold text-emerald-400">
                    {simCosts.targetMarginPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={simCosts.targetMarginPercent}
                  onChange={(e) =>
                    handleSimCostChange('targetMarginPercent', Number(e.target.value))
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>20% (Bajo)</span>
                  <span>50% (Equilibrado recomendado)</span>
                  <span>80% (Alto)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-slate-300 block font-semibold">
                    Precio Sugerido para {simCosts.targetMarginPercent}% de Margen:
                  </span>
                  <p className="text-[10px] text-slate-400">Fórmula: Costo / (1 - Margen%)</p>
                </div>
                <span className="text-base font-black font-mono text-emerald-300">
                  {formatPrice(Math.round(simSuggestedPrice))}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Precio de Venta Simulado ($):
                </label>
                <input
                  type="number"
                  step="500"
                  placeholder="0"
                  value={simCosts.salePrice === 0 ? '' : simCosts.salePrice}
                  onChange={(e) =>
                    handleSimCostChange(
                      'salePrice',
                      e.target.value === '' ? 0 : Number(e.target.value)
                    )
                  }
                  className="w-full text-lg font-mono font-bold py-2 px-3 rounded-xl bg-white/[0.04] border border-emerald-500/40 text-emerald-300 focus:border-emerald-500 focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Resultados del Precio Simulado */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Ganancia neta por remera:</span>
                  <strong className={`font-mono ${simUnitProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatPrice(simUnitProfit)} ({simMarginPercent.toFixed(1)}%)
                  </strong>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Seña 50% requerida al cliente:</span>
                  <span className="font-mono text-slate-300">{formatPrice(simCosts.salePrice * 0.5)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Saldo restante al entregar:</span>
                  <span className="font-mono text-slate-300">{formatPrice(simCosts.salePrice * 0.5)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proyección con las unidades de la preventa */}
        <div className="p-6 rounded-2xl bg-[#11141a] border border-white/[0.08] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Proyección Financiera con Prendas Actuales</h3>
              <p className="text-xs text-slate-400">
                Si vendés las <strong>{totalUnits} prendas</strong> reservadas actualmente con este precio simulado:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Ingresos Totales</span>
                <span className="text-base font-mono font-bold text-white">
                  {formatPrice(simCosts.salePrice * totalUnits)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Costo Total Taller</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {formatPrice(simTotalUnitCost * totalUnits)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Ganancia Neta en Mano</span>
                <span className="text-base font-mono font-black text-emerald-400">
                  {formatPrice(simProjectedProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guía Explicativa con Ejemplo Real */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#11141a] to-blue-950/20 border border-blue-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guía Práctica: ¿Cómo calcular y entender los números?</h3>
              <p className="text-[11px] text-slate-400">Ejemplo con números redondos para tomar decisiones seguras</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center">1</span>
                <span>Costos de Fabricación</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Sumás lo que pagás por prenda:
              </p>
              <div className="font-mono text-[11px] text-slate-300 bg-black/30 p-2.5 rounded-lg space-y-1">
                <div>• Prenda lisa: $6.000</div>
                <div>• Estampa delantera y trasera: $2.500</div>
                <div>• Bolsa y etiquetas: $500</div>
                <div className="border-t border-white/[0.1] pt-1 font-bold text-amber-300">
                  Total Costo Taller = $9.000
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] flex items-center justify-center">2</span>
                <span>Venta y Seña del 50%</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Si decidís vender cada remera a <strong>$18.000</strong>:
              </p>
              <div className="font-mono text-[11px] text-slate-300 bg-black/30 p-2.5 rounded-lg space-y-1">
                <div>• Seña previa 50% = <strong>$9.000</strong></div>
                <div className="text-[10px] text-emerald-400 leading-tight">
                  👉 <strong>¡La seña cubre el 100% del taller!</strong> No ponés un solo peso de tu bolsillo.
                </div>
                <div className="border-t border-white/[0.1] pt-1">
                  • Saldo al entregar = <strong>$9.000</strong> (100% ganancia en mano).
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-950 text-blue-400 text-[10px] flex items-center justify-center">3</span>
                <span>Resultado de la Tanda</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Si en la tanda vendés <strong>30 remeras</strong>:
              </p>
              <div className="font-mono text-[11px] text-slate-300 bg-black/30 p-2.5 rounded-lg space-y-1">
                <div>• Total ventas: $540.000 (30 × $18.000)</div>
                <div>• Pago taller: $270.000 (30 × $9.000)</div>
                <div className="border-t border-white/[0.1] pt-1 font-bold text-emerald-400">
                  Ganancia en tu bolsillo: $270.000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </main>

      {/* Change PIN Modal */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#11141a] border border-white/[0.1] rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cambiar PIN del Panel</h3>
                  <p className="text-[11px] text-slate-400">Seguridad del taller SantyBike</p>
                </div>
              </div>
              <button
                onClick={() => setIsChangePinOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {pinChangeMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  pinChangeMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {pinChangeMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  PIN Actual:
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="••••"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  required
                  className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nuevo PIN (mínimo 4 dígitos):
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="••••"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  required
                  className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold text-xs border border-white/[0.08] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isChangingPin}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPin ? 'Guardando...' : 'Guardar PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Diagnostic Modal */}
      {isDiagnosticOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#11141a] border border-white/[0.1] rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Estado de Base de Datos Supabase</h3>
                  <p className="text-[11px] text-slate-400">Verificación de conectividad y tablas en vivo</p>
                </div>
              </div>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {diagnosticLoading ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Consultando tablas de Supabase en tiempo real...</p>
              </div>
            ) : diagnosticResult?.status === 'success' ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span className="font-bold">¡Tu base de datos Supabase está 100% activa y conectada!</span>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex justify-between items-center text-slate-300 pb-1.5 border-b border-white/[0.06]">
                    <span>URL del proyecto:</span>
                    <span className="font-mono text-[11px] text-slate-400">dyiohbvpxxtcsfjuqakq.supabase.co</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 pb-1.5 border-b border-white/[0.06]">
                    <span>Tabla <strong>store_settings</strong> (Configuración):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      Precio en nube: {formatPrice(diagnosticResult.cloudPrice || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Tabla <strong>orders</strong> (Pedidos registrados):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {diagnosticResult.ordersCount} órdenes en la nube
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cualquier pedido que hagan los clientes en sus celulares se guardará instantáneamente en esta base de datos en la nube.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Aviso de sincronización:</strong>
                    <span>{diagnosticResult?.errorMsg || 'No se pudo comunicar con Supabase.'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dev Data Segmented Control Toggle (Dev environment / testing) */}
      <Suspense fallback={null}>
        <DevDataToggle onModeChange={() => setOrders(getStoredOrders())} />
      </Suspense>
    </div>
  );
}
