/**
 * Example usage of sermon validation utilities
 * 
 * This file demonstrates how to use the sermon validation functions
 * in API routes and other parts of the application.
 */

import {
  validateSermon,
  validateRequiredFields,
  validateTitle,
  validateTag,
  validatePodcastLinks,
  formatValidationErrors,
} from "./sermon-validation";
import type { Sermon } from "@/lib/types/sermon";

// Example 1: Validate complete sermon data
export function exampleValidateCompleteSermon() {
  const sermonData = {
    title: "The Power of Faith",
    tag: "Faith",
    date: "January 15, 2024",
    pastor: "John Doe",
    subtitle: "Understanding faith in modern times",
    series: "Faith Series 2024",
    podcastLinks: {
      spotify: "https://open.spotify.com/episode/123",
      apple: "https://podcasts.apple.com/episode/456",
    },
  };

  const result = validateSermon(sermonData);

  if (result.success) {
    console.log("Sermon is valid:", result.data);
    // Proceed with saving to database
  } else {
    console.error("Validation errors:", result.errors);
    const errorMessage = formatValidationErrors(result.errors!);
    console.error("Formatted error:", errorMessage);
    // Return 400 Bad Request with error message
  }
}

// Example 2: Validate individual fields
export function exampleValidateIndividualFields() {
  const title = "My Sermon Title";
  const tag = "Faith";
  const podcastLinks = {
    spotify: "https://open.spotify.com/episode/123",
  };

  const titleError = validateTitle(title);
  if (titleError) {
    console.error("Title error:", titleError);
  }

  const tagError = validateTag(tag);
  if (tagError) {
    console.error("Tag error:", tagError);
  }

  const linksError = validatePodcastLinks(podcastLinks);
  if (linksError) {
    console.error("Podcast links error:", linksError);
  }
}

// Example 3: Check for missing required fields
export function exampleCheckRequiredFields() {
  const partialSermon: Partial<Sermon> = {
    title: "My Sermon",
    tag: "Prayer",
    // Missing date and pastor
  };

  const missingFields = validateRequiredFields(partialSermon);

  if (missingFields.length > 0) {
    console.error("Missing required fields:", missingFields);
    // Return 400 Bad Request
  } else {
    console.log("All required fields present");
  }
}

// Example 4: API route usage pattern
export async function exampleApiRouteUsage(requestBody: unknown) {
  // Validate the incoming request body
  const validation = validateSermon(requestBody);

  if (!validation.success) {
    // Format errors for API response
    const errorMessage = formatValidationErrors(validation.errors!);
    
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: errorMessage,
          details: validation.errors,
        },
      },
    };
  }

  // Validation passed, use the validated data
  const validatedSermon = validation.data;
  
  // Proceed with database operation
  console.log("Saving sermon:", validatedSermon);
  
  return {
    status: 201,
    body: {
      success: true,
      data: validatedSermon,
    },
  };
}

// Example 5: Handling invalid tag values
export function exampleInvalidTagHandling() {
  const invalidTag = "InvalidTag";
  const error = validateTag(invalidTag);

  if (error) {
    console.error(error);
    // Output: "Tag must be one of: Faith, Family, Prayer, Identity, Prophecy"
  }
}

// Example 6: Handling invalid podcast links
export function exampleInvalidPodcastLinks() {
  const invalidLinks = {
    spotify: "not-a-url",
    invalidPlatform: "https://example.com",
  };

  const error = validatePodcastLinks(invalidLinks);

  if (error) {
    console.error(error);
    // Will catch both invalid URL format and invalid platform key
  }
}
