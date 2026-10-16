'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveStoredOrders } from '@/lib/storage';
import { INITIAL_ORDERS } from '@/data/mockData';
import {
  WORST_CASE_ORDERS,
  EMPTY_ORDERS,
  SINGLE_ORDER,
  generateHugeOrders,
} from '@/data/worstCaseData';

export type FixtureMode = 'demo' | 'worst' | 'empty' | 'one' | 'huge';

interface DevDataToggleProps {
  currentMode?: FixtureMode;
  onModeChange?: (mode: FixtureMode) => void;
}

export function DevDataToggle({ currentMode, onModeChange }: DevDataToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMode = (searchParams.get('data') as FixtureMode) || 'demo';
  const [activeMode, setActiveMode] = useState<FixtureMode>(currentMode || urlMode);

  useEffect(() => {
    const mode = (searchParams.get('data') as FixtureMode) || 'demo';
    setActiveMode(mode);
  }, [searchParams]);

  const handleSelect = (mode: FixtureMode) => {
    setActiveMode(mode);

    // Apply dataset to storage
    switch (mode) {
      case 'worst':
        saveStoredOrders(WORST_CASE_ORDERS);
        break;
      case 'empty':
        saveStoredOrders(EMPTY_ORDERS);
        break;
      case 'one':
        saveStoredOrders(SINGLE_ORDER);
        break;
      case 'huge':
        saveStoredOrders(generateHugeOrders(1000));
        break;
      case 'demo':
      default:
        saveStoredOrders(INITIAL_ORDERS);
        break;
    }

    if (onModeChange) {
      onModeChange(mode);
    }

    // Persist to URL parameter without full reload
    const params = new URLSearchParams(window.location.search);
    if (mode === 'demo') {
      params.delete('data');
    } else {
      params.set('data', mode);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    // Dispatch custom event so listeners know data changed
    window.dispatchEvent(new Event('santybike_fixture_change'));
  };

  const options: { label: string; mode: FixtureMode }[] = [
    { label: 'Demo', mode: 'demo' },
    { label: 'Worst case', mode: 'worst' },
    { label: 'Empty', mode: 'empty' },
    { label: 'One', mode: 'one' },
    { label: '1,000 rows', mode: 'huge' },
  ];

  return (
    <aside
      aria-label="Selector de datos de prueba (Solo desarrollo)"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto shadow-2xl"
    >
      <div className="flex items-center gap-1 p-1 bg-neutral-900/95 border border-neutral-700/80 rounded-full text-xs font-sans backdrop-blur-md">
        <span className="pl-3 pr-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 select-none hidden sm:inline">
          Data:
        </span>
        {options.map(({ label, mode }) => {
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleSelect(mode)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer select-none ${
                isActive
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
