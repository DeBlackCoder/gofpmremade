/**
 * Sermon data types and interfaces
 * 
 * Defines the TypeScript types for sermon documents used throughout
 * the sermon management system to ensure type safety between frontend and backend.
 */

/**
 * Valid series tag values for categorizing sermons
 * 
 * **Validates: Requirements 7.1, 7.3**
 */
export type SeriesTag = "Faith" | "Family" | "Prayer" | "Identity" | "Prophecy";

/**
 * Podcast links for sermon audio/video content
 * All fields are optional to support partial podcast availability
 * 
 * **Validates: Requirements 7.3, 7.4**
 */
export interface PodcastLinks {
  spotify?: string;
  apple?: string;
  youtube?: string;
}

/**
 * Sermon document interface matching MongoDB schema and admin UI expectations
 * 
 * Required fields:
 * - slug: Unique URL-friendly identifier
 * - title: Sermon title
 * - tag: Series category tag
 * - date: Human-readable date string
 * - pastor: Pastor name
 * 
 * Optional fields:
 * - subtitle: One-line subtitle
 * - series: Series name
 * - dateISO: ISO 8601 date string
 * - pastorRole: Pastor's role/title
 * - scripture: Scripture reference
 * - excerpt: Short description for listings
 * - body: Full sermon content
 * - featured: Whether sermon is featured
 * - podcastLinks: Links to podcast platforms
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */
export interface Sermon {
  slug: string;
  title: string;
  subtitle?: string;
  series?: string;
  tag: SeriesTag;
  date: string;
  dateISO?: string;
  pastor: string;
  pastorRole?: string;
  scripture?: string;
  excerpt?: string;
  body?: string;
  featured?: boolean;
  podcastLinks?: PodcastLinks;
}
