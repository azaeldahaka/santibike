# Especificación Técnica y de Producto: MVP E-commerce SantyBike Merch

## 1. Visión General del Proyecto
Desarrollar una aplicación web de comercio electrónico **Mobile-First** orientada a la venta y preventa (modelo con seña previa) del merchandising oficial de la bicicletería **SantyBike**. 

El sistema debe permitir a los clientes reservar prendas (inicialmente la remera oficial técnica/urbana de SantyBike), abonar una seña porcentual o fija para asegurar la producción sin riesgo de stock ocioso, y proporcionarle al dueño un panel administrativo (Dashboard) para gestionar pedidos, costos de producción, márgenes de ganancia y fijación de precios recomendados.

---

## 2. Stack Tecnológico Sugerido (MVP Rápido y Escalable)
* **Frontend:** Next.js (App Router, React 19) + Tailwind CSS + Lucide Icons + Shadcn/ui.
* **Backend / API:** Next.js Route Handlers / Server Actions.
* **Base de Datos & Auth:** Supabase (PostgreSQL) o SQLite/Prisma para despliegue ultra-rápido.
* **Pasarela de Pagos:** Integración con Mercado Pago SDK (Checkout Pro / Preferencias) y opción de Transferencia Bancaria (CBU/CVU/Alias).
* **Despliegue:** Vercel (Front/API) + Supabase Cloud.

---

## 3. Modelo de Negocio: Preventa con Seña (Pre-order Flow)

### 3.1. Reglas de Negocio
* **Monto de Seña:** Por defecto, $50\%$ del valor total de la prenda (configurable desde el Admin).
* **Saldo restante:** Se abona al momento de retirar en el local o previo al despacho si es con envío.
* **Políticas claras en UI:**
  * Fecha de cierre de la tanda de preventa (ej.: *"Preventa abierta hasta el día X"*).
  * Fecha estimada de entrega (ej.: *"Entrega estimada en 10-15 días hábiles luego del cierre"*).
  * Código único de reserva emitido por pedido (`SAN-XXXX`).

---

## 4. Requerimientos de UI/UX (Mobile-First)

### 4.1. Estética y Diseño
* **Paleta:** Fondo oscuro/moderno o blanco minimalista con contraste alto (estilo ciclismo urbano/MTB: negro `#111111`, acentos en blanco `#FFFFFF` y toques sutiles de color para alertas/botones de acción).
* **Tipografía:** Sans-serif moderna, de fácil lectura en pantallas móviles pequeñas.
* **Componentes táctiles:** Botones grandes de llamada a la acción (CTA) fijos en la parte inferior de la pantalla (Sticky Bottom Bar en móviles).

### 4.2. Estructura de la Landing / Catálogo
1. **Hero Section:**
   * Imagen de impacto con modelos vistiendo la remera (frente y dorso en entorno ciclista).
   * Titular: *"Remera Oficial SantyBike - Edición Limitada"*.
   * Tag de estado: Badge *"Preventa Abierta - 50% de Seña"*.
   * Botón directo: *"Reservar Ahora"*.
2. **Galería de Producto interactiva:**
   * Foto 1: Frente completo (logo SantyBike en pecho).
   * Foto 2: Espalda completa (logos de sponsors: SRAM, SARS, AWA, WKNS).
   * Foto 3: Detalle de mangas (bandera argentina, parches Shimano/Sega).
   * Foto 4: Foto de uso real en modelo.
3. **Selector de Producto:**
   * Selector visual de talle: `S`, `M`, `L`, `XL`, `XXL`.
   * Botón modal: **"Ver Guía de Talles"** (Popup con medidas en cm de ancho axila-axila y largo total).
   * Selector de cantidad.
4. **Desglose de Pago transparente:**
   * Precio total: `$X.XXX`
   * Seña a pagar hoy: `$X.XXX (50%)`
   * Saldo a pagar al retirar: `$X.XXX (50%)`
5. **Formulario de Reserva (Checkout simplificado):**
   * Nombre y Apellido.
   * Teléfono / WhatsApp (campo obligatorio para confirmación de entrega).
   * Email.
   * Método de entrega:
     * Retiro en el local (gratis).
     * Envío a acordar.
6. **Selección del Método de Pago:**
   * **Opción A:** Mercado Pago (tarjeta de crédito/débito o dinero en cuenta).
   * **Opción B:** Transferencia Bancaria Directa (muestra Alias, CBU y botón para subir foto de comprobante o enviarlo por WhatsApp).
7. **Pantalla de Éxito / Confirmación:**
   * Resumen del pedido con `ID de Reserva`.
   * Botón directo: *"Enviar confirmación por WhatsApp a SantyBike"*.

---

## 5. Módulo Administrativo: Dashboard Financiero y Costos

Este módulo permitirá controlar las ganancias y fijar precios de manera informada.

### 5.1. Calculadora de Costos y Margen (Unit Economics)
Fórmula de fijación de precio y cálculo de margen:
$$\text{Margen Bruto (\%)} = \frac{\text{Precio de Venta} - \text{Costo Total Unitario}}{\text{Precio de Venta}} \times 100$$

**Campos de Entrada de Costos (por prenda):**
* Costo de prenda base (remera lisa al por mayor).
* Costo de estampado/estampas (frente, espalda, mangas).
* Costo de packaging y etiquetas.
* Comisión estimada de pasarela de pago (ej.: 5%-8% en Mercado Pago).
* Gastos operativos fijos asignados por unidad.

**Salidas calculadas en tiempo real:**
* **Costo Total Unitario ($):** Suma de todos los costos.
* **Precio Sugerido según Margen Objetivo:** Si el usuario quiere ganar un $40\%$ o $50\%$, el sistema calcula automáticamente a qué precio debería venderla:
  $$\text{Precio Sugerido} = \frac{\text{Costo Total Unitario}}{1 - \frac{\text{Margen Deseado}}{100}}$$
* **Ganancia Neta por Unidad ($).**
* **Ganancia Proyectada de la Tanda:** (Ganancia unitaria $\times$ Unidades reservadas).

### 5.2. Panel de Gestión de Pedidos (Kanban o Tabla)
* Estados del pedido:
  1. `Pendiente de Seña` (inició proceso pero no acreditó pago).
  2. `Seña Confirmada` (pedido asegurado para producción).
  3. `En Producción` (enviado al taller/estampador).
  4. `Listo para Retirar` (notificación automática por WhatsApp).
  5. `Entregado y Cobrado Completo`.
  6. `Cancelado`.
* Filtros por talle (ej.: *"¿Cuántas L y cuántas XL tenemos que mandar a fabricar?"*).
* Exportación a Excel/CSV de la lista de producción.

---

## 6. Modelo de Datos (Esquema de Base de Datos Relacional)

```sql
-- Tabla de Productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  deposit_percentage INT DEFAULT 50,
  preorder_end_date TIMESTAMP WITH TIME ZONE,
  estimated_delivery_date VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Talles y Stock
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL, -- 'S', 'M', 'L', 'XL', 'XXL'
  stock_limit INT DEFAULT NULL, -- NULL si es preventa abierta sin cupo máximo
  chest_width_cm DECIMAL(5,2),
  length_cm DECIMAL(5,2)
);

-- Tabla de Costos y Métricas Financieras
CREATE TABLE product_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  blank_garment_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  printing_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  packaging_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  gateway_fee_percent DECIMAL(5,2) DEFAULT 6.5,
  other_costs DECIMAL(10,2) DEFAULT 0
);

-- Tabla de Pedidos / Reservas
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code VARCHAR(20) UNIQUE NOT NULL, -- ej: SAN-1001
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  product_variant_id UUID REFERENCES product_variants(id),
  quantity INT DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  remaining_amount DECIMAL(10,2) NOT NULL,
  delivery_method VARCHAR(50) NOT NULL, -- 'pickup', 'shipping'
  payment_method VARCHAR(50) NOT NULL, -- 'mercadopago', 'transfer'
  payment_status VARCHAR(50) DEFAULT 'pending_deposit', -- 'pending_deposit', 'deposit_paid', 'fully_paid', 'refunded'
  order_status VARCHAR(50) DEFAULT 'reserved', -- 'reserved', 'in_production', 'ready_for_pickup', 'completed', 'cancelled'
  payment_receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. Fases de Implementación para Antigravity

### Fase 1: MVP Storefront (Prioridad Inmediata)
* Implementar vista Mobile-First con landing de la remera oficial.
* Galería de fotos (con soporte para vistas frontal, dorsal y detalles).
* Modal con la tabla de talles.
* Selector de talle y desglose de precio ($50\%$ seña / $50\%$ saldo).
* Formulario de checkout conectado a base de datos de órdenes.
* Integración de redirección a WhatsApp con mensaje pre-armado y detalle del pedido.

### Fase 2: Pasarela de Pagos & Transferencias
* Endpoint para crear preferencia de pago en Mercado Pago por el valor de la seña.
* Webhook de Mercado Pago para marcar pedidos como `deposit_paid` automáticamente.
* Opción alternativa: pantalla de alias con botón para adjuntar comprobante de transferencia.

### Fase 3: Dashboard Administrativo
* Autenticación básica para administradores.
* Tabla de gestión de pedidos con cambio de estados.
* Vista de producción: contador consolidado de prendas por talle para enviar a fábrica.
* Calculadora interactiva de costos, márgenes y fijación de precios recomendados.