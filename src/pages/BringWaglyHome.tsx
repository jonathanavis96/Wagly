import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Shield, Star, X } from 'lucide-react';

const bundles = {
  '1': { qty: 1, perUnit: '49.99', total: '49.99', original: '124.99', discount: '60%' },
  '2': { qty: 2, perUnit: '44.99', total: '89.98', original: '249.99', discount: '64%' },
  '3': { qty: 3, perUnit: '39.99', total: '119.97', original: '374.99', discount: '68%', bestSeller: true },
  '4': { qty: 4, perUnit: '34.99', total: '139.96', original: '499.99', discount: '72%', bestValue: true },
};

export default function BringWaglyHome() {
  const [selectedBundle, setSelectedBundle] = useState('3');
  const [timeLeft, setTimeLeft] = useState(600);
  const [stock, setStock] = useState(0);
  const [stockColor, setStockColor] = useState('bg-green-600');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const initialStock = Math.floor(Math.random() * (300 - 80 + 1)) + 80;
    setStock(initialStock);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stock === 0) return;

    const interval = Math.random() * (18000 - 6000) + 6000;
    const timer = setTimeout(() => {
      setStock((prev) => (prev > 12 ? prev - 1 : 12));
    }, interval);

    return () => clearTimeout(timer);
  }, [stock]);

  useEffect(() => {
    const maxStock = 300;
    const percentage = stock / maxStock;

    if (percentage > 0.5) {
      setStockColor('bg-green-600');
    } else if (percentage > 0.25) {
      setStockColor('bg-yellow-500');
    } else {
      setStockColor('bg-red-600');
    }
  }, [stock]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = bundles[selectedBundle as keyof typeof bundles].total;
    const baseUrl = "https://pay.card2crypto.org/pay.php?address=8cFpxAKADQJdCLl%2FDfbd%2Fl7yPI0%2Bslp61k5F1CZcZ%2FtcZsQ9ox8aV%2BDR6L53oerx93ycwC%2FMiSg5oNIoVTG%2FoQ%3D%3D&provider=hosted";
    window.location.href = `${baseUrl}&amount=${amount}&email=${encodeURIComponent(email)}`;
  };

  const currentBundle = bundles[selectedBundle as keyof typeof bundles];

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold text-gray-800 hover:text-[#8A9A5B] transition">Wagly</Link>
          <Link to="/" className="text-gray-600 hover:text-[#8A9A5B] transition">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 text-center mb-12">
          Choose Your Family Bundle
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-6">
                {Object.entries(bundles).map(([key, bundle]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedBundle(key)}
                    className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${
                      selectedBundle === key
                        ? 'border-[#8A9A5B] bg-[#F9F6F0] shadow-lg'
                        : 'border-gray-200 bg-white hover:border-[#8A9A5B]'
                    }`}
                  >
                    {bundle.bestSeller && (
                      <div className="absolute -top-3 left-6 bg-[#8A9A5B] text-white px-3 py-1 rounded-full text-xs font-bold">
                        BEST SELLER
                      </div>
                    )}
                    {bundle.bestValue && (
                      <div className="absolute -top-3 right-6 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        BEST VALUE
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4 mt-2">
                      <div className="flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <span className="text-lg">🐕</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{bundle.qty}× Wagly Bundle</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Perfect for {bundle.qty === 1 ? 'one special child' : `${bundle.qty} lucky kids`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          {bundle.discount} OFF
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Price per unit</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-bold text-gray-900">${bundle.perUnit}</div>
                          <div className="text-sm text-gray-400 line-through">${bundle.original}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Total</div>
                        <div className="text-2xl font-bold text-[#8A9A5B]">${bundle.total}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedBundle === key ? 'border-[#8A9A5B] bg-[#8A9A5B]' : 'border-gray-300'
                      }`}>
                        {selectedBundle === key && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-8 text-center">
                🔋 Note: Batteries not included.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Wagly?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#8A9A5B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">30-Day Money Back</p>
                    <p className="text-sm text-gray-600">Happiness guaranteed</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-[#8A9A5B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Professional Support</p>
                    <p className="text-sm text-gray-600">Expert customer service</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#8A9A5B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Checkout</p>
                    <p className="text-sm text-gray-600">Encrypted payments</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {[
                  { name: 'Margaret T.', text: 'Best gift ever! My granddaughter loves it.', rating: 5 },
                  { name: 'Sarah L.', text: 'Quality is amazing and the customer service is wonderful.', rating: 5 },
                  { name: 'David K.', text: 'Perfect for our family with allergies!', rating: 5 },
                ].map((review, i) => (
                  <div key={i}>
                    <div className="flex gap-1 mb-1">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-[#8A9A5B] text-[#8A9A5B]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{review.text}"</p>
                    <p className="text-xs text-gray-500">— {review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Order</h2>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Only {stock} items left in stock!</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${stockColor}`} style={{ width: `${Math.min((stock / 300) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-yellow-700 flex-shrink-0" />
                <span className="text-sm text-yellow-900">
                  Hurry! Your discount is reserved for <span className="font-bold">{formatTime(timeLeft)}</span> minutes!
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B] focus:ring-opacity-20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    id="customerEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B] focus:ring-opacity-20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B] focus:ring-opacity-20 outline-none transition"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-600 mb-2">Order Total:</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">${currentBundle.total}</span>
                    <span className="text-sm text-gray-400 line-through">${currentBundle.original}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8A9A5B] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#7a8a4b] transition-all hover:shadow-xl mt-6"
                >
                  Proceed to Payment
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Securely processed via Card2Crypto. We never store your card details.
                </p>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-3 font-semibold">Shipping & Delivery</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li>✓ Ships within 24-48 hours</li>
                  <li>✓ Delivered in 5-8 business days</li>
                  <li>✓ Free shipping on orders over $100</li>
                  <li>✓ Tracking number provided</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-white transition">Back to Home</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Policies</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
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
