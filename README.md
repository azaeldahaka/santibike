# 🚴‍♂️ SantyBike Merch — E-commerce & Preventa Oficial (MVP)

Plataforma de comercio electrónico **Mobile-First** diseñada para la venta y preventa con seña previa del merchandising oficial de la bicicletería **SantyBike Bicycles**.

---

## 🌟 Características Principales

### 🛍️ Storefront (Experiencia del Cliente)
- **Modelo de Preventa con Seña (50%):** El cliente abona el 50% para asegurar la confección de su prenda y salda el restante al retirar en el local o antes del despacho.
- **Selector de Colores y Talles:** Cambio en tiempo real entre *Negro Obsidiana* y *Gris Melange*, con talles de `S` a `XXL`.
- **Galería Interactiva en Alta Definición:** Fotografías reales de frente, dorso con sponsors oficiales (*SRAM, SARS, AWA, WKNS, SHIMANO*) y detalles en macro.
- **Modal con Guía de Talles:** Medidas exactas en centímetros (ancho de axila a axila y largo total) con consejos de medición.
- **Checkout Dinámico:**
  - Integración simulada y lista para producción con **Mercado Pago**.
  - Opción de **Transferencia Bancaria Directa** con copia de Alias/CBU en un toque y subida de comprobante.
- **Confirmación con Confeti y Redirección a WhatsApp:** Genera automáticamente el mensaje detallado para enviar a la bicicletería con un clic.
- **Sticky Bottom Bar Mobile:** Barra flotante inferior para una experiencia nativa en smartphones.

### 📊 Panel de Administración & Finanzas (`/admin`)
- **Métricas Financieras en Tiempo Real:** Total de señas recaudadas, saldo pendiente por cobrar contra entrega y ganancia neta proyectada.
- **Consolidado de Talles para el Taller:** Matriz exacta de cantidades por talle y color, con botón de un toque para copiar la orden de pedido y enviarla por WhatsApp al taller de estampado.
- **Calculadora Interactiva de Unit Economics:**
  - Ajuste de costo de prenda lisa, estampado, packaging y comisiones de pasarela.
  - Cálculo instantáneo del precio de venta sugerido y margen de rentabilidad neta.
- **Gestión de Órdenes:** Filtro por estado (*Pendiente de Seña*, *Seña Pagada*, *En Producción*, *Listo para Retirar*, *Entregado*), buscador por cliente o código y notificación directa por WhatsApp.

---

## 📁 Estructura del Proyecto

```text
├── assets/                  # Fotos y recursos originales categorizados
│   ├── branding/            # Logos oficiales e insignias
│   ├── products/            # Fotos de remeras (negra y gris)
│   └── samples/             # Muestras
├── public/
│   └── images/              # Imágenes optimizadas para la web (rotadas y comprimidas)
│       ├── products/
│       └── details/
├── src/
│   ├── app/
│   │   ├── admin/           # Dashboard financiero y de producción
│   │   ├── globals.css      # Estilos Tailwind v4 y modo oscuro ciclismo
│   │   ├── layout.tsx       # Layout raíz con metadata OpenGraph y viewport
│   │   └── page.tsx         # Storefront principal
│   ├── components/          # Componentes modulares (Navbar, Hero, Gallery, etc.)
│   ├── data/                # Mock data, configuración de tienda y guía de talles
│   ├── lib/                 # Helpers de persistencia en localStorage y formato ARS
│   └── types/               # Tipos TypeScript para órdenes, finanzas y productos
```

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador:
# Tienda: http://localhost:3000
# Panel Admin: http://localhost:3000/admin
```

---

## ☁️ Despliegue en Vercel

El proyecto está 100% optimizado para desplegar en **Vercel**:

1. Subir el repositorio a GitHub:
   ```bash
   git add .
   git commit -m "feat: MVP SantyBike E-commerce listo para presentación"
   git remote add origin https://github.com/TU_USUARIO/santibike-ecommerce.git
   git push -u origin master
   ```
2. En [vercel.com](https://vercel.com):
   - Importar el repositorio de GitHub.
   - Framework Preset: **Next.js**.
   - Hacer clic en **Deploy**. ¡Listo en menos de 2 minutos!
