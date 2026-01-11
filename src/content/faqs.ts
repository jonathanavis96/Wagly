// FAQ data for Wagly
// Objection-driven questions extracted for easier maintenance

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Main FAQs for home page - objection-driven
export const homeFAQs: FAQ[] = [
  {
    id: 'realistic',
    question: 'Is Wagly realistic enough for my child?',
    answer: 'Wagly is designed to feel lifelike without being overwhelming. It responds to touch and voice, walks, barks, and even wags its tail. Kids connect with it emotionally while understanding it's still a toy they can control.'
  },
  {
    id: 'age',
    question: 'What age is Wagly appropriate for?',
    answer: 'Wagly is perfect for children ages 3–10. Younger kids love the interactive play and sounds, while older children enjoy caring for and "training" their Wagly. It's simple enough for toddlers but engaging enough for grade-schoolers.'
  },
  {
    id: 'battery',
    question: 'How long does the battery last?',
    answer: 'Wagly runs on 3 AA batteries (included) and typically lasts 20–30 hours of active play. When battery runs low, Wagly will still respond but with less movement—a gentle reminder for kids to "rest" their pup.'
  },
  {
    id: 'break',
    question: 'What if my child breaks it or loses interest?',
    answer: 'Wagly is built to withstand typical play and comes with a 30-day money-back guarantee. If your child doesn't love it or it stops working, just contact us for a refund or replacement. Most families find Wagly becomes a lasting favorite.'
  },
  {
    id: 'alternatives',
    question: 'Why Wagly instead of other interactive toys?',
    answer: 'Unlike screen-based toys or overly complex robots, Wagly focuses on simple, emotional connection. No apps, no Wi-Fi, no subscriptions. Just a responsive companion that encourages imaginative play and teaches responsibility without the overwhelm.'
  }
];

// Product page FAQs - shorter, conversion-focused
export const productFAQs: FAQ[] = [
  {
    id: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Orders typically arrive within 7–14 business days depending on location. You'll receive tracking information via email once your order ships.'
  },
  {
    id: 'guarantee',
    question: 'What's your guarantee?',
    answer: '30-day money-back guarantee. If you're not happy with Wagly for any reason, return it for a full refund. No questions asked.'
  },
  {
    id: 'batteries',
    question: 'Are batteries included?',
    answer: 'Yes! Wagly comes with 3 AA batteries included, so your child can start playing right away.'
  },
  {
    id: 'multiple',
    question: 'Can I buy multiple Waglys?',
    answer: 'Absolutely! Many families buy 2–4 Waglys so siblings can each have their own. Bundles offer the best savings and ensure everyone gets to join the fun.'
  }
];
