'use client';

import { useEffect } from 'react';

export default function Hero() {
  useEffect(() => {
    const container = document.getElementById('card-grid-container');
    if (!container) return;

    const cards = container.querySelectorAll('.card-item');
    let activeCard: HTMLElement | null = null;

    const handleCardClick = (card: HTMLElement) => (e: MouseEvent) => {
      e.stopPropagation();
      
      if (activeCard === card) {
        resetCards();
        return;
      }

      cards.forEach((c) => {
        const element = c as HTMLElement;
        element.style.filter = 'blur(8px)';
        element.style.opacity = '0.4';
        element.style.transform = '';
        element.style.position = 'relative';
        element.style.zIndex = '1';
        element.style.transition = 'all 0.7s ease-out';
      });

      card.style.filter = 'blur(0px)';
      card.style.opacity = '1';
      card.style.transform = 'translate(0, 0) rotate(0deg) scale(1.15)';
      card.style.position = 'relative';
      card.style.zIndex = '10';
      card.style.transition = 'all 0.7s ease-out';
      activeCard = card;
    };

    const resetCards = () => {
      cards.forEach((c) => {
        const element = c as HTMLElement;
        element.style.filter = '';
        element.style.opacity = '';
        element.style.transform = '';
        element.style.position = '';
        element.style.zIndex = '';
      });
      activeCard = null;
    };

    cards.forEach((card) => {
      card.addEventListener('click', handleCardClick(card as HTMLElement) as EventListener);
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (activeCard && !container.contains(e.target as Node)) {
        resetCards();
      }
    };

    document.addEventListener('click', handleOutsideClick as EventListener);

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('click', handleCardClick(card as HTMLElement) as EventListener);
      });
      document.removeEventListener('click', handleOutsideClick as EventListener);
    };
  }, []);

  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="sm:pb-6 sm:pt-24 w-full pt-16 pb-5 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(252,234,234,0.08) 0%, rgba(253,242,242,0.04) 15%, #FFFFFF 35%)' }}>
      {/* Large ambient glows */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, transparent 70%)' }} />
      <div className="absolute top-10 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 60%)' }} />
      <div className="absolute top-10 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.025) 0%, transparent 60%)' }} />


      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="px-0 py-0 sm:px-0 sm:py-0 lg:px-0">
          {/* Headline */}
          <div className="mx-auto max-w-3xl text-center" style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-tighter font-sans font-semibold">
              <span className="whitespace-nowrap">
                Print your photos ready in
              </span>{' '}
              <span className="inline-flex items-baseline whitespace-nowrap">
                <span className="text-red-600">1 hour</span>
                <span className="ml-2">at</span>
                <span className="relative ml-2 inline-flex">
                  <span className="absolute inset-0 -skew-x-12 rounded-full bg-gradient-to-r from-red-100 via-pink-100 to-red-100 -z-10" />
                  <span className="relative inline-flex items-center px-3 text-red-600 italic font-serif">
                    Walgreens
                  </span>
                </span>
              </span>
              <span className="block whitespace-nowrap tracking-tighter font-sans font-semibold">
                or delivered to your door!
              </span>
            </h1>

            <div className="mt-7 flex items-center justify-center">
              <button
                type="button"
                onClick={scrollToUpload}
                className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-red-600 px-9 py-4 text-base font-semibold text-white shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                Upload Photos
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90 group-hover:translate-y-0.5 transition-transform duration-300">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto mt-10 max-w-5xl px-2"></div>

          {/* Card rail */}
          <div className="sm:mt-12 max-w-5xl mt-12 mr-auto ml-auto relative" style={{ animation: 'fadeSlideIn 1s ease-out 0.3s both' }}>

            {/* Cards */}
            <div className="flex justify-center">
              <div className="grid grid-cols-6 sm:gap-4 gap-x-3 gap-y-3" id="card-grid-container">
                {/* Card 1 */}
                <div className="card-item group relative col-span-2 sm:col-span-1 self-end transform -rotate-8 translate-y-3 sm:translate-y-5 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="0">
                  <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 z-50 opacity-0 translate-y-2 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-gray-950 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                        family
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-950"></span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-1.png" alt="Photo print 1" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="card-item group relative col-span-2 sm:col-span-1 self-end transform -rotate-2 translate-y-5 sm:translate-y-7 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="1">
                  <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 z-50 opacity-0 translate-y-2 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-gray-950 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                        travel
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-950"></span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-2.png" alt="Photo print 2" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="card-item group relative col-span-2 sm:col-span-1 self-end transform rotate-3 translate-y-2 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="2">
                  <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 z-50 opacity-0 translate-y-2 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-gray-950 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                        portraits
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-950"></span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-3.png" alt="Photo print 3" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 4 */}
                <div className="card-item group relative col-span-2 sm:col-span-1 self-end transform rotate-0 -translate-y-1 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="3">
                  <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 z-50 opacity-0 translate-y-2 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-gray-950 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                        pets
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-950"></span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-4.png" alt="Photo print 4" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 5 */}
                <div className="card-item group relative col-span-2 sm:col-span-1 self-end transform -rotate-2 translate-y-3 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="4">
                  <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 z-50 opacity-0 translate-y-2 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-gray-950 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                        weddings
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-950"></span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-5.png" alt="Photo print 5" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 6 */}
                <div className="card-item group relative col-span-2 sm:col-span-1 self-end transform rotate-6 translate-y-6 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="5">
                  <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 z-50 opacity-0 translate-y-2 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-gray-950 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                        birthdays
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </span>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-950"></span>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-6.png" alt="Photo print 6" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subcopy */}
          <p className="mx-auto mt-16 max-w-xxl text-center text-base text-gray-500 font-sans" style={{ animation: 'fadeSlideIn 1s ease-out 0.5s both' }}>
            From camera roll to real-life memories in as little as 1 hour, or delivered straight to your home.
          </p>

          {/* Scrolling badges */}
          <div
            className="mt-8 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            }}
          >
            <div className="flex gap-3 animate-marquee">
              {[
                '4×6 Prints from $0.69',
                'Ready in 1 Hour',
                'Walgreens Pickup',
                'Free Shipping 50$+',
                'Retro Prints',
                'Premium Quality',
                'CVS & Target Stores',
                '24/7 Customer Support',
                'Eco-Friendly Paper',
                'No Subscription Needed',
                'Wallet Size Available',
                'Same Day Pickup',
                'Secure Checkout',
                'Glossy & Matte Finish',
                'Up to 16×20 Prints',
              ].concat([
                '4×6 Prints from $0.69',
                'Ready in 1 Hour',
                'Walgreens Pickup',
                'Free Shipping 50$+',
                'Retro Prints',
                'Premium Quality',
                'CVS & Target Stores',
                '24/7 Customer Support',
                'Eco-Friendly Paper',
                'No Subscription Needed',
                'Wallet Size Available',
                'Same Day Pickup',
                'Secure Checkout',
                'Glossy & Matte Finish',
                'Up to 16×20 Prints',
              ]).map((text, i) => (
                <span
                  key={i}
                  className="group inline-flex items-center gap-2 flex-shrink-0 rounded-full border border-gray-200 bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-700 backdrop-blur-sm hover:border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 transition-colors duration-300 group-hover:bg-white" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
