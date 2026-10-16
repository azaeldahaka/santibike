import { Order } from '@/types';

export const WORST_CASE_ORDERS: Order[] = [
  // 1. Long hyphenated name, long unbreakable email, multiple items (3 items)
  {
    id: 'ord-worst-1',
    orderCode: 'SAN-9901-EXT',
    createdAt: '2026-10-15T10:00:00Z',
    customerName: 'Aleksandra Wiśniewska-Kowalczyk',
    customerPhone: '+54 9 387 512-9988',
    customerEmail: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
    customerCity: 'Avenida del Libertador General San Martín 14258, Piso 14 Depto B, Salta Capital',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'in_production',
    items: [
      { color: 'negro', size: 'XL', quantity: 2, unitPrice: 32000, unitDeposit: 16000 },
      { color: 'gris', size: 'M', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
      { color: 'negro', size: 'XXL', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 128000,
    depositAmount: 64000,
    remainingAmount: 64000,
    receiptNote: 'Comprobante transferido desde cuenta de terceros con CUIT diferente al titular',
  },
  // 2. Extremely short name, minimal email, count exactly 1 (tests pluralization and empty-space layout)
  {
    id: 'ord-worst-2',
    orderCode: 'SAN-0001',
    createdAt: '2026-10-15T11:20:00Z',
    customerName: 'Jo',
    customerPhone: '+5491122334455',
    customerEmail: 'a@b.co',
    deliveryMethod: 'pickup',
    paymentMethod: 'mercadopago',
    status: 'ready_for_pickup',
    items: [
      { color: 'negro', size: 'S', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  // 3. CRITICAL FAILURE TEST: Order with empty items array (tests runtime crash on order.items[0])
  {
    id: 'ord-worst-3',
    orderCode: 'SAN-EMPTY-ITEMS',
    createdAt: '2026-10-15T12:00:00Z',
    customerName: 'Santiago Sin Ítems',
    customerPhone: '+54 9 387 000-0000',
    customerEmail: 'vacio@example.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'pending_deposit',
    items: [],
    totalAmount: 0,
    depositAmount: 0,
    remainingAmount: 0,
  },
  // 4. Emoji-first name (tests surrogate pair slice/split corruption) + phone with symbols
  {
    id: 'ord-worst-4',
    orderCode: 'SAN-9904',
    createdAt: '2026-10-15T13:45:00Z',
    customerName: '🦊 Fox Romero',
    customerPhone: '+54 (0387) 15-4422-991',
    customerEmail: 'fox.romero+santybike-preorder@example.org',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'deposit_paid',
    items: [
      { color: 'gris', size: 'L', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  // 5. Leading/trailing spaces in name (breaks naive .split(' ')[0] in success modal)
  {
    id: 'ord-worst-5',
    orderCode: 'SAN-9905',
    createdAt: '2026-10-15T14:10:00Z',
    customerName: '   Marcos   Pérez   ',
    customerPhone: '+54 9 387 665-1122',
    customerEmail: 'marcos.perez@example.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'mercadopago',
    status: 'completed',
    items: [
      { color: 'negro', size: 'XXL', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  // 6. XSS Injection attempt in customer fields
  {
    id: 'ord-worst-6',
    orderCode: 'SAN-<script>',
    createdAt: '2026-10-15T15:00:00Z',
    customerName: '<script>alert("xss")</script>',
    customerPhone: '0000000000',
    customerEmail: 'hacker@security-test.test',
    customerCity: '"><img src=x onerror=alert(1)>',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'cancelled',
    items: [
      { color: 'negro', size: 'M', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  // 7. Stacked Vietnamese diacritics & uppercase CJK characters
  {
    id: 'ord-worst-7',
    orderCode: 'SAN-9907-VN',
    createdAt: '2026-10-15T15:30:00Z',
    customerName: 'Đặng Thị Ngọc Hân',
    customerPhone: '+54 9 11 9988-7766',
    customerEmail: 'dang.thi.ngoc.han@department.region.example.co.uk',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'in_production',
    items: [
      { color: 'gris', size: 'S', quantity: 2, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 64000,
    depositAmount: 32000,
    remainingAmount: 32000,
  },
  // 8. Name with suffix & multiple middle names (tests CI initials or split index)
  {
    id: 'ord-worst-8',
    orderCode: 'SAN-9908-SUF',
    createdAt: '2026-10-15T16:15:00Z',
    customerName: 'Christopher Alexander Montgomery III',
    customerPhone: '+54 9 387 400-1122',
    customerEmail: 'c.a.montgomery.iii@example.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'deposit_paid',
    items: [
      { color: 'negro', size: 'XL', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
  // 9. Extreme financial values (Wholesale bulk order - 100 units)
  {
    id: 'ord-worst-9',
    orderCode: 'SAN-BULK-100',
    createdAt: '2026-10-15T17:00:00Z',
    customerName: 'Club Ciclista Salta MTB Pro Team',
    customerPhone: '+54 9 387 111-2233',
    customerEmail: 'presidencia@clubciclistasaltamtb.org.ar',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'in_production',
    items: [
      { color: 'negro', size: 'M', quantity: 40, unitPrice: 32000, unitDeposit: 16000 },
      { color: 'negro', size: 'L', quantity: 40, unitPrice: 32000, unitDeposit: 16000 },
      { color: 'gris', size: 'XL', quantity: 20, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 3200000,
    depositAmount: 1600000,
    remainingAmount: 1600000,
  },
  // 10. Minimal optional fields: missing city, missing notes, minimal clean state
  {
    id: 'ord-worst-10',
    orderCode: 'SAN-9910',
    createdAt: '2026-10-15T17:45:00Z',
    customerName: 'María José de la Cruz y Fernández',
    customerPhone: '+54 9 387 778-9900',
    customerEmail: 'mariajose@example.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'pending_deposit',
    items: [
      { color: 'gris', size: 'M', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
];

export const EMPTY_ORDERS: Order[] = [];

export const SINGLE_ORDER: Order[] = [
  {
    id: 'ord-single-1',
    orderCode: 'SAN-ONE-01',
    createdAt: '2026-10-15T12:00:00Z',
    customerName: 'Jo',
    customerPhone: '+5491122334455',
    customerEmail: 'jo@example.com',
    deliveryMethod: 'pickup',
    paymentMethod: 'transfer',
    status: 'pending_deposit',
    items: [
      { color: 'negro', size: 'M', quantity: 1, unitPrice: 32000, unitDeposit: 16000 },
    ],
    totalAmount: 32000,
    depositAmount: 16000,
    remainingAmount: 16000,
  },
];

export function generateHugeOrders(count = 1000): Order[] {
  const colors: ('negro' | 'gris')[] = ['negro', 'gris'];
  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const statuses: Order['status'][] = [
    'pending_deposit',
    'deposit_paid',
    'in_production',
    'ready_for_pickup',
    'completed',
    'cancelled',
  ];

  return Array.from({ length: count }, (_, i) => {
    const idNum = 1000 + i;
    const color = colors[i % colors.length];
    const size = sizes[i % sizes.length];
    const status = statuses[i % statuses.length];
    const quantity = (i % 3) + 1;
    const unitPrice = 32000;
    const unitDeposit = 16000;

    return {
      id: `ord-huge-${idNum}`,
      orderCode: `SAN-${idNum}`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      customerName: `Cliente Prueba #${idNum}`,
      customerPhone: `+54 9 387 ${100 + (i % 900)}-${1000 + (i % 9000)}`,
      customerEmail: `cliente${idNum}@example.com`,
      customerCity: i % 2 === 0 ? 'Salta Capital' : undefined,
      deliveryMethod: 'pickup',
      paymentMethod: i % 2 === 0 ? 'transfer' : 'mercadopago',
      status,
      items: [
        {
          color,
          size,
          quantity,
          unitPrice,
          unitDeposit,
        },
      ],
      totalAmount: unitPrice * quantity,
      depositAmount: unitDeposit * quantity,
      remainingAmount: (unitPrice - unitDeposit) * quantity,
    };
  });
}
