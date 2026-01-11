import { ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    { icon: Truck, text: 'Free Shipping' },
    { icon: RefreshCw, text: '30-Day Returns' },
    { icon: Heart, text: 'Safe for Kids' },
    { icon: ShieldCheck, text: 'Secure Checkout' },
  ];

  return (
    <div className="border-y border-gray-200 bg-[#F9F6F0]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 text-sm"
            >
              <item.icon className="h-5 w-5 flex-shrink-0 text-[#8A9A5B]" />
              <span className="font-medium text-gray-800">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
