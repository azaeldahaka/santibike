import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://santibike.vercel.app"),
  title: {
    default: "Bicicletería SantyBike | Preventa Oficial Remera Técnica 2026",
    template: "%s | Bicicletería SantyBike",
  },
  description: "Preventa exclusiva del merchandising oficial de Bicicletería SantyBike (B° Limache, Salta). Asegurá tu remera técnica edición limitada con el 50% de seña.",
  applicationName: "Bicicletería SantyBike",
  authors: [{ name: "Bicicletería SantyBike", url: "https://santibike.vercel.app" }],
  creator: "Bicicletería SantyBike",
  publisher: "Bicicletería SantyBike",
  keywords: [
    "SantyBike",
    "Bicicletería SantyBike",
    "Remera Ciclismo Salta",
    "Preventa Oficial",
    "Merchandising SantyBike",
    "Remera Técnica Ciclismo",
    "Barrio Limache Salta",
    "Ciclismo Salta",
  ],
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://santibike.vercel.app",
    siteName: "Bicicletería SantyBike",
    title: "Bicicletería SantyBike | Preventa Oficial Remera Técnica 2026",
    description: "Asegurá tu remera técnica edición limitada con el 50% de seña. Retiro exclusivo en el local oficial de Bicicletería SantyBike (B° Limache, Salta).",
    images: [
      {
        url: "/images/og-santybike.jpg",
        width: 1200,
        height: 630,
        alt: "Bicicletería SantyBike - Preventa Oficial Remera Técnica",
        type: "image/jpeg",
      },
      {
        url: "/images/products/remera-negra-frente.jpg",
        width: 1200,
        height: 1600,
        alt: "Remera Técnica Oficial SantyBike Negra",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bicicletería SantyBike | Preventa Oficial Remera Técnica 2026",
    description: "Asegurá tu remera técnica de SantyBike con el 50% de seña. Retiro en local oficial (B° Limache, Salta).",
    images: ["/images/og-santybike.jpg"],
    creator: "@santybike",
  },
  alternates: {
    canonical: "https://santibike.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090a0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Remera Técnica Oficial Bicicletería SantyBike 2026",
    image: "https://santibike.vercel.app/images/og-santybike.jpg",
    description: "Remera técnica de ciclismo oficial edición limitada de Bicicletería SantyBike en Salta Capital. Confeccionada en algodón peinado 24/1 premium.",
    brand: {
      "@type": "Brand",
      name: "SantyBike",
    },
    offers: {
      "@type": "Offer",
      url: "https://santibike.vercel.app",
      priceCurrency: "ARS",
      price: "32000",
      availability: "https://schema.org/PreOrder",
      priceValidUntil: "2026-10-31",
      seller: {
        "@type": "BikeStore",
        name: "Bicicletería SantyBike",
        telephone: "+5493876048120",
        address: {
          "@type": "PostalAddress",
          streetAddress: "B° Limache",
          addressLocality: "Salta Capital",
          addressRegion: "Salta",
          addressCountry: "AR",
        },
      },
    },
  };

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090a0d] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
