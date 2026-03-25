'use client';

import { useRef, useState, useEffect } from 'react';

const products = [
  {
    id: 1,
    name: '4×6',
    price: '$0.69',
    image: '/photo-1.png',
    badge: 'Most Popular',
    badgeColor: 'bg-purple-100 text-purple-600'
  },
  {
    id: 2,
    name: 'Retro Print 4×6',
    price: '$0.99',
    image: '/photo-2.png',
    badge: 'New',
    badgeColor: 'bg-red-100 text-red-600'
  },
  {
    id: 3,
    name: '5×7',
    price: '$4.99',
    image: '/photo-3.png',
    badge: null,
    badgeColor: ''
  },
  {
    id: 4,
    name: '4×4',
    price: '$0.79',
    image: '/photo-1.png',
    badge: null,
    badgeColor: ''
  },
  {
    id: 5,
    name: '8×10',
    price: '$6.99',
    image: '/photo-2.png',
    badge: null,
    badgeColor: ''
  },
  {
    id: 6,
    name: 'Wallet 2.5×3.5',
    price: '$1.49',
    image: '/photo-3.png',
    badge: null,
    badgeColor: ''
  },
  {
    id: 7,
    name: '11×14',
    price: '$12.99',
    image: '/photo-1.png',
    badge: null,
    badgeColor: ''
  },
  {
    id: 8,
    name: '16×20',
    price: '$19.99',
    image: '/photo-2.png',
    badge: null,
    badgeColor: ''
  }
];

export default function ProductList() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section id="prints" className="w-full py-12 bg-white border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8" style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">Prints</h2>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Product Grid */}
        <div className="relative" style={{ animation: 'fadeSlideIn 1s ease-out 0.3s both' }}>
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:ring-red-200 transition-all duration-300"
            style={{ opacity: canScrollLeft ? 1 : 0, pointerEvents: canScrollLeft ? 'auto' : 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:ring-red-200 transition-all duration-300"
            style={{ opacity: canScrollRight ? 1 : 0, pointerEvents: canScrollRight ? 'auto' : 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-hide pt-4"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            }}
          >
            <div className="flex gap-4 pb-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer flex-shrink-0 w-[160px]"
              >
                {/* Product Card */}
                <div className="relative bg-white rounded-2xl overflow-hidden aspect-[3/4] mb-3 ring-1 ring-gray-200 hover:ring-red-300 transition-all duration-300 hover:shadow-xl">
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${product.badgeColor} shadow-sm`}>
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Product Image - Polaroid Style */}
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="bg-white p-2 shadow-lg transform group-hover:scale-105 group-hover:rotate-0 rotate-2 transition-all duration-300 w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-left px-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    From <span className="font-semibold text-gray-700">{product.price}</span>
                  </p>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
