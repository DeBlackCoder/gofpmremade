/**
 * Unit tests for sermon data types
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */

import { describe, it, expect } from "vitest";
import type { Sermon, SeriesTag, PodcastLinks } from "./sermon";

describe("Sermon Types", () => {
  describe("SeriesTag", () => {
    it("should accept valid tag values", () => {
      const validTags: SeriesTag[] = ["Faith", "Family", "Prayer", "Identity", "Prophecy"];
      
      validTags.forEach(tag => {
        const sermon: Sermon = {
          slug: "test-sermon",
          title: "Test Sermon",
          tag: tag,
          date: "January 1, 2024",
          pastor: "John Doe"
        };
        
        expect(sermon.tag).toBe(tag);
      });
    });
  });

  describe("Sermon Interface", () => {
    it("should accept sermon with only required fields", () => {
      const sermon: Sermon = {
        slug: "test-sermon",
        title: "Test Sermon",
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "John Doe"
      };

      expect(sermon.slug).toBe("test-sermon");
      expect(sermon.title).toBe("Test Sermon");
      expect(sermon.tag).toBe("Faith");
      expect(sermon.date).toBe("January 1, 2024");
      expect(sermon.pastor).toBe("John Doe");
    });

    it("should accept sermon with all optional fields", () => {
      const sermon: Sermon = {
        slug: "complete-sermon",
        title: "Complete Sermon",
        subtitle: "A subtitle",
        series: "Test Series",
        tag: "Prayer",
        date: "January 15, 2024",
        dateISO: "2024-01-15",
        pastor: "Jane Smith",
        pastorRole: "Senior Pastor",
        scripture: "John 3:16",
        excerpt: "This is an excerpt",
        body: "This is the full sermon body",
        featured: true,
        podcastLinks: {
          spotify: "https://open.spotify.com/episode/123",
          apple: "https://podcasts.apple.com/episode/123",
          youtube: "https://youtube.com/watch?v=123"
        }
      };

      expect(sermon.subtitle).toBe("A subtitle");
      expect(sermon.series).toBe("Test Series");
      expect(sermon.dateISO).toBe("2024-01-15");
      expect(sermon.pastorRole).toBe("Senior Pastor");
      expect(sermon.scripture).toBe("John 3:16");
      expect(sermon.excerpt).toBe("This is an excerpt");
      expect(sermon.body).toBe("This is the full sermon body");
      expect(sermon.featured).toBe(true);
      expect(sermon.podcastLinks?.spotify).toBe("https://open.spotify.com/episode/123");
    });

    it("should accept sermon with partial podcast links", () => {
      const sermon: Sermon = {
        slug: "partial-podcast",
        title: "Partial Podcast Sermon",
        tag: "Identity",
        date: "February 1, 2024",
        pastor: "Bob Johnson",
        podcastLinks: {
          spotify: "https://open.spotify.com/episode/456"
        }
      };

      expect(sermon.podcastLinks?.spotify).toBe("https://open.spotify.com/episode/456");
      expect(sermon.podcastLinks?.apple).toBeUndefined();
      expect(sermon.podcastLinks?.youtube).toBeUndefined();
    });

    it("should accept sermon without podcast links", () => {
      const sermon: Sermon = {
        slug: "no-podcast",
        title: "No Podcast Sermon",
        tag: "Prophecy",
        date: "March 1, 2024",
        pastor: "Alice Williams"
      };

      expect(sermon.podcastLinks).toBeUndefined();
    });

    it("should handle featured flag correctly", () => {
      const featuredSermon: Sermon = {
        slug: "featured",
        title: "Featured Sermon",
        tag: "Family",
        date: "April 1, 2024",
        pastor: "Chris Brown",
        featured: true
      };

      const regularSermon: Sermon = {
        slug: "regular",
        title: "Regular Sermon",
        tag: "Faith",
        date: "April 8, 2024",
        pastor: "Chris Brown",
        featured: false
      };

      expect(featuredSermon.featured).toBe(true);
      expect(regularSermon.featured).toBe(false);
    });
  });

  describe("PodcastLinks Interface", () => {
    it("should accept empty podcast links object", () => {
      const links: PodcastLinks = {};
      expect(links).toEqual({});
    });

    it("should accept podcast links with all platforms", () => {
      const links: PodcastLinks = {
        spotify: "https://open.spotify.com/episode/789",
        apple: "https://podcasts.apple.com/episode/789",
        youtube: "https://youtube.com/watch?v=789"
      };

      expect(links.spotify).toBe("https://open.spotify.com/episode/789");
      expect(links.apple).toBe("https://podcasts.apple.com/episode/789");
      expect(links.youtube).toBe("https://youtube.com/watch?v=789");
    });

    it("should accept podcast links with only one platform", () => {
      const spotifyOnly: PodcastLinks = {
        spotify: "https://open.spotify.com/episode/abc"
      };

      const appleOnly: PodcastLinks = {
        apple: "https://podcasts.apple.com/episode/def"
      };

      const youtubeOnly: PodcastLinks = {
        youtube: "https://youtube.com/watch?v=ghi"
      };

      expect(spotifyOnly.spotify).toBe("https://open.spotify.com/episode/abc");
      expect(appleOnly.apple).toBe("https://podcasts.apple.com/episode/def");
      expect(youtubeOnly.youtube).toBe("https://youtube.com/watch?v=ghi");
    });
  });
});
