'use client';

const stepsStorePickup = [
  {
    title: 'Choose Your Photos',
    desc: 'Select your favorite memories from your gallery',
    icon: (
      <img src="/camera.svg" alt="" className="h-6 w-6" />
    ),
  },
  {
    title: 'Edit & Pick Your Size',
    desc: 'Crop, adjust and choose the perfect print size for your photos',
    icon: (
      <img src="/cut.svg" alt="" className="h-6 w-6" />
    ),
  },
  {
    title: 'Select Your store',
    desc: 'Find the nearest Walgreens to pick your prints',
    icon: (
      <img src="/location.svg" alt="" className="h-6 w-6" />
    ),
  },
  {
    title: 'Pick Up & Pay in Store',
    desc: 'Your prints will be ready in about 1 hour. No online payment needed.',
    icon: (
      <img src="/store.svg" alt="" className="h-6 w-6" />
    ),
  },
];

const stepsHomeDelivery = [
  {
    title: 'Choose Your Photos',
    desc: "Select your favorite memories from your phone’s gallery",
    icon: stepsStorePickup[0]!.icon,
  },
  {
    title: 'Edit & Pick Your Size',
    desc: 'Crop, adjust and choose the perfect print size for your photos',
    icon: stepsStorePickup[1]!.icon,
  },
  {
    title: 'Enter Your Adress',
    desc: 'Tell us where to deliver your beatiful prints.',
    icon: (
      <img src="/home.svg" alt="" className="h-6 w-6" />
    ),
  },
  {
    title: 'Pay & Relax',
    desc: 'Pay securely online. Your prints will arrive at your door in a few business days.',
    icon: (
      <img src="/pay.svg" alt="" className="h-7 w-7" />
    ),
  },
];

function Card({
  title,
  pillText,
  steps,
  borderWidthClass = 'border-[4px]',
  borderColorClass = 'border-red-200/80',
}: {
  title: string;
  pillText: string;
  steps: { title: string; desc: string; icon: React.ReactNode }[];
  borderWidthClass?: string;
  borderColorClass?: string;
}) {
  return (
    <div className={`rounded-[28px] ${borderWidthClass} ${borderColorClass} bg-white p-7 sm:p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h3>
          <div className="mt-3 inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100">
            {pillText}
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-7">
        {steps.map((s, idx) => (
          <div key={`${s.title}-${idx}`} className="flex items-start gap-1">
            <div className="mt-0.5 flex h-11 w-11 items-center justify-center text-red-600">
              {s.icon}
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold tracking-tight text-gray-900">{s.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-gray-500">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksAltCards() {
  return (
    <section
      id="how-it-works-alt-cards"
      className="w-full py-14 sm:py-16 bg-white border-t border-gray-100"
      style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card
            title="Store Pickup"
            pillText="Ready in about 1 hour - pay at the store"
            steps={stepsStorePickup}
            borderWidthClass="border-[2px]"
            borderColorClass="border-gray-200/80"
          />
          <Card
            title="Home Delivery"
            pillText="Delivered straight to your doorstep"
            steps={stepsHomeDelivery}
            borderWidthClass="border-[2px]"
            borderColorClass="border-gray-200/80"
          />
        </div>
      </div>
    </section>
  );
}

