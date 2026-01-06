import { useState } from 'react';
import { X, Phone, Mail, MapPin } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

export function ContactModal({ onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { submitContact } = await import('../api/handler');
      await submitContact({ name, email, message });
      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('Error submitting contact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-lg font-bold text-gray-900 mb-2">
              Thanks for reaching out!
            </p>
            <p className="text-sm text-gray-600">We'll get back to you soon.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 text-sm mb-6">
              Any questions about your order or products, please don't hesitate to contact us.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#8A9A5B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600 text-sm">+1 (888) 555-0199</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#8A9A5B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 text-sm">myhearthsidepets@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8A9A5B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600 text-sm">
                    Wagly Fulfillment Center<br />
                    1000 Warehouse Way<br />
                    Ashburn, VA 20147, USA
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B] focus:ring-opacity-20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B] focus:ring-opacity-20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B] focus:ring-opacity-20 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8A9A5B] text-white py-2 rounded-lg font-bold hover:bg-[#7a8a4b] transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
