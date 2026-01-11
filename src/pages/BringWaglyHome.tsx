// BringWaglyHome.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, CreditCard, Headphones, Shield, Tag, Users } from 'lucide-react';
import Header from '../components/Header';
import TrustBar from '../components/TrustBar';
import Footer from '../components/Footer';
import { ContactModal } from '../components/ContactModal';



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

type CountryOption = {
  name: string;
  flag: string;
  code: string;
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
const PUP_IMAGE_SRC = `${import.meta.env.BASE_URL}wagly-nobackground-1.png`;

// GitHub Pages “home” should be BASE_URL (e.g. "/Wagly/"), not "/"
const HOME_PATH = (() => {
  const base = import.meta.env.BASE_URL || '/';
  if (!base.startsWith('/')) return `/${base.endsWith('/') ? base : `${base}/`}`;
  return base.endsWith('/') ? base : `${base}/`;
})();

// Stock behavior constants
const STOCK_MAX = 200; // for bar percentage + “start 50–60%”
const STOCK_MIN = 5;
const STOCK_TARGET_TIME_LEFT = 60; // at ~1 minute remaining, stock should be 5 and flashing

const countries: CountryOption[] = [
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
  { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { name: 'Italy', flag: '🇮🇹', code: 'IT' },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
  { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
  { name: 'Norway', flag: '🇳🇴', code: 'NO' },
  { name: 'Denmark', flag: '🇩🇰', code: 'DK' },
  { name: 'Ireland', flag: '🇮🇪', code: 'IE' },
  { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
  { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
  { name: 'Japan', flag: '🇯🇵', code: 'JP' },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
  { name: 'Singapore', flag: '🇸🇬', code: 'SG' },
  { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
  { name: 'Austria', flag: '🇦🇹', code: 'AT' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
  { name: 'Finland', flag: '🇫🇮', code: 'FI' },
  { name: 'Poland', flag: '🇵🇱', code: 'PL' },
  { name: 'Israel', flag: '🇮🇱', code: 'IL' },
  { name: 'United Arab Emirates', flag: '🇦🇪', code: 'AE' }
].sort((a, b) => a.name.localeCompare(b.name));

function money(n: number) {
  return n.toFixed(2);
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function PriceEach({ price }: { price: string }) {
  const [dollars, cents = '00'] = price.split('.');
  return (
    <div className="inline-flex items-start leading-tight shrink-0 pt-1">
      <span className="text-[24px] sm:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none">
        ${dollars}
      </span>
      <span className="ml-0.5 sm:ml-1 flex flex-col items-start justify-start">
        <span className="text-[12px] sm:text-[16px] font-extrabold text-gray-900 leading-none">{cents}</span>
        <span className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-tighter mt-0.5 leading-none">
          each
        </span>
      </span>
    </div>
  );
}

/** Simple, black, same-size “logos” as shield (w-6 h-6). No external assets required. */
// Apple + Google icons only (used in Payment Methods)
function AppleIcon() {
  // Simple Icons style Apple mark (black)
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.46 2.213-1.266 3.048-.822.85-2.158 1.503-3.33 1.412-.15-1.128.414-2.35 1.19-3.2.86-.95 2.365-1.64 3.406-1.26z" />
      <path d="M20.88 17.098c-.646 1.49-.956 2.158-1.79 3.47-1.16 1.82-2.8 4.09-4.83 4.11-1.8.02-2.26-1.16-4.71-1.14-2.45.02-2.96 1.16-4.76 1.14-2.03-.02-3.58-2.05-4.74-3.87C.76 18.72-.4 13.45 2.12 9.56c1.41-2.18 3.64-3.45 5.74-3.45 1.84 0 3 1.2 4.52 1.2 1.48 0 2.38-1.21 4.5-1.21 1.88 0 3.87 1.03 5.27 2.8-4.62 2.54-3.88 8.96-.27 8.2z" />
    </svg>
  );
}

function GooglePayIcon() {
  // Simple Icons style Google "G" mark (black)
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M12.24 10.285v3.432h5.665c-.228 1.23-1.412 3.61-5.665 3.61-3.41 0-6.195-2.82-6.195-6.327 0-3.506 2.785-6.327 6.195-6.327 1.94 0 3.24.82 3.985 1.532l2.71-2.61C17.3 1.72 15.04.75 12.24.75 6.97.75 2.75 4.97 2.75 10.99c0 6.02 4.22 10.24 9.49 10.24 5.49 0 9.12-3.86 9.12-9.29 0-.62-.07-1.09-.15-1.56z" />
    </svg>
  );
}

const STORAGE_KEY = 'wagly_checkout_state_v1';

export default function BringWaglyHome() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<BundleKey>('3');

  // 10 min timer
  const [timeLeft, setTimeLeft] = useState(600);

  // stock
  const [stock, setStock] = useState<number>(0);
  const [stockColor, setStockColor] = useState<string>('bg-green-600');
  const [flashStock, setFlashStock] = useState<boolean>(false);

  // form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<string>('United States'); // store country NAME (reverted to old method)
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [zip, setZip] = useState('');

  // Refs for scroll management
  const isAutoScrollingRef = useRef(false);
  const rehydratingRef = useRef(true);

  const pupOptions: PupOption[] = useMemo(
    () => [
      { id: 'teddy', name: 'Teddy', src: `${import.meta.env.BASE_URL}pups/pup1.png` },
      { id: 'buddy', name: 'Buddy', src: `${import.meta.env.BASE_URL}pups/pup2.png` },
      { id: 'snowy', name: 'Snowy', src: `${import.meta.env.BASE_URL}pups/pup3.png` },
      { id: 'milo', name: 'Milo', src: `${import.meta.env.BASE_URL}pups/pup4.png` },
      { id: 'peanut', name: 'Peanut', src: `${import.meta.env.BASE_URL}pups/pup5.png` },
      { id: 'daisy', name: 'Daisy', src: `${import.meta.env.BASE_URL}pups/pup6.png` }
    ],
    []
  );

  const [selectedPups, setSelectedPups] = useState<PupOption[]>([]);
  const [justFilledSlotIndex, setJustFilledSlotIndex] = useState<number | null>(null);

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentBundle = bundles[selectedBundle];

  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedBundle) setSelectedBundle(parsed.selectedBundle);
        if (parsed.selectedPups) setSelectedPups(parsed.selectedPups);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.country) setCountry(parsed.country);
        if (parsed.address1) setAddress1(parsed.address1);
        if (parsed.address2) setAddress2(parsed.address2);
        if (parsed.city) setCity(parsed.city);
        if (parsed.stateRegion) setStateRegion(parsed.stateRegion);
        if (parsed.zip) setZip(parsed.zip);
      }
    } catch (err) {
      console.warn('Failed to load checkout state:', err);
    } finally {
      // Mark rehydration complete after a frame to avoid triggering scroll effects
      requestAnimationFrame(() => {
        rehydratingRef.current = false;
      });
    }
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    if (rehydratingRef.current) return; // Skip during initial rehydration
    try {
      const state = {
        selectedBundle,
        selectedPups,
        fullName,
        email,
        phone,
        country,
        address1,
        address2,
        city,
        stateRegion,
        zip
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save checkout state:', err);
    }
  }, [selectedBundle, selectedPups, fullName, email, phone, country, address1, address2, city, stateRegion, zip]);

  // keep selected pups aligned to bundle qty (trim oldest first to preserve most recent choices)
  useEffect(() => {
    setSelectedPups((prev) => (prev.length > currentBundle.qty ? prev.slice(prev.length - currentBundle.qty) : prev));
  }, [currentBundle.qty]);

  // initial stock: starts around 50–60% of total (green)
  useEffect(() => {
    const initial = randInt(Math.floor(STOCK_MAX * 0.5), Math.floor(STOCK_MAX * 0.6));
    setStock(initial);
  }, []);

  // country via IP (fallback to USA)
  useEffect(() => {
    let cancelled = false;

    async function detectCountry() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) return;
        const data = (await res.json()) as { country_code?: string };
        const code = (data.country_code || '').toUpperCase();
        const match = countries.find((c) => c.code === code);
        if (!cancelled && match) setCountry(match.name);
      } catch {
        // ignore (fallback remains United States)
      }
    }

    detectCountry();
    return () => {
      cancelled = true;
    };
  }, []);

  // discount countdown timer
  useEffect(() => {
    const t = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  // ---- Stock countdown (self-scheduling timeout loop, does not get cancelled every second) ----
  const timeLeftRef = useRef<number>(timeLeft);
  const stockRef = useRef<number>(stock);
  const stockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    stockRef.current = stock;
  }, [stock]);

  const computeNextDropDelayMs = (curStock: number, curTimeLeft: number) => {
    if (curTimeLeft <= STOCK_TARGET_TIME_LEFT) return null;
    if (curStock <= STOCK_MIN) return null;

    const timeWindow = Math.max(curTimeLeft - STOCK_TARGET_TIME_LEFT, 1);
    const remainingUnits = Math.max(curStock - STOCK_MIN, 0);
    const avgDrop = 2.5; // average of 1..4
    const dropsNeeded = Math.max(1, Math.ceil(remainingUnits / avgDrop));

    const baseIntervalSec = timeWindow / dropsNeeded;
    const intervalSec = clamp(baseIntervalSec, 4, 12);
    const jitter = 0.7 + Math.random() * 0.6; // 0.7..1.3
    return Math.floor(intervalSec * jitter * 1000);
  };

  useEffect(() => {
    if (stock <= 0) return;

    const scheduleNext = () => {
      const tl = timeLeftRef.current;
      const st = stockRef.current;

      if (tl <= STOCK_TARGET_TIME_LEFT) {
        stockRef.current = STOCK_MIN;
        setStock(STOCK_MIN);
        setFlashStock(true);
        setStockColor('bg-red-600');
        return;
      }

      if (st <= STOCK_MIN) {
        stockRef.current = STOCK_MIN;
        setStock(STOCK_MIN);
        setFlashStock(true);
        setStockColor('bg-red-600');
        return;
      }

      const delay = computeNextDropDelayMs(st, tl);
      if (delay === null) return;

      stockTimerRef.current = window.setTimeout(() => {
        const nowTimeLeft = timeLeftRef.current;
        const nowStock = stockRef.current;

        if (nowTimeLeft <= STOCK_TARGET_TIME_LEFT) {
          stockRef.current = STOCK_MIN;
          setStock(STOCK_MIN);
          setFlashStock(true);
          setStockColor('bg-red-600');
          return;
        }

        if (nowStock <= STOCK_MIN) {
          stockRef.current = STOCK_MIN;
          setStock(STOCK_MIN);
          setFlashStock(true);
          setStockColor('bg-red-600');
          return;
        }

        const step = randInt(1, 4);
        const next = Math.max(nowStock - step, STOCK_MIN);

        stockRef.current = next;
        setStock(next);

        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (stockTimerRef.current !== null) {
        window.clearTimeout(stockTimerRef.current);
        stockTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock > 0]);

  // Stock bar color + flashing
  useEffect(() => {
    const pct = stock / STOCK_MAX;

    if (stock <= STOCK_MIN) {
      setStockColor('bg-red-600');
      setFlashStock(true);
      return;
    }

    setFlashStock(false);

    // green -> yellow -> orange -> red
    if (pct > 0.45) setStockColor('bg-green-600');
    else if (pct > 0.3) setStockColor('bg-yellow-500');
    else if (pct > 0.18) setStockColor('bg-orange-500');
    else setStockColor('bg-red-600');
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

      if (prev.length < currentBundle.qty) {
        const next = [...prev, p];
        setJustFilledSlotIndex(next.length - 1);
        window.setTimeout(() => setJustFilledSlotIndex(null), 450);
        return next;
      }

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
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

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

    try {
      const { submitToFormspree } = await import('../api/formspree');
      const result = await submitToFormspree(FORMSPREE_ENDPOINT, payload);

      if (result.success) {
        setSubmitSuccess(true);
        // Clear localStorage on successful order
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
          console.warn('Failed to clear checkout state:', err);
        }
        // Brief delay to show success, then redirect to payment
        setTimeout(() => {
          routeToPayment();
        }, 1000);
      } else {
        setSubmitError(result.error || 'Failed to submit. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Network error. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  const headline = useMemo(() => {
    if (selectedBundle === '3') return 'Adopt Your Wagly Trio';
    if (selectedBundle === '4') return 'Bring Home the Wagly Pack';
    if (selectedBundle === '2') return 'Bring Home Two Wagly Friends';
    return 'Bring Home a Wagly Today';
  }, [selectedBundle]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F6F0] to-white">
      <Header />
      <TrustBar />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center font-serif text-3xl font-bold text-gray-900 md:text-4xl">{headline}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT */}
          <div>
            {/* Stock + countdown */}
            <style>{`
  @keyframes waglyStockFlash {
    0%, 100% {
      background-color: #ffffff;
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
    50% {
      background-color: #fee2e2; /* light red */
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0.18); /* red glow */
    }
  }
`}</style>

            <div
              className={`bg-white rounded-2xl p-5 shadow-md border-2 transition ${
                flashStock ? 'border-red-600 animate-[waglyStockFlash_0.9s_ease-in-out_infinite]' : 'border-transparent'
              }`}>
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
                  style={{ width: `${Math.min((stock / STOCK_MAX) * 100, 100)}%` }}
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
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 md:text-2xl">Choose Your Bundle</h2>

              <div className="space-y-4">
                {Object.entries(bundles).map(([key, bundle]) => {
                  const active = selectedBundle === key;
                  const showChooser = active;

                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedBundle(key as BundleKey)}
                      className={`relative cursor-pointer rounded-2xl border transition-all ${
                        active
                          ? 'border-[#8A9A5B] bg-[#FBFAF6] shadow-lg ring-1 ring-[#8A9A5B]'
                          : 'border-gray-200 bg-white hover:border-[#8A9A5B]'
                      }`}>
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
                          <div className="flex items-center gap-2 sm:gap-5">
                            <div className="shrink-0">
                              <img
                                src={PUP_IMAGE_SRC}
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

                          <div className="shrink-0 text-right flex flex-col items-end">
                            <div className="text-[10px] sm:text-sm text-gray-400 line-through leading-none mb-1">
                              ${bundle.original}
                            </div>
                            <PriceEach price={bundle.perUnit} />

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

                      {showChooser && (
                        <div className="border-t border-gray-200 bg-[#FBFAF6] p-5">
                          <div className="text-xl font-extrabold text-gray-900 mb-3">Choose Your Wagly</div>

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
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    isAutoScrollingRef.current = true;
                                    
                                    // Wait for any layout changes, then scroll to payment section
                                    requestAnimationFrame(() => {
                                      requestAnimationFrame(() => {
                                        const target = document.getElementById('paymentSecure');
                                        if (target) {
                                          // Get the target's position
                                          const rect = target.getBoundingClientRect();
                                          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                                          const targetTop = rect.top + scrollTop;
                                          
                                          // Scroll so the target is at the top of the viewport
                                          window.scrollTo({
                                            top: targetTop,
                                            behavior: 'smooth'
                                          });
                                          
                                          // Release the auto-scroll lock after animation completes
                                          setTimeout(() => {
                                            isAutoScrollingRef.current = false;
                                          }, 1000);
                                        }
                                      });
                                    });
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
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h2 id="completeOrderHeader" className="text-xl font-bold text-gray-900 mb-5 scroll-mt-24 md:text-2xl">
                Complete Your Order
              </h2>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* PAYMENT METHODS */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-3 md:text-sm">Payment Methods</div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Secure Checkout */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <Shield className="w-6 h-6 text-gray-900 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-gray-900">Secure Checkout</div>
                        <div className="text-xs text-gray-600">Encrypted processing</div>
                      </div>
                    </div>

                    {/* Card Payments (text only, no logos) */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <CreditCard className="w-6 h-6 text-gray-900 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-gray-900">Card Payments</div>
                        <div className="text-xs text-gray-600">Visa, MasterCard, AMEX</div>
                      </div>
                    </div>

                    {/* Apple Pay (black Apple logo) */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <div className="w-6 h-6 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                          <AppleIcon />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Apple Pay</div>
                        <div className="text-xs text-gray-600">Fast checkout on Apple devices</div>
                      </div>
                    </div>

                    {/* Robinhood */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <div className="w-6 h-6 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                          <path
                            d="M18 6c-6 0-10 4.7-10 10.5V20l2.5-2.2c3.2-2.8 4.3-4.1 4.3-6.3 0-1.7 1.2-3 3.2-5.5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Robinhood</div>
                        <div className="text-xs text-gray-600">Supported payment option</div>
                      </div>
                    </div>

                    {/* PayPal */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <div className="w-6 h-6 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                          <path
                            d="M7 20l2-14h6.2c2.5 0 4 1.4 4 3.4 0 3.1-2.4 5.3-6.2 5.3H10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          <path d="M5 20l2-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">PayPal</div>
                        <div className="text-xs text-gray-600">Pay with your PayPal balance or linked methods</div>
                      </div>
                    </div>

                    {/* Google Pay (black Google "G" mark style) */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                      <div className="w-6 h-6 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <GooglePayIcon />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Google Pay</div>
                        <div className="text-xs text-gray-600">Quick checkout on supported devices</div>
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="rounded-xl border border-gray-200 p-4 flex items-start gap-3 sm:col-span-2">
                      <div className="w-6 h-6 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                          <path d="M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path
                            d="M6 10V19M10 10V19M14 10V19M18 10V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path d="M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4 10l8-5 8 5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Bank Transfer</div>
                        <div className="text-xs text-gray-600">Available on the secure checkout page</div>
                      </div>
                    </div>
                  </div>

                  <p id="paymentSecure" className="text-xs text-gray-500 mt-2">
                    Payments are completed on the secure Card2Crypto checkout page.
                  </p>
                </div>

                {/* CUSTOMER INFORMATION */}
                <div className="scroll-mt-20">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-3 md:text-sm">Customer Information</div>

                  <div className="grid sm:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
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
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-3 md:text-sm">Delivery Address</div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
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

                {/* Error message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Success message */}
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-semibold text-green-900">Order details saved! Redirecting to payment...</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="w-full bg-[#FFD700] text-gray-900 py-4 rounded-full font-extrabold text-lg hover:brightness-95 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : submitSuccess ? (
                    'Redirecting...'
                  ) : (
                    'Bring Wagly Home'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Securely processed via Card2Crypto. We never store your card details.
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 sticky top-24">
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

              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-lg font-extrabold text-gray-900 mb-3 text-center">Over 1,000 5-Star Reviews</h3>

                <div className="space-y-4">
                  {[
                    {
                      name: 'Mary',
                      title: 'So adorable',
                      text: 'Bought this puppy for my grandson and he fell in love straight away 💕 First month he took it everywhere and even wanted it in bed so we had to turn it off at night 😄 Months later he still plays with it all the time. Nice to see him off the tablet too.'
                    },
                    {
                      name: 'Helen Rosburg',
                      title: 'Lovely little toy',
                      text: 'We are really happy with this puppy. Keeps the kids busy for ages and they never seem to get tired of it. Such a good gift idea.'
                    },
                    {
                      name: 'Susan Chan',
                      title: 'So much fun',
                      text: 'Did not expect it to be this interactive. It reacts to touch and sound which makes it feel more real. Every time it moves my toddler laughs so much 😂 Also helping him learn to be gentle which I really like.'
                    },
                    {
                      name: 'Daniel Tompson',
                      title: 'Worth it',
                      text: 'Got this for my nephew and my sister says he hardly puts it down. Seeing how happy he is makes it totally worth it. Would buy again.'
                    },
                    {
                      name: 'Patricia',
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

      <Footer homeHref={HOME_PATH} showBackToHome className="mt-16" onOpenContact={() => setShowContactModal(true)} />
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
