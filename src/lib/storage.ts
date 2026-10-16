import { CampaignDates, FinancialCosts, Order } from '@/types';
import { INITIAL_CAMPAIGN_DATES, INITIAL_FINANCIAL_COSTS, INITIAL_ORDERS } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const ORDERS_KEY = 'santibike_orders_v2';
const COSTS_KEY = 'santibike_costs_v2';
const CAMPAIGN_DATES_KEY = 'santibike_campaign_dates_v1';

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
    // Asynchronously update in Supabase
    if (supabase) {
      supabase
        .from('store_settings')
        .update({
          blank_garment_cost: costs.blankGarmentCost,
          printing_cost: costs.printingCost,
          packaging_cost: costs.packagingCost,
          gateway_fee_percent: 0,
          target_margin_percent: costs.targetMarginPercent,
          sale_price: costs.salePrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default_settings')
        .then(({ error }) => {
          if (error) console.warn('Supabase settings update warning:', error.message);
        });
    }
  } catch (e) {
    console.error('Error saving costs to localStorage', e);
  }
}

export async function updateStorePrice(newPrice: number): Promise<boolean> {
  const current = getStoredCosts();
  const updated = { ...current, salePrice: newPrice };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(COSTS_KEY, JSON.stringify(updated));
  }

  if (supabase) {
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          sale_price: newPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default_settings');

      if (error) {
        console.warn('Could not update store price in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Network error updating store price:', e);
      return false;
    }
  }

  return true;
}

export function formatPreorderDate(isoDateStr: string): string {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('-');
  if (parts.length < 3) return isoDateStr;
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthsEs = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  if (month < 0 || month > 11 || isNaN(day)) return isoDateStr;
  return `${day} de ${monthsEs[month]}`;
}

export function getStoredCampaignDates(): CampaignDates {
  if (typeof window === 'undefined') return INITIAL_CAMPAIGN_DATES;
  try {
    const raw = localStorage.getItem(CAMPAIGN_DATES_KEY);
    if (!raw) {
      localStorage.setItem(CAMPAIGN_DATES_KEY, JSON.stringify(INITIAL_CAMPAIGN_DATES));
      return INITIAL_CAMPAIGN_DATES;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CAMPAIGN_DATES,
      ...parsed,
    };
  } catch (e) {
    console.error('Error reading campaign dates from localStorage', e);
    return INITIAL_CAMPAIGN_DATES;
  }
}

export function saveStoredCampaignDates(dates: CampaignDates): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAMPAIGN_DATES_KEY, JSON.stringify(dates));
    window.dispatchEvent(new Event('santybike_campaign_change'));

    // Asynchronously update in Supabase
    if (supabase) {
      supabase
        .from('store_settings')
        .update({
          preorder_end_date: dates.preorderEndDate,
          preorder_end_date_formatted: dates.preorderEndDateFormatted,
          estimated_pickup_date: dates.estimatedPickupDate,
          pickup_grace_days: dates.pickupGraceDays,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default_settings')
        .then(({ error }) => {
          if (error) console.warn('Supabase campaign dates update warning:', error.message);
        });
    }
  } catch (e) {
    console.error('Error saving campaign dates to localStorage', e);
  }
}

export async function updateCampaignDates(partial: Partial<CampaignDates>): Promise<boolean> {
  const current = getStoredCampaignDates();
  const updated: CampaignDates = {
    ...current,
    ...partial,
  };
  saveStoredCampaignDates(updated);
  return true;
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

export async function fetchLiveCampaignDates(): Promise<CampaignDates> {
  if (!supabase) return getStoredCampaignDates();

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'default_settings')
      .single();

    if (error || !data) {
      return getStoredCampaignDates();
    }

    if (data.preorder_end_date || data.preorder_end_date_formatted) {
      const cloudDates: CampaignDates = {
        preorderEndDate: data.preorder_end_date || INITIAL_CAMPAIGN_DATES.preorderEndDate,
        preorderEndDateFormatted: data.preorder_end_date_formatted || INITIAL_CAMPAIGN_DATES.preorderEndDateFormatted,
        estimatedPickupDate: data.estimated_pickup_date || INITIAL_CAMPAIGN_DATES.estimatedPickupDate,
        pickupGraceDays: data.pickup_grace_days !== undefined ? Number(data.pickup_grace_days) : INITIAL_CAMPAIGN_DATES.pickupGraceDays,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(CAMPAIGN_DATES_KEY, JSON.stringify(cloudDates));
        window.dispatchEvent(new Event('santybike_campaign_change'));
      }
      return cloudDates;
    }

    return getStoredCampaignDates();
  } catch (err) {
    return getStoredCampaignDates();
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}
