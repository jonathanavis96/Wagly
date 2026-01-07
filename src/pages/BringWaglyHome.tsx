// BringWaglyHome.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, CreditCard, Headphones, Shield, Tag, Users } from 'lucide-react';

type BundleKey = '1' | '2' | '3' | '4';

type Bundle = {
  key: BundleKey;
  qty: number;
  perUnit: string;
  total: string;
  original: string;
  discount: string;
  bestSeller?: boolean;
  bestValue?: boolean;
};

type PupOption = {
  id: string;
  name: string;
  src: string;
};

const bundles: Record<BundleKey, Bundle> = {
  '1': { key: '1', qty: 1, perUnit: '49.99', total: '49.99', original: '124.99', discount: '60%' },
  '2': { key: '2', qty: 2, perUnit: '44.99', total: '89.98', original: '249.99', discount: '64%' },
  '3': { key: '3', qty: 3, perUnit: '39.99', total: '119.97', original: '374.99', discount: '68%', bestSeller: true },
  '4': { key: '4', qty: 4, perUnit: '34.99', total: '139.96', original: '499.99', discount: '72%', bestValue: true }
};

const ROUTES: Record<BundleKey, string> = {
  '1': 'https://pay.card2crypto.org/pay.php?address=4%2FHcTx3jM49k7fcXsd68WnTr9uzIiSZhY32FyDTgByKHtUX7BcfTdxoUhECa18o4UxKEB%2BTr%2BRb9mTsxZi2FDA%3D%3D&amount=49.99&provider=hosted&email=[EMAIL]&currency=USD',
  '2': 'https://pay.card2crypto.org/pay.php?address=jaOG5kmj0pGJ4qZvCdopfTL0sfuxxtsNpjV04T%2Ba5cbvqR9HsjaIe2vr8oDPK%2Bwdqdx68YHJSWyOVNIGEFspGQ%3D%3D&amount=89.98&provider=hosted&email=[EMAIL]&currency=USD',
  '3': 'https://pay.card2crypto.org/pay.php?address=WrOgk4QcnCUBta%2BqxOG4VR3DH7YOnhnGu3W89aEoXvtXwOqRBOgX%2FhTc3Vb47vaQOKwAwyu%2FkiFYOFjInFv9ig%3D%3D&amount=119.97&provider=hosted&email=[EMAIL]&currency=USD',
  '4': 'https://pay.card2crypto.org/pay.php?address=OrdDuSMvZq534U4TDy2elEW8KaW0%2FI6Xzw9duq5OZhEJqQjYtRJlVUCHBDD3Ys%2B2dLfpbypFtOa3uSVXIsG63g%3D%3D&amount=139.96&provider=hosted&email=[EMAIL]&currency=USD'
};

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzgeowa';

// Vite + GH Pages safe paths (BASE_URL typically ends with "/")
const PUP_IMAGE_SRC = `${import.meta.env.BASE_URL}wagly-pup.png`;

const countries = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'United Arab Emirates', flag: '🇦🇪' }
].sort((a, b) => a.name.localeCompare(b.name));

function money(n: number) {
  return n.toFixed(2);
}
function PriceEach({ price }: { price: string }) {
  const [dollars, cents = '00'] = price.split('.');
  return (
    /* pt-1 provides the buffer to prevent top clipping on desktop */
    <div className="inline-flex items-start leading-tight shrink-0 pt-1">
      {/* Dollars: Responsive font sizing with tracking for a premium feel */}
      <span className="text-[24px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none">
        ${dollars}
      </span>

      {/* Cents and "each" vertical stack */}
      <span className="ml-0.5 sm:ml-1 flex flex-col items-start justify-start">
        <span className="text-[12px] sm:text-[16px] font-extrabold text-gray-900 leading-none">{cents}</span>
        <span className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-tighter mt-0.5 leading-none">
          each
        </span>
      </span>
    </div>
  );
}

export default function BringWaglyHome() {
  const [selectedBundle, setSelectedBundle] = useState<BundleKey>('3');

  // 10 min timer
  const [timeLeft, setTimeLeft] = useState(600);

  // stock
  const [stock, setStock] = useState(0);
  const [stockColor, setStockColor] = useState('bg-yellow-500');
  const [flashStock, setFlashStock] = useState(false);

  // form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('US');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [zip, setZip] = useState('');

  const pupOptions: PupOption[] = useMemo(
    () => [
      { id: 'teddy', name: 'Teddy', src: `${import.meta.env.BASE_URL}pups/pup1.png` },
      { id: 'buddy', name: 'Buddy', src: `${import.meta.env.BASE_URL}pups/pup2.png` },
      { id: 'snowy', name: 'Snowy', src: `${import.meta.env.BASE_URL}pups/pup3.png` },
      // Coco renamed to Milo, original Milo removed to keep 6 grid
      { id: 'milo', name: 'Milo', src: `${import.meta.env.BASE_URL}pups/pup4.png` },
      { id: 'peanut', name: 'Peanut', src: `${import.meta.env.BASE_URL}pups/pup5.png` },
      { id: 'daisy', name: 'Daisy', src: `${import.meta.env.BASE_URL}pups/pup6.png` }
    ],
    []
  );

  const [selectedPups, setSelectedPups] = useState<PupOption[]>([]);
  const [justFilledSlotIndex, setJustFilledSlotIndex] = useState<number | null>(null);

  const currentBundle = bundles[selectedBundle];

  // keep selected pups aligned to bundle qty (trim oldest first to preserve most recent choices)
  useEffect(() => {
    setSelectedPups((prev) => (prev.length > currentBundle.qty ? prev.slice(prev.length - currentBundle.qty) : prev));
  }, [currentBundle.qty]);

  // initial stock: starts mid range (orange/yellow)
  useEffect(() => {
    const initial = Math.floor(Math.random() * (170 - 110 + 1)) + 110; // 110..170
    setStock(initial);
  }, []);

  // countdown timer
  useEffect(() => {
    const t = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  // stock countdown timeout handle
  const nextDropRef = useRef<number | null>(null);

  // stock countdown: random 5-12 seconds, drop 1-4, never below 5, aims to hit ~5 around 0:35 left
  useEffect(() => {
    if (timeLeft <= 0) return;
    if (stock <= 5) return;

    if (nextDropRef.current === null) {
      nextDropRef.current = window.setTimeout(() => {
        setStock((prev) => {
          if (prev <= 5) return 5;

          const secondsTarget = 35;
          const remainingSeconds = timeLeft;

          const remainingDropsNeeded = Math.max(prev - 5, 0);
          const secondsLeftToTarget = Math.max(remainingSeconds - secondsTarget, 1);

          const urgency = remainingDropsNeeded / secondsLeftToTarget;

          const maxStep = urgency > 0.12 ? 4 : urgency > 0.08 ? 3 : urgency > 0.05 ? 2 : 1;
          const step = Math.floor(Math.random() * maxStep) + 1;

          return Math.max(prev - step, 5);
        });

        nextDropRef.current = null;
      }, Math.floor(Math.random() * (12000 - 5000 + 1)) + 5000);
    }

    return () => {
      if (nextDropRef.current !== null) {
        window.clearTimeout(nextDropRef.current);
        nextDropRef.current = null;
      }
    };
  }, [stock, timeLeft]);

  useEffect(() => {
    const maxStock = 210;
    const pct = stock / maxStock;

    if (pct > 0.55) setStockColor('bg-yellow-500');
    else if (pct > 0.25) setStockColor('bg-orange-500');
    else setStockColor('bg-red-600');

    setFlashStock(stock <= 5);
  }, [stock]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSavings = useMemo(() => {
    const savings = parseFloat(currentBundle.original) - parseFloat(currentBundle.total);
    return Math.max(savings, 0);
  }, [currentBundle]);

  // Pup selection helpers (duplicates allowed + FIFO auto-swap when full)
  const pupCount = (id: string) => selectedPups.filter((x) => x.id === id).length;

  const addPupFIFO = (p: PupOption) => {
    setSelectedPups((prev) => {
      if (currentBundle.qty <= 0) return prev;

      // space available: append
      if (prev.length < currentBundle.qty) {
        const next = [...prev, p];
        setJustFilledSlotIndex(next.length - 1);
        window.setTimeout(() => setJustFilledSlotIndex(null), 450);
        return next;
      }

      // full: FIFO swap
      const next = [...prev.slice(1), p];
      setJustFilledSlotIndex(next.length - 1);
      window.setTimeout(() => setJustFilledSlotIndex(null), 450);
      return next;
    });
  };

  const routeToPayment = () => {
    const template = ROUTES[selectedBundle];
    const url = template.replace('[EMAIL]', encodeURIComponent(email));
    window.location.href = url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        bundle: selectedBundle,
        qty: currentBundle.qty,
        amount: currentBundle.total,
        fullName,
        email,
        phone,
        country,
        address1,
        address2,
        city,
        stateRegion,
        zip,
        selectedPups: selectedPups.map((p) => p.name).join(', ')
      };

      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // ignore - still allow checkout
    }

    routeToPayment();
  };

  const headline = useMemo(() => {
    if (selectedBundle === '3') return 'Adopt Your Wagly Trio';
    if (selectedBundle === '4') return 'Bring Home the Wagly Pack';
    if (selectedBundle === '2') return 'Bring Home Two Wagly Friends';
    return 'Bring Home a Wagly Today';
  }, [selectedBundle]);

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold text-gray-800 hover:text-[#8A9A5B] transition">
            Wagly
          </Link>
          <Link to="/" className="text-gray-600 hover:text-[#8A9A5B] transition">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 overflow-x-hidden">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 text-center mb-10">{headline}</h1>

        {/* lg:grid-cols-2 restores the 50/50 split on desktop, flex-col handles mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: bundle tiles + form */}
          <div>
            {/* Top-left stock + countdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-900">
                  Only <span className={flashStock ? 'text-red-600 animate-pulse' : 'text-red-600'}>{stock}</span> items
                  left
                </div>
                <div className="text-xs text-gray-500">Left in stock</div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${stockColor} ${
                    flashStock ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${Math.min((stock / 210) * 100, 100)}%` }}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-yellow-700 flex-shrink-0" />
                <span className="text-sm text-yellow-900">
                  Hurry! Your discount is reserved for <span className="font-bold">{formatTime(timeLeft)}</span>
                </span>
              </div>
            </div>

            {/* Bundle tiles */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-4">
                {Object.entries(bundles).map(([key, bundle]) => {
                  const active = selectedBundle === key;
                  const showChooser = active; // show chooser on selected tile (including 1x)

                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedBundle(key as BundleKey)}
                      className={`relative cursor-pointer rounded-2xl border transition-all ${
                        active
                          ? 'border-[#8A9A5B] bg-[#FBFAF6] shadow-lg ring-1 ring-[#8A9A5B]'
                          : 'border-gray-200 bg-white hover:border-[#8A9A5B]'
                      }`}>
                      {/* Promo badge: Locked to top row to prevent overlapping the expanded content */}
                      <div className="absolute left-1/2 top-[32px] sm:top-[42px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#C8E6C9] bg-[#E8F5E9] whitespace-nowrap shadow-sm">
                          <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2E7D32]" />
                          <span className="text-[10px] sm:text-[12px] font-black text-[#2E7D32] uppercase tracking-tight">
                            {bundle.discount}% <span className="font-bold opacity-80">off</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between relative">
                          {/* Left Side: Dog + Name */}
                          <div className="flex items-center gap-2 sm:gap-5">
                            <div className="shrink-0">
                              <img
                                src={`${import.meta.env.BASE_URL}wagly-pup.png`}
                                alt="Wagly Pup"
                                className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-none">
                                {bundle.qty}x
                              </div>
                              <div className="text-sm sm:text-base font-bold text-gray-900">Wagly</div>
                            </div>
                          </div>

                          {/* Right Side: Price Section */}
                          <div className="shrink-0 text-right flex flex-col items-end">
                            <div className="text-[10px] sm:text-sm text-gray-400 line-through leading-none mb-1">
                              ${bundle.original}
                            </div>
                            <PriceEach price={bundle.perUnit} />

                            {/* Badges kept on right to avoid center-pill conflict */}
                            {bundle.bestSeller && (
                              <div className="mt-1 bg-[#4D91FF] text-white px-2 py-0.5 rounded text-[9px] font-black">
                                BEST SELLER
                              </div>
                            )}
                            {bundle.bestValue && (
                              <div className="mt-1 bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-black">
                                BEST VALUE
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded chooser (slots + grid) */}
                      {showChooser && (
                        <div className="border-t border-gray-200 bg-[#FBFAF6] p-5">
                          <div className="text-xl font-extrabold text-gray-900 mb-3">Choose Your Wagly</div>

                          {/* Inventory slots */}
                          <div className="flex items-center gap-3 mb-4">
                            {Array.from({ length: bundle.qty }).map((_, slotIdx) => {
                              const filled = selectedPups[slotIdx];
                              const pop = justFilledSlotIndex === slotIdx;

                              return (
                                <div
                                  key={slotIdx}
                                  className={`relative w-16 h-16 rounded-2xl border-2 bg-white flex items-center justify-center overflow-hidden transition ${
                                    filled ? 'border-[#8A9A5B]' : 'border-gray-200'
                                  } ${pop ? 'scale-105' : ''}`}>
                                  {!filled ? (
                                    <div className="text-gray-300 text-2xl font-extrabold">+</div>
                                  ) : (
                                    <>
                                      <img
                                        src={filled.src}
                                        alt={filled.name}
                                        className="w-full h-full object-contain p-2"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedPups((prev) => prev.filter((_, i) => i !== slotIdx));
                                        }}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-extrabold flex items-center justify-center hover:bg-red-600"
                                        aria-label="Remove">
                                        ×
                                      </button>
                                    </>
                                  )}
                                </div>
                              );
                            })}

                            <div className="ml-auto flex items-center">
                              {selectedPups.length === bundle.qty ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document
                                      .getElementById('completeOrderHeader')
                                      ?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="py-3 px-8 bg-[#FFD700] hover:bg-[#FFC400] text-gray-900 text-base sm:text-lg font-black rounded-xl shadow-xl transition-all transform hover:scale-105 animate-pulse border-2 border-white">
                                  YES! ADOPT MY PACK →
                                </button>
                              ) : (
                                <div className="text-sm font-semibold text-gray-700">
                                  Total Items:{' '}
                                  <span className="font-extrabold text-gray-900">{selectedPups.length}</span>/
                                  {bundle.qty}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Grid (6 pups) - grid-cols-2 for mobile (2x3), md:grid-cols-3 for desktop (3x2) */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl mx-auto">
                            {pupOptions.map((p) => {
                              const count = pupCount(p.id);

                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addPupFIFO(p);
                                  }}
                                  className={`relative rounded-2xl border bg-white p-3 transition cursor-pointer text-left ${
                                    count > 0
                                      ? 'border-[#8A9A5B] ring-2 ring-[#8A9A5B]/20'
                                      : 'border-gray-200 hover:border-[#8A9A5B]'
                                  }`}>
                                  {/* Count badge */}
                                  {count > 0 && (
                                    <div className="absolute top-2 right-2 min-w-[28px] h-7 px-2 rounded-full bg-[#8A9A5B] text-white text-xs font-extrabold flex items-center justify-center">
                                      x{count}
                                    </div>
                                  )}

                                  <div className="w-full h-28 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center bg-white">
                                    <img src={p.src} alt={p.name} className="w-full h-full object-contain p-2" />
                                  </div>

                                  <div className="mt-2 text-center font-extrabold text-gray-900">{p.name}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-6 text-center">🔋 Note: Batteries not included.</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 id="completeOrderHeader" className="text-2xl font-bold text-gray-900 mb-5 scroll-mt-24">
                Complete Your Order
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PAYMENT METHODS */}
                <div>
                  <div className="text-sm font-extrabold text-gray-900 mb-2">PAYMENT METHODS</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-900" />
                      <div>
                        <div className="font-bold text-gray-900">Card</div>
                        <div className="text-xs text-gray-600">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-gray-900" />
                      <div>
                        <div className="font-bold text-gray-900">Secure Checkout</div>
                        <div className="text-xs text-gray-600">Encrypted processing</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Payments are completed on the secure Card2Crypto checkout page.
                  </p>
                </div>

                {/* CUSTOMER INFORMATION */}
                <div>
                  <div className="text-sm font-extrabold text-gray-900 mb-2">CUSTOMER INFORMATION</div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      id="customerEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div>
                  <div className="text-sm font-extrabold text-gray-900 mb-2">DELIVERY ADDRESS</div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        id="customerInformation"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition">
                        {countries.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 mt-3">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">State / Region</label>
                      <input
                        type="text"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 outline-none transition"
                      />
                    </div>
                    <div className="sm:col-span-1" />
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  className="w-full bg-[#FFD700] text-gray-900 py-4 rounded-full font-extrabold text-lg hover:brightness-95 transition-all hover:shadow-xl">
                  Bring Wagly Home
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Securely processed via Card2Crypto. We never store your card details.
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT: totals + trust + reviews */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              {/* Total Savings + Order Summary */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-600">Total Savings</div>
                  <div className="text-sm font-extrabold text-green-600">${money(totalSavings)}</div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-600">Order Summary</div>
                  <div className="text-sm font-extrabold text-gray-900">${currentBundle.total}</div>
                </div>
              </div>

              {/* Why Choose Wagly */}
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-gray-900 mb-4 text-center">Why Choose Wagly</h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Shield className="w-8 h-8 text-[#8A9A5B] flex-shrink-0" strokeWidth={2.5} />
                    <div>
                      <p className="font-extrabold text-gray-900">30-Day Money Back Guarantee</p>
                      <p className="text-sm text-gray-600">
                        Try Wagly for 30 days. If your family is not happy, send it back for a full refund.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Users className="w-8 h-8 text-[#8A9A5B] flex-shrink-0" strokeWidth={2.5} />
                    <div>
                      <p className="font-extrabold text-gray-900">Over 14,200 Happy Wagly Families</p>
                      <p className="text-sm text-gray-600">
                        Wagly brings joy to kids and peace of mind to parents, with a growing community of happy homes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Headphones className="w-8 h-8 text-[#8A9A5B] flex-shrink-0" strokeWidth={2.5} />
                    <div>
                      <p className="font-extrabold text-gray-900">Professional Customer Support</p>
                      <p className="text-sm text-gray-600">
                        Questions about Wagly? Our team is here to help anytime, and we will make it easy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-lg font-extrabold text-gray-900 mb-3 text-center">Over 1,000 5-Star Reviews</h3>

                <div className="space-y-4">
                  {[
                    {
                      name: 'Margaret L.',
                      title: 'So adorable',
                      text: 'Bought this puppy for my grandson and he fell in love straight away 💕 First month he took it everywhere and even wanted it in bed so we had to turn it off at night 😄 Months later he still plays with it all the time. Nice to see him off the tablet too.'
                    },
                    {
                      name: 'Helen R.',
                      title: 'Lovely little toy',
                      text: 'We are really happy with this puppy. Keeps the kids busy for ages and they never seem to get tired of it. Such a good gift idea.'
                    },
                    {
                      name: 'Susan K.',
                      title: 'So much fun',
                      text: 'Did not expect it to be this interactive. It reacts to touch and sound which makes it feel more real. Every time it moves my toddler laughs so much 😂 Also helping him learn to be gentle which I really like.'
                    },
                    {
                      name: 'Daniel T.',
                      title: 'Worth it',
                      text: 'Got this for my nephew and my sister says he hardly puts it down. Seeing how happy he is makes it totally worth it. Would buy again.'
                    },
                    {
                      name: 'Patricia W.',
                      title: 'Really impressed',
                      text: 'Such a nice way to teach kids about caring for animals. Our daughter loves looking after it and you can see her learning while playing. Very happy with this purchase.'
                    }
                  ].map((r, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-extrabold text-gray-900">{r.name}</div>
                        <div className="text-xs font-bold text-green-600">Verified Buyer</div>
                      </div>
                      <div className="text-sm font-extrabold text-gray-900 mb-2">{r.title}</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition">
                    Back to Home
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Policies</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shipping Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>Phone: +1 (888) 555-0199</li>
                <li>Email: myhearthsidepets@gmail.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Secure Payment</h3>
              <p className="text-sm">We process payments securely via Card2Crypto and never store card details.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>© 2026 Wagly. All rights reserved. Made with love for families everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}