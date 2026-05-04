/**
 * Integration tests for sermon types
 * Verifies types work correctly with realistic data scenarios
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */

import { describe, it, expect } from "vitest";
import type { Sermon, SeriesTag } from "./sermon";

describe("Sermon Types Integration", () => {
  it("should match admin UI form data structure", () => {
    // Simulating data from the admin UI form
    const formData = {
      slug: "walking-in-faith",
      title: "Walking in Faith",
      subtitle: "Trusting God in Uncertain Times",
      series: "Faith Series 2024",
      tag: "Faith" as SeriesTag,
      date: "January 15, 2024",
      dateISO: "2024-01-15",
      pastor: "Pastor John Smith",
      pastorRole: "Senior Pastor",
      scripture: "Hebrews 11:1-6",
      excerpt: "Discover what it means to walk by faith and not by sight.",
      body: "In this sermon, we explore the nature of faith...",
      featured: true,
      podcastLinks: {
        spotify: "https://open.spotify.com/episode/abc123",
        apple: "https://podcasts.apple.com/us/podcast/walking-in-faith/id123456",
        youtube: "https://youtube.com/watch?v=xyz789"
      }
    };

    // Type assertion should work without errors
    const sermon: Sermon = formData;

    expect(sermon.slug).toBe("walking-in-faith");
    expect(sermon.title).toBe("Walking in Faith");
    expect(sermon.tag).toBe("Faith");
    expect(sermon.pastor).toBe("Pastor John Smith");
  });

  it("should handle slug generation scenario", () => {
    // Simulating slug generation from title
    const title = "The Power of Prayer";
    const generatedSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const sermon: Sermon = {
      slug: generatedSlug,
      title: title,
      tag: "Prayer",
      date: "February 1, 2024",
      pastor: "Pastor Jane Doe"
    };

    expect(sermon.slug).toBe("the-power-of-prayer");
  });

  it("should handle all valid series tags", () => {
    const tags: SeriesTag[] = ["Faith", "Family", "Prayer", "Identity", "Prophecy"];
    
    const sermons: Sermon[] = tags.map((tag, index) => ({
      slug: `sermon-${index + 1}`,
      title: `Sermon ${index + 1}`,
      tag: tag,
      date: `January ${index + 1}, 2024`,
      pastor: "Pastor Test"
    }));

    expect(sermons).toHaveLength(5);
    expect(sermons[0].tag).toBe("Faith");
    expect(sermons[1].tag).toBe("Family");
    expect(sermons[2].tag).toBe("Prayer");
    expect(sermons[3].tag).toBe("Identity");
    expect(sermons[4].tag).toBe("Prophecy");
  });

  it("should handle API response scenario", () => {
    // Simulating API response with array of sermons
    const apiResponse: Sermon[] = [
      {
        slug: "sermon-1",
        title: "First Sermon",
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "Pastor A",
        featured: true
      },
      {
        slug: "sermon-2",
        title: "Second Sermon",
        tag: "Family",
        date: "January 8, 2024",
        pastor: "Pastor B",
        podcastLinks: {
          spotify: "https://open.spotify.com/episode/def456"
        }
      },
      {
        slug: "sermon-3",
        title: "Third Sermon",
        tag: "Prayer",
        date: "January 15, 2024",
        pastor: "Pastor C"
      }
    ];

    expect(apiResponse).toHaveLength(3);
    expect(apiResponse[0].featured).toBe(true);
    expect(apiResponse[1].podcastLinks?.spotify).toBeDefined();
    expect(apiResponse[2].featured).toBeUndefined();
  });

  it("should handle update scenario with partial data", () => {
    // Original sermon
    const original: Sermon = {
      slug: "original-sermon",
      title: "Original Title",
      tag: "Faith",
      date: "March 1, 2024",
      pastor: "Pastor Original"
    };

    // Update with new data
    const updated: Sermon = {
      ...original,
      title: "Updated Title",
      subtitle: "New Subtitle",
      featured: true
    };

    expect(updated.slug).toBe("original-sermon");
    expect(updated.title).toBe("Updated Title");
    expect(updated.subtitle).toBe("New Subtitle");
    expect(updated.featured).toBe(true);
    expect(updated.pastor).toBe("Pastor Original");
  });

  it("should handle empty podcast links correctly", () => {
    const sermon: Sermon = {
      slug: "no-podcast",
      title: "Sermon Without Podcast",
      tag: "Identity",
      date: "April 1, 2024",
      pastor: "Pastor Test",
      podcastLinks: {}
    };

    expect(sermon.podcastLinks).toBeDefined();
    expect(sermon.podcastLinks?.spotify).toBeUndefined();
    expect(sermon.podcastLinks?.apple).toBeUndefined();
    expect(sermon.podcastLinks?.youtube).toBeUndefined();
  });

  it("should handle date formats correctly", () => {
    const sermon: Sermon = {
      slug: "date-test",
      title: "Date Test Sermon",
      tag: "Prophecy",
      date: "December 25, 2024",
      dateISO: "2024-12-25",
      pastor: "Pastor Date"
    };

    expect(sermon.date).toBe("December 25, 2024");
    expect(sermon.dateISO).toBe("2024-12-25");
  });
});
