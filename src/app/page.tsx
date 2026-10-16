'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductConfigurator } from '@/components/ProductConfigurator';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { CancellationPolicyModal } from '@/components/CancellationPolicyModal';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { Footer } from '@/components/Footer';
import { CampaignDates, Order, ProductColor, ProductSize } from '@/types';
import {
  addOrder,
  getStoredCosts,
  fetchLiveCosts,
  getStoredCampaignDates,
  fetchLiveCampaignDates,
} from '@/lib/storage';
import {
  CreditCard,
  PackageCheck,
  Sparkles,
  Store,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Navigation,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { STORE_CONFIG } from '@/data/mockData';

export default function StorefrontPage() {
  const [selectedColor, setSelectedColor] = useState<ProductColor>('negro');
  const [selectedSize, setSelectedSize] = useState<ProductSize>('L');
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState<number>(STORE_CONFIG.basePrice);
  const [campaignDates, setCampaignDates] = useState<CampaignDates>(getStoredCampaignDates());

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const productSectionRef = useRef<HTMLDivElement>(null);

  // Sync live price & campaign dates from Supabase / localStorage so changes in /admin reflect immediately for customers
  useEffect(() => {
    const cached = getStoredCosts();
    if (cached?.salePrice) {
      setCurrentPrice(cached.salePrice);
    }
    fetchLiveCosts().then((live) => {
      if (live?.salePrice) {
        setCurrentPrice(live.salePrice);
      }
    });

    const cachedDates = getStoredCampaignDates();
    if (cachedDates) {
      setCampaignDates(cachedDates);
    }
    fetchLiveCampaignDates().then((liveDates) => {
      if (liveDates) {
        setCampaignDates(liveDates);
      }
    });

    const handleCampaignChange = () => {
      setCampaignDates(getStoredCampaignDates());
    };
    window.addEventListener('santybike_campaign_change', handleCampaignChange);
    return () => {
      window.removeEventListener('santybike_campaign_change', handleCampaignChange);
    };
  }, []);

  const handleScrollToProduct = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderSuccess = (newOrder: Order) => {
    // Persist to storage for admin dashboard
    addOrder(newOrder);
    setIsCheckoutOpen(false);
    setCompletedOrder(newOrder);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0d] text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <Hero
          onScrollToProduct={handleScrollToProduct}
          campaignDates={campaignDates}
        />

        {/* Product Section */}
        <section
          ref={productSectionRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7">
              <ProductGallery selectedColor={selectedColor} />
            </div>

            {/* Configurator & Purchase Breakdown Column (5 cols) */}
            <div className="lg:col-span-5 bg-[#0e1117] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl">
              <ProductConfigurator
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                currentPrice={currentPrice}
                campaignDates={campaignDates}
              />
            </div>
          </div>
        </section>

        {/* How Pre-orders Work Explainer (3 Simple Steps) */}
        <section className="border-y border-white/[0.06] bg-[#0c0e14] py-14 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Transparencia Total
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white mt-3 uppercase tracking-tight">
                ¿Cómo funciona la Preventa de SantyBike?
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Un modelo justo y transparente: asegurás tu talle sin sobrecostos de producción ni riesgo de stock.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative group hover:border-emerald-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg mb-4">
                  01
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Elegí tu Color y Talle</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consultá nuestra guía de medidas exactas en centímetros (S a XXL) y seleccioná la combinación que prefieras (Negro o Gris).
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative group hover:border-emerald-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg mb-4">
                  02
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Abonás el 50% de Seña</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Podés pagar con tarjeta/saldo en Mercado Pago o vía Transferencia Bancaria (Alias/CBU). Recibís tu código de reserva único inmediatamente.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative group hover:border-emerald-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg mb-4">
                  03
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Retirás y Saldás el Resto</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cuando la tanda finalice su producción ({campaignDates.estimatedPickupDate} tras el cierre del {campaignDates.preorderEndDateFormatted}), te avisamos por WhatsApp para retirar en el local abonando el 50% restante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Local & Google Maps Section */}
        <section className="py-14 sm:py-20 border-t border-white/[0.06] bg-[#090a0d]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Store details */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Punto de Retiro Oficial
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-3 uppercase tracking-tight">
                    {STORE_CONFIG.storeName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    Vení a conocer el taller y retirás tu remera en persona. Nos encontramos en Salta Capital con atención personalizada.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Dirección:</p>
                      <p className="text-slate-300 mt-0.5">{STORE_CONFIG.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Horarios de Atención:</p>
                      <p className="text-slate-300 mt-0.5">{STORE_CONFIG.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={STORE_CONFIG.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1] hover:border-emerald-500/50 shadow-lg transition-all"
                  >
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span>Cómo llegar en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Right Column: Embedded Google Maps */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#11141a]">
                  <iframe
                    title="Ubicación Bicicletería SantyBike en Google Maps"
                    src={STORE_CONFIG.mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale-[15%] contrast-[1.05]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
        onSuccess={handleOrderSuccess}
        currentPrice={currentPrice}
        onOpenPolicy={() => setIsPolicyOpen(true)}
      />

      <CancellationPolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        campaignDates={campaignDates}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Sticky Bottom Bar for Mobile Viewports */}
      <MobileStickyBar
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        currentPrice={currentPrice}
      />

      <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
    </div>
  );
}
