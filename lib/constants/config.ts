/**
 * Application configuration constants
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const COOKIE_TOKEN_NAME = "auth_token";
export const COOKIE_REFRESH_TOKEN_NAME = "refresh_token";
export const COOKIE_USER_NAME = "auth_user";

// Token refresh timing (milliseconds)
export const TOKEN_REFRESH_BUFFER = 60 * 1000; // Refresh 1 min before expiry
export const TOKEN_EXPIRY_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 mins

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export const QUERY_KEYS = {
  // Authentication
  AUTH_ME: ["auth", "me"],

  // Members
  MEMBERS: ["members"],
  MEMBER: (id: string) => ["members", id],

  // Events
  EVENTS: ["events"],
  EVENT: (id: string) => ["events", id],

  // Sermons
  SERMONS: ["sermons"],
  SERMON: (id: string) => ["sermons", id],

  // Prayers
  PRAYERS: ["prayers"],
  PRAYER: (id: string) => ["prayers", id],

  // Giving
  GIVING: ["giving"],
  GIVING_HISTORY: ["giving", "history"],

  // Branches
  BRANCHES: ["branches"],

  // Ministries
  MINISTRIES: ["ministries"],

  // Livestream
  LIVESTREAM: ["livestream"],

  // Content (blogs, devotionals, announcements)
  CONTENT: ["content"],

  // Notifications
  NOTIFICATIONS: ["notifications"],

  // Search
  SEARCH: ["search"],

  // Media
  MEDIA: ["media"],

  // Admin
  ADMIN: ["admin"],
} as const;

export const RETRY_CONFIG = {
  attempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
} as const;
