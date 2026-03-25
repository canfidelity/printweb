'use client';

import { useRef, useState, useEffect } from 'react';

const reviews = [
  {
    id: 1,
    text: "Absolutely love how fast the prints were ready! Picked them up while getting milk, and everything was already waiting for me. The whole process was super easy and convenient. Will definitely use it again!",
    author: "Alex K.",
    rating: 5,
    rotation: -10
  },
  {
    id: 2,
    text: "Walgreens pickup was so easy and convenient. I placed my order and picked it up while I was already at the store. The print quality is much better than my home printer, and everything looked sharp and vibrant!",
    author: "Emma L.",
    rating: 4,
    rotation: -6
  },
  {
    id: 3,
    text: "Ordered prints for a last-minute birthday gift and was a bit worried about the timing. Luckily, everything was ready in less than 45 minutes! The whole process was quick and smooth, and the prints turned out great!",
    author: "Victoria S.",
    rating: 5,
    rotation: 0
  },
  {
    id: 4,
    text: "The quality of the prints exceeded my expectations! Colors were vibrant and true to the original photos. Delivery was fast and packaging was secure. Highly recommend for anyone needing quality prints quickly.",
    author: "Michael R.",
    rating: 5,
    rotation: 4
  },
  {
    id: 5,
    text: "Great service! I needed prints for a family event and they were ready in under an hour. The staff was helpful and the prints came out beautifully. Will be using this service again for sure!",
    author: "Sarah M.",
    rating: 5,
    rotation: 8
  }
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < rating ? 'text-amber-400' : 'text-gray-300'}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
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
    <section id="reviews" className="w-full py-12 bg-white border-t border-gray-200" style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            <span className="text-5xl sm:text-7xl text-red-600 font-extrabold italic">1.5M+</span> orders delivered
          </h2>
        </div>

        {/* Reviews — always horizontal, scrollable when cards overflow */}
        <div className="relative">
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
            className="overflow-x-auto scrollbar-hide py-12"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            }}
          >
            <div className="flex items-center justify-center min-w-max gap-0 px-4">
              {reviews.map((review, index) => (
              <div
                key={review.id}
                className="group relative flex-shrink-0 cursor-pointer transition-all duration-500 ease-out hover:scale-110"
                style={{
                  width: '300px',
                  height: '300px',
                  margin: '0 -30px',
                  transform: `rotate(${review.rotation}deg)`,
                  zIndex: reviews.length - index,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.zIndex = '100';
                  el.style.transform = 'rotate(0deg) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.zIndex = String(reviews.length - index);
                  el.style.transform = `rotate(${review.rotation}deg) scale(1)`;
                }}
              >
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-black/5 shadow-2xl backdrop-blur-sm flex items-center justify-center group-hover:shadow-3xl transition-shadow duration-500">
                  <div className="absolute inset-4 rounded-xl bg-white text-gray-900 shadow-xl ring-1 ring-gray-200 group-hover:ring-red-300 overflow-hidden transition-all duration-500">
                    <div className="p-5 flex flex-col h-full">
                      <StarRow rating={review.rating} />
                      <p className="text-sm leading-relaxed text-gray-500 mb-4 flex-grow">
                        {review.text}
                      </p>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-900">
                          by &ldquo;{review.author}&rdquo;
                        </div>
                      </div>
                    </div>
                  </div>
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
