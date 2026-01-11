// Testimonials and reviews data for Wagly
// Extracted from Home.tsx and BringWaglyHome.tsx for easier maintenance

export interface Testimonial {
  id?: number;
  name: string;
  title: string;
  text: string;
  rating?: number;
  verified?: boolean;
}

// Short testimonials for social proof strips
export const shortTestimonials: Testimonial[] = [
  {
    name: 'Mary',
    title: 'Grandmother',
    text: 'My grandson fell in love straight away! Best gift ever.',
    rating: 5
  },
  {
    name: 'Helen Rosburg',
    title: 'Parent',
    text: 'Keeps the kids busy for ages. Such a good gift idea.',
    rating: 5
  },
  {
    name: 'Susan Chan',
    title: 'Parent',
    text: 'So interactive! Every time it moves my toddler laughs.',
    rating: 5
  }
];

// Detailed testimonials for product page
export const detailedTestimonials: Testimonial[] = [
  {
    name: 'Mary',
    title: 'So adorable',
    text: 'Bought this puppy for my grandson and he fell in love straight away 💕 First month he took it everywhere and even wanted it in bed so we had to turn it off at night 😄 Months later he still plays with it all the time. Nice to see him off the tablet too.',
    verified: true
  },
  {
    name: 'Helen Rosburg',
    title: 'Lovely little toy',
    text: 'We are really happy with this puppy. Keeps the kids busy for ages and they never seem to get tired of it. Such a good gift idea.',
    verified: true
  },
  {
    name: 'Susan Chan',
    title: 'So much fun',
    text: 'Did not expect it to be this interactive. It reacts to touch and sound which makes it feel more real. Every time it moves my toddler laughs so much 😂 Also helping him learn to be gentle which I really like.',
    verified: true
  },
  {
    name: 'Daniel Tompson',
    title: 'Worth it',
    text: 'Got this for my nephew and my sister says he hardly puts it down. Seeing how happy he is makes it totally worth it. Would buy again.',
    verified: true
  },
  {
    name: 'Patricia',
    title: 'Really impressed',
    text: 'Such a nice way to teach kids about caring for animals. Our daughter loves looking after it and you can see her learning while playing. Very happy with this purchase.',
    verified: true
  }
];
