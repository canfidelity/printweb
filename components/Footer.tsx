'use client';

export default function Footer() {
  return (
    <footer id="pricing" className="relative w-full bg-black pt-24 pb-12 overflow-hidden text-gray-100 rounded-t-[48px]">
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-red-900/20 via-gray-900/10 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
        {/* CTA Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          {/* Headline */}
          <h2 className="mb-6 max-w-5xl text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
            Start printing your memories today <span className="text-red-500">&#10084;</span>
          </h2>
          
          {/* App Store Button */}
          <a
            href="#"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm sm:text-base font-medium text-black ring-1 ring-white/10 hover:bg-gray-100 transition-colors h-11"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <div className="flex flex-col items-start justify-center leading-none -space-y-0.5">
              <span className="text-[9px] font-normal">DOWNLOAD ON THE</span>
              <span className="text-sm font-semibold">App Store</span>
            </div>
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-16">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 text-center lg:text-left">
            {/* Brand Column */}
            <div className="flex flex-col items-center lg:items-start lg:col-span-5">
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-xl text-white" style={{ fontWeight: 900 }}>Easy Prints</span>
                  <span className="text-gray-400">×</span>
                  <span className="text-xl font-serif italic text-red-600">Walgreens</span>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                  The easiest way to print your mobile photos at your local pharmacy.
                </p>
                <p className="text-sm text-gray-400">
                  Made with <span className="text-red-500">❤</span> in <span className="font-bold text-white">San Francisco</span>
                </p>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:col-span-1 lg:block"></div>

            {/* Links Columns */}
            <div className="col-span-1 grid grid-cols-3 gap-10 lg:col-span-6 lg:gap-12">
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">SERVICE</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><a href="#" className="transition-colors hover:text-white">FAQ</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Track Order</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">CVS Locations</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">LEGAL</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><a href="#" className="transition-colors hover:text-white">Terms</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">SUPPORT</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><a href="#" className="transition-colors hover:text-white">Contact</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Email Us</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright Line */}
          <div className="mt-16 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2026 Easy Print. All rights reserved. Not an official Walgreens Health app.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
