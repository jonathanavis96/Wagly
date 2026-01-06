import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, Shield, Sparkles, Clock, Phone, Mail, MapPin, X, Star } from 'lucide-react';
import { ReviewModal } from '../components/ReviewModal';
import { ContactModal } from '../components/ContactModal';

const reviews = [
  {
    id: 1,
    name: 'Margaret T.',
    title: 'Grandmother',
    text: 'My granddaughter absolutely adores Wagly! It\'s the perfect gift for a child who wants a pet but lives in an apartment.',
    rating: 5,
    upvotes: 20,
    downvotes: 0,
  },
  {
    id: 2,
    name: 'Sarah L.',
    title: 'Parent',
    text: 'Finally, a toy that keeps my son engaged without a screen. He takes Wagly everywhere and has learned so much about caring for animals.',
    rating: 5,
    upvotes: 39,
    downvotes: 1,
  },
  {
    id: 3,
    name: 'David K.',
    title: 'Father of Two',
    text: 'We have severe allergies, so a real dog was never an option. Wagly has brought so much joy to our home without any sniffles!',
    rating: 5,
    upvotes: 10,
    downvotes: 0,
  },
  {
    id: 4,
    name: 'Jennifer M.',
    title: 'Aunt',
    text: 'Best gift I\'ve ever given! Both kids play with it together, and it\'s so gentle and well-made.',
    rating: 5,
    upvotes: 8,
    downvotes: 0,
  },
  {
    id: 5,
    name: 'Robert H.',
    title: 'Grandfather',
    text: 'Quality is fantastic. My grandson has had it for 2 months and still loves it just as much as day one.',
    rating: 5,
    upvotes: 4,
    downvotes: 0,
  },
  {
    id: 6,
    name: 'Lisa B.',
    title: 'Teacher',
    text: 'Recommended this to parents with allergy concerns. They were thrilled with the purchase.',
    rating: 5,
    upvotes: 15,
    downvotes: 0,
  },
  {
    id: 7,
    name: 'Tom W.',
    title: 'Parent',
    text: 'Excellent company. Fast shipping and great customer service when I had questions.',
    rating: 5,
    upvotes: 12,
    downvotes: 0,
  },
  {
    id: 8,
    name: 'Caroline P.',
    title: 'Grandmother',
    text: 'It\'s perfect for my grandchild who lives overseas. Shipping was quick and packaging was beautiful.',
    rating: 5,
    upvotes: 18,
    downvotes: 0,
  },
  {
    id: 9,
    name: 'Michael J.',
    title: 'Father',
    text: 'Not just a toy, it\'s an investment in my child\'s happiness and learning.',
    rating: 5,
    upvotes: 7,
    downvotes: 0,
  },
  {
    id: 10,
    name: 'Patricia S.',
    title: 'Parent',
    text: 'Good quality, though I wish the battery compartment was easier to access. Otherwise, highly recommend!',
    rating: 4,
    upvotes: 6,
    downvotes: 2,
  },
];

interface ReviewItem {
  id: number;
  name: string;
  title: string;
  text: string;
  rating: number;
  upvotes: number;
  downvotes: number;
}

export default function Home() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState<ReviewItem[]>(reviews.slice(0, 3));
  const [reviewVotes, setReviewVotes] = useState<Record<number, { upvotes: number; downvotes: number }>>({});
  const [userVotes, setUserVotes] = useState<Record<number, 'up' | 'down' | null>>({});

  useEffect(() => {
    const initialVotes: Record<number, { upvotes: number; downvotes: number }> = {};
    reviews.forEach(review => {
      initialVotes[review.id] = { upvotes: review.upvotes, downvotes: review.downvotes };
    });
    setReviewVotes(initialVotes);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadMore = () => {
    const newCount = Math.min(displayedReviews.length + 3, reviews.length);
    setDisplayedReviews(reviews.slice(0, newCount));
  };

  const handleVote = (reviewId: number, direction: 'up' | 'down') => {
    const currentVote = userVotes[reviewId];

    setReviewVotes(prev => {
      const updated = { ...prev[reviewId] };

      if (currentVote === direction) {
        if (direction === 'up') updated.upvotes--;
        else updated.downvotes--;
        setUserVotes(prev => ({ ...prev, [reviewId]: null }));
      } else {
        if (currentVote === 'up') updated.upvotes--;
        if (currentVote === 'down') updated.downvotes--;
        if (direction === 'up') updated.upvotes++;
        else updated.downvotes++;
        setUserVotes(prev => ({ ...prev, [reviewId]: direction }));
      }

      return { ...prev, [reviewId]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-gray-800">Wagly</div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-600 hover:text-[#8A9A5B] transition">Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-gray-600 hover:text-[#8A9A5B] transition">How It Works</a>
            <a href="#reviews" onClick={(e) => scrollToSection(e, 'reviews')} className="text-gray-600 hover:text-[#8A9A5B] transition">Reviews</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-gray-600 hover:text-[#8A9A5B] transition">FAQ</a>
            <button onClick={() => setShowContactModal(true)} className="text-gray-600 hover:text-[#8A9A5B] transition">Contact</button>
            <Link to="/bring-wagly-home" className="bg-[#8A9A5B] text-white px-6 py-2 rounded-full hover:bg-[#7a8a4b] transition">
              Bring Wagly Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="bg-[#8A9A5B] text-white py-3 text-center">
        <p className="text-sm md:text-base">Limited-Time Family Offer | Save Up to 72% Today</p>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#8A9A5B] text-[#8A9A5B]" />
            ))}
            <span className="text-gray-600 ml-2">4.7 (3,000+ reviews)</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Meet Wagly — The Puppy That Brings Joy Without the Mess
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed" style={{ lineHeight: '1.6' }}>
            All the love of a puppy, without the shedding or accidents. A handcrafted companion designed for screen-free play and lasting family memories.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#8A9A5B]" />
              <span className="text-gray-700">30-Day Happiness Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#8A9A5B]" />
              <span className="text-gray-700">Family-Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#8A9A5B]" />
              <span className="text-gray-700">Allergy-Safe</span>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-3xl shadow-xl p-12 aspect-video flex items-center justify-center">
            <p className="text-gray-400 text-lg">Interactive Wagly Product Display</p>
          </div>

          <Link to="/bring-wagly-home" className="inline-block mt-12 bg-[#8A9A5B] text-white px-8 py-4 rounded-full hover:bg-[#7a8a4b] transition font-bold text-lg">
            Get Up to 68% Discount
          </Link>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
            A Gift They'll Remember
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
            Watch their face light up when Wagly walks, wags, and barks—a gift that creates real moments, not screen time.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Joy Without the Mess</h3>
            <p className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
              No shedding, no accidents, no allergies. All the cuddles and companionship your family craves, with none of the cleanup.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Building Healthy Routines</h3>
            <p className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
              Gentle bedtime cuddles, encouraging kindness, and empathy. Wagly helps children develop nurturing habits naturally.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-16">
            Thoughtfully Designed Features
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Interactive Motion', desc: 'Walks, wags, and responds to touch' },
              { title: 'Touch-Responsive', desc: 'Sensors detect petting and cuddles' },
              { title: 'Soft & Odorless', desc: 'Premium plush materials' },
              { title: 'Works Everywhere', desc: 'All floor types supported' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#F9F6F0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#8A9A5B]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8A9A5B] mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Your Wagly</h3>
              <p className="text-gray-600">Choose your bundle and complete checkout securely.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8A9A5B] mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Ships within 24-48 hours. Arrives in 5-8 business days.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8A9A5B] mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Memories</h3>
              <p className="text-gray-600">Watch your family fall in love with their new companion.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900">
            What Families Are Saying
          </h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#8A9A5B] text-white px-6 py-2 rounded-full hover:bg-[#7a8a4b] transition"
          >
            Write a Review
          </button>
        </div>

        <div className="space-y-6 mb-8">
          {displayedReviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#8A9A5B] text-[#8A9A5B]" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{review.text}</p>
                  <p className="text-sm text-gray-500 font-medium">— {review.name}, {review.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Was this helpful?</span>
                <button
                  onClick={() => handleVote(review.id, 'up')}
                  className={`flex items-center gap-1 text-sm transition ${
                    userVotes[review.id] === 'up'
                      ? 'text-[#8A9A5B] font-bold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>👍</span>
                  <span>{(reviewVotes[review.id]?.upvotes || 0)}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, 'down')}
                  className={`flex items-center gap-1 text-sm transition ${
                    userVotes[review.id] === 'down'
                      ? 'text-red-600 font-bold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>👎</span>
                  <span>{(reviewVotes[review.id]?.downvotes || 0)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayedReviews.length < reviews.length && (
          <button
            onClick={handleLoadMore}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition"
          >
            Load More Reviews
          </button>
        )}
      </section>

      <section id="faq" className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What batteries does Wagly need?',
                a: 'Wagly requires 2x AA batteries (not included). They typically last 20-30 hours of active play.',
              },
              {
                q: 'Is there a return policy?',
                a: 'Yes! We offer a 30-day money-back guarantee. If your child doesn\'t fall in love with Wagly, we\'ll refund you completely.',
              },
              {
                q: 'How long does shipping take?',
                a: 'Orders ship within 24-48 hours and typically arrive in 5-8 business days with standard shipping.',
              },
              {
                q: 'Is Wagly safe for children with allergies?',
                a: 'Yes. Wagly is hypoallergenic and odorless, making it perfect for families with pet allergies.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#8A9A5B] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-6">The Grandparent Promise</h2>
          <p className="text-xl leading-relaxed mb-8" style={{ lineHeight: '1.6' }}>
            If your grandchild doesn't fall in love within 30 days, we'll buy it back—no questions asked.
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition">Contact Us</button></li>
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
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

      {showReviewModal && <ReviewModal onClose={() => setShowReviewModal(false)} />}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
