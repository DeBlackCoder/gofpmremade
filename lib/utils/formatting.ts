/**
 * Formatting utilities for display
 */

import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatters = {
  /**
   * Format date as locale string
   */
  date: (date: string | Date, formatStr: string = "MMM dd, yyyy"): string => {
    try {
      const d = typeof date === "string" ? parseISO(date) : date;
      return format(d, formatStr);
    } catch {
      return "-";
    }
  },

  /**
   * Format date and time
   */
  dateTime: (
    date: string | Date,
    formatStr: string = "MMM dd, yyyy p",
  ): string => {
    try {
      const d = typeof date === "string" ? parseISO(date) : date;
      return format(d, formatStr);
    } catch {
      return "-";
    }
  },

  /**
   * Format as relative time (e.g., "2 hours ago")
   */
  timeAgo: (date: string | Date): string => {
    try {
      const d = typeof date === "string" ? parseISO(date) : date;
      return formatDistanceToNow(d, { addSuffix: true });
    } catch {
      return "-";
    }
  },

  /**
   * Format currency
   */
  currency: (
    amount: number,
    currency: string = "USD",
    locales: string = "en-US",
  ): string => {
    try {
      return new Intl.NumberFormat(locales, {
        style: "currency",
        currency,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  },

  /**
   * Format phone number
   */
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  /**
   * Truncate text
   */
  truncate: (
    text: string,
    length: number = 50,
    suffix: string = "...",
  ): string => {
    return text.length > length ? `${text.slice(0, length)}${suffix}` : text;
  },

  /**
   * Format full name
   */
  fullName: (firstName?: string, lastName?: string): string => {
    return [firstName, lastName].filter(Boolean).join(" ");
  },
};
