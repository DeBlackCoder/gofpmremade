/**
 * Resource types aligned with the refactored backend (Prisma + API responses).
 */

// --- Events (ChurchEvent) ---

export type EventCategory =
  | "SERVICE"
  | "PRAYER"
  | "YOUTH"
  | "OUTREACH"
  | "OTHER";

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  time: string;
  location: string;
  category: EventCategory;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  checkedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
}

// --- Sermons ---

export type SermonTag =
  | "FAITH"
  | "FAMILY"
  | "PRAYER"
  | "IDENTITY"
  | "PROPHECY";

export interface Sermon {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  series: string;
  tag: SermonTag;
  date: string;
  dateISO: string;
  pastor: string;
  pastorRole: string;
  pastorPhoto: string;
  readTime: string;
  scripture: string;
  excerpt: string;
  body: string;
  featured: boolean;
  podcastSpotify?: string | null;
  podcastApple?: string | null;
  podcastYoutube?: string | null;
  // UI helpers/aliases to fix component errors
  preachedAt?: string;
  speaker?: string;
  description?: string;
  videoUrl?: string;
  audioUrl?: string;
  content?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SermonListResult {
  data: Sermon[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SermonSearchResult {
  data: Sermon[];
  total: number;
}

// --- Members / users ---

export interface PublicUser {
  id: string;
  email: string;
  fullName: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface MemberProfile extends PublicUser {
  role: string;
  givingRecords?: unknown[];
  eventRegistrations?: unknown[];
}

export interface MemberListResult {
  data: PublicUser[];
  total: number;
}

// --- Giving ---

export interface GivingRecord {
  id: string;
  reference: string;
  userId?: string | null;
  amount: number;
  currency: string;
  type: string;
  frequency: string;
  fullName: string;
  email: string;
  phone?: string | null;
  note?: string | null;
  method: string;
  status: string;
  paymentUrl?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InitiateGivingInput {
  amount: number;
  type?: string;
  frequency?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  note?: string;
  /** Backend: CARD, BANK, PAYSTACK, FLUTTERWAVE, etc. */
  method?: string;
  redirectUrl?: string;
}

export interface InitiateGivingResult {
  reference: string;
  status: string;
  method: string;
  paymentUrl?: string | null;
  providerReference?: string;
  provider?: string;
}

// --- Contact / prayer (ContactSubmission) ---

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  read: boolean;
  submittedAt: string;
}

export interface PrayerRequestInput {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
  request?: string;
}

export interface TestimonyInput {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  content?: string;
  message?: string;
}

export interface PrayerRequestListResult {
  data: ContactSubmission[];
  total: number;
}

// --- Ministries (CommunityGroup) ---

export type GroupTag = "MEN" | "WOMEN" | "YOUTH" | "FAMILIES" | "ALL_AGES";

export interface MinistryGroup {
  id: string;
  name: string;
  tag: GroupTag;
  meets: string;
  leader: string;
  bio: string;
  spots: number | null;
  // UI helpers
  volunteers?: number | null;
  schedule?: string;
  lead?: string;
  desc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MinistryListResult {
  data: MinistryGroup[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// --- Livestream ---

export interface LiveSettings {
  id: string;
  isLive: boolean;
  streamUrl?: string | null;
  title: string;
  description: string;
  status?: "LIVE" | "OFFLINE"; // UI helper
  updatedAt: string;
}

export type LiveWithStreams = LiveSettings;

export interface PreviousStream {
  id: string;
  liveSettingsId: string;
  title: string;
  description: string;
  streamUrl: string;
  date: string;
  createdAt: string;
}

// --- Search ---

export interface GlobalSearchResults {
  query: string;
  types: string[];
  results: {
    sermons: Sermon[];
    events: ChurchEvent[];
    posts: ContactSubmission[];
  };
}

// --- Legacy aliases (avoid breaking named imports in older code) ---

export type Event = ChurchEvent;
export type Member = MemberProfile;
export type EventAttendee = EventRegistration;
export type Giving = GivingRecord;
export type GivingInitiation = InitiateGivingInput;
export type Prayer = ContactSubmission;
export type PrayerInput = PrayerRequestInput;
export type Branch = { id: string; name: string };
export type Ministry = MinistryGroup;
export type Livestream = LiveSettings;
