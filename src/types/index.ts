export type ProductColor = 'negro' | 'gris';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type DeliveryMethod = 'pickup' | 'shipping';

export type PaymentMethod = 'mercadopago' | 'transfer';

export type OrderStatus =
  | 'pending_deposit'
  | 'deposit_paid'
  | 'in_production'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  color?: ProductColor;
}

export interface SizeMeasurement {
  size: ProductSize;
  chestWidthCm: number;
  lengthCm: number;
  recommendedWeightKg: string;
}

export interface OrderItem {
  color: ProductColor;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  unitDeposit: number;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. SAN-2026-1042
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity?: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  receiptNote?: string;
}

export interface FinancialCosts {
  blankGarmentCost: number;     // Costo prenda lisa al por mayor
  printingCost: number;         // Costo estampado (pecho, espalda, mangas)
  packagingCost: number;        // Packaging, bolsas y etiquetas
  gatewayFeePercent: number;    // Comisión de pasarela o impuestos (ej. 6.5%)
  targetMarginPercent: number;  // Margen deseado (ej. 45%)
  salePrice: number;            // Precio de venta actual
}

export interface CampaignDates {
  preorderEndDate: string;          // Fecha ISO 'YYYY-MM-DD'
  preorderEndDateFormatted: string; // Texto legible ej: '31 de Octubre'
  estimatedPickupDate: string;      // Plazo de retiro ej: '10 a 15 días hábiles luego del cierre'
  pickupGraceDays: number;          // Días de tolerancia para retirar en local (ej: 7)
}

