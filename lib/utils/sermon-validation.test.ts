/**
 * Unit tests for sermon validation utilities
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
 */

import { describe, it, expect } from "vitest";
import {
  validateSermon,
  validateRequiredFields,
  validateTitle,
  validateTag,
  validatePodcastLinks,
  validateDate,
  validatePastor,
  formatValidationErrors,
} from "./sermon-validation";
import type { Sermon } from "@/lib/types/sermon";

describe("Sermon Validation Utilities", () => {
  describe("validateSermon", () => {
    it("should validate a complete valid sermon", () => {
      const validSermon: Partial<Sermon> = {
        slug: "test-sermon",
        title: "Test Sermon",
        subtitle: "A test subtitle",
        series: "Test Series",
        tag: "Faith",
        date: "January 1, 2024",
        dateISO: "2024-01-01",
        pastor: "John Doe",
        pastorRole: "Senior Pastor",
        scripture: "John 3:16",
        excerpt: "A test excerpt",
        body: "Full sermon content",
        featured: true,
        podcastLinks: {
          spotify: "https://open.spotify.com/episode/123",
          apple: "https://podcasts.apple.com/episode/456",
          youtube: "https://youtube.com/watch?v=789",
        },
      };

      const result = validateSermon(validSermon);

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it("should validate sermon with only required fields", () => {
      const minimalSermon = {
        title: "Minimal Sermon",
        tag: "Prayer",
        date: "February 1, 2024",
        pastor: "Jane Smith",
      };

      const result = validateSermon(minimalSermon);

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it("should fail validation when title is missing", () => {
      const invalidSermon = {
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "John Doe",
      };

      const result = validateSermon(invalidSermon);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.title).toBeDefined();
    });

    it("should fail validation when tag is invalid", () => {
      const invalidSermon = {
        title: "Test Sermon",
        tag: "InvalidTag",
        date: "January 1, 2024",
        pastor: "John Doe",
      };

      const result = validateSermon(invalidSermon);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.tag).toBeDefined();
    });

    it("should fail validation when date is missing", () => {
      const invalidSermon = {
        title: "Test Sermon",
        tag: "Faith",
        pastor: "John Doe",
      };

      const result = validateSermon(invalidSermon);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.date).toBeDefined();
    });

    it("should fail validation when pastor is missing", () => {
      const invalidSermon = {
        title: "Test Sermon",
        tag: "Faith",
        date: "January 1, 2024",
      };

      const result = validateSermon(invalidSermon);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.pastor).toBeDefined();
    });

    it("should fail validation when podcast link URL is invalid", () => {
      const invalidSermon = {
        title: "Test Sermon",
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "John Doe",
        podcastLinks: {
          spotify: "not-a-valid-url",
        },
      };

      const result = validateSermon(invalidSermon);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.["podcastLinks.spotify"]).toBeDefined();
    });

    it("should validate sermon with partial podcast links", () => {
      const validSermon = {
        title: "Test Sermon",
        tag: "Identity",
        date: "January 1, 2024",
        pastor: "John Doe",
        podcastLinks: {
          spotify: "https://open.spotify.com/episode/123",
        },
      };

      const result = validateSermon(validSermon);

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it("should validate sermon without podcast links", () => {
      const validSermon = {
        title: "Test Sermon",
        tag: "Prophecy",
        date: "January 1, 2024",
        pastor: "John Doe",
      };

      const result = validateSermon(validSermon);

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe("validateRequiredFields", () => {
    it("should return empty array for sermon with all required fields", () => {
      const sermon: Partial<Sermon> = {
        title: "Test Sermon",
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "John Doe",
      };

      const missing = validateRequiredFields(sermon);

      expect(missing).toEqual([]);
    });

    it("should return missing field names when required fields are absent", () => {
      const sermon: Partial<Sermon> = {
        title: "Test Sermon",
      };

      const missing = validateRequiredFields(sermon);

      expect(missing).toContain("tag");
      expect(missing).toContain("date");
      expect(missing).toContain("pastor");
      expect(missing.length).toBe(3);
    });

    it("should detect empty string as missing field", () => {
      const sermon: Partial<Sermon> = {
        title: "",
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "John Doe",
      };

      const missing = validateRequiredFields(sermon);

      expect(missing).toContain("title");
    });

    it("should detect whitespace-only string as missing field", () => {
      const sermon: Partial<Sermon> = {
        title: "Test Sermon",
        tag: "Faith",
        date: "   ",
        pastor: "John Doe",
      };

      const missing = validateRequiredFields(sermon);

      expect(missing).toContain("date");
    });
  });

  describe("validateTitle", () => {
    it("should return null for valid title", () => {
      const error = validateTitle("Valid Sermon Title");

      expect(error).toBeNull();
    });

    it("should return error for non-string title", () => {
      const error = validateTitle(123);

      expect(error).toBe("Title must be a string");
    });

    it("should return error for empty title", () => {
      const error = validateTitle("");

      expect(error).toBe("Title cannot be empty");
    });

    it("should return error for whitespace-only title", () => {
      const error = validateTitle("   ");

      expect(error).toBe("Title cannot be empty");
    });
  });

  describe("validateTag", () => {
    it("should return null for valid Faith tag", () => {
      const error = validateTag("Faith");

      expect(error).toBeNull();
    });

    it("should return null for valid Family tag", () => {
      const error = validateTag("Family");

      expect(error).toBeNull();
    });

    it("should return null for valid Prayer tag", () => {
      const error = validateTag("Prayer");

      expect(error).toBeNull();
    });

    it("should return null for valid Identity tag", () => {
      const error = validateTag("Identity");

      expect(error).toBeNull();
    });

    it("should return null for valid Prophecy tag", () => {
      const error = validateTag("Prophecy");

      expect(error).toBeNull();
    });

    it("should return error for invalid tag", () => {
      const error = validateTag("InvalidTag");

      expect(error).toContain("Tag must be one of");
      expect(error).toContain("Faith");
      expect(error).toContain("Family");
      expect(error).toContain("Prayer");
      expect(error).toContain("Identity");
      expect(error).toContain("Prophecy");
    });

    it("should return error for non-string tag", () => {
      const error = validateTag(123);

      expect(error).toBe("Tag must be a string");
    });

    it("should return error for case-sensitive mismatch", () => {
      const error = validateTag("faith");

      expect(error).toContain("Tag must be one of");
    });
  });

  describe("validatePodcastLinks", () => {
    it("should return null for undefined podcast links", () => {
      const error = validatePodcastLinks(undefined);

      expect(error).toBeNull();
    });

    it("should return null for null podcast links", () => {
      const error = validatePodcastLinks(null);

      expect(error).toBeNull();
    });

    it("should return null for valid podcast links with all platforms", () => {
      const links = {
        spotify: "https://open.spotify.com/episode/123",
        apple: "https://podcasts.apple.com/episode/456",
        youtube: "https://youtube.com/watch?v=789",
      };

      const error = validatePodcastLinks(links);

      expect(error).toBeNull();
    });

    it("should return null for valid podcast links with one platform", () => {
      const links = {
        spotify: "https://open.spotify.com/episode/123",
      };

      const error = validatePodcastLinks(links);

      expect(error).toBeNull();
    });

    it("should return null for empty podcast links object", () => {
      const error = validatePodcastLinks({});

      expect(error).toBeNull();
    });

    it("should return error for non-object podcast links", () => {
      const error = validatePodcastLinks("not an object");

      expect(error).toBe("Podcast links must be an object");
    });

    it("should return error for array podcast links", () => {
      const error = validatePodcastLinks([]);

      expect(error).toBe("Podcast links must be an object");
    });

    it("should return error for invalid key", () => {
      const links = {
        invalidKey: "https://example.com",
      };

      const error = validatePodcastLinks(links);

      expect(error).toContain("Invalid podcast link key");
      expect(error).toContain("invalidKey");
    });

    it("should return error for non-string link value", () => {
      const links = {
        spotify: 123,
      };

      const error = validatePodcastLinks(links);

      expect(error).toContain("spotify link must be a string");
    });

    it("should return error for invalid URL format", () => {
      const links = {
        spotify: "not-a-url",
      };

      const error = validatePodcastLinks(links);

      expect(error).toContain("spotify link must be a valid URL");
    });

    it("should accept http URLs", () => {
      const links = {
        spotify: "http://open.spotify.com/episode/123",
      };

      const error = validatePodcastLinks(links);

      expect(error).toBeNull();
    });
  });

  describe("validateDate", () => {
    it("should return null for valid date string", () => {
      const error = validateDate("January 1, 2024");

      expect(error).toBeNull();
    });

    it("should return error for non-string date", () => {
      const error = validateDate(123);

      expect(error).toBe("Date must be a string");
    });

    it("should return error for empty date", () => {
      const error = validateDate("");

      expect(error).toBe("Date cannot be empty");
    });

    it("should return error for whitespace-only date", () => {
      const error = validateDate("   ");

      expect(error).toBe("Date cannot be empty");
    });
  });

  describe("validatePastor", () => {
    it("should return null for valid pastor name", () => {
      const error = validatePastor("John Doe");

      expect(error).toBeNull();
    });

    it("should return error for non-string pastor", () => {
      const error = validatePastor(123);

      expect(error).toBe("Pastor must be a string");
    });

    it("should return error for empty pastor", () => {
      const error = validatePastor("");

      expect(error).toBe("Pastor cannot be empty");
    });

    it("should return error for whitespace-only pastor", () => {
      const error = validatePastor("   ");

      expect(error).toBe("Pastor cannot be empty");
    });
  });

  describe("formatValidationErrors", () => {
    it("should format single field error", () => {
      const errors = {
        title: ["Title is required"],
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted).toBe("title: Title is required");
    });

    it("should format multiple field errors", () => {
      const errors = {
        title: ["Title is required"],
        tag: ["Tag must be one of: Faith, Family, Prayer, Identity, Prophecy"],
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted).toContain("title: Title is required");
      expect(formatted).toContain("tag: Tag must be one of");
    });

    it("should format multiple errors for same field", () => {
      const errors = {
        password: ["Password is too short", "Password must contain uppercase"],
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted).toContain("password: Password is too short, Password must contain uppercase");
    });

    it("should format general errors without field name", () => {
      const errors = {
        _general: ["Validation failed"],
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted).toBe("Validation failed");
    });

    it("should format mixed field and general errors", () => {
      const errors = {
        _general: ["General error"],
        title: ["Title is required"],
      };

      const formatted = formatValidationErrors(errors);

      expect(formatted).toContain("General error");
      expect(formatted).toContain("title: Title is required");
    });

    it("should return empty string for empty errors object", () => {
      const formatted = formatValidationErrors({});

      expect(formatted).toBe("");
    });
  });
});
