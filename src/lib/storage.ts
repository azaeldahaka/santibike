import { FinancialCosts, Order } from '@/types';
import { INITIAL_FINANCIAL_COSTS, INITIAL_ORDERS } from '@/data/mockData';

const ORDERS_KEY = 'sanibike_orders_v1';
const COSTS_KEY = 'sanibike_costs_v1';

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
  return updated;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order[] {
  const current = getStoredOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  saveStoredOrders(updated);
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
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading costs from localStorage', e);
    return INITIAL_FINANCIAL_COSTS;
  }
}

export function saveStoredCosts(costs: FinancialCosts): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COSTS_KEY, JSON.stringify(costs));
  } catch (e) {
    console.error('Error saving costs to localStorage', e);
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}
