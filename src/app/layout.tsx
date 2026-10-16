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
  title: "SantyBike Merch | Preventa Oficial Remera Técnica Edición Limitada",
  description: "Preventa exclusiva del merchandising oficial de Bicicletería SantyBike. Asegurá tu remera con el 50% de seña y saldo contra entrega.",
  keywords: ["SantyBike", "Bicicletería SantyBike", "Remera Ciclismo", "Preventa", "Merchandising Oficial", "Salta"],
  openGraph: {
    title: "SantyBike Merch | Preventa Oficial Remera Técnica",
    description: "Asegurá tu remera técnica edición limitada de SantyBike con un 50% de seña.",
    images: [{ url: "/images/products/remera-negra-frente.jpg" }],
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
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#090a0d] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
