import { FinancialCosts, Order } from '@/types';
import { INITIAL_FINANCIAL_COSTS, INITIAL_ORDERS } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const ORDERS_KEY = 'santibike_orders_v2';
const COSTS_KEY = 'santibike_costs_v2';

// ----------------------------------------------------
// LOCAL STORAGE ADAPTER (Cache & Fallback)
// ----------------------------------------------------

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading orders from localStorage', e);
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage', e);
  }
}

export function addOrder(newOrder: Order): Order[] {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  saveStoredOrders(updated);

  // Asynchronously sync to Supabase Cloud in background
  syncOrderToSupabase(newOrder);

  return updated;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order[] {
  const current = getStoredOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  saveStoredOrders(updated);

  // Asynchronously update in Supabase
  if (supabase) {
    supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .then(({ error }) => {
        if (error) console.warn('Supabase order update warning:', error.message);
      });
  }

  return updated;
}

export function getStoredCosts(): FinancialCosts {
  if (typeof window === 'undefined') return INITIAL_FINANCIAL_COSTS;
  try {
    const raw = localStorage.getItem(COSTS_KEY);
    if (!raw) {
      localStorage.setItem(COSTS_KEY, JSON.stringify(INITIAL_FINANCIAL_COSTS));
      return INITIAL_FINANCIAL_COSTS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_FINANCIAL_COSTS,
      ...parsed,
      gatewayFeePercent: 0,
    };
  } catch (e) {
    console.error('Error reading costs from localStorage', e);
    return INITIAL_FINANCIAL_COSTS;
  }
}

export function saveStoredCosts(costs: FinancialCosts): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COSTS_KEY, JSON.stringify(costs));
    // Asynchronously save to Supabase
    if (supabase) {
      supabase
        .from('store_settings')
        .upsert({
          id: 'default_settings',
          blank_garment_cost: costs.blankGarmentCost,
          printing_cost: costs.printingCost,
          packaging_cost: costs.packagingCost,
          gateway_fee_percent: 0,
          target_margin_percent: costs.targetMarginPercent,
          sale_price: costs.salePrice,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase settings upsert warning:', error.message);
        });
    }
  } catch (e) {
    console.error('Error saving costs to localStorage', e);
  }
}

// ----------------------------------------------------
// SUPABASE CLOUD SYNC & FETCH
// ----------------------------------------------------

function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    orderCode: row.order_code,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    customerCity: row.customer_city || undefined,
    deliveryMethod: row.delivery_method,
    paymentMethod: row.payment_method,
    status: row.status,
    receiptNote: row.receipt_note || undefined,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.total_amount),
    depositAmount: Number(row.deposit_amount),
    remainingAmount: Number(row.remaining_amount),
  };
}

export async function syncOrderToSupabase(order: Order): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      order_code: order.orderCode,
      created_at: order.createdAt,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,
      customer_city: order.customerCity || null,
      delivery_method: order.deliveryMethod,
      payment_method: order.paymentMethod,
      status: order.status,
      receipt_note: order.receiptNote || null,
      items: order.items,
      total_amount: order.totalAmount,
      deposit_amount: order.depositAmount,
      remaining_amount: order.remainingAmount,
    });

    if (error) {
      console.warn('Could not insert order to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Network error syncing to Supabase:', err);
    return false;
  }
}

export async function fetchLiveOrders(): Promise<Order[]> {
  if (!supabase) return getStoredOrders();

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Falling back to local orders cache:', error?.message);
      return getStoredOrders();
    }

    if (data.length === 0) {
      return getStoredOrders();
    }

    const cloudOrders = data.map(mapRowToOrder);
    saveStoredOrders(cloudOrders);
    return cloudOrders;
  } catch (err) {
    console.warn('Supabase fetch failed, using local orders:', err);
    return getStoredOrders();
  }
}

export async function fetchLiveCosts(): Promise<FinancialCosts> {
  if (!supabase) return getStoredCosts();

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'default_settings')
      .single();

    if (error || !data) {
      return getStoredCosts();
    }

    const cloudCosts: FinancialCosts = {
      blankGarmentCost: Number(data.blank_garment_cost),
      printingCost: Number(data.printing_cost),
      packagingCost: Number(data.packaging_cost),
      gatewayFeePercent: 0,
      targetMarginPercent: Number(data.target_margin_percent),
      salePrice: Number(data.sale_price),
    };

    saveStoredCosts(cloudCosts);
    return cloudCosts;
  } catch (err) {
    return getStoredCosts();
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}
