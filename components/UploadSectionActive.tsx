'use client';

import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadSectionActive() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
    if (files.length > 0) {
      router.push('/order');
    }
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
            <div className="text-center">
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
              className="group relative flex min-h-[420px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[32px] border-2 border-dashed border-[#ffe0e0] bg-[rgba(255,250,250,1)] px-6 py-10 text-center transition-all duration-300 hover:-translate-y-1 hover:border-red-300 sm:min-h-[460px] sm:px-10"
            >
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100/70" />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-red-200/80" />

              <div className="relative z-10 flex flex-col items-center group/cards">
                {/* Stacked cards: back (tilted) + front with gradient circle & "Add your photo" */}
                <div className="relative mb-8 h-[200px] w-[280px]">
                  {/* Back card — eğik, soldan taşan */}
                  <div
                    className="absolute -rotate-[22deg] rounded-2xl border-2 border-gray-200 p-[3px] bg-white shadow-lg w-[200px] transition-transform duration-300 ease-out group-hover/cards:translate-x-[-6px] group-hover/cards:translate-y-[-2px]"
                    style={{ left: '-17px', top: '-23px', height: '200px', zIndex: 0 }}
                  >
                    <div className="h-full w-full rounded-[14px] bg-gray-50/95" />
                  </div>
                  {/* Back card — eğik, sağdan taşan */}
                  <div
                    className="absolute rotate-[22deg] rounded-2xl border-2 border-gray-200 p-[3px] bg-white shadow-lg w-[200px] transition-transform duration-300 ease-out group-hover/cards:translate-x-[6px] group-hover/cards:translate-y-[-2px]"
                    style={{ right: '-17px', top: '-23px', height: '200px', zIndex: 0 }}
                  >
                    <div className="h-full w-full rounded-[14px] bg-gray-50/95" />
                  </div>
                  {/* Front card — düz, ortada önde */}
                  <div className="absolute bottom-0 left-1/2 z-10 w-[180px] -translate-x-1/2 rounded-2xl border-2 border-gray-200 p-[3px] bg-white shadow-md transition-transform duration-300 ease-out group-hover/cards:-translate-x-1/2 group-hover/cards:-translate-y-2">
                    <div className="rounded-[14px] bg-gray-50/95 px-5 py-9">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="mb-5 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-white shadow-inner"
                        style={{ background: 'linear-gradient(to bottom, #FF8C5F, #E91E63)' }}
                      >
                        <span className="text-3xl font-bold leading-none">+</span>
                      </div>
                      <p className="text-center font-medium text-gray-700">
                        <span className="block">Add your</span>
                        <span className="block">photo</span>
                      </p>
                    </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-2">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">Drag and drop photos</p>
                  <p className="flex flex-wrap items-center justify-center gap-2 text-base text-gray-600 sm:text-lg">
                    <span>Or</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-all duration-300">
                      Import a Photo
                    </span>
                    <span>From My Device</span>
                  </p>
                </div>
              </div>

            </label>
          </div>

          
        </div>
      </div>
    </section>
    </>
  );
}
