'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PhotoEditModal from '@/components/PhotoEditModal';

type LineItem = {
  id: string;
  title: string;
  subtitle: string;
  metaLeft: string;
  metaMid: string;
  metaRight: string;
  price: number;
  image: string;
};

type StepBarSectionProps = {
  onSelectedCountChange?: (count: number) => void;
  onNextStep?: () => void;
};

export default function StepBarSection({ onSelectedCountChange, onNextStep }: StepBarSectionProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadSeedRef = useRef(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  // Her item için "ilk orijinal" görseli saklıyoruz; save sonrası değişse bile Undo hep buraya dönecek.
  const originalImagesByIdRef = useRef<Record<string, string>>({});
  const sizes = useMemo(() => ['5x7', '6x6', '6x8', '8x8', '8x10'] as const, []);
  const sizePreviewClass = useMemo(() => {
    const base =
      'rounded-xl border border-dashed text-[12px] font-semibold tracking-tight transition-all duration-200 flex items-center justify-center flex-shrink-0 px-1.5 w-10 sm:w-11 md:w-12 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]';
    return {
      // Genişlik sabit; yükseklik oranla değişsin (screenshot'taki gibi)
      '5x7': `${base} aspect-[5/7]`,
      '6x6': `${base} aspect-square`,
      '6x8': `${base} aspect-[6/8]`,
      '8x8': `${base} aspect-square`,
      '8x10': `${base} aspect-[8/10]`,
    } as const;
  }, []);
  const [items, setItems] = useState<LineItem[]>(() => [
      {
        id: 'p1',
        title: '4×6 Print',
        subtitle: 'Photo Print',
        metaLeft: '1–2 yr',
        metaMid: 'Girl',
        metaRight: 'Ready in 1 hour',
        price: 0.7,
        image: '/photo-1.png',
      },
      {
        id: 'p2',
        title: 'Retro 4×6',
        subtitle: 'Photo Print',
        metaLeft: '1–2 yr',
        metaMid: 'Girl',
        metaRight: 'Ready in 1 hour',
        price: 0.99,
        image: '/photo-2.png',
      },
      {
        id: 'p3',
        title: '8×10 Print',
        subtitle: 'Photo Print',
        metaLeft: '1–2 yr',
        metaMid: 'Girl',
        metaRight: 'Ready in 1 hour',
        price: 6.99,
        image: '/photo-3.png',
      },
    ]);

  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    items.reduce((acc, it, idx) => {
      acc[it.id] = idx === 0;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const [qty, setQty] = useState<Record<string, number>>(() =>
    items.reduce((acc, it) => {
      acc[it.id] = 1;
      return acc;
    }, {} as Record<string, number>)
  );
  const [sizeByItem, setSizeByItem] = useState<Record<string, (typeof sizes)[number]>>(() =>
    items.reduce((acc, it) => {
      acc[it.id] = sizes[0];
      return acc;
    }, {} as Record<string, (typeof sizes)[number]>)
  );

  // Orijinal görselleri ilk defa gördüğümüz anda kaydet.
  useEffect(() => {
    const ids = new Set(items.map((it) => it.id));
    for (const it of items) {
      if (!originalImagesByIdRef.current[it.id]) {
        originalImagesByIdRef.current[it.id] = it.image;
      }
    }
    // Kullanılmayan id'leri temizle (hafıza disiplini).
    for (const id of Object.keys(originalImagesByIdRef.current)) {
      if (!ids.has(id)) delete originalImagesByIdRef.current[id];
    }
  }, [items]);

  const getSizedTitle = (title: string, id: string) => {
    const chosen = sizeByItem[id];
    if (!chosen) return title;
    // Replace the first "NxM" / "N×M" occurrence in the title.
    const next = title.replace(/\d+\s*[×x]\s*\d+/, chosen);
    return next === title ? title : next;
  };

  const updateQty = (id: string, delta: number) => {
    setQty(prev => {
      const next = Math.max(1, (prev[id] ?? 1) + delta);
      return { ...prev, [id]: next };
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
    setSelected(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setQty(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setSizeByItem(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const openEditor = (id: string) => {
    setEditTargetId(id);
    setEditOpen(true);
  };

  // UI-only phase: real save/apply will be wired during editor integration.

  const simulateAddPhotos = (count: number) => {
    if (count <= 0) return;
    const pool = ['/photo-1.png', '/photo-2.png', '/photo-3.png', '/photo-4.png', '/photo-5.png', '/photo-6.png'] as const;
    const now = Date.now();

    const newItems: LineItem[] = Array.from({ length: count }).map((_, i) => {
      const n = (uploadSeedRef.current += 1);
      const id = `u-${now}-${n}`;
      const image = pool[(now + i) % pool.length]!;
      return {
        id,
        title: '4×6 Print',
        subtitle: 'Photo Print',
        metaLeft: 'New',
        metaMid: 'Photo',
        metaRight: 'Ready in 1 hour',
        price: 0.7,
        image,
      };
    });

    // Prepend so the newest shows in the first 3 cards.
    setItems(prev => [...newItems, ...prev]);
    setSelected(prev => {
      const next = { ...prev };
      for (const it of newItems) next[it.id] = true;
      return next;
    });
    setQty(prev => {
      const next = { ...prev };
      for (const it of newItems) next[it.id] = 1;
      return next;
    });
    setSizeByItem(prev => {
      const next = { ...prev };
      for (const it of newItems) next[it.id] = sizes[0];
      return next;
    });
  };

  useEffect(() => {
    if (!onSelectedCountChange) return;
    onSelectedCountChange(items.length);
  }, [items.length, onSelectedCountChange]);

  // selectedCount is lifted via onSelectedCountChange

  return (
    <>
      <section id="upload" className="w-full bg-white py-4 sm:py-6">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[32px] border border-gray-200 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
            style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
          >
            <div className="mx-auto max-w-[1320px]">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold tracking-tight text-gray-950">Size & quantity</h3>
                <p className="mt-2 text-gray-500">
                  Pick the perfect print size for each photo and adjust quantities before continuing.
                </p>
              </div>
              <div className="mb-6 mx-auto max-w-[1320px]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
                {items.map((it) => (
                  <div
                    key={`card-${it.id}`}
                    className="w-full rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="relative bg-gray-50">
                      <div className="px-5 pt-5">
                        <div className="relative mx-auto h-[150px] w-[150px] sm:h-[170px] sm:w-[170px] rounded-[24px] bg-white shadow-[0_24px_60px_-38px_rgba(0,0,0,0.42)] ring-1 ring-gray-200 overflow-hidden">
                          <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditor(it.id)}
                        className="absolute left-5 top-5 h-11 w-11 rounded-full bg-white shadow-lg ring-1 ring-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                        aria-label="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        className="absolute right-5 top-5 h-11 w-11 rounded-full bg-white shadow-lg ring-1 ring-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                        aria-label="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>

                    <div className="px-5 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="min-w-0 text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
                          {getSizedTitle(it.title.replace('×', 'x'), it.id)}
                        </p>
                        <div className="flex items-center ring-1 ring-gray-200 rounded-full flex-shrink-0 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQty(it.id, -1)}
                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors rounded-l-full"
                            aria-label="Decrease quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-7 text-center">
                            {qty[it.id] ?? 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(it.id, 1)}
                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors rounded-r-full"
                            aria-label="Increase quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14" /><path d="M12 5v14" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap items-end gap-2">
                          {sizes.map((s) => {
                            const isActive = (sizeByItem[it.id] ?? sizes[0]) === s;
                            return (
                              <button
                                key={`${it.id}-${s}`}
                                type="button"
                                onClick={() => setSizeByItem((prev) => ({ ...prev, [it.id]: s }))}
                                className={`${sizePreviewClass[s]} ${
                                  isActive
                                    ? 'border-red-400 text-red-600 bg-red-100 shadow-[0_18px_44px_-30px_rgba(239,68,68,0.45)]'
                                    : 'border-red-200/80 bg-white text-red-400 hover:border-red-300 hover:text-red-500 hover:shadow-[0_14px_34px_-26px_rgba(0,0,0,0.38)]'
                                }`}
                                aria-pressed={isActive}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="w-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 shadow-sm overflow-hidden">
                  <div className="relative px-5 pt-5 pb-6">
                    <div className="relative mx-auto h-[170px] w-[170px]">
                      <div
                        className="absolute -rotate-[18deg] rounded-2xl border-2 border-gray-200 bg-white p-[3px] shadow-md w-[150px] h-[150px] left-0 top-2"
                        aria-hidden
                      >
                        <div className="h-full w-full rounded-[18px] bg-gray-50/95" />
                      </div>
                      <div
                        className="absolute rotate-[18deg] rounded-2xl border-2 border-gray-200 bg-white p-[3px] shadow-md w-[150px] h-[150px] right-0 top-2"
                        aria-hidden
                      >
                        <div className="h-full w-full rounded-[18px] bg-gray-50/95" />
                      </div>

                      <button
                        type="button"
                        onClick={() => uploadInputRef.current?.click()}
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-2xl border-2 border-gray-200 bg-white p-[3px] shadow-md w-[150px] h-[150px] transition-transform duration-300 ease-out hover:-translate-y-1"
                        aria-label="Upload photos"
                      >
                        <div className="h-full w-full rounded-[18px] bg-gray-50/95 flex flex-col items-center justify-center">
                          <div
                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-inner"
                            style={{ background: 'linear-gradient(to bottom, #FF8C5F, #E91E63)' }}
                            aria-hidden
                          >
                            <span className="text-3xl font-bold leading-none">+</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-700 leading-tight">
                            <span className="block">Add</span>
                            <span className="block">photos</span>
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="mt-6 flex flex-col items-center text-center gap-2">
                      <p className="text-xl font-bold text-gray-900 sm:text-2xl">Drag and drop photos</p>
                      <p className="flex flex-wrap items-center justify-center gap-2 text-base text-gray-600 sm:text-lg">
                        <span>Or</span>
                        <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-all duration-300">
                          Import a Photo
                        </span>
                        <span>From My Device</span>
                      </p>
                    </div>

                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        const fileCount = e.currentTarget.files?.length ?? 0;
                        simulateAddPhotos(fileCount);
                        // allow selecting same file again
                        e.currentTarget.value = '';
                      }}
                    />
                  </div>
                </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <button
                  type="button"
                  onClick={onNextStep}
                  disabled={!onNextStep || items.length === 0}
                  className="w-full sm:w-[320px] h-11 flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next step"
                >
                  <span>Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PhotoEditModal
        open={editOpen}
        title={(editTargetId ? items.find((x) => x.id === editTargetId)?.title : '') ?? 'Photo'}
        imageSrc={(editTargetId ? items.find((x) => x.id === editTargetId)?.image : '') ?? '/photo-1.png'}
        originalImageSrc={
          (editTargetId ? originalImagesByIdRef.current[editTargetId] : undefined) ??
          (editTargetId ? items.find((x) => x.id === editTargetId)?.image : undefined)
        }
        canvasSize={(editTargetId ? sizeByItem[editTargetId] : undefined) ?? sizes[0]}
        onSave={(nextImageSrc) => {
          if (!editTargetId) return;
          setItems((prev) => prev.map((it) => (it.id === editTargetId ? { ...it, image: nextImageSrc } : it)));
        }}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}