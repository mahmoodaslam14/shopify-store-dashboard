/**
 * Static mock data for UI-only development (no API, no global state store).
 */

export const mockUser = {
  name: "Alex Morgan",
  email: "alex@example.com",
  role: "customer" as const,
};

export const mockShopify = {
  connected: false,
  shopDomain: "your-brand.myshopify.com",
  customerId: "7123456789012",
};

export const mockBalance = 1240;
export const pointsPerCurrencyUnit = 100;

export type MockOrder = {
  id: string;
  orderNumber: string;
  financialStatus: string;
  fulfillmentStatus: string;
  total: string;
  currency: string;
  date: string;
};

export const mockOrders: MockOrder[] = [
  {
    id: "1",
    orderNumber: "#1042",
    financialStatus: "paid",
    fulfillmentStatus: "fulfilled",
    total: "128.00",
    currency: "USD",
    date: "2026-04-28",
  },
  {
    id: "2",
    orderNumber: "#1038",
    financialStatus: "paid",
    fulfillmentStatus: "in progress",
    total: "64.50",
    currency: "USD",
    date: "2026-04-12",
  },
  {
    id: "3",
    orderNumber: "#1001",
    financialStatus: "refunded",
    fulfillmentStatus: "restocked",
    total: "32.00",
    currency: "USD",
    date: "2026-03-02",
  },
];

export type MockAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  isDefault: boolean;
};

export const mockAddresses: MockAddress[] = [
  {
    id: "a1",
    label: "Home",
    line1: "221B Baker Street",
    city: "London",
    region: "ENG",
    postal: "NW1 6XE",
    country: "United Kingdom",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Studio",
    line1: "90 York Way",
    line2: "Floor 3",
    city: "London",
    region: "ENG",
    postal: "N1 9AG",
    country: "United Kingdom",
    isDefault: false,
  },
];

export type MockWishItem = {
  id: string;
  title: string;
  price: string;
  currency: string;
  image: string;
};

export const mockWishlist: MockWishItem[] = [
  {
    id: "w1",
    title: "Heritage zip hoodie",
    price: "89.00",
    currency: "USD",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
  },
  {
    id: "w2",
    title: "Everyday organic tee",
    price: "34.00",
    currency: "USD",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
  },
];

export type MockSubmission = {
  id: string;
  platform: string;
  postUrl: string;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  pointsAwarded: number;
  adminNote: string | null;
  createdAt: string;
};

export const mockSubmissions: MockSubmission[] = [
  {
    id: "s1",
    platform: "instagram",
    postUrl: "https://instagram.com/p/example-approved",
    notes: "Wearing the new collection at the event.",
    status: "approved",
    pointsAwarded: 120,
    adminNote: null,
    createdAt: "2026-04-20T14:30:00.000Z",
  },
  {
    id: "s2",
    platform: "tiktok",
    postUrl: "https://tiktok.com/@user/video/123",
    notes: null,
    status: "pending",
    pointsAwarded: 0,
    adminNote: null,
    createdAt: "2026-05-01T09:12:00.000Z",
  },
];

export type AdminSubmissionRow = MockSubmission & {
  userId: string;
  userEmail: string;
};

export const mockAdminSubmissions: AdminSubmissionRow[] = [
  {
    id: "ad1",
    userId: "u-demo-1",
    userEmail: "alex@example.com",
    platform: "instagram",
    postUrl: "https://instagram.com/p/pending-1",
    notes: "Outfit of the day",
    status: "pending",
    pointsAwarded: 0,
    adminNote: null,
    createdAt: "2026-05-03T11:00:00.000Z",
  },
  {
    id: "ad2",
    userId: "u-demo-2",
    userEmail: "sam@example.com",
    platform: "youtube",
    postUrl: "https://youtube.com/watch?v=demo",
    notes: "Short unboxing",
    status: "pending",
    pointsAwarded: 0,
    adminNote: null,
    createdAt: "2026-05-02T16:45:00.000Z",
  },
  {
    id: "ad3",
    userId: "u-demo-1",
    userEmail: "alex@example.com",
    platform: "instagram",
    postUrl: "https://instagram.com/p/older",
    notes: null,
    status: "approved",
    pointsAwarded: 80,
    adminNote: null,
    createdAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: "ad4",
    userId: "u-demo-3",
    userEmail: "jules@example.com",
    platform: "tiktok",
    postUrl: "https://tiktok.com/@jules/video/bad",
    notes: "Brand not visible",
    status: "rejected",
    pointsAwarded: 0,
    adminNote: "Product not clearly shown",
    createdAt: "2026-04-05T08:20:00.000Z",
  },
];

export const mockActivity = [
  { id: 1, label: "Points earned from post", points: 120, at: "Apr 20, 2026" },
  { id: 2, label: "Redeemed for checkout", points: -500, at: "Apr 18, 2026" },
  { id: 3, label: "Welcome bonus", points: 50, at: "Mar 1, 2026" },
];

/** Leaderboard — mock advocates (UI preview only) */
export type MockLeaderboardEntry = {
  rank: number;
  name: string;
  initials: string;
  accent: string;
  tier: string;
  earnedUsd: number;
  referrals: number;
  isYou?: boolean;
};

export const mockLeaderboardAllTime: MockLeaderboardEntry[] = [
  {
    rank: 1,
    name: "Marcus Thorne",
    initials: "MT",
    accent: "from-amber-400 to-amber-700",
    tier: "Champion",
    earnedUsd: 5290,
    referrals: 312,
  },
  {
    rank: 2,
    name: "Sarah Chen",
    initials: "SC",
    accent: "from-slate-300 to-slate-500",
    tier: "Elite advocate",
    earnedUsd: 3820,
    referrals: 228,
  },
  {
    rank: 3,
    name: "Elena Rodriguez",
    initials: "ER",
    accent: "from-orange-300 to-amber-800",
    tier: "Gold advocate",
    earnedUsd: 3150,
    referrals: 190,
  },
  {
    rank: 4,
    name: "Jordan Lee",
    initials: "JL",
    accent: "from-violet-400 to-fuchsia-500",
    tier: "Influencer tier",
    earnedUsd: 2890,
    referrals: 140,
  },
  {
    rank: 5,
    name: "Sam Rivera",
    initials: "SR",
    accent: "from-cyan-400 to-blue-500",
    tier: "Rising star",
    earnedUsd: 2410,
    referrals: 118,
  },
  {
    rank: 6,
    name: "Priya Shah",
    initials: "PS",
    accent: "from-emerald-400 to-teal-600",
    tier: "Gold advocate",
    earnedUsd: 1980,
    referrals: 96,
  },
  {
    rank: 42,
    name: mockUser.name,
    initials: "AM",
    accent: "from-violet-500 to-fuchsia-500",
    tier: "Vibrant",
    earnedUsd: 1240.5,
    referrals: 54,
    isYou: true,
  },
  {
    rank: 43,
    name: "Chris Patel",
    initials: "CP",
    accent: "from-slate-400 to-slate-600",
    tier: "Silver",
    earnedUsd: 1198,
    referrals: 51,
  },
];

export const mockLeaderboardMonthly: MockLeaderboardEntry[] = [
  {
    rank: 1,
    name: "Sarah Chen",
    initials: "SC",
    accent: "from-slate-300 to-slate-500",
    tier: "Monthly MVP",
    earnedUsd: 920,
    referrals: 42,
  },
  {
    rank: 2,
    name: "Marcus Thorne",
    initials: "MT",
    accent: "from-amber-400 to-amber-700",
    tier: "Champion",
    earnedUsd: 880,
    referrals: 38,
  },
  {
    rank: 3,
    name: "Jordan Lee",
    initials: "JL",
    accent: "from-violet-400 to-fuchsia-500",
    tier: "Influencer tier",
    earnedUsd: 640,
    referrals: 29,
  },
  {
    rank: 4,
    name: "Elena Rodriguez",
    initials: "ER",
    accent: "from-orange-300 to-amber-800",
    tier: "Gold advocate",
    earnedUsd: 510,
    referrals: 22,
  },
  {
    rank: 5,
    name: "Alex Morgan",
    initials: "AM",
    accent: "from-violet-500 to-fuchsia-500",
    tier: "Vibrant",
    earnedUsd: 340,
    referrals: 18,
    isYou: true,
  },
  {
    rank: 6,
    name: "Sam Rivera",
    initials: "SR",
    accent: "from-cyan-400 to-blue-500",
    tier: "Rising star",
    earnedUsd: 290,
    referrals: 15,
  },
];

export type MockBadgeItem = {
  id: string;
  title: string;
  reward: string;
  unlocked: boolean;
  hint?: string;
  palette: "teal" | "violet" | "amber" | "rose" | "slate";
};

export const mockBadges: MockBadgeItem[] = [
  {
    id: "b1",
    title: "First post",
    reward: "+500 points",
    unlocked: true,
    palette: "teal",
  },
  {
    id: "b2",
    title: "Viral hit",
    reward: "+2,500 points",
    unlocked: true,
    palette: "violet",
  },
  {
    id: "b3",
    title: "Referral pro",
    reward: "+10% boost",
    unlocked: true,
    palette: "amber",
  },
  {
    id: "b4",
    title: "Early adopter",
    reward: "Exclusive badge",
    unlocked: true,
    palette: "rose",
  },
  {
    id: "b5",
    title: "Power buyer",
    reward: "Locked",
    unlocked: false,
    hint: "Make 50 purchases in a single month.",
    palette: "slate",
  },
  {
    id: "b6",
    title: "Community leader",
    reward: "Locked",
    unlocked: false,
    hint: "Gain 500 followers on your social profile.",
    palette: "slate",
  },
  {
    id: "b7",
    title: "Moon shot",
    reward: "Locked",
    unlocked: false,
    hint: "Complete a high-value merchant challenge.",
    palette: "slate",
  },
  {
    id: "b8",
    title: "Merchant legend",
    reward: "Locked",
    unlocked: false,
    hint: "Reach top tier status with 5 different brands.",
    palette: "slate",
  },
];

export const mockBadgeStats = {
  earned: 12,
  locked: 8,
  totalXp: 4850,
  tierProgressPct: 60,
  nextTierLabel: "Platinum tier",
  pointsToNextCash: 150,
};
