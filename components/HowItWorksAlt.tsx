'use client';

export default function HowItWorksAlt() {
  return (
    <section
      id="how-it-works-alt"
      className="w-full pt-8 pb-14 sm:pt-10 sm:pb-16 bg-white border-t border-gray-100"
      style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        {/*
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
        */}

        {/* Block 1: On the website */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">
              Store pickup
            </span>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-gray-200 last:border-b-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Choose Your Photos
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Select your favorite memories from your gallery
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-1.5 shadow-sm flex items-center justify-center">
                <div className="relative grid grid-cols-2 gap-0.5 w-full h-full">
                  {[
                    'bg-amber-100',
                    'bg-orange-100',
                    'bg-gray-100',
                    'bg-pink-100',
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`${bg} rounded-md border border-white/70 shadow-[0_0_0_1px_rgba(148,163,184,0.12)]`}
                    />
                  ))}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-gray-200 last:border-b-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Edit &amp; Pick Your Size
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Crop, adjust and choose the perfect print size for your photos
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-1.5 shadow-sm flex items-center justify-center">
                <div className="relative w-full h-full rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
                  <div className="absolute left-2 top-2 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-amber-500" />
                  <div className="absolute right-2 top-2 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-amber-500" />
                  <div className="absolute bottom-2 left-2 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-amber-500" />
                  <div className="absolute bottom-2 right-2 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-amber-500" />
                  <div className="absolute inset-x-3 top-3 h-8 rounded-md border border-amber-100 bg-white p-1.5 shadow-[0_8px_18px_rgba(249,115,22,0.14)]">
                    <div className="flex h-full w-full items-end overflow-hidden rounded-[6px] bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50">
                      <div className="ml-1 mb-1.5 h-3 w-3 rounded-full bg-orange-300" />
                      <div className="ml-auto mr-1 mb-1 h-5 w-7 rounded-tl-xl bg-amber-300/90" />
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-[58%] -translate-x-1/2 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white shadow-sm">
                    4x6
                  </div>
                </div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-gray-200 last:border-b-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Select Your store
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Find the nearest Walgreens to pick your prints
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-1.5 shadow-sm flex items-center justify-center">
                <div className="relative w-full h-full rounded-lg border border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-50 overflow-hidden">
                  <div className="absolute inset-x-2 top-3 h-9 rounded-md border border-red-100 bg-white shadow-[0_10px_20px_rgba(239,68,68,0.12)] overflow-hidden">
                    <div className="flex h-2.5">
                      <span className="flex-1 bg-red-500" />
                      <span className="flex-1 bg-pink-400" />
                      <span className="flex-1 bg-red-300" />
                    </div>
                    <div className="flex h-[calc(100%_-_10px)] items-end justify-between px-2 pb-1.5">
                      <div className="h-4 w-3 rounded-t-full bg-red-100" />
                      <div className="h-5 w-4 rounded-sm border border-red-100 bg-red-50" />
                      <div className="h-3 w-3 rounded-full bg-pink-100" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-red-500 ring-2 ring-white shadow-sm flex items-center justify-center">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Pick Up &amp; Pay in Store
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Your prints will be ready in about 1 hour. No online payment needed.
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-1.5 shadow-sm flex items-center justify-center">
                <div className="relative w-full h-full rounded-lg border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden">
                  <div className="absolute left-1/2 top-1/2 h-7 w-12 -translate-x-1/2 -translate-y-[2px] rounded-t-xl rounded-b-md border border-amber-200 bg-white shadow-[0_10px_18px_rgba(245,158,11,0.12)]" />
                  <div className="absolute left-1/2 top-1/2 h-4 w-8 -translate-x-1/2 -translate-y-[14px] rounded-full border-2 border-b-0 border-amber-300" />
                  <div className="absolute left-1/2 top-1/2 h-1 w-7 -translate-x-1/2 translate-y-[4px] rounded-full bg-amber-100" />
                  <div className="absolute left-1/2 top-1/2 h-5 w-4 -translate-x-1/2 -translate-y-[1px] rotate-[-8deg] rounded-md border border-red-200 bg-red-100" />
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-[2px] rounded-full bg-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: Home delivery */}
        <div>
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">
              Home delivery
            </span>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 border-b border-gray-200 last:border-b-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Enter Your Address
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Tell us where to deliver your beatiful prints.
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-1.5 shadow-sm flex items-center justify-center">
                <div className="relative w-full h-full rounded-lg border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 overflow-hidden">
                  <div className="absolute inset-x-3 bottom-3 h-8 rounded-md border border-sky-100 bg-white shadow-[0_8px_18px_rgba(59,130,246,0.12)]">
                    <div className="absolute left-2 top-2 h-1.5 w-8 rounded-full bg-sky-100" />
                    <div className="absolute left-2 top-5 h-1.5 w-10 rounded-full bg-sky-50" />
                  </div>
                  <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg
                      className="h-[18px] w-[18px] text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                  </div>
                  <div className="absolute left-3 top-3 h-3 w-5 rounded-full bg-sky-100" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Pay &amp; Relax
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Pay securely online. Your prints will arrive at your door in a few business days.
                </p>
              </div>
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-1.5 shadow-sm flex items-center justify-center">
                <div className="relative w-full h-full rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
                  <div className="absolute inset-x-3 top-4 h-7 rounded-md border border-emerald-100 bg-white shadow-[0_8px_18px_rgba(16,185,129,0.12)]">
                    <div className="absolute left-0 right-0 top-2 h-1.5 bg-emerald-500/12" />
                    <div className="absolute left-2 bottom-2 h-1.5 w-5 rounded-full bg-emerald-100" />
                    <div className="absolute right-2 bottom-2 h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white shadow-sm">
                    Paid
                  </div>
                  <span className="absolute right-2 top-2 h-6 w-6 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
