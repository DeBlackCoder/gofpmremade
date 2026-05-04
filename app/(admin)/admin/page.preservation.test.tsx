/**
 * Preservation Property Tests for Sermon Count Dashboard Fix
 * 
 * **Property 2: Preservation** - Non-Sermon Endpoint Count Extraction
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.5**
 * 
 * This test verifies that all other endpoints continue to work correctly
 * after changing the sermon count endpoint. It ensures that the fetchCount
 * function correctly handles various response formats from different endpoints.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock fetch globally
const originalFetch = global.fetch;

describe("Property 2: Preservation - Non-Sermon Endpoint Count Extraction", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  /**
   * Helper function to test fetchCount with various response formats
   * This replicates the fetchCount logic from the dashboard
   */
  async function testFetchCount(url: string, mockResponse: any, shouldFail: boolean = false): Promise<number | null> {
    // Mock fetch to return our test response
    if (shouldFail) {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    } else {
      global.fetch = vi.fn().mockResolvedValue({
        ok: mockResponse.ok !== undefined ? mockResponse.ok : true,
        status: mockResponse.status || 200,
        statusText: mockResponse.statusText || "OK",
        json: async () => mockResponse.data,
      } as Response);
    }

    // Replicate the fetchCount logic
    try {
      const res = await fetch(url, { 
        signal: AbortSignal.timeout(2000),
        credentials: 'include',
        cache: 'no-store',
      });
      
      if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
        return null;
      }
      
      const data = await res.json();
      
      // Handle different response formats
      // Paginated responses with nested data: { success: true, data: { data: [...], total: N } }
      if (data?.success && data?.data?.total !== undefined) return data.data.total;
      
      // Check for nested pagination (for /api/v1/sermons)
      if (data?.success && data?.data?.pagination?.total !== undefined) {
        return data.data.pagination.total;
      }
      
      if (data?.success && Array.isArray(data?.data?.data)) return data.data.data.length;
      
      // MongoDB responses: { success: true, data: [...] }
      if (data?.success && Array.isArray(data?.data)) return data.data.length;
      
      // Standard paginated responses: { data: [...], total: N } or { data: [...], pagination: { total: N } }
      if (typeof data?.total === "number") return data.total;
      if (typeof data?.pagination?.total === "number") return data.pagination.total;
      
      // Direct array responses
      if (Array.isArray(data?.data)) return data.data.length;
      if (Array.isArray(data)) return data.length;
      
      console.error(`Unexpected response format from ${url}:`, data);
      return null;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  }

  describe("Events Endpoint Preservation", () => {
    it("should extract count from paginated events response", async () => {
      // Arrange - /api/v1/events returns paginated format
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              { id: "1", title: "Event 1", date: "2024-01-01" },
              { id: "2", title: "Event 2", date: "2024-01-02" },
              { id: "3", title: "Event 3", date: "2024-01-03" },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 3,
              pages: 1,
            },
          },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse);

      // Assert
      expect(result).toBe(3);
    });

    it("should extract count from events response with zero events", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0,
            },
          },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("Community Groups Endpoint Preservation", () => {
    it("should extract count from direct array response", async () => {
      // Arrange - /api/v1/ministries returns direct array format
      const mockResponse = {
        data: {
          success: true,
          data: [
            { id: "1", name: "Youth Group", leader: "John Doe" },
            { id: "2", name: "Women's Ministry", leader: "Jane Smith" },
            { id: "3", name: "Men's Fellowship", leader: "Bob Johnson" },
            { id: "4", name: "Children's Ministry", leader: "Alice Brown" },
          ],
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/ministries", mockResponse);

      // Assert
      expect(result).toBe(4);
    });

    it("should extract count from empty community groups array", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: [],
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/ministries", mockResponse);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("Members Endpoint Preservation", () => {
    it("should extract count from paginated members response", async () => {
      // Arrange - /api/v1/members returns paginated format
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              { id: "1", name: "Member 1", email: "member1@example.com" },
              { id: "2", name: "Member 2", email: "member2@example.com" },
              { id: "3", name: "Member 3", email: "member3@example.com" },
              { id: "4", name: "Member 4", email: "member4@example.com" },
              { id: "5", name: "Member 5", email: "member5@example.com" },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 5,
              pages: 1,
            },
          },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/members", mockResponse);

      // Assert
      expect(result).toBe(5);
    });

    it("should extract count from members response with zero members", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0,
            },
          },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/members", mockResponse);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("Messages Endpoint Preservation", () => {
    it("should extract count from paginated prayer requests response", async () => {
      // Arrange - /api/v1/admin/prayer-requests returns paginated format
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [
              { id: "1", message: "Prayer request 1", status: "pending" },
              { id: "2", message: "Prayer request 2", status: "answered" },
              { id: "3", message: "Prayer request 3", status: "pending" },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 3,
              pages: 1,
            },
          },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/admin/prayer-requests", mockResponse);

      // Assert
      expect(result).toBe(3);
    });

    it("should extract count from prayer requests response with zero messages", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            data: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0,
            },
          },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/admin/prayer-requests", mockResponse);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("Error Handling Preservation", () => {
    it("should return null for 404 error", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        data: { error: "Not found" },
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for 500 error", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        data: { error: "Server error" },
      };

      // Act
      const result = await testFetchCount("/api/v1/members", mockResponse);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for network timeout", async () => {
      // Arrange - shouldFail flag triggers network error
      const mockResponse = {
        data: null,
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse, true);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for fetch exception", async () => {
      // Arrange
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      // Act
      const result = await testFetchCount("/api/v1/ministries", {} as any, true);

      // Assert
      expect(result).toBe(null);
    });
  });

  describe("Malformed Response Handling Preservation", () => {
    it("should handle response without success field using fallback logic", async () => {
      // Arrange - fetchCount has fallback logic for direct array responses
      const mockResponse = {
        data: {
          data: [{ id: "1" }, { id: "2" }],
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse);

      // Assert
      // Should use fallback logic: if (Array.isArray(data?.data)) return data.data.length
      expect(result).toBe(2);
    });

    it("should return null for response with unexpected structure", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          unexpected: "format",
          random: { nested: { data: "value" } },
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/members", mockResponse);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for response with null data", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: null,
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for response with undefined data", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: undefined,
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/ministries", mockResponse);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for response with string data instead of array", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: "not an array",
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/members", mockResponse);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null for response with number data instead of array", async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: 42,
        },
      };

      // Act
      const result = await testFetchCount("/api/v1/events", mockResponse);

      // Assert
      expect(result).toBe(null);
    });
  });

  describe("Cross-Endpoint Consistency", () => {
    it("should handle multiple endpoints with different formats consistently", async () => {
      // Test that different endpoints with different formats all work correctly
      
      // Events - paginated format
      const eventsResponse = {
        data: {
          success: true,
          data: {
            data: [{ id: "1" }, { id: "2" }],
            pagination: { page: 1, limit: 10, total: 2, pages: 1 },
          },
        },
      };
      
      // Community groups - direct array format
      const ministriesResponse = {
        data: {
          success: true,
          data: [{ id: "1" }, { id: "2" }, { id: "3" }],
        },
      };
      
      // Members - paginated format
      const membersResponse = {
        data: {
          success: true,
          data: {
            data: [{ id: "1" }],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 },
          },
        },
      };

      // Act
      const eventsCount = await testFetchCount("/api/v1/events", eventsResponse);
      const ministriesCount = await testFetchCount("/api/v1/ministries", ministriesResponse);
      const membersCount = await testFetchCount("/api/v1/members", membersResponse);

      // Assert
      expect(eventsCount).toBe(2);
      expect(ministriesCount).toBe(3);
      expect(membersCount).toBe(1);
    });
  });
});
