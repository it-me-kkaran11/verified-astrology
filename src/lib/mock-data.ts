export type Astrologer = {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  trustScore: number;
  verified: number;
  total: number;
  streak: number;
  initials: string;
};

export const astrologers: Astrologer[] = [
  {
    id: "1",
    name: "Mira Kalyani",
    handle: "@miravedic",
    specialty: "Vedic • Career",
    trustScore: 942,
    verified: 418,
    total: 452,
    streak: 26,
    initials: "MK",
  },
  {
    id: "2",
    name: "Dorian Vale",
    handle: "@transitlab",
    specialty: "Transits • Timing",
    trustScore: 907,
    verified: 356,
    total: 401,
    streak: 14,
    initials: "DV",
  },
  {
    id: "3",
    name: "Ines Moreau",
    handle: "@lunanotes",
    specialty: "Lunar • Relationships",
    trustScore: 881,
    verified: 290,
    total: 344,
    streak: 9,
    initials: "IM",
  },
  {
    id: "4",
    name: "Rafael Ortiz",
    handle: "@solarhouse",
    specialty: "Solar Return • Money",
    trustScore: 846,
    verified: 231,
    total: 296,
    streak: 5,
    initials: "RO",
  },
  {
    id: "5",
    name: "Aya Sundqvist",
    handle: "@nodefinder",
    specialty: "Nodes • Life Path",
    trustScore: 812,
    verified: 188,
    total: 249,
    streak: 3,
    initials: "AS",
  },
  {
    id: "6",
    name: "Kwame Boateng",
    handle: "@retrocheck",
    specialty: "Retrogrades • Travel",
    trustScore: 774,
    verified: 142,
    total: 201,
    streak: 2,
    initials: "KB",
  },
];

export type Prediction = {
  id: string;
  astrologer: string;
  window: string;
  text: string;
  status: "pending" | "true" | "false";
};

export const todaysPredictions: Prediction[] = [
  {
    id: "p1",
    astrologer: "Mira Kalyani",
    window: "Logged 3 days ago · resolves today",
    text: "A delayed message about work finally lands, and it's better news than you expect.",
    status: "pending",
  },
  {
    id: "p2",
    astrologer: "Dorian Vale",
    window: "Logged 5 days ago · resolves today",
    text: "An unexpected expense shows up before Wednesday — under $200.",
    status: "pending",
  },
  {
    id: "p3",
    astrologer: "Ines Moreau",
    window: "Logged last week · resolved",
    text: "You reconnect with someone you last spoke to in spring.",
    status: "true",
  },
  {
    id: "p4",
    astrologer: "Rafael Ortiz",
    window: "Logged last week · resolved",
    text: "A travel plan gets moved to a different date.",
    status: "false",
  },
];

export const astraMessages = [
  {
    id: "m1",
    from: "astra" as const,
    text: "Good morning. Two predictions logged for you resolve today — want to check them in?",
  },
  {
    id: "m2",
    from: "user" as const,
    text: "Later. First, how accurate has Mira actually been for me?",
  },
  {
    id: "m3",
    from: "astra" as const,
    text: "For your chart specifically: 31 of 36 predictions confirmed true. Trust Score 942, verified by 1,204 users.",
    verified: true,
  },
];

export const plans = [
  {
    name: "Observer",
    price: "Free",
    cadence: "",
    blurb: "Verify predictions and browse public Trust Scores.",
    features: [
      "1 daily check-in",
      "Public leaderboard access",
      "Trust Score history (30 days)",
    ],
    cta: "Current plan",
    highlight: false,
  },
  {
    name: "Verified",
    price: "$12",
    cadence: "/month",
    blurb: "Full verification ledger and unlimited Astra chat.",
    features: [
      "Unlimited check-ins & logging",
      "Unlimited Astra conversations",
      "Full lifetime accuracy ledger",
      "Follow up to 20 astrologers",
    ],
    cta: "Upgrade to Verified",
    highlight: true,
  },
  {
    name: "Oracle",
    price: "$29",
    cadence: "/month",
    blurb: "Direct readings from top Trust Score astrologers.",
    features: [
      "Everything in Verified",
      "2 live readings per month",
      "Priority resolution review",
      "Early access to new astrologers",
    ],
    cta: "Go Oracle",
    highlight: false,
  },
];
