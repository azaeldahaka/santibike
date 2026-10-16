'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductColor, ProductImage } from '@/types';
import { PRODUCT_IMAGES } from '@/data/mockData';
import { Eye, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  selectedColor: ProductColor;
}

export function ProductGallery({ selectedColor }: ProductGalleryProps) {
  // Filter images relevant to current color + general details
  const filteredImages = PRODUCT_IMAGES.filter(
    (img) => !img.color || img.color === selectedColor
  );

  const [activeImage, setActiveImage] = useState<ProductImage>(filteredImages[0]);

  // When selectedColor changes, switch to the first matching image of that color
  useEffect(() => {
    const defaultForColor = PRODUCT_IMAGES.find((img) => img.color === selectedColor);
    if (defaultForColor) {
      setActiveImage(defaultForColor);
    }
  }, [selectedColor]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#11141a] border border-white/[0.08] group shadow-2xl">
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Active image title badge */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeImage.title}</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-slate-300 border border-white/10">
            {selectedColor === 'negro' ? 'Negro Obsidiana' : 'Gris Melange'}
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {filteredImages.map((img) => {
          const isSelected = activeImage.id === img.id;
          return (
            <button
              key={img.id}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 scale-[1.03] shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                  : 'border-white/[0.08] hover:border-white/30 opacity-70 hover:opacity-100'
              }`}
              title={img.title}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
