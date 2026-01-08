import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Battery,
  Bot,
  Check,
  Gift,
  HandHeart,
  Heart,
  HeartHandshake,
  MessageCircle,
  Package,
  Palette,
  PawPrint,
  Power,
  Shield,
  Sparkles,
  Star,
  Volume2,
  WifiOff,
  X
} from 'lucide-react';
import { ReviewModal } from '../components/ReviewModal';
import { ContactModal } from '../components/ContactModal';
import Footer from '../components/Footer';

interface ReviewItem {
  id: number;
  name: string;
  title: string;
  text: string;
  rating: number;
  upvotes: number;
  downvotes: number;
  photos?: string[]; // optional thumbnails in the review card
}

function OthersDogIcon({ className = 'w-10 h-10' }: { className?: string }) {
  // Clear dog-head icon (more recognizable than the previous abstract lines)
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* ears */}
      <path
        d="M18 22c-5-4-9-4-11 0 2 7 6 10 11 11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 22c5-4 9-4 11 0-2 7-6 10-11 11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* head */}
      <path
        d="M22 26c0-7 5-12 10-12s10 5 10 12v12c0 6-5 11-10 11s-10-5-10-11V26Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* snout + mouth */}
      <path
        d="M26 34c2 2 4 3 6 3s4-1 6-3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 40c1 1 3 1 4 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* nose */}
      <path d="M32 37.5h0.01" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const BASE = import.meta.env.BASE_URL;

  // Ensures images work on both localhost and GH Pages (/Wagly/)
  const withBase = (src: string) => {
    if (!src) return src;
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith('/')) return `${BASE}${src.slice(1)}`;
    return `${BASE}${src}`;
  };

  const WAGLY_IMG = withBase('/wagly-nobackground-1.png');

  // Updated review names to match your distribution:
  // 40% first-name only, 20% full surname, 20% first-letter surname, 20% anonymous
  const reviews: ReviewItem[] = [
    {
      id: 1,
      name: 'Margaret Thompson', // full surname
      title: 'Grandmother',
      text: "My granddaughter absolutely adores Wagly. It's the sweetest little companion and such a lovely gift.",
      rating: 5,
      upvotes: 20,
      downvotes: 0,
      photos: ['/wagly-pup.png', '/steps/step2.avif']
    },
    {
      id: 2,
      name: 'Sarah', // first name only
      title: 'Parent',
      text: "Finally something that keeps my little one busy without a screen. He talks to it like it's real and it melts my heart.",
      rating: 5,
      upvotes: 39,
      downvotes: 1,
      photos: ['/steps/step1.avif']
    },
    {
      id: 3,
      name: 'Anonymous',
      title: 'Verified Buyer', // will render as Anonymous (Verified Buyer)
      text: 'We have allergies so a real dog is not possible. Wagly gives the kids that puppy joy without the sneezes.',
      rating: 5,
      upvotes: 10,
      downvotes: 0,
      photos: ['/wagly-pup.png']
    },
    {
      id: 4,
      name: 'Jennifer', // first name only
      title: 'Aunt',
      text: 'Best gift I have given in ages. The kids play together and it feels really well made.',
      rating: 5,
      upvotes: 8,
      downvotes: 0,
      photos: ['/steps/step3.avif']
    },
    {
      id: 5,
      name: 'Robert H', // first letter surname (no dot)
      title: 'Grandfather',
      text: 'Quality is excellent. My grandson still loves it weeks later and it has held up beautifully.',
      rating: 5,
      upvotes: 4,
      downvotes: 0
    },
    {
      id: 6,
      name: 'Lisa', // first name only
      title: 'Teacher',
      text: 'I recommend Wagly to families who want gentle, imaginative play. It is a lovely alternative to more screen time.',
      rating: 5,
      upvotes: 15,
      downvotes: 0
    },
    {
      id: 7,
      name: 'Tom', // first name only
      title: 'Parent',
      text: 'Fast shipping and helpful support when I had a question. The toy itself is adorable.',
      rating: 5,
      upvotes: 12,
      downvotes: 0
    },
    {
      id: 8,
      name: 'Caroline Patel', // full surname
      title: 'Grandmother',
      text: 'Perfect for sending overseas to my grandchild. Came nicely packaged and the smiles were priceless.',
      rating: 5,
      upvotes: 18,
      downvotes: 0,
      photos: ['/wagly-pup.png']
    },
    {
      id: 9,
      name: 'Michael J', // first letter surname (no dot)
      title: 'Father',
      text: "Not just a toy, it becomes a little buddy. My daughter is so gentle with it and that's been wonderful to see.",
      rating: 5,
      upvotes: 7,
      downvotes: 0
    },
    {
      id: 10,
      name: 'Patricia', // first name only
      title: 'Parent',
      text: 'Really cute and the reactions are sweet. Battery compartment could be a bit easier, but overall very happy.',
      rating: 4,
      upvotes: 6,
      downvotes: 2
    }
  ];

  const [displayedReviews, setDisplayedReviews] = useState<ReviewItem[]>(reviews.slice(0, 3));
  const [reviewVotes, setReviewVotes] = useState<Record<number, { upvotes: number; downvotes: number }>>({});
  const [userVotes, setUserVotes] = useState<Record<number, 'up' | 'down' | null>>({});

  // Reviews summary (requested numbers)
  const reviewSummary = useMemo(() => {
    const total = 1132;
    const counts = {
      5: 850,
      4: 240,
      3: 31,
      2: 5,
      1: 6
    } as Record<1 | 2 | 3 | 4 | 5, number>;

    const weighted = 5 * counts[5] + 4 * counts[4] + 3 * counts[3] + 2 * counts[2] + 1 * counts[1];
    const avg = weighted / total;

    return {
      total,
      counts,
      averageDisplay: 4.7,
      averageExact: avg,
      recommendPercent: 97,
      barsRight: [
        { label: 'Results', value: 96 },
        { label: 'Quality', value: 95 },
        { label: 'Satisfaction', value: 94 }
      ]
    };
  }, []);

  useEffect(() => {
    const initialVotes: Record<number, { upvotes: number; downvotes: number }> = {};
    reviews.forEach((review) => {
      initialVotes[review.id] = { upvotes: review.upvotes, downvotes: review.downvotes };
    });
    setReviewVotes(initialVotes);
  }, [reviews]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    const newCount = Math.min(displayedReviews.length + 3, reviews.length);
    setDisplayedReviews(reviews.slice(0, newCount));
  };

  const handleVote = (reviewId: number, direction: 'up' | 'down') => {
    const currentVote = userVotes[reviewId];

    setReviewVotes((prev) => {
      const updated = { ...prev[reviewId] };

      if (currentVote === direction) {
        if (direction === 'up') updated.upvotes--;
        else updated.downvotes--;
        setUserVotes((p) => ({ ...p, [reviewId]: null }));
      } else {
        if (currentVote === 'up') updated.upvotes--;
        if (currentVote === 'down') updated.downvotes--;
        if (direction === 'up') updated.upvotes++;
        else updated.downvotes++;
        setUserVotes((p) => ({ ...p, [reviewId]: direction }));
      }

      return { ...prev, [reviewId]: updated };
    });
  };

  const [openFaqKey, setOpenFaqKey] = useState<string | null>('realistic');

  const faqs: Array<{ key: string; q: string; a: string }> = [
    {
      key: 'realistic',
      q: 'How realistic is Wagly compared to other robot puppy toys?',
      a: 'Wagly is made to feel like a real little puppy friend. It reacts to gentle touch, makes sweet sounds, and has playful movements that kids love. It is not just a repeating toy, it feels more personal and cozy.'
    },
    {
      key: 'ai',
      q: 'What does “AI-powered” mean here?',
      a: 'It means Wagly responds in a more natural way during play. When your child talks, pets, or interacts, Wagly can react with different little behaviors so play feels less predictable and more like a real companion.'
    },
    {
      key: 'wifi',
      q: 'Does Wagly need Wi-Fi or an app?',
      a: 'No. Wagly works right out of the box. No Wi-Fi, no app, and no setup headaches. Just pop in the batteries and you are ready to go.'
    },
    {
      key: 'age',
      q: 'What age is Wagly best for?',
      a: 'Most families love Wagly for ages 3 and up. Younger kids also enjoy it with adult supervision, especially during gentle playtime.'
    },
    {
      key: 'batteries',
      q: 'What batteries does Wagly need, and how long do they last?',
      a: 'Wagly uses AA batteries. Battery life depends on playtime, but most families get many happy play sessions before needing a change.'
    },
    {
      key: 'noise',
      q: 'Is it loud?',
      a: 'It is designed to be family-friendly. The sounds are cute and not harsh. Many grandparents tell us it is much nicer than noisy plastic toys.'
    },
    {
      key: 'allergies',
      q: 'Will it shed or trigger allergies?',
      a: 'Wagly is plush and allergy-friendly for most families. No shedding like a real pet, and no dander. If your family has severe allergies, it is still a great option compared to a real dog.'
    },
    {
      key: 'clean',
      q: 'How do I clean Wagly?',
      a: 'A gentle surface wipe is best. Use a slightly damp cloth and mild soap if needed, then let it air dry.'
    },
    {
      key: 'returns',
      q: 'What if my child does not love it?',
      a: 'You are covered with a 30-day money-back guarantee. If it is not the right fit, we will help you with a return so you can shop with confidence.'
    },
    {
      key: 'shipping',
      q: 'How long does shipping take?',
      a: 'Orders typically ship quickly and arrive in a few business days depending on your location. You will receive tracking as soon as it is on the way.'
    },
    {
      key: 'support',
      q: 'How do I reach support if I have questions?',
      a: 'You can contact us anytime and we will help you. We know gift shopping can be stressful, so we keep support friendly and simple.'
    }
  ];

  const attributionText = (review: ReviewItem) => {
    if (review.name === 'Anonymous') return 'Anonymous (Verified Buyer)';
    if (!review.title) return review.name;
    return `${review.name} (${review.title})`;
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-gray-800">Wagly</div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-gray-600 hover:text-[#8A9A5B] transition">
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="text-gray-600 hover:text-[#8A9A5B] transition">
              How It Works
            </a>
            <a
              href="#reviews"
              onClick={(e) => scrollToSection(e, 'reviews')}
              className="text-gray-600 hover:text-[#8A9A5B] transition">
              Reviews
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, 'faq')}
              className="text-gray-600 hover:text-[#8A9A5B] transition">
              FAQ
            </a>
            <button onClick={() => setShowContactModal(true)} className="text-gray-600 hover:text-[#8A9A5B] transition">
              Contact
            </button>

            <Link
              to="/bring-wagly-home"
              className="bg-[#8A9A5B] text-white px-6 py-2 rounded-full hover:bg-[#7a8a4b] transition font-semibold">
              Bring Wagly Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Promo bar */}
      <div className="bg-[#8A9A5B] text-white py-3 text-center">
        <p className="text-sm md:text-base">Limited-Time Family Offer | Save Up to 72% Today</p>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#8A9A5B] text-[#8A9A5B]" />
            ))}
            <span className="text-gray-600 ml-2">4.7 (1,132 reviews)</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Meet Wagly, the Puppy That Brings Family Joy
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed" style={{ lineHeight: '1.6' }}>
            All the love of a puppy, without the stress. A cozy companion designed for screen-free play, sweet routines,
            and real family moments.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#8A9A5B]" />
              <span className="text-gray-700">30-Day Happiness Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#8A9A5B]" />
              <span className="text-gray-700">Family-Approved Gift</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#8A9A5B]" />
              <span className="text-gray-700">Allergy-Friendly</span>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-3xl shadow-xl p-12 aspect-video flex items-center justify-center">
            <p className="text-gray-400 text-lg">Interactive Wagly Product Display</p>
          </div>

          <Link
            to="/bring-wagly-home"
            className="inline-block mt-12 bg-[#8A9A5B] text-white px-8 py-4 rounded-full hover:bg-[#7a8a4b] transition font-bold text-lg">
            Get Up to 72% Off
          </Link>

          <p className="text-sm text-gray-500 mt-3">Limited stock available at the discounted bundles.</p>
        </div>
      </section>

      {/* Your Best Wagly Friend */}
      <section className="bg-[#F9F6F0] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Your Best Wagly Friend</h2>
          <div className="w-20 h-1 bg-[#8A9A5B] mx-auto rounded-full mb-8" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ lineHeight: '1.6' }}>
            Handcrafted to bring joy to every family, with sweet details kids love and grown-ups appreciate.
          </p>

          <div className="mt-14 grid md:grid-cols-3 gap-10 items-center">
            {/* Left list */}
            <div className="space-y-6 text-left">
              {[
                { icon: Check, label: 'Ready to play instantly' },
                { icon: Sparkles, label: 'Playful, responsive behavior' },
                { icon: PawPrint, label: 'Feels like a little puppy friend' },
                { icon: HandHeart, label: 'Touch-responsive reactions' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#8A9A5B]" />
                  </div>
                  <div className="text-gray-800 font-semibold">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Center image */}
            <div className="flex justify-center">
              <img
                src={WAGLY_IMG}
                alt="Wagly puppy"
                className="w-56 h-56 md:w-60 md:h-60 object-contain drop-shadow-sm"
                loading="lazy"
              />
            </div>

            {/* Right list */}
            <div className="space-y-6 text-left md:justify-self-end">
              {[
                { icon: Sparkles, label: 'Hand-finished details' },
                { icon: Check, label: 'Soft and durable' },
                { icon: Palette, label: '6 color options' },
                { icon: Shield, label: 'Allergy-friendly for families' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#8A9A5B]" />
                  </div>
                  <div className="text-gray-800 font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gift */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">A Gift They’ll Remember</h2>
          <p className="text-xl text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
            Watch their face light up when Wagly walks, reacts, and “keeps them company.” It creates real moments, not
            more screen time.
          </p>
        </div>
      </section>

      {/* Shared moments / Screen-free / Healthy routines */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="w-7 h-7 text-[#8A9A5B]" />
              <h3 className="text-2xl font-serif font-bold text-gray-900">Shared Moments</h3>
            </div>
            <p className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
              The kind of toy that brings everyone closer. Little chats, gentle cuddles, and sweet play you will want to
              take photos of.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-7 h-7 text-[#8A9A5B]" />
              <h3 className="text-2xl font-serif font-bold text-gray-900">Screen-Free Play</h3>
            </div>
            <p className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
              Keeps little hands busy with imaginative play, without another show, app, or noisy plastic toy.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <HandHeart className="w-7 h-7 text-[#8A9A5B]" />
              <h3 className="text-2xl font-serif font-bold text-gray-900">Building Healthy Routines</h3>
            </div>
            <p className="text-gray-600 leading-relaxed" style={{ lineHeight: '1.6' }}>
              Gentle bedtime cuddles, encouraging kindness, and empathy. Wagly helps children develop nurturing habits
              naturally.
            </p>
          </div>
        </div>
      </section>

      {/* A Futuristic Puppy */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-3">
            A Futuristic Puppy That Adores You
          </h2>
          <p className="text-gray-600 text-center mb-14">Cutting-edge play, made cozy and family-friendly</p>
          <div className="w-20 h-1 bg-[#8A9A5B] mx-auto rounded-full mb-12" />

          <p className="text-center text-gray-500 max-w-4xl mx-auto mb-14">
            Over 67% of families want a pet, but many parents worry about mess, allergies, or caring for one. Wagly
            brings the joy of a puppy into your home without the challenges.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Gift,
                title: 'Gift-Ready Comfort',
                desc: 'Soft, cuddly, and made to feel special when you give it.'
              },
              {
                icon: PawPrint,
                title: 'Real Puppy Reactions',
                desc: 'Wagly moves and responds in sweet little ways that feel puppy-like.'
              },
              {
                icon: Bot,
                title: 'AI-Powered Intelligence',
                desc: 'More natural play that feels less repetitive, so kids stay interested longer.'
              },
              {
                icon: HandHeart,
                title: 'Touch-Responsive Interaction',
                desc: 'A gentle pat or cuddle triggers cute reactions right away.'
              }
            ].map((feature, i) => (
              <div key={i} className="text-center bg-[#F9F6F0] rounded-2xl p-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <feature.icon className="w-8 h-8 text-[#8A9A5B]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm" style={{ lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-3">
            Bring Wagly to Life in 3 Simple Steps
          </h2>
          <div className="w-20 h-1 bg-[#8A9A5B] mx-auto rounded-full mb-12" />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: 1,
                title: 'Turn On Wagly',
                icon: Power,
                desc: 'Add the batteries and flip the switch. You will hear a happy little bark.',
                img: withBase('/steps/step1.avif')
              },
              {
                n: 2,
                title: 'Say Hello',
                icon: MessageCircle,
                desc: 'Gently pet Wagly or call it over. The sensors respond right away.',
                img: withBase('/steps/step2.avif')
              },
              {
                n: 3,
                title: 'Have Fun Together',
                icon: PawPrint,
                desc: 'Play, cuddle, and enjoy those sweet family moments.',
                img: withBase('/steps/step3.avif')
              }
            ].map((step) => (
              <div key={step.n} className="bg-[#F9F6F0] rounded-2xl overflow-hidden shadow-sm">
                <div className="relative p-5">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-white">
                    <img
                      src={step.img}
                      alt={`Step ${step.n}`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-800">
                    {step.n}
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-6 h-6 text-[#8A9A5B]" />
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm" style={{ lineHeight: '1.6' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Wagly */}
      <section className="bg-[#F9F6F0] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-3">Why Wagly?</h2>
          <div className="w-20 h-1 bg-[#8A9A5B] mx-auto rounded-full mb-10" />
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-14" style={{ lineHeight: '1.6' }}>
            Not all robotic pets feel the same. Wagly is designed to be a cuddly companion that fits real family life.
          </p>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            {/* MOBILE layout */}
            <div className="md:hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comparing Wagly to other toys</h3>
                <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                  The little differences add up, especially for parents and grandparents choosing a gift.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-[#F9F6F0] rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto">
                      <img src={WAGLY_IMG} alt="Wagly" className="w-12 h-12 object-contain" loading="lazy" />
                    </div>
                    <div className="mt-3 font-bold text-gray-900">Wagly</div>
                    <div className="text-xs text-gray-600">Our cuddly companion</div>
                  </div>

                  <div className="bg-[#F9F6F0] rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-gray-800">
                      <OthersDogIcon className="w-10 h-10 text-gray-800" />
                    </div>
                    <div className="mt-3 font-bold text-gray-900">Others</div>
                    <div className="text-xs text-gray-600">Typical robot toys</div>
                  </div>
                </div>
              </div>

              {[
                'Realistic, puppy-like reactions',
                'Touch-responsive interaction',
                'Soft, cuddly, gift-ready design',
                '6 color options',
                'Made for screen-free play',
                'Allergy-friendly for families'
              ].map((label, idx) => {
                const waglyYes = true;
                const othersYes = label === '6 color options';
                return (
                  <div key={idx} className="p-6 border-b border-gray-100">
                    <div className="text-gray-900 font-semibold mb-4">{label}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3">
                        <span className="text-sm font-semibold text-gray-800">Wagly</span>
                        {waglyYes ? (
                          <Check className="w-5 h-5 text-[#8A9A5B]" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-3">
                        <span className="text-sm font-semibold text-gray-800">Others</span>
                        {othersYes ? (
                          <Check className="w-5 h-5 text-[#8A9A5B]" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP layout */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3">
                <div className="p-8 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Comparing Wagly to other toys</h3>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                    The little differences add up, especially for parents and grandparents choosing a gift.
                  </p>
                </div>

                <div className="p-8 bg-[#F9F6F0] flex flex-col items-center justify-center border-l border-gray-100">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <img src={WAGLY_IMG} alt="Wagly" className="w-14 h-14 object-contain" loading="lazy" />
                  </div>
                  <div className="mt-3 font-bold text-gray-900">Wagly</div>
                  <div className="text-sm text-gray-600">Our cuddly companion</div>
                </div>

                <div className="p-8 bg-[#F9F6F0] flex flex-col items-center justify-center border-l border-gray-100">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <img
                      src={withBase('/other-dogs.png')}
                      alt="Other robot dogs"
                      className="w-14 h-14 object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-3 font-bold text-gray-900">Others</div>
                  <div className="text-sm text-gray-600">Typical robot toys</div>
                </div>
              </div>

              {[
                'Realistic, puppy-like reactions',
                'Touch-responsive interaction',
                'Soft, cuddly, gift-ready design',
                '6 color options',
                'Made for screen-free play',
                'Allergy-friendly for families'
              ].map((label, idx) => {
                const waglyYes = true;
                const othersYes = label === '6 color options';
                return (
                  <div key={idx} className="grid grid-cols-3 border-t border-gray-100">
                    <div className="p-6 text-gray-900 font-medium">{label}</div>
                    <div className="p-6 flex items-center justify-center">
                      {waglyYes ? <Check className="w-6 h-6 text-[#8A9A5B]" /> : <X className="w-6 h-6 text-red-500" />}
                    </div>
                    <div className="p-6 flex items-center justify-center">
                      {othersYes ? (
                        <Check className="w-6 h-6 text-[#8A9A5B]" />
                      ) : (
                        <X className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-serif font-bold text-gray-900">What Families Are Saying</h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#8A9A5B] text-white px-6 py-2 rounded-full hover:bg-[#7a8a4b] transition">
            Write a Review
          </button>
        </div>

        {/* Rating summary */}
        <div className="bg-white rounded-3xl shadow-sm p-10 mb-12">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold text-gray-900">{reviewSummary.averageDisplay.toFixed(1)}</div>
              <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#8A9A5B] text-[#8A9A5B]" />
                ))}
              </div>
              <div className="text-gray-600 mt-2">{reviewSummary.total.toLocaleString()} reviews</div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewSummary.counts[star as 1 | 2 | 3 | 4 | 5];
                const pct = (count / reviewSummary.total) * 100;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="w-10 text-sm text-gray-700">{star}★</div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-3 bg-[#8A9A5B]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">{count}</div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-5">
              <div className="text-gray-700">
                <span className="font-bold text-gray-900">{reviewSummary.recommendPercent}%</span> of reviewers would
                recommend this product to a friend
              </div>

              <div className="space-y-3">
                {reviewSummary.barsRight.map((b) => (
                  <div key={b.label} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-700">{b.label}</div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-3 bg-[#8A9A5B]" style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="space-y-6 mb-8">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="w-full">
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#8A9A5B] text-[#8A9A5B]" />
                    ))}
                  </div>

                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-3 mb-4 flex-wrap">
                      {review.photos.slice(0, 4).map((src, idx) => (
                        <img
                          key={idx}
                          src={withBase(src)}
                          alt="Review photo"
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-gray-600 mb-4" style={{ lineHeight: '1.6' }}>
                    {review.text}
                  </p>

                  {/* No dash prefix, clean formatting */}
                  <p className="text-sm text-gray-500 font-medium">{attributionText(review)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Was this helpful?</span>
                <button
                  onClick={() => handleVote(review.id, 'up')}
                  className={`flex items-center gap-1 text-sm transition ${
                    userVotes[review.id] === 'up' ? 'text-[#8A9A5B] font-bold' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <span>👍</span>
                  <span>{reviewVotes[review.id]?.upvotes || 0}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, 'down')}
                  className={`flex items-center gap-1 text-sm transition ${
                    userVotes[review.id] === 'down' ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <span>👎</span>
                  <span>{reviewVotes[review.id]?.downvotes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayedReviews.length < reviews.length && (
          <button
            onClick={handleLoadMore}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition">
            Load More Reviews
          </button>
        )}
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-[#8A9A5B] mx-auto rounded-full mb-14" />

          <div className="space-y-4">
            {faqs.map((item) => {
              const isOpen = openFaqKey === item.key;
              return (
                <div key={item.key} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqKey((prev) => (prev === item.key ? null : item.key))}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left">
                    <span className="font-bold text-gray-900">{item.q}</span>
                    <span className="text-2xl text-gray-600">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-gray-600" style={{ lineHeight: '1.7' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-12">
            {[
              { icon: WifiOff, label: 'No Wi-Fi needed' },
              { icon: Battery, label: 'Battery powered' },
              { icon: Volume2, label: 'Family-friendly sound' },
              { icon: Package, label: 'Gift-ready box' }
            ].map((x, idx) => (
              <div key={idx} className="bg-[#F9F6F0] rounded-2xl p-5 flex items-center gap-3">
                <x.icon className="w-5 h-5 text-[#8A9A5B]" />
                <div className="text-sm font-semibold text-gray-800">{x.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[#8A9A5B] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-6">The Grandparent Promise</h2>
          <p className="text-xl leading-relaxed mb-8" style={{ lineHeight: '1.6' }}>
            If your grandchild does not fall in love within 30 days, we will help you with a return. No stress, no
            awkwardness.
          </p>

          <Link
            to="/bring-wagly-home"
            className="inline-block bg-white text-[#8A9A5B] px-8 py-4 rounded-full hover:bg-gray-100 transition font-bold text-lg">
            Get Up to 72% Off
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenContact={() => setShowContactModal(true)} />

      {showReviewModal && <ReviewModal onClose={() => setShowReviewModal(false)} />}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
