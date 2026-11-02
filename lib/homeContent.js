const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const HERO_SLIDES = [
  {
    id: "impact",
    image: img("photo-1542601906990-b4d3fb778b09"),
    eyebrow: "Crowdfunding that grows with you",
    title: "Turn your ideas into impact",
    subtitle:
      "Start a campaign, get support from people who care, and make a difference together. Every credit you raise is real progress.",
    cta: { label: "Explore Campaigns", href: "/campaigns" },
    secondary: { label: "How it works", href: "#how-it-works" },
  },
  {
    id: "backers",
    image: img("photo-1517486808906-6ca8b3f04846"),
    eyebrow: "For supporters",
    title: "Back the projects you believe in",
    subtitle:
      "Join a community of supporters funding clean water, classrooms, clinics and creative work. Start with 50 free credits when you sign up.",
    cta: { label: "Join as a Supporter", href: "/register" },
    secondary: { label: "Browse categories", href: "#categories" },
  },
  {
    id: "creators",
    image: img("photo-1460925895917-afdab827c52f"),
    eyebrow: "For creators",
    title: "Raise funds and get paid for what you build",
    subtitle:
      "Launch a campaign in minutes, review every contribution yourself, and withdraw your earnings once you pass 200 credits.",
    cta: { label: "Start a Campaign", href: "/register" },
    secondary: { label: "See top campaigns", href: "#top-funded" },
  },
];

export const STEPS = [
  {
    title: "Create your account",
    text: "Sign up as a supporter or a creator. Supporters start with 50 credits and creators with 20, on us.",
  },
  {
    title: "Launch or discover",
    text: "Creators submit a campaign for approval. Supporters search and filter live campaigns by category, goal and deadline.",
  },
  {
    title: "Contribute and review",
    text: "Supporters back a campaign with credits. The creator approves each contribution, or rejects it and the credits are refunded.",
  },
  {
    title: "Withdraw your earnings",
    text: "Creators turn raised credits into money at 20 credits per $1, with a minimum of 200 credits, paid out after an admin confirms.",
  },
];

export const CATEGORY_CARDS = [
  {
    name: "Technology",
    blurb: "Open tools, apps and gadgets",
    image: img("photo-1521737604893-d14cc237f11d", 700),
  },
  {
    name: "Art",
    blurb: "Murals, music and exhibitions",
    image: img("photo-1513364776144-60967b0f800f", 700),
  },
  {
    name: "Community",
    blurb: "Neighbours helping neighbours",
    image: img("photo-1559027615-cd4628902d4a", 700),
  },
  {
    name: "Health",
    blurb: "Clinics, supplies and care",
    image: img("photo-1576091160399-112ba8d25d1d", 700),
  },
  {
    name: "Education",
    blurb: "Schools, books and learning",
    image: img("photo-1509062522246-3755977927d7", 700),
  },
  {
    name: "Environment",
    blurb: "Water, trees and clean energy",
    image: img("photo-1473773508845-188df298d2d1", 700),
  },
];

const portrait = (p) => `https://randomuser.me/api/portraits/${p}.jpg`;

export const TESTIMONIALS = [
  {
    name: "Sarah Ahmed",
    role: "Supporter",
    photo: portrait("women/44"),
    quote:
      "I like that every contribution is reviewed by the creator and refunded if it is rejected. I always know where my credits are.",
  },
  {
    name: "Rahim Uddin",
    role: "Creator, Solar Water Pump",
    photo: portrait("men/32"),
    quote:
      "We reached our goal in five weeks. Approving each supporter myself made it easy to thank people and keep our village updated.",
  },
  {
    name: "Carla Mendes",
    role: "Supporter",
    photo: portrait("women/68"),
    quote:
      "Buying a credit pack takes under a minute, and the best-value pack stretches my budget across several campaigns I care about.",
  },
  {
    name: "Daniel Okafor",
    role: "Creator, Community Garden",
    photo: portrait("men/75"),
    quote:
      "The withdrawal rules are clear: 20 credits per dollar and a ten dollar minimum. No surprises when the admin sent our payment.",
  },
  {
    name: "Mei Lin",
    role: "Supporter",
    photo: portrait("women/12"),
    quote:
      "Searching by category and goal helped me find small local projects I would never have discovered on a bigger platform.",
  },
  {
    name: "Omar Haddad",
    role: "Creator, Mobile Library Bus",
    photo: portrait("men/46"),
    quote:
      "Reports and moderation keep the platform honest. As a creator that gives me confidence that supporters trust what they see.",
  },
];

export const FAQS = [
  {
    q: "How do credits work?",
    a: "Credits are the currency of Fundora. Supporters buy credits in packs (100 for $10, 300 for $25, 800 for $60 or 1,500 for $110) and spend them on contributions. New supporters get 50 free credits and new creators get 20.",
  },
  {
    q: "What happens to my credits when I contribute?",
    a: "They leave your balance immediately and are held until the creator reviews your contribution. If the creator approves it, the credits count toward the campaign. If it is rejected, or the campaign is deleted, the full amount is refunded to you.",
  },
  {
    q: "How do creators get paid?",
    a: "Creators withdraw the credits their campaigns have raised at 20 credits per $1. The minimum withdrawal is 200 credits ($10). Pending requests reserve those credits, and an admin marks the request as paid once the money has been sent.",
  },
  {
    q: "Why does a new campaign not appear straight away?",
    a: "Every campaign is reviewed by an admin before it goes live. Once approved it appears in Explore until its deadline passes.",
  },
  {
    q: "Is my card payment secure?",
    a: "Payments are processed by Stripe. Fundora never sees or stores your card number, and credits are added exactly once per successful payment.",
  },
  {
    q: "What if I see a campaign that looks wrong?",
    a: "Use the Report campaign button on its page. An admin reviews the report and can suspend the campaign or delete it, refunding every supporter.",
  },
];
