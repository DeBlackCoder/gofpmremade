/**
 * MongoDB Collections
 * 
 * Centralized collection names for the entire application
 */

export const COLLECTIONS = {
  SERMONS: 'sermons',
  ANNOUNCEMENTS: 'announcements',
  COMMUNITY: 'community',
  CONTACTS: 'contacts',
  EVENTS: 'events',
  GIVING: 'giving',
  LIVE: 'live',
  MEMBERS: 'members',
  ADMIN: 'admin',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
