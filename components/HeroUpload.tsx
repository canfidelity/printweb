'use client';

import { useEffect, useState, type ChangeEvent } from 'react';

const locations = [
  { name: 'Walgreens', color: 'from-red-100 via-orange-100 to-red-100', textColor: 'text-red-600', logo: null },
  { name: 'CVS', color: 'from-red-100 via-pink-100 to-red-100', textColor: 'text-red-600', logo: '/cvs.svg' },
  { name: 'Target', color: 'from-red-100 via-pink-100 to-red-100', textColor: 'text-red-600', logo: null },
  { name: 'Walmart', color: 'from-blue-100 via-yellow-100 to-blue-100', textColor: 'text-blue-600', logo: null }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(event.target.files ?? []));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % locations.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = document.getElementById('card-grid-container');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.card-item'));
    let activeCard: HTMLElement | null = null;
    const handlers = new WeakMap<HTMLElement, (e: MouseEvent) => void>();

    const handleCardClick = (card: HTMLElement) => (e: MouseEvent) => {
      e.stopPropagation();
      
      if (activeCard === card) {
        resetCards();
        return;
      }

      cards.forEach((element) => {
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
      cards.forEach((element) => {
        element.style.filter = '';
        element.style.opacity = '';
        element.style.transform = '';
        element.style.position = '';
        element.style.zIndex = '';
      });
      activeCard = null;
    };

    cards.forEach((card) => {
      const fn = handleCardClick(card);
      handlers.set(card, fn);
      card.addEventListener('click', fn);
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (activeCard && !container.contains(e.target as Node)) {
        resetCards();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      cards.forEach((card) => {
        const fn = handlers.get(card);
        if (fn) card.removeEventListener('click', fn);
      });
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <section id="home" className="sm:pb-16 sm:pt-24 w-full pt-20 pb-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(252,234,234,0.08) 0%, rgba(253,242,242,0.04) 15%, #FFFFFF 35%)' }}>
      {/* Large ambient glows */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, transparent 70%)' }} />
      <div className="absolute top-10 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 60%)' }} />
      <div className="absolute top-10 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.025) 0%, transparent 60%)' }} />


      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="px-0 py-0 sm:px-0 sm:py-0 lg:px-0">
          {/* Headline */}
          <div className="mx-auto max-w-3xl text-center" style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}>
            {/* Badge */}
            <div className="mb-5 inline-flex items-center justify-center">
              <div className="group inline-flex items-center gap-3 rounded-full bg-gray-950 pl-3 pr-4 py-1.5 shadow-md hover:shadow-lg transition-all duration-300">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </span>
                <span className="text-xs font-medium text-gray-300 tracking-wide">Prints in various sizes</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-tighter font-sans font-semibold">
              Print your photos
              <span className="block">
                in <span className="text-red-600">1 hour</span> at <span className="relative inline-block transition-all duration-700 ease-in-out"><span className={`absolute inset-0 bg-gradient-to-r ${locations[currentIndex].color} rounded-full -skew-x-12 -z-10 transition-all duration-700 ease-in-out`}></span><span className={`${locations[currentIndex].textColor} italic font-serif relative px-3 transition-all duration-500 ease-in-out inline-flex items-center gap-2 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>{locations[currentIndex].logo ? <img src={locations[currentIndex].logo!} alt={locations[currentIndex].name} className="inline h-[0.55em] w-auto" /> : locations[currentIndex].name}</span></span>
              </span>
              <span className="block whitespace-nowrap tracking-tighter font-sans font-semibold">
                or delivered to your door!
              </span>
            </h1>
          </div>

          {/* Divider */}
          <div className="mx-auto mt-10 max-w-5xl px-2"></div>

          {/* Card rail */}
          <div className="sm:mt-12 max-w-5xl mt-12 mr-auto ml-auto relative mb-[20px]" style={{ animation: 'fadeSlideIn 1s ease-out 0.3s both' }}>
            {/* creator tag left */}
            <div className="-top-5 sm:-top-7 sm:left-[16%] z-50 absolute left-[12%]">
              <div className="relative">
                <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-red-600 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                  memories
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </span>
                <span className="absolute -bottom-1 left-6 h-2 w-2 rotate-45 bg-red-600"></span>
              </div>
            </div>

            {/* creator tag right */}
            <div className="-top-4 sm:-top-6 sm:right-[14%] z-50 absolute right-[10%]">
              <div className="relative">
                <span className="inline-flex items-center gap-2 border-gradient before:rounded-full text-sm font-medium text-white bg-red-600 rounded-full pt-1.5 pr-3.5 pb-1.5 pl-3.5 shadow-md">
                  moments
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </span>
                <span className="absolute -bottom-1 left-6 h-2 w-2 rotate-45 bg-red-600"></span>
              </div>
            </div>

            {/* Cards */}
            <div className="flex justify-center">
              <div className="grid grid-cols-6 sm:gap-4 gap-x-3 gap-y-3" id="card-grid-container">
                {/* Card 1 */}
                <div className="card-item col-span-2 sm:col-span-1 self-end transform -rotate-8 translate-y-3 sm:translate-y-5 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="0">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-1.png" alt="Photo print 1" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="card-item col-span-2 sm:col-span-1 self-end transform -rotate-2 translate-y-5 sm:translate-y-7 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="1">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-2.png" alt="Photo print 2" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 3 */}
                <div className="card-item col-span-2 sm:col-span-1 self-end transform rotate-3 translate-y-2 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="2">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-3.png" alt="Photo print 3" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 4 */}
                <div className="card-item col-span-2 sm:col-span-1 self-end transform rotate-0 -translate-y-1 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="3">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-1.png" alt="Photo print 4" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 5 */}
                <div className="card-item col-span-2 sm:col-span-1 self-end transform -rotate-2 translate-y-3 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="4">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-2.png" alt="Photo print 5" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Card 6 */}
                <div className="card-item col-span-2 sm:col-span-1 self-end transform rotate-6 translate-y-6 transition-all duration-700 ease-out cursor-pointer hover:scale-105" data-card-index="5">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-lg border-gradient before:rounded-2xl transition-shadow duration-500 hover:shadow-2xl">
                    <img src="/photo-3.png" alt="Photo print 6" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subcopy */}
          <p className="mx-auto mt-12 max-w-xl text-center text-base text-gray-500 font-sans" style={{ animation: 'fadeSlideIn 1s ease-out 0.5s both' }}>
            From camera roll to real-life memories in as little as 1 hour, or delivered straight to your home.
          </p>

          {/* CTAs */}
          <div className="mt-[20px] flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animation: 'fadeSlideIn 1s ease-out 0.7s both' }}>
            <div className="group relative mx-auto flex w-full max-w-[720px] justify-center">
              <input
                id="hero-upload-input"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleFileChange}
              />
              <label
                htmlFor="hero-upload-input"
                className="flex min-h-[112px] cursor-pointer items-center justify-between gap-6 rounded-[36px] border border-red-100 bg-white/90 px-8 py-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 sm:min-w-[720px]"
              >
                <div className="flex min-w-0 items-center gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-lg font-semibold tracking-tight text-gray-950 font-sans">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} selected` : 'Upload your photos'}
                    </p>
                    <p className="truncate text-sm text-gray-500 font-sans">
                      {selectedFiles.length > 0
                        ? selectedFiles.map((file) => file.name).join(', ')
                        : 'JPG, PNG or HEIC — drag in from your camera roll'}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition-colors duration-300 group-hover:bg-red-600">
                  Choose files
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

