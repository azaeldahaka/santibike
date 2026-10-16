import { FinancialCosts, Order, ProductImage, SizeMeasurement } from '@/types';

export const STORE_CONFIG = {
  storeName: 'San Ibike Bicycles',
  phoneWhatsApp: '+5491100000000', // Reemplazable con el real
  phoneWhatsAppDisplay: '+54 9 11 0000-0000',
  instagram: '@sanibike.oficial',
  address: 'Av. Principal 1234, Local San Ibike',
  hours: 'Lunes a Viernes de 09:30 a 19:30 hs | Sábados 10:00 a 14:00 hs',
  bankInfo: {
    bank: 'Mercado Pago / Banco Santander',
    alias: 'SANIBIKE.OFICIAL.MP',
    cbu: '0000003100045892019284',
    holder: 'Bicicletería San Ibike',
    cuit: '20-38491823-9',
  },
  preorderEndDate: '2026-10-31',
  preorderEndDateFormatted: '31 de Octubre',
  estimatedDeliveryDate: '10 a 15 días hábiles luego del cierre',
  basePrice: 32000,
  depositPercentage: 50,
};

export const SIZE_CHART: SizeMeasurement[] = [
  { size: 'S', chestWidthCm: 50, lengthCm: 68, recommendedWeightKg: '55 - 65 kg' },
  { size: 'M', chestWidthCm: 53, lengthCm: 71, recommendedWeightKg: '65 - 75 kg' },
  { size: 'L', chestWidthCm: 56, lengthCm: 74, recommendedWeightKg: '75 - 85 kg' },
  { size: 'XL', chestWidthCm: 59, lengthCm: 77, recommendedWeightKg: '85 - 95 kg' },
  { size: 'XXL', chestWidthCm: 63, lengthCm: 80, recommendedWeightKg: '+95 kg' },
];

export const PRODUCT_IMAGES: ProductImage[] = [
  {
    id: 'negro-frente',
    url: '/images/products/remera-negra-frente.jpg',
    alt: 'Remera Oficial San Ibike Negra - Vista Frontal',
    title: 'Frente - Logo San Ibike',
    color: 'negro',
  },
  {
    id: 'negro-espalda',
    url: '/images/products/remera-negra-espalda.jpg',
    alt: 'Remera Oficial San Ibike Negra - Vista Dorsal Sponsors',
    title: 'Espalda - Sponsors Oficiales',
    color: 'negro',
  },
  {
    id: 'gris-frente',
    url: '/images/products/remera-gris-frente.jpg',
    alt: 'Remera Oficial San Ibike Gris Melange - Vista Frontal',
    title: 'Frente - Gris Melange',
    color: 'gris',
  },
  {
    id: 'gris-espalda',
    url: '/images/products/remera-gris-espalda.jpg',
    alt: 'Remera Oficial San Ibike Gris Melange - Vista Dorsal',
    title: 'Espalda - Gris Melange',
    color: 'gris',
  },
  {
    id: 'detalle-pecho-negro',
    url: '/images/details/logo-pecho-negra.jpg',
    alt: 'Detalle estampado de pecho en remera negra',
    title: 'Estampa Pecho Alta Definición',
    color: 'negro',
  },
  {
    id: 'detalle-pecho-gris',
    url: '/images/details/logo-pecho-gris.jpg',
    alt: 'Detalle estampado de pecho en remera gris',
    title: 'Estampa Contorneada Gris',
    color: 'gris',
  },
  {
    id: 'detalle-ciclista',
    url: '/images/details/logo-ciclista-macro.jpg',
    alt: 'Detalle Macro Emblema Ciclista San Ibike',
    title: 'Detalle Emblema Ciclista',
  },
  {
    id: 'detalle-ruedo',
    url: '/images/details/detalle-bicycles-ruedo.jpg',
    alt: 'Detalle BICYCLES estampado en el ruedo inferior',
    title: 'Sello BICYCLES en Ruedo',
  },
];

export const INITIAL_FINANCIAL_COSTS: FinancialCosts = {
  blankGarmentCost: 9500,     // Remera lisa de algodón peinado 24/1 premium
  printingCost: 4800,         // DTF / Serigrafía premium frente, espalda, mangas
  packagingCost: 1200,        // Bolsa ecológica con cierre ziploc + stickers oficiales
  gatewayFeePercent: 6.5,     // Comisión promedio Mercado Pago
  targetMarginPercent: 48,    // Margen objetivo
  salePrice: 32000,
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderCode: 'SAN-1048',
    createdAt: '2026-10-15T18:30:00Z',
    customerName: 'Santiago Rossi',
    customerPhone: '+54 9 11 4589-2010',
    customerEmail: 'santi.rossi@gmail.com',
    customerCity: 'San Isidro, Bs. As.',
    deliveryMethod: 'pickup',
    paymentMethod: 'mercadopago',
    status: 'deposit_paid',
    items: [
      {
        color: 'negro',
        size: 'L',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  {
    id: 'ord-102',
    orderCode: 'SAN-1049',
    createdAt: '2026-10-15T19:15:00Z',
    customerName: 'Martín Benítez',
    customerPhone: '+54 9 11 5821-9932',
    customerEmail: 'martinb_mtb@hotmail.com',
    customerCity: 'Vicente López, Bs. As.',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'deposit_paid',
    receiptNote: 'Comprobante transferido vía Mercado Pago',
    items: [
      {
        color: 'gris',
        size: 'XL',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
      {
        color: 'negro',
        size: 'M',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
    ],
    totalAmount: 64000,
    depositAmount: 32000,
    remainingAmount: 32000,
  },
  {
    id: 'ord-103',
    orderCode: 'SAN-1050',
    createdAt: '2026-10-15T20:05:00Z',
    customerName: 'Luciana Morales',
    customerPhone: '+54 9 11 3190-4421',
    customerEmail: 'luciana.morales@yahoo.com',
    customerCity: 'Tigre, Bs. As.',
    deliveryMethod: 'shipping',
    paymentMethod: 'mercadopago',
    status: 'in_production',
    items: [
      {
        color: 'negro',
        size: 'S',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  {
    id: 'ord-104',
    orderCode: 'SAN-1051',
    createdAt: '2026-10-15T20:50:00Z',
    customerName: 'Gonzalo Farias',
    customerPhone: '+54 9 11 7721-0081',
    customerEmail: 'gonza.farias@gmail.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'pending_deposit',
    items: [
      {
        color: 'gris',
        size: 'L',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  {
    id: 'ord-105',
    orderCode: 'SAN-1052',
    createdAt: '2026-10-15T21:10:00Z',
    customerName: 'Federico Aguirre',
    customerPhone: '+54 9 11 9901-2245',
    customerEmail: 'fede.aguirre@live.com',
    customerCity: 'CABA',
    deliveryMethod: 'pickup',
    paymentMethod: 'mercadopago',
    status: 'deposit_paid',
    items: [
      {
        color: 'negro',
        size: 'M',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  {
    id: 'ord-106',
    orderCode: 'SAN-1053',
    createdAt: '2026-10-15T21:40:00Z',
    customerName: 'Julián Castro',
    customerPhone: '+54 9 11 6340-9128',
    customerEmail: 'juliancastro@gmail.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'ready_for_pickup',
    items: [
      {
        color: 'negro',
        size: 'XL',
        quantity: 1,
        unitPrice: 32000,
        unitDeposit: 16000,
      },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
];
