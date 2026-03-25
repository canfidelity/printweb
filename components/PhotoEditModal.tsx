'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type PhotoEditModalProps = {
  open: boolean;
  title: string;
  imageSrc: string;
  // Modal içinde yapılan Undo işlemleri için parent'ın sakladığı "ilk orijinal" referansı.
  originalImageSrc?: string;
  canvasSize?: string;
  onSave?: (nextImageSrc: string) => void;
  onClose: () => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseCanvasSize(canvasSize?: string) {
  if (!canvasSize) return null;
  const m = String(canvasSize).match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  return { w, h } as const;
}

export default function PhotoEditModal({ open, title, imageSrc, originalImageSrc, canvasSize, onSave, onClose }: PhotoEditModalProps) {
  // UI-only (Phase 1): keep a minimal, centered preview.
  // Controls (crop/rotate/filters) will be reintroduced with real editor integration.
  const [activeTool, setActiveTool] = useState<
    null | 'adjust' | 'crop' | 'zoom' | 'fit' | 'filter' | 'text'
  >(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [rotation] = useState(0);
  const [flipX] = useState(false);
  const [flipY] = useState(false);
  const [brightness] = useState(100);
  const [contrast] = useState(100);
  const [saturation] = useState(100);
  const [filterPreset, setFilterPreset] = useState<
    'normal' | 'black' | 'gray' | 'blue' | 'red' | 'pink' | 'cyan' | 'peach'
  >('normal');

  const showAdjustZoom = activeTool === 'adjust';
  const zoomMin = 1;
  const zoomMax = 2.5;

  const dragRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    rect: DOMRect | null;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    rect: null,
  });

  const canvas = useMemo(() => parseCanvasSize(canvasSize), [canvasSize]);
  const canvasAspectRatio = useMemo(() => {
    if (!canvas) return '16 / 10';
    return `${canvas.w} / ${canvas.h}`;
  }, [canvas]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // UI-only: preview is CSS-driven (no real export yet).
  const previewStyle = useMemo(() => {
    const r = ((rotation % 360) + 360) % 360;
    const transform = [
      `translateZ(0)`,
      `scale(${clamp(zoom, 1, 2.5)})`,
      `rotate(${r}deg)`,
      flipX ? 'scaleX(-1)' : '',
      flipY ? 'scaleY(-1)' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const presetFilter =
      filterPreset === 'black'
        ? 'grayscale(1) contrast(1.25) brightness(0.92)'
        : filterPreset === 'gray'
          ? 'grayscale(0.75) contrast(1.08) brightness(0.98)'
          : filterPreset === 'blue'
            ? 'sepia(0.6) saturate(1.6) hue-rotate(190deg) brightness(1.03)'
            : filterPreset === 'red'
              ? 'sepia(0.7) saturate(1.8) hue-rotate(-35deg) brightness(1.02)'
              : filterPreset === 'pink'
                ? 'sepia(0.7) saturate(1.8) hue-rotate(320deg) brightness(1.03)'
                : filterPreset === 'cyan'
                  ? 'sepia(0.6) saturate(1.6) hue-rotate(90deg) brightness(1.03)'
                  : filterPreset === 'peach'
                    ? 'sepia(1) saturate(1.35) hue-rotate(-10deg) brightness(1.02)'
                    : '';

    const baseFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    const filter = presetFilter ? `${presetFilter} ${baseFilter}` : baseFilter;

    return { transform, filter } as const;
  }, [brightness, contrast, filterPreset, flipX, flipY, rotation, saturation, zoom]);

  const panStyle = useMemo(() => {
    return { transform: `translate(${panX}px, ${panY}px)` } as const;
  }, [panX, panY]);

  useEffect(() => {
    // Pan yalnızca Adjust modunda değiştiriliyor; Crop modundayken de görselin oturmuş halini bozmuyoruz.
    if (activeTool === 'adjust' || activeTool === 'crop') return;
    setIsPanning(false);
    setPanX(0);
    setPanY(0);
  }, [activeTool]);

  type CropRect = { x: number; y: number; w: number; h: number };
  type CropHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [cropMode, setCropMode] = useState<'idle' | 'create' | 'move' | 'resize'>('idle');
  const [cropHandle, setCropHandle] = useState<CropHandle | null>(null);
  const [cropFrameSize, setCropFrameSize] = useState<{ w: number; h: number } | null>(null);

  const cropAspect = useMemo(() => {
    if (!canvas) return 16 / 10;
    return canvas.w / canvas.h;
  }, [canvas]);

  const MIN_CROP_SIZE = 36; // px

  const cropClipPath = useMemo(() => {
    if (!cropRect || !cropFrameSize) return null;
    const left = cropRect.x;
    const top = cropRect.y;
    const right = cropFrameSize.w - (cropRect.x + cropRect.w);
    const bottom = cropFrameSize.h - (cropRect.y + cropRect.h);
    return `inset(${top}px ${right}px ${bottom}px ${left}px round 2px)`;
  }, [cropFrameSize, cropRect]);

  const frameRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const originalImageSrcRef = useRef<string>(originalImageSrc ?? imageSrc);
  const [hasAppliedEdits, setHasAppliedEdits] = useState(false);

  const resetEditsToOriginal = () => {
    setActiveTool(null);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setIsPanning(false);
    setFilterPreset('normal');
    setCropRect(null);
    setCropMode('idle');
    setCropHandle(null);
    setCropFrameSize(null);
  };

  useEffect(() => {
    if (!open) return;

    // Parent'tan gelen "ilk orijinal" referansını baz alıyoruz.
    // Parent save sonrası imageSrc güncellesey bile Undo hep bu referansa döner.
    originalImageSrcRef.current = originalImageSrc ?? imageSrc;

    // UI'ı her open anında temizle.
    resetEditsToOriginal();
    setHasAppliedEdits(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const hasUiEdits =
    activeTool !== null ||
    Math.abs(zoom - 1) > 0.0001 ||
    panX !== 0 ||
    panY !== 0 ||
    cropRect !== null ||
    filterPreset !== 'normal';

  const original = originalImageSrcRef.current;
  const parentDiffersFromOriginal = original && imageSrc !== original;
  const undoDisabled = isSaving || !original || (!parentDiffersFromOriginal && !hasAppliedEdits && !hasUiEdits);

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      // Helps avoid tainting the canvas when possible.
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const renderEditedImageToDataUrl = async () => {
    if (!frameRef.current) return null;
    const rect = frameRef.current.getBoundingClientRect();
    const frameW = Math.max(1, Math.round(rect.width));
    const frameH = Math.max(1, Math.round(rect.height));

    const crop = cropRect;
    const outW = crop ? Math.max(1, Math.round(crop.w)) : frameW;
    const outH = crop ? Math.max(1, Math.round(crop.h)) : frameH;

    const img = await loadImage(imageSrc);
    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;
    if (!srcW || !srcH) return null;

    // Replicate CSS object-fit: cover sizing.
    const coverScale = Math.max(frameW / srcW, frameH / srcH);
    const zoomScale = clamp(zoom, zoomMin, zoomMax);
    const totalScale = coverScale * zoomScale;

    const scaledW = srcW * totalScale;
    const scaledH = srcH * totalScale;

    // Image top-left in frame coordinates when transform-origin is center.
    const dx = frameW / 2 - scaledW / 2 + panX;
    const dy = frameH / 2 - scaledH / 2 + panY;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(outW * dpr);
    canvas.height = Math.round(outH * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.filter = previewStyle.filter;
    ctx.clearRect(0, 0, outW, outH);

    // If cropping, shift the frame coordinate system so cropRect maps to (0,0).
    if (crop) {
      ctx.translate(-crop.x, -crop.y);
    }

    ctx.drawImage(img, dx, dy, scaledW, scaledH);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const next = await renderEditedImageToDataUrl();
      if (next) {
        setHasAppliedEdits(true);
        onSave?.(next);
      }
    } catch (e) {
      // Keep UI stable; user can retry.
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (isSaving) return;

    resetEditsToOriginal();
    setHasAppliedEdits(false);

    const originalNow = originalImageSrcRef.current;
    // Sadece parent görseli "orijinal"den sapmışsa geri yazıyoruz.
    // Böylece save yapmadıysan (parent imageSrc aynıysa) Undo sadece UI state'ini sıfırlar.
    if (originalNow && imageSrc !== originalNow) {
      onSave?.(originalNow);
    }
  };

  const cropDragRef = useRef<{
    pointerId: number | null;
    startPointerX: number;
    startPointerY: number;
    startRect: CropRect | null;
    startX: number;
    startY: number;
    frameW: number;
    frameH: number;
    mode: 'idle' | 'create' | 'move' | 'resize';
    activeHandle: CropHandle | null;
  }>({
    pointerId: null,
    startPointerX: 0,
    startPointerY: 0,
    startRect: null,
    startX: 0,
    startY: 0,
    frameW: 1,
    frameH: 1,
    mode: 'idle',
    activeHandle: null,
  });

  const getLocalPoint = (clientX: number, clientY: number, rect: DOMRect) => {
    return {
      x: clamp(clientX - rect.left, 0, rect.width),
      y: clamp(clientY - rect.top, 0, rect.height),
    };
  };

  const ensureMinAndAspectSize = (w: number, h: number, frameW: number, frameH: number) => {
    const aspect = cropAspect;
    let nextW = w;
    let nextH = h;

    // Keep aspect ratio (width = height * aspect)
    if (nextH > 0) nextW = nextH * aspect;
    else if (nextW > 0) nextH = nextW / aspect;

    // Min size
    if (Math.min(nextW, nextH) < MIN_CROP_SIZE) {
      if (nextW >= nextH) nextW = Math.max(nextW, MIN_CROP_SIZE);
      else nextH = Math.max(nextH, MIN_CROP_SIZE);
      nextH = nextW / aspect;
    }

    // Fit inside frame
    if (nextW > frameW) {
      nextW = frameW;
      nextH = nextW / aspect;
    }
    if (nextH > frameH) {
      nextH = frameH;
      nextW = nextH * aspect;
    }

    return { w: nextW, h: nextH };
  };

  const clampRectToFrame = (rect: CropRect, frameW: number, frameH: number) => {
    const w = Math.min(rect.w, frameW);
    const h = Math.min(rect.h, frameH);
    const x = clamp(rect.x, 0, Math.max(0, frameW - w));
    const y = clamp(rect.y, 0, Math.max(0, frameH - h));
    return { x, y, w, h };
  };

  const computeRectFromCreateDrag = (sx: number, sy: number, cx: number, cy: number, frameW: number, frameH: number) => {
    const dx = cx - sx;
    const dy = cy - sy;

    let w = Math.abs(dx);
    let h = Math.abs(dy);

    // Min sizes (free aspect)
    w = Math.max(MIN_CROP_SIZE, w);
    h = Math.max(MIN_CROP_SIZE, h);

    // Clamp size to frame
    w = Math.min(w, frameW);
    h = Math.min(h, frameH);

    const x = dx >= 0 ? sx : sx - w;
    const y = dy >= 0 ? sy : sy - h;

    return clampRectToFrame({ x, y, w, h }, frameW, frameH);
  };

  const detectHandle = (p: { x: number; y: number }, rect: CropRect) => {
    const threshold = 14;
    const left = rect.x;
    const right = rect.x + rect.w;
    const top = rect.y;
    const bottom = rect.y + rect.h;

    const onLeft = Math.abs(p.x - left) <= threshold;
    const onRight = Math.abs(p.x - right) <= threshold;
    const onTop = Math.abs(p.y - top) <= threshold;
    const onBottom = Math.abs(p.y - bottom) <= threshold;

    if (onLeft && onTop) return 'nw' as const;
    if (onRight && onTop) return 'ne' as const;
    if (onLeft && onBottom) return 'sw' as const;
    if (onRight && onBottom) return 'se' as const;
    if (onLeft) return 'w' as const;
    if (onRight) return 'e' as const;
    if (onTop) return 'n' as const;
    if (onBottom) return 's' as const;
    return null;
  };

  const pointInRect = (p: { x: number; y: number }, rect: CropRect) => {
    return p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
  };

  const computeRectFromResize = (
    handle: CropHandle,
    start: CropRect,
    cx: number,
    cy: number,
    frameW: number,
    frameH: number
  ): CropRect => {
    const minW = MIN_CROP_SIZE;
    const minH = MIN_CROP_SIZE;

    // Free aspect: width/height are independently resized based on handle.
    // Use the opposite corner/edge as an anchor.
    const anchor = (() => {
      switch (handle) {
        case 'nw':
          return { x: start.x + start.w, y: start.y + start.h }; // bottom-right fixed
        case 'ne':
          return { x: start.x, y: start.y + start.h }; // bottom-left fixed
        case 'sw':
          return { x: start.x + start.w, y: start.y }; // top-right fixed
        case 'se':
          return { x: start.x, y: start.y }; // top-left fixed
        case 'n':
          return { x: start.x, y: start.y + start.h }; // bottom edge fixed, width fixed
        case 's':
          return { x: start.x, y: start.y }; // top edge fixed, width fixed
        case 'w':
          return { x: start.x + start.w, y: start.y }; // right edge fixed, height fixed
        case 'e':
          return { x: start.x, y: start.y }; // left edge fixed, height fixed
      }
    })();

    let x = start.x;
    let y = start.y;
    let w = start.w;
    let h = start.h;

    const clampLeft = (left: number) => clamp(left, 0, anchor.x - minW);
    const clampRight = (right: number) => clamp(right, anchor.x + minW, frameW);
    const clampTop = (top: number) => clamp(top, 0, anchor.y - minH);
    const clampBottom = (bottom: number) => clamp(bottom, anchor.y + minH, frameH);

    switch (handle) {
      case 'se': {
        const right = clampRight(cx);
        const bottom = clampBottom(cy);
        x = anchor.x;
        y = anchor.y;
        w = right - anchor.x;
        h = bottom - anchor.y;
        break;
      }
      case 'ne': {
        const left = anchor.x;
        const right = clampRight(cx);
        const top = clampTop(cy);
        x = left;
        y = top;
        w = right - left;
        h = anchor.y - top;
        break;
      }
      case 'sw': {
        const right = anchor.x;
        const left = clampLeft(cx);
        const bottom = clampBottom(cy);
        x = left;
        y = anchor.y;
        w = right - left;
        h = bottom - anchor.y;
        break;
      }
      case 'nw': {
        const right = anchor.x;
        const bottom = anchor.y;
        const left = clampLeft(cx);
        const top = clampTop(cy);
        x = left;
        y = top;
        w = right - left;
        h = bottom - top;
        break;
      }
      case 'e': {
        const right = clampRight(cx);
        x = anchor.x;
        y = anchor.y;
        w = right - anchor.x;
        h = start.h;
        break;
      }
      case 'w': {
        const left = clampLeft(cx);
        x = left;
        y = anchor.y;
        w = anchor.x - left;
        h = start.h;
        break;
      }
      case 's': {
        const bottom = clampBottom(cy);
        x = anchor.x;
        y = anchor.y;
        w = start.w;
        h = bottom - anchor.y;
        break;
      }
      case 'n': {
        const top = clampTop(cy);
        x = anchor.x;
        y = top;
        w = start.w;
        h = anchor.y - top;
        break;
      }
    }

    return clampRectToFrame({ x, y, w, h }, frameW, frameH);
  };

  const handleCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== 'crop') return;
    if (e.button !== 0) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const p = getLocalPoint(e.clientX, e.clientY, rect);

    setCropFrameSize({ w: rect.width, h: rect.height });

    cropDragRef.current.pointerId = e.pointerId;
    cropDragRef.current.startPointerX = e.clientX;
    cropDragRef.current.startPointerY = e.clientY;
    cropDragRef.current.frameW = rect.width;
    cropDragRef.current.frameH = rect.height;
    cropDragRef.current.startX = p.x;
    cropDragRef.current.startY = p.y;
    cropDragRef.current.startRect = cropRect;
    cropDragRef.current.mode = 'idle';
    cropDragRef.current.activeHandle = null;

    const current = cropRect;
    if (!current) {
      cropDragRef.current.mode = 'create';
      setCropMode('create');
      setCropHandle(null);
      setCropRect(computeRectFromCreateDrag(p.x, p.y, p.x + 0.01, p.y + 0.01, rect.width, rect.height));
    } else {
      const handle = detectHandle(p, current);
      const inside = pointInRect(p, current);

      if (handle) {
        cropDragRef.current.mode = 'resize';
        cropDragRef.current.activeHandle = handle;
        setCropMode('resize');
        setCropHandle(handle);
      } else if (inside) {
        cropDragRef.current.mode = 'move';
        setCropMode('move');
        setCropHandle(null);
      } else {
        // Start a new crop rect
        cropDragRef.current.mode = 'create';
        setCropMode('create');
        setCropHandle(null);
        setCropRect(computeRectFromCreateDrag(p.x, p.y, p.x + 0.01, p.y + 0.01, rect.width, rect.height));
      }
    }

    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleCropPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== 'crop') return;
    if (cropDragRef.current.mode === 'idle') return;
    if (cropDragRef.current.pointerId !== e.pointerId) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const p = getLocalPoint(e.clientX, e.clientY, rect);

    const frameW = cropDragRef.current.frameW;
    const frameH = cropDragRef.current.frameH;

    const mode = cropDragRef.current.mode;
    const activeHandle = cropDragRef.current.activeHandle;

    if (mode === 'create') {
      const sx = cropDragRef.current.startX;
      const sy = cropDragRef.current.startY;
      const newRect = computeRectFromCreateDrag(sx, sy, p.x, p.y, frameW, frameH);
      setCropRect(newRect);
      return;
    }

    if (!cropDragRef.current.startRect) return;
    const startRect = cropDragRef.current.startRect;

    if (mode === 'move') {
      const dx = p.x - cropDragRef.current.startX;
      const dy = p.y - cropDragRef.current.startY;
      const newX = startRect.x + dx;
      const newY = startRect.y + dy;
      setCropRect(clampRectToFrame({ ...startRect, x: newX, y: newY }, frameW, frameH));
      return;
    }

    if (mode === 'resize' && activeHandle) {
      const newRect = computeRectFromResize(activeHandle, startRect, p.x, p.y, frameW, frameH);
      setCropRect(newRect);
      return;
    }
  };

  const handleCropPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== 'crop') return;
    if (cropDragRef.current.pointerId !== e.pointerId) return;
    cropDragRef.current.pointerId = null;
    cropDragRef.current.startRect = null;
    cropDragRef.current.mode = 'idle';
    cropDragRef.current.activeHandle = null;
    setCropMode('idle');
    setCropHandle(null);

    setCropRect((r) => {
      if (!r) return null;
      if (r.w < MIN_CROP_SIZE || r.h < MIN_CROP_SIZE) return null;
      return r;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!showAdjustZoom) return;
    if (e.button !== 0) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    dragRef.current.pointerId = e.pointerId;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startPanX = panX;
    dragRef.current.startPanY = panY;
    dragRef.current.rect = rect;
    setIsPanning(true);

    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!showAdjustZoom) return;
    if (dragRef.current.pointerId !== e.pointerId) return;

    const rect = dragRef.current.rect;
    if (!rect) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const z = clamp(zoom, zoomMin, zoomMax);
    const maxPanX = Math.max(30, (rect.width * (z - 1)) / 2);
    const maxPanY = Math.max(30, (rect.height * (z - 1)) / 2);

    setPanX(clamp(dragRef.current.startPanX + dx, -maxPanX, maxPanX));
    setPanY(clamp(dragRef.current.startPanY + dy, -maxPanY, maxPanY));
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!showAdjustZoom) return;
    if (dragRef.current.pointerId !== e.pointerId) return;
    dragRef.current.pointerId = null;
    dragRef.current.rect = null;
    setIsPanning(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 z-10 w-[min(980px,calc(100vw-32px))] max-h-[calc(100vh-32px)] -translate-x-1/2 -translate-y-1/2">
        <div className="relative isolate rounded-[28px] bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden">
          {/* Header */}
          <div className="relative z-30 px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-white">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-400">Edit photo</p>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-950 truncate">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-10 px-4 rounded-full ring-1 ring-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                {hasAppliedEdits ? 'Close' : 'Cancel'}
              </button>
              <button
                type="button"
                className="h-10 px-4 rounded-full ring-1 ring-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUndo}
                disabled={undoDisabled}
              >
                Undo
              </button>
              <button
                type="button"
                className="h-10 px-5 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                Save
              </button>
            </div>
          </div>

          {/* Body (centered preview) */}
          <div className="relative z-10 p-6 sm:p-8 bg-gradient-to-b from-white to-gray-50/60">
            <div className="mx-auto w-full max-w-[760px]">
              <div className={['relative z-0 rounded-[26px]', showAdjustZoom ? 'overflow-visible' : 'overflow-hidden'].join(' ')}>
                <div
                  className="relative mx-auto w-auto bg-transparent"
                  style={{ aspectRatio: canvasAspectRatio, height: 'min(52vh, 520px)' }}
                >
                  <div className="absolute inset-0 flex items-start justify-center pt-3 sm:pt-2">
                    <div
                      ref={frameRef}
                      className={['relative h-[90%] w-full rounded-[26px]', showAdjustZoom ? 'overflow-visible' : 'overflow-hidden'].join(' ')}
                      onPointerDown={(e) => {
                        if (activeTool === 'adjust') handlePointerDown(e);
                        else if (activeTool === 'crop') handleCropPointerDown(e);
                      }}
                      onPointerMove={(e) => {
                        if (activeTool === 'adjust') handlePointerMove(e);
                        else if (activeTool === 'crop') handleCropPointerMove(e);
                      }}
                      onPointerUp={(e) => {
                        if (activeTool === 'adjust') handlePointerUpOrCancel(e);
                        else if (activeTool === 'crop') handleCropPointerUpOrCancel(e);
                      }}
                      onPointerCancel={(e) => {
                        if (activeTool === 'adjust') handlePointerUpOrCancel(e);
                        else if (activeTool === 'crop') handleCropPointerUpOrCancel(e);
                      }}
                      style={{
                        touchAction: 'none',
                        cursor:
                          activeTool === 'adjust' ? (isPanning ? 'grabbing' : 'grab') : activeTool === 'crop' ? 'crosshair' : undefined,
                      }}
                    >
                      {showAdjustZoom ? (
                        <div className="absolute inset-0">
                          {/* Dim continuation outside the frame */}
                          <div className="pointer-events-none absolute inset-0" style={panStyle}>
                            <img
                              src={imageSrc}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover will-change-transform opacity-40 saturate-[0.9]"
                              style={previewStyle}
                              draggable={false}
                            />
                          </div>

                          {/* Normal frame (hard-clipped). Keeps outside dim-only even when zoomed */}
                          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
                            <div className="absolute inset-0" style={panStyle}>
                              <img
                                src={imageSrc}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover will-change-transform"
                                style={previewStyle}
                                draggable={false}
                              />
                            </div>

                            {/* Subtle shade inside the frame */}
                            <div className="absolute inset-0 bg-black/10" />

                            {/* Grid + border across full photo (main frame) */}
                            <div className="absolute inset-0">
                              <div className="absolute inset-0 ring-1 ring-white/55" />
                              <div
                                className="absolute inset-0 opacity-75"
                                style={{
                                  backgroundImage:
                                    'linear-gradient(to right, rgba(255,255,255,0.62) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.62) 1px, transparent 1px)',
                                  backgroundSize: '33.3333% 33.3333%',
                                  backgroundPosition: '0 0',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : activeTool === 'crop' ? (
                        <div className="absolute inset-0">
                          {/* Dim full frame */}
                          <div className="pointer-events-none absolute inset-0" style={panStyle}>
                            <img
                              src={imageSrc}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover will-change-transform opacity-40 saturate-[0.9]"
                              style={previewStyle}
                              draggable={false}
                            />
                          </div>

                          {/* Net cropped area */}
                          {cropRect && cropClipPath ? (
                            <>
                              <div className="pointer-events-none absolute inset-0" style={panStyle}>
                                <img
                                  src={imageSrc}
                                  alt=""
                                  className="absolute inset-0 h-full w-full object-cover will-change-transform"
                                  style={{
                                    ...previewStyle,
                                    clipPath: cropClipPath,
                                  }}
                                  draggable={false}
                                />
                              </div>

                              {/* Crop border + grid */}
                              <div
                                className="pointer-events-none absolute"
                                style={{
                                  left: cropRect.x,
                                  top: cropRect.y,
                                  width: cropRect.w,
                                  height: cropRect.h,
                                }}
                              >
                                <div className="absolute inset-0 rounded-[2px] ring-1 ring-white/80 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.55)]" />
                                <div
                                  className="absolute inset-0 opacity-75"
                                  style={{
                                    backgroundImage:
                                      'linear-gradient(to right, rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.65) 1px, transparent 1px)',
                                    backgroundSize: '33.3333% 33.3333%',
                                    backgroundPosition: '0 0',
                                  }}
                                />

                                {/* Handles (for visual only, hit is detected in pointer math) */}
                                {(() => {
                                  const pts = [
                                    { x: cropRect.x, y: cropRect.y, key: 'nw' },
                                    { x: cropRect.x + cropRect.w, y: cropRect.y, key: 'ne' },
                                    { x: cropRect.x, y: cropRect.y + cropRect.h, key: 'sw' },
                                    { x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h, key: 'se' },
                                    { x: cropRect.x + cropRect.w / 2, y: cropRect.y, key: 'n' },
                                    { x: cropRect.x + cropRect.w / 2, y: cropRect.y + cropRect.h, key: 's' },
                                    { x: cropRect.x, y: cropRect.y + cropRect.h / 2, key: 'w' },
                                    { x: cropRect.x + cropRect.w, y: cropRect.y + cropRect.h / 2, key: 'e' },
                                  ] as const;
                                  return pts.map((pt) => (
                                    <div
                                      key={pt.key}
                                      className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 ring-1 ring-gray-200"
                                      style={{ left: pt.x - cropRect.x, top: pt.y - cropRect.y }}
                                    />
                                  ));
                                })()}
                              </div>
                            </>
                          ) : null}
                        </div>
                      ) : (
                        <img
                          src={imageSrc}
                          alt=""
                          className="h-full w-full object-cover will-change-transform"
                          style={previewStyle}
                          draggable={false}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool layer (UI-only) */}
              <div className="relative z-20 mt-6 flex justify-center">
                <div className="w-full">
                  {/* Adjust: crop zoom bar */}
                  {showAdjustZoom ? (
                    <div className="mb-3 px-1 sm:px-2">
                      <input
                        aria-label="Crop zoom"
                        type="range"
                        min={zoomMin}
                        max={zoomMax}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(clamp(Number(e.target.value), zoomMin, zoomMax))}
                        className={[
                          'w-full h-7 bg-transparent cursor-pointer appearance-none',
                          // Track
                          '[&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:rounded-full',
                          '[&::-webkit-slider-runnable-track]:bg-gray-200',
                          // Thumb
                          '[&::-webkit-slider-thumb]:appearance-none',
                          '[&::-webkit-slider-thumb]:h-9 [&::-webkit-slider-thumb]:w-9 [&::-webkit-slider-thumb]:rounded-full',
                          '[&::-webkit-slider-thumb]:bg-slate-700',
                          '[&::-webkit-slider-thumb]:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.55)]',
                          // Center thumb on track
                          '[&::-webkit-slider-thumb]:mt-[-12px]',
                          // Firefox
                          '[&::-moz-range-track]:h-3 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-gray-200',
                          '[&::-moz-range-thumb]:h-9 [&::-moz-range-thumb]:w-9 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-slate-700 [&::-moz-range-thumb]:border-0',
                        ].join(' ')}
                      />
                    </div>
                  ) : null}

                  <div className="rounded-full bg-white px-3 py-2.5 shadow-[0_26px_70px_-50px_rgba(0,0,0,0.45)] ring-1 ring-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className={[
                        'group flex-1 max-w-[92px] flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-colors py-1.5',
                        activeTool === 'adjust' ? 'bg-gray-50' : 'hover:bg-gray-50',
                      ].join(' ')}
                      aria-label="Adjust"
                      onClick={() => setActiveTool((t) => (t === 'adjust' ? null : 'adjust'))}
                    >
                      <span className="h-10 w-10 rounded-full text-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3v18" />
                          <path d="M3 12h18" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-700 leading-none">Adjust</span>
                    </button>

                    <button
                      type="button"
                      className="group flex-1 max-w-[92px] flex flex-col items-center justify-center gap-1.5 rounded-2xl hover:bg-gray-50 transition-colors py-1.5"
                      aria-label="Crop"
                      onClick={() => setActiveTool('crop')}
                    >
                      <span className="h-10 w-10 rounded-full text-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                          <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-700 leading-none">Crop</span>
                    </button>

                    <button
                      type="button"
                      className="group flex-1 max-w-[92px] flex flex-col items-center justify-center gap-1.5 rounded-2xl hover:bg-gray-50 transition-colors py-1.5"
                      aria-label="Zoom"
                      onClick={() => setActiveTool('zoom')}
                    >
                      <span className="h-10 w-10 rounded-full text-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="7" />
                          <path d="M21 21l-4.3-4.3" />
                          <path d="M11 8v6" />
                          <path d="M8 11h6" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-700 leading-none">Zoom</span>
                    </button>

                    <button
                      type="button"
                      className="group flex-1 max-w-[92px] flex flex-col items-center justify-center gap-1.5 rounded-2xl hover:bg-gray-50 transition-colors py-1.5"
                      aria-label="Filter"
                      onClick={() => setActiveTool((t) => (t === 'filter' ? null : 'filter'))}
                    >
                      <span className="h-10 w-10 rounded-full text-gray-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 6h16" />
                          <path d="M7 12h10" />
                          <path d="M10 18h4" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-700 leading-none">Filter</span>
                    </button>

                    {/* Text & Fit kaldırildi */}
                  </div>
                </div>
                {activeTool === 'filter' ? (
                  <div className="mt-3 px-2">
                    <div className="flex items-center justify-center gap-2">
                      {(
                        [
                          { id: 'black', bg: '#0B0B0B', border: '#0B0B0B' },
                          { id: 'normal', bg: '#FFFFFF', border: '#D1D5DB' },
                          { id: 'gray', bg: '#6B6B6B', border: '#6B6B6B' },
                          { id: 'blue', bg: '#2563EB', border: '#2563EB' },
                          { id: 'red', bg: '#EF4444', border: '#EF4444' },
                          { id: 'pink', bg: '#F9C6D9', border: '#D946EF' },
                          { id: 'cyan', bg: '#A7F3D0', border: '#5EEAD4' },
                          { id: 'peach', bg: '#FDE68A', border: '#FDBA74' },
                        ] as const
                      ).map((c) => {
                        const active = filterPreset === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            aria-label={`Filter ${c.id}`}
                            onClick={() => setFilterPreset(c.id)}
                            className={[
                              'w-7 h-7 rounded-full border flex items-center justify-center transition-transform',
                              active ? 'ring-2 ring-red-600 scale-105' : 'ring-0',
                            ].join(' ')}
                            style={{
                              backgroundColor: c.bg,
                              borderColor: c.border,
                            }}
                          >
                            {/* İç dolgu için küçük kontrast halkası */}
                            <span
                              aria-hidden
                              className="block w-5 h-5 rounded-full"
                              style={{
                                backgroundColor: c.bg,
                                boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.35)' : undefined,
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

