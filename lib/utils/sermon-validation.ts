/**
 * Sermon validation utilities
 * 
 * Provides validation functions for sermon data to ensure data integrity
 * before storing in the database.
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
 */

import { z } from "zod";
import { schemas } from "./validation";
import type { Sermon, SeriesTag } from "@/lib/types/sermon";

/**
 * Validation result type
 */
export interface ValidationResult {
  success: boolean;
  errors?: Record<string, string[]>;
  data?: Partial<Sermon>;
}

/**
 * Validate sermon data against the schema
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
 * 
 * @param data - The sermon data to validate
 * @returns ValidationResult with success status and errors if any
 */
export function validateSermon(data: unknown): ValidationResult {
  try {
    const validated = schemas.sermonSchema.parse(data);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: {
        _general: ["Validation failed"],
      },
    };
  }
}

/**
 * Validate required fields are present
 * 
 * **Validates: Requirement 6.1**
 * 
 * @param data - The sermon data to validate
 * @returns Array of missing required field names
 */
export function validateRequiredFields(data: Partial<Sermon>): string[] {
  const requiredFields: (keyof Sermon)[] = ["title", "tag", "date", "pastor"];
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      missing.push(field);
    }
  }

  return missing;
}

/**
 * Validate title is a non-empty string
 * 
 * **Validates: Requirement 6.2**
 * 
 * @param title - The title to validate
 * @returns Error message if invalid, null if valid
 */
export function validateTitle(title: unknown): string | null {
  if (typeof title !== "string") {
    return "Title must be a string";
  }

  if (title.trim() === "") {
    return "Title cannot be empty";
  }

  return null;
}

/**
 * Validate tag is a valid SeriesTag value
 * 
 * **Validates: Requirement 6.3**
 * 
 * @param tag - The tag to validate
 * @returns Error message if invalid, null if valid
 */
export function validateTag(tag: unknown): string | null {
  const validTags: SeriesTag[] = ["Faith", "Family", "Prayer", "Identity", "Prophecy"];

  if (typeof tag !== "string") {
    return "Tag must be a string";
  }

  if (!validTags.includes(tag as SeriesTag)) {
    return `Tag must be one of: ${validTags.join(", ")}`;
  }

  return null;
}

/**
 * Validate podcast links structure
 * 
 * **Validates: Requirement 6.4**
 * 
 * @param podcastLinks - The podcast links to validate
 * @returns Error message if invalid, null if valid
 */
export function validatePodcastLinks(podcastLinks: unknown): string | null {
  if (podcastLinks === undefined || podcastLinks === null) {
    return null; // Optional field
  }

  if (typeof podcastLinks !== "object" || Array.isArray(podcastLinks)) {
    return "Podcast links must be an object";
  }

  const links = podcastLinks as Record<string, unknown>;
  const validKeys = ["spotify", "apple", "youtube"];

  // Check for invalid keys
  for (const key of Object.keys(links)) {
    if (!validKeys.includes(key)) {
      return `Invalid podcast link key: ${key}. Valid keys are: ${validKeys.join(", ")}`;
    }
  }

  // Validate URL format for each link
  const urlRegex = /^https?:\/\/.+/;
  
  for (const key of validKeys) {
    const value = links[key];
    if (value !== undefined && value !== null) {
      if (typeof value !== "string") {
        return `${key} link must be a string`;
      }
      if (!urlRegex.test(value)) {
        return `${key} link must be a valid URL`;
      }
    }
  }

  return null;
}

/**
 * Validate date field is present
 * 
 * **Validates: Requirement 6.1**
 * 
 * @param date - The date to validate
 * @returns Error message if invalid, null if valid
 */
export function validateDate(date: unknown): string | null {
  if (typeof date !== "string") {
    return "Date must be a string";
  }

  if (date.trim() === "") {
    return "Date cannot be empty";
  }

  return null;
}

/**
 * Validate pastor field is present
 * 
 * **Validates: Requirement 6.1**
 * 
 * @param pastor - The pastor name to validate
 * @returns Error message if invalid, null if valid
 */
export function validatePastor(pastor: unknown): string | null {
  if (typeof pastor !== "string") {
    return "Pastor must be a string";
  }

  if (pastor.trim() === "") {
    return "Pastor cannot be empty";
  }

  return null;
}

/**
 * Format validation errors for API response
 * 
 * **Validates: Requirement 6.5**
 * 
 * @param errors - The validation errors
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages: string[] = [];

  for (const [field, fieldErrors] of Object.entries(errors)) {
    if (field === "_general") {
      messages.push(...fieldErrors);
    } else {
      messages.push(`${field}: ${fieldErrors.join(", ")}`);
    }
  }

  return messages.join("; ");
}
