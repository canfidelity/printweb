'use client';

import { useState, type ChangeEvent } from 'react';

export default function UploadSection() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(event.target.files ?? []));
  };

  return (
    <>
      <style jsx>{`
        @keyframes uploadTitleFloatLeft {
          0%,
          100% {
            transform: rotate(-6deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(-4deg) translate3d(0, -6px, 0);
          }
        }

        @keyframes uploadTitleFloatRight {
          0%,
          100% {
            transform: rotate(6deg) translate3d(0, 0, 0);
          }
          50% {
            transform: rotate(4deg) translate3d(0, -5px, 0);
          }
        }
      `}</style>

      <section id="upload" className="w-full bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
        <div
          className="rounded-[36px] border border-gray-200 bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-14"
          style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
        >
          <div className="mx-auto max-w-5xl text-center">
            <div className="text-center opacity-0 h-0 overflow-hidden pointer-events-none select-none">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <span className="text-3xl font-semibold tracking-tighter text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl">
                  Upload your
                </span>
                <img
                  src="/photo-1.png"
                  alt="Printed memory preview"
                  className="inline-block h-10 w-10 rounded-2xl bg-white object-cover ring-4 ring-white shadow-xl -rotate-6 sm:h-12 sm:w-12 md:h-14 md:w-14"
                  style={{ animation: 'uploadTitleFloatLeft 6s ease-in-out infinite' }}
                />
                <span className="text-3xl font-semibold tracking-tighter text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl">
                  moments,
                </span>
                <span className="text-3xl font-semibold tracking-tighter text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl">
                  print what matters.
                </span>
                <img
                  src="/photo-2.png"
                  alt="Photo print preview"
                  className="inline-block h-10 w-10 rounded-2xl bg-white object-cover ring-4 ring-white shadow-xl rotate-6 sm:h-12 sm:w-12 md:h-14 md:w-14"
                  style={{ animation: 'uploadTitleFloatRight 6.8s ease-in-out infinite' }}
                />
              </div>
            </div>

            
          </div>

          <div className="relative mx-auto mt-12 max-w-5xl">
            <input
              id="upload-section-input"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />

            <label
              htmlFor="upload-section-input"
              className="group relative flex min-h-[420px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[32px] border-2 border-dashed border-gray-200 bg-white px-6 py-10 text-center transition-all duration-300 hover:-translate-y-1 hover:border-red-300 sm:min-h-[460px] sm:px-10"
            >
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100/70" />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-red-200/80" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_24px_60px_-26px_rgba(220,38,38,0.7)] sm:h-32 sm:w-32">
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>

                <div className="mt-10 max-w-2xl">
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? 's are' : ' is'} ready for printing`
                      : 'Drag and drop your photos here'}
                  </h3>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex min-h-[64px] min-w-[220px] items-center justify-center rounded-full bg-red-600 px-10 py-5 text-lg font-semibold text-white transition-transform duration-300 group-hover:scale-105">
                    Import files
                  </span>
                </div>
              </div>

              <div className="pointer-events-none absolute left-8 top-8 hidden gap-2 sm:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="mt-6 h-2 w-2 rounded-full bg-orange-400" />
              </div>
              <div className="pointer-events-none absolute right-10 top-16 hidden gap-3 sm:flex">
                <span className="h-3 w-3 rounded-full border-2 border-blue-400" />
                <span className="mt-10 h-2 w-2 rounded-full bg-red-500" />
              </div>
              <div className="pointer-events-none absolute bottom-10 left-12 hidden gap-3 sm:flex">
                <span className="h-3 w-3 rounded-full border-2 border-purple-400" />
                <span className="mt-5 h-2 w-2 rounded-full bg-orange-400" />
              </div>
              <div className="pointer-events-none absolute bottom-12 right-12 hidden gap-2 sm:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="mt-6 h-3 w-3 rounded-full border-2 border-teal-400" />
              </div>
            </label>
          </div>

          <div className="relative mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Upload photos instantly
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Continue to print sizes and checkout
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Pickup in 1 hour or get delivery
            </span>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
