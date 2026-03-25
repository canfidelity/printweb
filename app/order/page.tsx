'use client';

import { useMemo, useState } from 'react';
import NavbarCentered from '@/components/NavbarCentered';
import { OrderProgressSteps } from '@/components/NavbarCentered';
import StepBarSection from '@/components/StepBarSection';
import Footer from '@/components/Footer';

const ORDER_STEPS = [
  { id: '1', label: 'Size & quantity' },
  { id: '2', label: 'Delivery' },
  { id: '3', label: 'Checkout' },
  { id: '4', label: 'Order summary' },
];

type DeliveryChoice = 'home' | 'store';
type WalgreensStore = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
};

// Demo Walgreens store list (lat/lng for map embed).
const WALGREENS_STORES: WalgreensStore[] = [
  {
    id: 'wal-1',
    name: 'Walgreens - Downtown',
    address: '123 Main St',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    id: 'wal-2',
    name: 'Walgreens - Lakeside',
    address: '456 Lake Shore Dr',
    city: 'Chicago',
    state: 'IL',
    zip: '60611',
    lat: 41.8902,
    lng: -87.6029,
  },
  {
    id: 'wal-3',
    name: 'Walgreens - West Loop',
    address: '789 West Loop Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60607',
    lat: 41.8837,
    lng: -87.6497,
  },
  {
    id: 'wal-4',
    name: 'Walgreens - North Side',
    address: '321 North Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60610',
    lat: 41.8977,
    lng: -87.6489,
  },
];

export default function OrderFlowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, ORDER_STEPS.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const [deliveryChoice, setDeliveryChoice] = useState<DeliveryChoice>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(WALGREENS_STORES[0]?.id ?? '');

  const selectedStore = useMemo(
    () => WALGREENS_STORES.find((s) => s.id === selectedStoreId) ?? WALGREENS_STORES[0],
    [selectedStoreId],
  );

  const stepTitle =
    currentStep === 0
      ? 'Choose Size and Quality'
      : currentStep === 1
        ? 'Delivery'
        : 'Secure checkout';
  const stepDescription =
    currentStep === 0
      ? 'Pick the perfect print size for each photo and adjust quantities before continuing.'
      : currentStep === 1
        ? 'Choose between home delivery and store pickup.'
        : 'Complete your enrollment. No hidden fees.';

  const checkoutPlans = useMemo(
    () => [
      { id: 'Standard', amount: 1.99 },
      { id: 'Expedited', amount: 11.99 },
      { id: 'Rush', amount: 13.99 },
    ] as const,
    [],
  );

  const [selectedPlanId, setSelectedPlanId] = useState<(typeof checkoutPlans)[number]['id']>('Standard');
  const selectedPlan = useMemo(
    () => checkoutPlans.find((p) => p.id === selectedPlanId) ?? checkoutPlans[1],
    [checkoutPlans, selectedPlanId],
  );
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<'' | 'reactpro10'>('');
  const discountAmount = useMemo(() => {
    if (appliedCoupon !== 'reactpro10') return 0;
    // Demo: %10 indirim (sent hassasiyetiyle yuvarlama).
    return Math.floor(selectedPlan.amount * 0.1 * 100) / 100;
  }, [appliedCoupon, selectedPlan.amount]);

  const [couponMsg, setCouponMsg] = useState<{ text: string; tone: 'neutral' | 'success' | 'error' }>({
    text: '',
    tone: 'neutral',
  });

  const formatExpiry = (raw: string) => {
    // Digits-only and format to MM/YY
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const getShippingLabel = (id: (typeof checkoutPlans)[number]['id']) => {
    // Keep labels in English to match the rest of the order flow.
    return id;
  };

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress1, setStreetAddress1] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const subtotal = selectedPlan.amount;
  const total = subtotal - discountAmount;

  const couponMsgClass =
    couponMsg.tone === 'success'
      ? 'mt-1 text-xs text-green-600'
      : couponMsg.tone === 'error'
        ? 'mt-1 text-xs text-red-500'
        : 'mt-1 text-xs text-gray-500';

  const [checkoutDialog, setCheckoutDialog] = useState<null | { tone: 'success' | 'error'; title: string; message: string }>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const validateCheckout = () => {
    const nextErrors: Record<string, string> = {};

    const emailTrim = email.trim();
    const digitsCard = cardNumber.replace(/\D/g, '');
    const digitsCvc = cardCvc.replace(/\D/g, '');

    if (!firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length < 7) nextErrors.phoneNumber = 'Valid phone number is required.';
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) nextErrors.email = 'Valid email is required.';
    if (!streetAddress1.trim()) nextErrors.streetAddress1 = 'Street address is required.';

    if (!digitsCard || digitsCard.length < 12) nextErrors.cardNumber = 'Card number is not valid.';
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) nextErrors.cardExpiry = 'Expiry must be in MM/YY format.';
    if (!digitsCvc || digitsCvc.length < 3) nextErrors.cardCvc = 'CVC is not valid.';

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setCheckoutDialog({
        tone: 'error',
        title: 'Check your details',
        message: 'Please fix the highlighted fields and try again.',
      });
      return false;
    }

    setCheckoutDialog({
      tone: 'success',
      title: 'Payment ready',
      message: 'Your checkout information looks good.',
    });
    return true;
  };

  // Demo: cart popup’taki stil diliyle uyumlu order summary datası.
  const orderSummaryItems = useMemo(
    () => [
      { id: 1, name: '4×6 Print', qty: 2, unitPrice: 0.35, image: '/photo-1.png' },
      { id: 2, name: 'Retro 4×6', qty: 1, unitPrice: 0.99, image: '/photo-2.png' },
      { id: 3, name: '8×10 Print', qty: 1, unitPrice: 6.99, image: '/photo-3.png' },
    ],
    [],
  );

  const orderSummarySubtotal = orderSummaryItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const orderSummaryDeliveryFee = orderSummarySubtotal > 50 ? 0 : 3.99;
  const orderSummaryTotal = orderSummarySubtotal + orderSummaryDeliveryFee;

  return (
    <main className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes paymentSuccessPop {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          40% {
            transform: scale(1.15);
            opacity: 1;
          }
          70% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <NavbarCentered />
      <div className="pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10 mb-4 flex justify-center">
          <OrderProgressSteps orderSteps={ORDER_STEPS} currentStep={currentStep} />
        </div>
        <div className={currentStep === 0 ? '' : 'hidden'}>
          <StepBarSection onNextStep={goNext} />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10 mt-8">
          {currentStep === 1 ? (
            <div
              className="rounded-[28px] bg-white ring-1 ring-gray-200 shadow-sm p-6 sm:p-8"
              style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
            >
              <h3 className="text-2xl font-semibold tracking-tight text-gray-950">Delivery</h3>
              <p className="mt-2 text-gray-500">
                Select how you want to receive your prints.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryChoice('home')}
                  className={[
                    'rounded-[22px] ring-1 p-5 text-left transition-all duration-200',
                    deliveryChoice === 'home'
                      ? 'bg-red-50 ring-red-200'
                      : 'bg-white ring-gray-200 hover:ring-red-200',
                  ].join(' ')}
                  aria-pressed={deliveryChoice === 'home'}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 flex items-start gap-3">
                      <span
                        className={[
                          'mt-0.5 h-10 w-10 rounded-2xl flex items-center justify-center ring-1',
                          deliveryChoice === 'home' ? 'bg-red-600 text-white ring-red-600' : 'bg-white text-red-600 ring-red-200',
                        ].join(' ')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3v18h18" />
                          <path d="M8 8h10" />
                          <path d="M8 12h10" />
                          <path d="M8 16h10" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-950">Home delivery</p>
                        <p className="text-sm text-gray-500 mt-1">Delivered to your address.</p>
                      </div>
                    </div>
                    <span
                      className={[
                        'h-7 w-7 flex-shrink-0 rounded-full ring-1 flex items-center justify-center',
                        deliveryChoice === 'home' ? 'bg-white ring-red-500' : 'bg-white ring-gray-300',
                      ].join(' ')}
                      aria-hidden
                    >
                      <span className={`block h-[14px] w-[14px] rounded-full ${deliveryChoice === 'home' ? 'bg-red-600' : 'bg-transparent'}`} />
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryChoice('store')}
                  className={[
                    'rounded-[22px] ring-1 p-5 text-left transition-all duration-200',
                    deliveryChoice === 'store'
                      ? 'bg-red-50 ring-red-200'
                      : 'bg-white ring-gray-200 hover:ring-red-200',
                  ].join(' ')}
                  aria-pressed={deliveryChoice === 'store'}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 flex items-start gap-3">
                      <span
                        className={[
                          'mt-0.5 h-10 w-10 rounded-2xl flex items-center justify-center ring-1',
                          deliveryChoice === 'store' ? 'bg-red-600 text-white ring-red-600' : 'bg-white text-red-600 ring-red-200',
                        ].join(' ')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-950">Store pickup</p>
                        <p className="text-sm text-gray-500 mt-1">Pick up from Walgreens stores.</p>
                      </div>
                    </div>
                    <span
                      className={[
                        'h-7 w-7 flex-shrink-0 rounded-full ring-1 flex items-center justify-center',
                        deliveryChoice === 'store' ? 'bg-white ring-red-500' : 'bg-white ring-gray-300',
                      ].join(' ')}
                      aria-hidden
                    >
                      <span className={`block h-[14px] w-[14px] rounded-full ${deliveryChoice === 'store' ? 'bg-red-600' : 'bg-transparent'}`} />
                    </span>
                  </div>
                </button>
              </div>

              {deliveryChoice === 'store' ? (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1 rounded-[22px] ring-1 ring-gray-200 p-4 overflow-visible">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-950">Walgreens stores</p>
                      <button
                        type="button"
                        className="h-7 px-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-900 transition-colors inline-flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 21s7-4.35 7-10a7 7 0 0 0-14 0c0 5.65 7 10 7 10z" />
                          <circle cx="12" cy="11" r="2.5" />
                        </svg>
                        Use my locations
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto px-1 pt-1 pb-2">
                      {WALGREENS_STORES.map((store) => {
                        const active = store.id === selectedStore?.id;
                        return (
                          <button
                            key={store.id}
                            type="button"
                            onClick={() => setSelectedStoreId(store.id)}
                            className={[
                              'w-full text-left rounded-[18px] ring-1 p-4 transition-all duration-200',
                              active ? 'bg-red-50 ring-red-200' : 'bg-white ring-gray-200 hover:ring-red-200',
                            ].join(' ')}
                            aria-pressed={active}
                          >
                            <p className={active ? 'font-semibold text-gray-950' : 'font-semibold text-gray-900'}>{store.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {store.address}, {store.city}
                            </p>
                            <p className="text-sm text-gray-500">{store.state} {store.zip}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-2 rounded-[22px] ring-1 ring-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-white">
                      <p className="font-semibold text-gray-950">Selected store</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedStore?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedStore?.address}, {selectedStore?.city} {selectedStore?.state} {selectedStore?.zip}
                      </p>
                    </div>

                    <div className="w-full h-[320px] bg-gray-50">
                      {selectedStore ? (
                        <iframe
                          title="Walgreens store location"
                          className="w-full h-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&z=15&output=embed`}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[22px] bg-gray-50 ring-1 ring-gray-200 p-5">
                  <p className="font-semibold text-gray-950">Home delivery selected</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Address details and the delivery timeframe will be confirmed in step 3.
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 h-11 rounded-full ring-1 ring-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 h-11 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div
              className="relative rounded-[28px] bg-white ring-1 ring-gray-200 shadow-sm p-6 sm:p-8"
              style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
            >
              <div className="p-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-2xl font-semibold tracking-tight text-gray-950"
                      style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                    >
                      Secure checkout
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-800 font-semibold"
                      style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                    >
                      SSL 256-bit
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm text-gray-600"
                    style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                  >
                      Complete your enrollment. No hidden fees.
                  </p>

                  <form
                    className="mt-6"
                    id="checkout-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const ok = validateCheckout();
                      if (!ok) return;
                      setPaymentSuccess(true);
                      window.setTimeout(() => {
                        setPaymentSuccess(false);
                        setCurrentStep(3);
                      }, 900);
                    }}
                  >
                    {checkoutDialog ? (
                      <div
                        className={[
                          'mb-4 rounded-xl border p-3',
                          checkoutDialog.tone === 'success'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200',
                        ].join(' ')}
                      >
                        <p className="text-sm font-semibold text-gray-950">{checkoutDialog.title}</p>
                        <p className={checkoutDialog.tone === 'success' ? 'text-sm text-green-700' : 'text-sm text-red-700'}>
                          {checkoutDialog.message}
                        </p>
                      </div>
                    ) : null}
                    {paymentSuccess ? (
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <div
                          className="px-8 py-6 rounded-2xl bg-white/95 backdrop-blur-md ring-1 ring-gray-200 shadow-lg"
                          style={{ animation: 'paymentSuccessPop 900ms ease-out both' }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-200">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                            <div>
                              <p className="text-base font-semibold text-gray-950">Payment successful</p>
                              <p className="text-sm text-gray-500 mt-0.5">Redirecting to order summary…</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      <div className="lg:col-span-2 space-y-4 rounded-[22px] ring-1 ring-gray-200 p-4 overflow-visible bg-white">
                        <div>
                          <label
                            htmlFor="plan"
                            className="block text-sm mb-1 text-gray-950 font-semibold"
                            style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                          >
                            Shipping Type
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {checkoutPlans.map((p) => {
                              const isActive = p.id === selectedPlanId;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPlanId(p.id);
                                    // Coupon stays applied (discount recomputes for new plan).
                                    if (appliedCoupon) setCouponMsg({ text: '', tone: 'neutral' });
                                  }}
                                  className={[
                                    'col-span-1 px-3 py-2 rounded-lg border text-sm transition-colors',
                                    isActive
                                      ? 'border-red-500/30 bg-red-500/10 ring-1 ring-inset ring-red-500/30 text-gray-950 hover:bg-red-500/15'
                                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100',
                                  ].join(' ')}
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                  aria-pressed={isActive}
                                >
                              <span className="flex w-full flex-col items-center leading-none">
                                <span className="font-semibold">{getShippingLabel(p.id)}</span>
                                <span className="mt-1 text-xs font-semibold text-gray-600">
                                  ${p.amount.toFixed(2)}
                                </span>
                              </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4
                            className="text-base font-semibold tracking-tight text-gray-950"
                            style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                          >
                            Shipping Info
                          </h4>
                          <div className="mt-4 space-y-3">
                            <div>
                              <label
                                htmlFor="firstName"
                                className="block text-sm mb-1 text-gray-950 font-semibold"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                First Name
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.currentTarget.value)}
                                aria-invalid={!!fieldErrors.firstName}
                                className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              />
                              {fieldErrors.firstName ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                              ) : null}
                            </div>

                            <div>
                              <label
                                htmlFor="lastName"
                                className="block text-sm mb-1 text-gray-950 font-semibold"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                Last Name
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.currentTarget.value)}
                                aria-invalid={!!fieldErrors.lastName}
                                className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              />
                              {fieldErrors.lastName ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                              ) : null}
                            </div>

                            <div>
                              <label
                                htmlFor="phoneNumber"
                                className="block text-sm mb-1 text-gray-950 font-semibold"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                Phone Number
                              </label>
                              <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                                aria-invalid={!!fieldErrors.phoneNumber}
                                className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              />
                              {fieldErrors.phoneNumber ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                              ) : null}
                            </div>

                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm mb-1 text-gray-950 font-semibold"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                Email
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                aria-invalid={!!fieldErrors.email}
                                className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              />
                              {fieldErrors.email ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                              ) : null}
                            </div>

                            <div>
                              <label
                                htmlFor="streetAddress1"
                                className="block text-sm mb-1 text-gray-950 font-semibold"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                Street Address 1
                              </label>
                              <input
                                id="streetAddress1"
                                name="streetAddress1"
                                type="text"
                                required
                                placeholder="Street Address 1"
                                value={streetAddress1}
                                onChange={(e) => setStreetAddress1(e.currentTarget.value)}
                                aria-invalid={!!fieldErrors.streetAddress1}
                                className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              />
                              {fieldErrors.streetAddress1 ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.streetAddress1}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3 space-y-4 rounded-[22px] ring-1 ring-gray-200 overflow-hidden bg-white p-4">
                        <div>
                          <h4
                            className="text-base font-semibold tracking-tight text-gray-950"
                            style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                          >
                            Card details
                          </h4>
                          <div className="mt-4 space-y-3">
                            <div>
                              <label
                                htmlFor="cardNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                Card Number
                              </label>
                              <div className="relative">
                                <div className="pointer-events-none absolute right-3 top-3 flex items-center">
                                  <svg viewBox="0 0 72 44" className="h-5 w-10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <rect width="72" height="44" rx="6" fill="#1d4ed8" />
                                    <text
                                      x="36"
                                      y="28"
                                      textAnchor="middle"
                                      fontFamily="Arial, Helvetica, sans-serif"
                                      fontWeight="800"
                                      fontSize="14"
                                      fill="#ffffff"
                                    >
                                      VISA
                                    </text>
                                  </svg>
                                  <svg viewBox="0 0 72 44" className="h-5 w-10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <circle cx="30" cy="22" r="11" fill="#EB001B" />
                                    <circle cx="42" cy="22" r="11" fill="#F79E1B" />
                                  </svg>
                                </div>
                                <input
                                  id="cardNumber"
                                  name="cardNumber"
                                  type="text"
                                  required
                                  placeholder="1234 5678 9012 3456"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.currentTarget.value)}
                                  aria-invalid={!!fieldErrors.cardNumber}
                                  className="w-full px-4 py-3 pr-16 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-950"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                />
                              </div>
                              {fieldErrors.cardNumber ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.cardNumber}</p>
                              ) : null}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label
                                  htmlFor="cardExpiry"
                                  className="block text-sm mb-1 text-gray-950 font-semibold"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  Expiry
                                </label>
                                <input
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  type="text"
                                  required
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(formatExpiry(e.currentTarget.value))}
                                  aria-invalid={!!fieldErrors.cardExpiry}
                                  className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                />
                                {fieldErrors.cardExpiry ? (
                                  <p className="mt-1 text-xs text-red-600">{fieldErrors.cardExpiry}</p>
                                ) : null}
                              </div>

                              <div>
                                <label
                                  htmlFor="cardCvc"
                                  className="block text-sm mb-1 text-gray-950 font-semibold"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  CVC
                                </label>
                                <input
                                  id="cardCvc"
                                  name="cardCvc"
                                  type="text"
                                  required
                                  inputMode="numeric"
                                  placeholder="CVC"
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.currentTarget.value)}
                                  aria-invalid={!!fieldErrors.cardCvc}
                                  className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                />
                                {fieldErrors.cardCvc ? (
                                  <p className="mt-1 text-xs text-red-600">{fieldErrors.cardCvc}</p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="coupon"
                                className="block text-sm mb-1 text-gray-950 font-semibold"
                                style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                              >
                                Coupon code
                              </label>
                              <div className="flex gap-2">
                                <input
                                  id="coupon"
                                  name="coupon"
                                  type="text"
                                  placeholder="REACTPRO10"
                                  value={couponInput}
                                  onChange={(e) => setCouponInput(e.currentTarget.value)}
                                  className="w-full h-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-950 bg-gray-50 border-gray-200 border rounded-lg px-3"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const code = couponInput.trim().toLowerCase();
                                    if (code === 'reactpro10') {
                                      setAppliedCoupon('reactpro10');
                                      setCouponMsg({ text: '10% discount applied!', tone: 'success' });
                                      setCheckoutDialog({
                                        tone: 'success',
                                        title: 'Coupon applied',
                                        message: 'Your discount has been updated.',
                                      });
                                    } else if (code === '') {
                                      setAppliedCoupon('');
                                      setCouponMsg({ text: 'Please enter a coupon code.', tone: 'error' });
                                      setCheckoutDialog({
                                        tone: 'error',
                                        title: 'Coupon needed',
                                        message: 'Please enter a coupon code.',
                                      });
                                    } else {
                                      setAppliedCoupon('');
                                      setCouponMsg({ text: 'Invalid coupon code.', tone: 'error' });
                                      setCheckoutDialog({
                                        tone: 'error',
                                        title: 'Invalid coupon',
                                        message: 'That coupon code is not valid.',
                                      });
                                    }
                                  }}
                                  className="h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  Apply
                                </button>
                              </div>
                              <p className={couponMsgClass} style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
                                {couponMsg.text}
                              </p>
                            </div>

                            <dl className="text-sm space-y-2">
                              <div className="flex items-center justify-between">
                                <dt className="text-gray-600" style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
                                  Selected shipping type
                                </dt>
                                <dd
                                  id="summary-plan"
                                  className="text-gray-950"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  {getShippingLabel(selectedPlanId)}
                                </dd>
                              </div>

                              <div className="flex items-center justify-between">
                                <dt className="text-gray-600" style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
                                  Subtotal
                                </dt>
                                <dd
                                  id="summary-subtotal"
                                  className="text-gray-950"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  ${subtotal.toFixed(2)}
                                </dd>
                              </div>

                              <div className="flex items-center justify-between">
                                <dt className="text-gray-600" style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
                                  Discount
                                </dt>
                                <dd
                                  id="summary-discount"
                                  className="text-red-600"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  -${discountAmount.toFixed(2)}
                                </dd>
                              </div>

                              <div className="flex items-center justify-between font-medium pt-2 border-t border-gray-200">
                                <dt className="text-gray-950" style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
                                  Total
                                </dt>
                                <dd
                                  id="summary-total"
                                  className="text-gray-950"
                                  style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                                >
                                  ${total.toFixed(2)}
                                </dd>
                              </div>
                            </dl>

                            {/* Submit button altta (Proceed yerine) bulunuyor */}

                            <p
                              className="mt-1 text-xs text-gray-500 text-center"
                              style={{ fontFamily: 'Geist, Inter, sans-serif' }}
                            >
                              By continuing you agree to the Terms and Privacy Policy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="flex-1 h-11 rounded-full ring-1 ring-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const form = document.getElementById('checkout-form') as HTMLFormElement | null;
                      form?.requestSubmit();
                    }}
                    className="flex-1 h-11 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Pay securely
                  </button>
                </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div
              className="rounded-[28px] bg-white ring-1 ring-gray-200 shadow-sm p-6 sm:p-8"
              style={{ animation: 'fadeSlideIn 1s ease-out 0.1s both' }}
            >
              <h3 className="text-2xl font-semibold tracking-tight text-gray-950">Order summary</h3>
              <p className="mt-2 text-gray-500">Review your items and totals below.</p>

              <div className="mt-6 space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {orderSummaryItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 pb-4 ${i !== orderSummaryItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-gray-200 flex-shrink-0 bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">Qty: {String(item.qty).padStart(2, '0')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-red-600">${(item.unitPrice * item.qty).toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Unit: ${item.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-950 font-semibold">${orderSummarySubtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="text-gray-950 font-semibold">
                    {orderSummaryDeliveryFee === 0 ? 'Free' : `$${orderSummaryDeliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-950 font-semibold">Total</span>
                  <span className="text-gray-950 font-bold text-base">${orderSummaryTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 h-11 rounded-full ring-1 ring-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="flex-1 h-11 rounded-full bg-gray-200 text-sm font-semibold text-gray-500 cursor-not-allowed"
                >
                  Back to home
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </main>
  );
}
