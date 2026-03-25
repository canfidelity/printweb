'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

type BadgeType = 'shipping' | 'discount' | 'secure';

type CartItem = {
  id: number;
  name: string;
  qty: number;
  unitPrice: number;
  originalUnitPrice: number;
  image: string;
  badges: BadgeType[];
};

const initialCartItems: CartItem[] = [
  // Not: badges'i açık tip ile geniş tutuyoruz. `as const` yüzünden TS bazen `never` çıkarabiliyor.
  { id: 1, name: '4×6 Print', qty: 2, unitPrice: 0.35, originalUnitPrice: 0.35, image: '/photo-1.png', badges: ['shipping'] },
  { id: 2, name: 'Retro 4×6', qty: 1, unitPrice: 0.99, originalUnitPrice: 1.29, image: '/photo-2.png', badges: ['discount'] },
  { id: 3, name: '8×10 Print', qty: 1, unitPrice: 6.99, originalUnitPrice: 8.99, image: '/photo-3.png', badges: ['shipping', 'discount'] },
];

const badgeConfig: Record<BadgeType, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  shipping: {
    label: 'Free Shipping',
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  },
  discount: {
    label: 'Discount',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  },
  secure: {
    label: 'Secure Pay',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
};

const orders = [
  {
    id: '#302011',
    date: 'Mar 10, 2026',
    status: 'Ready for Pickup',
    statusColor: 'bg-green-100 text-green-700',
    estimated: 'Mar 11, 2026',
    product: { name: '4×6 Photo Prints', qty: 3, location: 'Walgreens Downtown', price: '$2.07', image: '/photo-1.png' },
    steps: [
      { label: 'Order Placed', desc: 'Your order has been confirmed', date: 'Mar 10, 2026', done: true },
      { label: 'Printing', desc: 'Photos are being printed at store', date: 'Mar 10, 2026', done: true },
      { label: 'Ready for Pickup', desc: 'Your prints are ready at Walgreens', date: 'Mar 11, 2026', done: true },
      { label: 'Picked Up', desc: 'Order completed', date: '', done: false },
    ],
  },
  {
    id: '#301984',
    date: 'Mar 7, 2026',
    status: 'Delivered',
    statusColor: 'bg-blue-100 text-blue-700',
    estimated: 'Mar 9, 2026',
    product: { name: '8×10 Print', qty: 1, location: 'Home Delivery', price: '$6.99', image: '/photo-2.png' },
    steps: [
      { label: 'Order Placed', desc: 'Your order has been confirmed', date: 'Mar 7, 2026', done: true },
      { label: 'Printing', desc: 'Photos printed and packaged', date: 'Mar 7, 2026', done: true },
      { label: 'Shipped', desc: 'Package en route to your address', date: 'Mar 8, 2026', done: true },
      { label: 'Delivered', desc: 'Package delivered', date: 'Mar 9, 2026', done: true },
    ],
  },
  {
    id: '#301820',
    date: 'Mar 3, 2026',
    status: 'Picked Up',
    statusColor: 'bg-gray-100 text-gray-600',
    estimated: 'Mar 3, 2026',
    product: { name: 'Retro 4×6 Prints', qty: 5, location: 'CVS Pharmacy', price: '$4.95', image: '/photo-3.png' },
    steps: [
      { label: 'Order Placed', desc: 'Your order has been confirmed', date: 'Mar 3, 2026', done: true },
      { label: 'Printing', desc: 'Photos printed at store', date: 'Mar 3, 2026', done: true },
      { label: 'Ready for Pickup', desc: 'Prints ready at CVS', date: 'Mar 3, 2026', done: true },
      { label: 'Picked Up', desc: 'Order completed', date: 'Mar 3, 2026', done: true },
    ],
  },
];

export type OrderStep = { id: string; label: string };

type OrderProgressStepsProps = {
  orderSteps: OrderStep[];
  currentStep?: number;
  revealed?: boolean;
  className?: string;
};

export function OrderProgressSteps({
  orderSteps,
  currentStep = 0,
  revealed = true,
  className = '',
}: OrderProgressStepsProps) {
  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-6px]'
      } ${className}`}
    >
      {orderSteps.map((step, i) => {
        const isActive = i === currentStep;
        const isPast = i < currentStep;
        return (
          <span key={step.id} className="flex items-center gap-1.5">
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                isActive ? 'bg-red-600 text-white' : isPast ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {isPast ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={`hidden sm:inline text-sm font-medium ${isActive ? 'text-gray-900' : isPast ? 'text-gray-600' : 'text-gray-400'}`}>
              {step.label}
            </span>
            {i < orderSteps.length - 1 && (
              <span className="hidden sm:block w-16 h-px bg-gray-200 mx-0.5" aria-hidden />
            )}
          </span>
        );
      })}
    </div>
  );
}

type NavbarCenteredProps = {
  variant?: 'default' | 'order';
  orderSteps?: OrderStep[];
  currentStep?: number;
  nextStepCount?: number;
};

export default function NavbarCentered({ variant = 'default', orderSteps = [], currentStep = 0, nextStepCount = 0 }: NavbarCenteredProps = {}) {
  const [hidden, setHidden] = useState(false);
  const [orderRevealed, setOrderRevealed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [trackView, setTrackView] = useState<'list' | 'detail'>('list');
  const [trackAnimating, setTrackAnimating] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [mobileSheetOffset, setMobileSheetOffset] = useState(0);
  const [mobileSheetDragging, setMobileSheetDragging] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileDragStartY = useRef<number | null>(null);

  useEffect(() => {
    footerRef.current = document.getElementById('pricing');

    const handleScroll = () => {
      if (!footerRef.current) return;
      const footerTop = footerRef.current.getBoundingClientRect().top;
      setHidden(footerTop <= window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (variant !== 'order') return;
    let t: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      t = setTimeout(() => setOrderRevealed(true), 80);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (t !== undefined) clearTimeout(t);
    };
  }, [variant]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth < 640) return;

      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
      if (trackRef.current && !trackRef.current.contains(e.target as Node)) {
        setTrackOpen(false);
      }
    };

    if (cartOpen || trackOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartOpen, trackOpen]);

  useEffect(() => {
    if (!cartOpen && !trackOpen) return;

    const originalOverflow = document.body.style.overflow;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setTrackOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [cartOpen, trackOpen]);

  const resetMobileSheetDrag = () => {
    setMobileSheetOffset(0);
    setMobileSheetDragging(false);
    mobileDragStartY.current = null;
  };

  const closeTrackPanel = () => {
    resetMobileSheetDrag();
    setTrackOpen(false);
    setSelectedOrder(null);
    setTrackView('list');
    setTrackAnimating(false);
  };

  const closeCartPanel = () => {
    resetMobileSheetDrag();
    setCartOpen(false);
  };

  const startMobileSheetDrag = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 640) return;

    mobileDragStartY.current = e.touches[0]?.clientY ?? null;
    setMobileSheetDragging(true);
  };

  const moveMobileSheetDrag = (e: React.TouchEvent<HTMLDivElement>) => {
    if (mobileDragStartY.current === null) return;

    const currentY = e.touches[0]?.clientY ?? mobileDragStartY.current;
    const nextOffset = Math.max(0, currentY - mobileDragStartY.current);
    setMobileSheetOffset(nextOffset);
  };

  const endMobileSheetDrag = () => {
    if (mobileDragStartY.current === null) return;

    const shouldClose = mobileSheetOffset > 120;
    mobileDragStartY.current = null;
    setMobileSheetDragging(false);

    if (shouldClose) {
      if (trackOpen) {
        closeTrackPanel();
      } else if (cartOpen) {
        closeCartPanel();
      }
      return;
    }

    setMobileSheetOffset(0);
  };

  const toggleTrackPanel = () => {
    const nextOpen = !trackOpen;
    resetMobileSheetDrag();
    setTrackOpen(nextOpen);
    setCartOpen(false);
    if (nextOpen) {
      setSelectedOrder(null);
      setTrackView('list');
      setTrackAnimating(false);
    }
  };

  const toggleCartPanel = () => {
    resetMobileSheetDrag();
    setCartOpen(prev => !prev);
    setTrackOpen(false);
  };

  const openOrderDetail = (id: string) => {
    setTrackAnimating(true);
    setTimeout(() => {
      setSelectedOrder(id);
      setTrackView('detail');
      setTimeout(() => setTrackAnimating(false), 30);
    }, 200);
  };

  const backToList = () => {
    setTrackAnimating(true);
    setTimeout(() => {
      setSelectedOrder(null);
      setTrackView('list');
      setTimeout(() => setTrackAnimating(false), 30);
    }, 200);
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter(item => item.qty > 0)
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const deliveryFee = subtotal > 50 ? 0 : 3.99;
  const total = subtotal + deliveryFee;
  const activeOrder = orders.find(order => order.id === selectedOrder);
  const mobileSheetProgress = Math.min(mobileSheetOffset / 320, 1);
  const mobileSheetStyle = {
    transform: `translateY(${mobileSheetOffset}px)`,
    transition: mobileSheetDragging ? 'none' : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
  };
  const mobileBackdropOpacity = 0.35 * (1 - mobileSheetProgress);

  const renderTrackPanelContent = () => (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: trackAnimating ? 0 : 1,
        transform: trackAnimating
          ? (trackView === 'detail' ? 'translateX(12px)' : 'translateX(-12px)')
          : 'translateX(0)',
      }}
    >
      {!activeOrder ? (
        <>
          <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                <p className="mt-1 text-sm text-gray-400">{orders.length} orders found</p>
              </div>
              <button onClick={closeTrackPanel} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="scrollbar-hide max-h-[min(62vh,420px)] overflow-y-auto px-5 pb-6 sm:max-h-[420px] sm:px-6">
            {orders.map((order, i) => (
              <button
                key={order.id}
                onClick={() => openOrderDetail(order.id)}
                className={`w-full rounded-2xl p-4 text-left ring-1 ring-gray-100 transition-all duration-200 hover:ring-red-200 hover:shadow-sm sm:p-5 ${i !== orders.length - 1 ? 'mb-3' : ''}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${order.statusColor}`}>{order.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200">
                    <img src={order.product.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{order.product.name}</p>
                    <p className="mt-0.5 text-sm text-gray-400">Qty: {order.product.qty} · {order.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="text-sm font-semibold text-gray-900">{order.product.price}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={backToList} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order {activeOrder.id}</h3>
                  <p className="mt-1 text-sm text-gray-400">Placed {activeOrder.date}</p>
                </div>
              </div>
              <button onClick={closeTrackPanel} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="mx-5 mb-5 rounded-2xl p-4 ring-1 ring-gray-100 sm:mx-6 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200">
                <img src={activeOrder.product.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{activeOrder.product.name}</p>
                <p className="mt-0.5 text-sm text-gray-400">Qty: {activeOrder.product.qty} · {activeOrder.product.location}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">{activeOrder.product.price}</span>
            </div>
          </div>

          <div className="scrollbar-hide max-h-[min(46vh,340px)] overflow-y-auto px-5 pb-2 sm:px-6">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Tracking History</p>
            <div className="relative ml-1">
              {activeOrder.steps.map((step, i) => {
                const isLast = i === activeOrder.steps.length - 1;
                return (
                  <div key={i} className="flex gap-2.5 pb-2 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${step.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {step.done && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                      </span>
                      {!isLast && (
                        <div className={`mt-1 w-0.5 flex-1 ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className={`text-[13px] font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                      <p className="text-xs text-gray-400">{step.desc}</p>
                      {step.date && <p className="mt-0.5 text-xs text-gray-300">{step.date}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 px-5 pt-4 pb-6 sm:px-6">
            <button onClick={backToList} className="flex flex-1 items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-gray-50">
              All Orders
            </button>
            <button className="flex flex-1 items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700">
              Contact Support
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderCartPanelContent = () => (
    <>
      <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            <p className="mt-1 text-sm text-gray-400 sm:text-base">Review your items before checkout</p>
          </div>
          <button
            onClick={closeCartPanel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="scrollbar-hide max-h-[min(52vh,380px)] overflow-y-auto px-5 sm:px-6">
        {cartItems.map((item, i) => (
          <div key={item.id} className={`py-3 ${i !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-gray-900">{item.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-base font-semibold text-red-600">${(item.unitPrice * item.qty).toFixed(2)}</p>
                  {item.badges.includes('discount') && item.originalUnitPrice > item.unitPrice && (
                    <p className="text-sm font-medium text-gray-400 line-through">
                      ${(item.originalUnitPrice * item.qty).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                <div className="flex items-center rounded-full bg-white ring-1 ring-gray-200">
                  <button onClick={() => updateQty(item.id, -1)} className="flex h-9 w-9 items-center justify-center text-gray-400 transition-colors hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
                  </button>
                  <span className="w-7 text-center text-sm font-semibold text-gray-900">{String(item.qty).padStart(2, '0')}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="flex h-9 w-9 items-center justify-center text-gray-400 transition-colors hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                  </button>
                </div>
                {item.badges.length > 0 && (
                  <div className="flex max-w-[170px] flex-wrap items-center justify-end gap-1">
                    {item.badges.map(badge => {
                      const cfg = badgeConfig[badge];
                      return (
                        <span key={badge} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-5 pt-5 pb-6 sm:px-6">
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estimated Delivery</span>
            <span className="text-sm font-medium text-gray-900">{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg">
          Proceed To Payment
        </button>
      </div>
    </>
  );

  return (
    <>
      <nav
        className="fixed top-4 left-0 right-0 z-50 transition-all duration-500"
        style={{
          opacity: hidden ? 0 : 1,
          transform: hidden ? 'translateY(-30px)' : 'translateY(0)',
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="rounded-full bg-white/80 backdrop-blur-md ring-1 ring-gray-200/60 px-6 py-3">
              <div className="relative flex items-center w-full">
              {variant === 'order' ? (
                <>
                  <div className="w-[140px] flex-shrink-0" aria-hidden />
                  <div className="flex-1 flex justify-center min-w-0">
                    <OrderProgressSteps orderSteps={orderSteps} currentStep={currentStep} revealed={orderRevealed} />
                  </div>
                  <Link
                    href="/"
                    className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${orderRevealed ? 'left-6 translate-x-0' : 'left-6 translate-x-0 sm:left-1/2 sm:-translate-x-1/2'}`}
                  >
                    <img src="/EasyPrint.svg" alt="Easy Print" className="h-4 sm:h-5 w-auto block" />
                    <span className="text-gray-300 text-[12px] sm:text-sm leading-none">×</span>
                    <img src="/wallgreens.svg" alt="Walgreens" className="h-[16px] sm:h-[18px] w-auto block" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex-1" />
                  <Link href="/" className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:left-1/2 sm:-translate-x-1/2">
                    <img src="/EasyPrint.svg" alt="Easy Print" className="h-4 sm:h-5 w-auto block" />
                    <span className="text-gray-300 text-[12px] sm:text-sm leading-none">×</span>
                    <img src="/wallgreens.svg" alt="Walgreens" className="h-[16px] sm:h-[18px] w-auto block" />
                  </Link>
                </>
              )}

              <div className="ml-auto flex items-center gap-1.5">
                {variant === 'order' ? (
                  <button className="relative flex items-center justify-center rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap">
                    Next Step
                    {nextStepCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-white text-[10px] font-bold text-red-600 leading-none ring-2 ring-red-600">
                        <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-50" />
                        <span className="relative">{nextStepCount}</span>
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="relative" ref={trackRef}>
                    <button
                      onClick={toggleTrackPanel}
                      className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0 min-w-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                      </svg>
                      <span className="hidden sm:inline whitespace-nowrap">Track Order</span>
                    </button>

                    <div
                      className="absolute top-full right-0 mt-3 hidden w-[410px] origin-top-right transition-all duration-300 sm:block"
                      style={{
                        opacity: trackOpen ? 1 : 0,
                        transform: trackOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                        pointerEvents: trackOpen ? 'auto' : 'none',
                      }}
                    >
                      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
                        {renderTrackPanelContent()}
                      </div>
                    </div>
                  </div>
                )}

                {variant !== 'order' && (
                <div className="relative" ref={cartRef}>
                  <button
                    onClick={toggleCartPanel}
                    className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors duration-200 shadow-sm hover:shadow-md ${totalItems > 0 ? 'animate-cart-wiggle' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-[9px] font-bold text-white leading-none">
                        <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-40" />
                        <span className="relative">{totalItems}</span>
                      </span>
                    )}
                  </button>

                  <div
                    className="absolute top-full right-0 mt-3 hidden w-[480px] origin-top-right transition-all duration-300 sm:block"
                    style={{
                      opacity: cartOpen ? 1 : 0,
                      transform: cartOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                      pointerEvents: cartOpen ? 'auto' : 'none',
                    }}
                  >
                    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
                      {renderCartPanelContent()}
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {variant !== 'order' && trackOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            onClick={closeTrackPanel}
            aria-label="Close track order sheet"
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{ backgroundColor: `rgba(17, 24, 39, ${mobileBackdropOpacity})` }}
          />
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
            style={mobileSheetStyle}
          >
            <div
              className="touch-none px-5 pt-3 pb-2"
              onTouchStart={startMobileSheetDrag}
              onTouchMove={moveMobileSheetDrag}
              onTouchEnd={endMobileSheetDrag}
              onTouchCancel={endMobileSheetDrag}
            >
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200" aria-hidden />
            </div>
            {renderTrackPanelContent()}
          </div>
        </div>
      )}

      {variant !== 'order' && cartOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            onClick={closeCartPanel}
            aria-label="Close cart sheet"
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{ backgroundColor: `rgba(17, 24, 39, ${mobileBackdropOpacity})` }}
          />
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
            style={mobileSheetStyle}
          >
            <div
              className="touch-none px-5 pt-3 pb-2"
              onTouchStart={startMobileSheetDrag}
              onTouchMove={moveMobileSheetDrag}
              onTouchEnd={endMobileSheetDrag}
              onTouchCancel={endMobileSheetDrag}
            >
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200" aria-hidden />
            </div>
            {renderCartPanelContent()}
          </div>
        </div>
      )}
    </>
  );
}
