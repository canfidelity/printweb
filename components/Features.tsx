'use client';

import { useState, useCallback } from 'react';

const stepKeyframes = `
  @keyframes stepSelect {
    0%, 100% { opacity: 0.4; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1); }
  }
  @keyframes stepPulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
  }
  @keyframes stepSlideBar {
    0% { width: 0%; }
    60% { width: 100%; }
    100% { width: 100%; }
  }
  @keyframes stepCheckPop {
    0%, 30% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes stepDotBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes stepFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
`;

export default function Features() {
  const [mode, setMode] = useState<'store' | 'delivery'>('store');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleModeChange = useCallback((newMode: 'store' | 'delivery') => {
    if (newMode === mode) return;
    setIsAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setTimeout(() => setIsAnimating(false), 50);
    }, 250);
  }, [mode]);

  const sel = (delay = 0) => ({ animation: `stepSelect 3s ease-in-out ${delay}s infinite` });
  const pulse = () => ({ animation: 'stepPulseRing 2.5s ease-in-out infinite' });
  const slide = () => ({ animation: 'stepSlideBar 3s ease-out infinite' });
  const check = () => ({ animation: 'stepCheckPop 3s ease-out infinite' });
  const blink = () => ({ animation: 'stepDotBlink 2s ease-in-out infinite' });
  const float = (dur = 3, delay = 0) => ({ animation: `stepFloat ${dur}s ease-in-out ${delay}s infinite` });

  return (
    <section id="how-it-works" className="relative w-full py-14 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: stepKeyframes }} />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="relative rounded-3xl py-16 px-6 sm:px-10 lg:px-14 overflow-hidden" style={{ backgroundColor: '#FDF5F9' }}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #dc2626 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Section Header */}
        <div className="relative text-center mb-10" style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="flex -space-x-2.5">
              <img src="/photo-1.png" alt="" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" />
              <img src="/photo-2.png" alt="" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" />
              <img src="/photo-3.png" alt="" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" />
              <img src="/photo-1.png" alt="" className="w-9 h-9 rounded-full ring-2 ring-white object-cover" />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700 mt-0.5">140+ happy customers</span>
            </div>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-gray-900">
            Printing your memories
            <span className="block text-red-600">is ridiculously easy</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Four simple steps from your phone to a real photo in your hands.
          </p>
        </div>

        {/* Toggle — Store Pickup / Home Delivery */}
        <div className="relative flex justify-center mb-12" style={{ animation: 'fadeSlideIn 1s ease-out 0.2s both' }}>
          <div className="inline-flex items-center bg-white rounded-full p-1.5 ring-1 ring-gray-200 shadow-sm">
            <button
              onClick={() => handleModeChange('store')}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                mode === 'store'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
              Store Pickup
            </button>
            <button
              onClick={() => handleModeChange('delivery')}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                mode === 'delivery'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Home Delivery
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative items-stretch mb-4" style={{ animation: 'fadeSlideIn 1s ease-out 0.3s both' }}>

          {/* STEP 1 — Choose Your Photos */}
          <div
            className="bg-white border border-gray-200 rounded-[28px] p-5 sm:p-6 relative h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 tracking-tight font-medium">
              STEP 1
            </span>

            <div className="relative h-40 sm:h-44 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden">
              <div className="absolute inset-0 p-4">
                <div className="bg-white/90 border border-gray-200 rounded-xl p-3 w-full shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <div className="h-2 w-20 bg-gray-900 rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <div className="aspect-square bg-red-50 rounded-lg border border-red-200 flex items-center justify-center" style={sel(0)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200" style={sel(1)} />
                    <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200" style={sel(2)} />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-red-100 rounded-lg flex items-center justify-center" style={float(3, 0.5)}>
                      <div className="h-1 w-8 bg-red-600 rounded" />
                    </div>
                    <div className="h-5 w-12 bg-gray-100 rounded-lg" style={float(3, 1)} />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-5 text-2xl sm:text-3xl text-gray-900 tracking-tighter font-semibold">
              Choose Your Photos
            </h3>
            <p className="mt-2 text-sm text-gray-500 tracking-tight">
              Select your favorite memories from your gallery
            </p>
          </div>

          {/* STEP 2 — Edit & Pick Your Size */}
          <div
            className="bg-white border border-gray-200 rounded-[28px] p-5 sm:p-6 relative h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s',
            }}
          >
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 tracking-tight font-medium">
              STEP 2
            </span>

            <div className="relative h-40 sm:h-44 rounded-2xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-3">
              <div className="grid grid-cols-2 gap-2 h-full">
                <div className="bg-white border border-red-200 rounded-lg p-2.5 shadow-sm ring-2 ring-red-500/20" style={pulse()}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    </svg>
                    <div className="h-1.5 w-6 bg-red-600 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-gray-200 rounded" />
                    <div className="h-1 w-4/5 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm" style={float(3, 0.5)}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    </svg>
                    <div className="h-1.5 w-8 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-gray-200 rounded" />
                    <div className="h-1 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm" style={float(3, 1)}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <rect width="14" height="18" x="5" y="3" rx="2" ry="2" />
                    </svg>
                    <div className="h-1.5 w-10 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-gray-200 rounded" />
                    <div className="h-1 w-5/6 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm" style={float(3, 1.5)}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                    </svg>
                    <div className="h-1.5 w-6 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-gray-200 rounded" />
                    <div className="h-1 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-5 text-2xl sm:text-3xl text-gray-900 tracking-tighter font-semibold">
              Edit & Pick Your Size
            </h3>
            <p className="mt-2 text-sm text-gray-500 tracking-tight">
              Crop, adjust and choose the perfect print size for your photos
            </p>
          </div>

          {/* STEP 3 — Conditional */}
          <div
            className="bg-white border border-gray-200 rounded-[28px] p-5 sm:p-6 relative h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
            }}
          >
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 tracking-tight font-medium">
              STEP 3
            </span>

            {mode === 'store' ? (
              <>
                <div className="relative h-40 sm:h-44 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden p-3">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div className="h-1.5 w-12 bg-gray-900 rounded" />
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full" style={blink()} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-1.5" style={pulse()}>
                        <div className="w-4 h-4 bg-red-200 rounded" />
                        <div className="h-1.5 w-16 bg-red-600 rounded" />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5" style={float(4, 0.3)}>
                        <div className="w-4 h-4 bg-gray-200 rounded" />
                        <div className="h-1.5 w-14 bg-gray-300 rounded" />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1.5" style={float(4, 0.6)}>
                        <div className="w-4 h-4 bg-gray-200 rounded" />
                        <div className="h-1.5 w-12 bg-gray-300 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl text-gray-900 tracking-tighter font-semibold">
                  Select Your Store
                </h3>
                <p className="mt-2 text-sm text-gray-500 tracking-tight">
                  Find the nearest Walgreens to pick your prints
                </p>
              </>
            ) : (
              <>
                <div className="relative h-40 sm:h-44 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden p-3">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-gray-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div className="h-1.5 w-14 bg-gray-900 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2" style={float(3.5, 0)}>
                        <div className="h-1.5 w-full bg-gray-200 rounded" />
                      </div>
                      <div className="flex items-center gap-2" style={float(3.5, 0.3)}>
                        <div className="h-1.5 w-4/5 bg-gray-200 rounded" />
                      </div>
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-1.5 mt-1" style={pulse()}>
                        <div className="w-4 h-4 bg-red-200 rounded" />
                        <div className="h-1.5 w-20 bg-red-400 rounded" />
                      </div>
                      <div className="h-6 w-full bg-red-100 rounded-lg flex items-center justify-center mt-1" style={float(2.5, 0.5)}>
                        <div className="h-1 w-14 bg-red-600 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl text-gray-900 tracking-tighter font-semibold">
                  Enter Your Address
                </h3>
                <p className="mt-2 text-sm text-gray-500 tracking-tight">
                  Tell us where to deliver your beautiful prints
                </p>
              </>
            )}
          </div>

          {/* STEP 4 — Conditional */}
          <div
            className="bg-white border border-gray-200 rounded-[28px] p-5 sm:p-6 relative h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s',
            }}
          >
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 tracking-tight font-medium">
              STEP 4
            </span>

            {mode === 'store' ? (
              <>
                <div className="relative h-40 sm:h-44 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden p-3">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                            <path d="M12 3v6" />
                          </svg>
                        </div>
                        <div className="h-1.5 w-14 bg-gray-900 rounded" />
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="bg-red-500 h-2 rounded-full" style={slide()} />
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500" style={check()}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <div className="h-1.5 w-16 bg-green-200 rounded" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 flex-1 bg-red-100 rounded-lg flex items-center justify-center" style={float(2.5, 0)}>
                        <div className="h-1 w-10 bg-red-600 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl text-gray-900 tracking-tighter font-semibold">
                  Pick Up & Pay in Store
                </h3>
                <p className="mt-2 text-sm text-gray-500 tracking-tight">
                  Your prints will be ready in about 1 hour. No online payment needed.
                </p>
              </>
            ) : (
              <>
                <div className="relative h-40 sm:h-44 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden p-3">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-gray-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </div>
                      <div className="h-1.5 w-14 bg-gray-900 rounded" />
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full" style={slide()} />
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500" style={check()}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <div className="h-1.5 w-20 bg-green-200 rounded" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400" style={float(2, 0)}>
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      <div className="h-1.5 w-16 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl text-gray-900 tracking-tighter font-semibold">
                  Pay & Relax
                </h3>
                <p className="mt-2 text-sm text-gray-500 tracking-tight">
                  Pay securely online. Your prints will arrive at your door in a few business days.
                </p>
              </>
            )}
          </div>

        </div>


        </div>
      </div>
    </section>
  );
}
