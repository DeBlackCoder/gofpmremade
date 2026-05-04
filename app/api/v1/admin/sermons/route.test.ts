/**
 * Unit tests for /api/v1/admin/sermons endpoint
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 10.1, 10.2, 10.3**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import type { Sermon } from "@/lib/types/sermon";

// Mock the MongoDB module BEFORE importing the route
vi.mock("@/lib/db/mongodb", () => ({
  getDatabase: vi.fn(),
  getClient: vi.fn(),
  default: Promise.resolve({
    db: vi.fn(),
  }),
}));

// Mock the cookies function from next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Now import the route and mongodb module
import { GET, POST, PUT, DELETE } from "./route";
import * as mongodb from "@/lib/db/mongodb";
import { cookies } from "next/headers";

describe("GET /api/v1/admin/sermons", () => {
  let mockFind: ReturnType<typeof vi.fn>;
  let mockToArray: ReturnType<typeof vi.fn>;
  let mockCollection: ReturnType<typeof vi.fn>;
  let mockDb: any;
  let mockCookieStore: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock cookie store with authenticated session
    mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: "authenticated" }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    // Setup mock chain: db.collection().find().toArray()
    mockToArray = vi.fn();
    mockFind = vi.fn().mockReturnValue({
      toArray: mockToArray,
    });
    mockCollection = vi.fn().mockReturnValue({
      find: mockFind,
    });
    mockDb = {
      collection: mockCollection,
    };

    // Mock getDatabase to return our mock db
    vi.mocked(mongodb.getDatabase).mockResolvedValue(mockDb);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue(undefined);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should return 401 when session cookie has invalid value", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue({ value: "invalid" });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should successfully retrieve all sermons", async () => {
    // Arrange
    const mockSermons: Sermon[] = [
      {
        slug: "test-sermon-1",
        title: "Test Sermon 1",
        tag: "Faith",
        date: "January 1, 2024",
        pastor: "John Doe",
      },
      {
        slug: "test-sermon-2",
        title: "Test Sermon 2",
        tag: "Prayer",
        date: "January 8, 2024",
        pastor: "Jane Smith",
      },
    ];

    mockToArray.mockResolvedValue(mockSermons);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockSermons);
    expect(data.data).toHaveLength(2);

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockToArray).toHaveBeenCalledOnce();
  });

  it("should return empty array when no sermons exist", async () => {
    // Arrange
    mockToArray.mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
    expect(data.data).toHaveLength(0);

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockToArray).toHaveBeenCalledOnce();
  });

  it("should handle database connection errors", async () => {
    // Arrange
    const errorMessage = "Database connection failed";
    vi.mocked(mongodb.getDatabase).mockRejectedValue(new Error(errorMessage));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to retrieve sermons");

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
  });

  it("should handle query execution errors", async () => {
    // Arrange
    const errorMessage = "Query execution failed";
    mockToArray.mockRejectedValue(new Error(errorMessage));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to retrieve sermons");

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFind).toHaveBeenCalledWith({});
    expect(mockToArray).toHaveBeenCalledOnce();
  });

  it("should retrieve sermons with all optional fields", async () => {
    // Arrange
    const mockSermons: Sermon[] = [
      {
        slug: "complete-sermon",
        title: "Complete Sermon",
        subtitle: "A complete example",
        series: "Test Series",
        tag: "Identity",
        date: "February 1, 2024",
        dateISO: "2024-02-01",
        pastor: "John Doe",
        pastorRole: "Senior Pastor",
        scripture: "John 3:16",
        excerpt: "This is a test excerpt",
        body: "Full sermon content here",
        featured: true,
        podcastLinks: {
          spotify: "https://open.spotify.com/episode/123",
          apple: "https://podcasts.apple.com/episode/456",
          youtube: "https://youtube.com/watch?v=789",
        },
      },
    ];

    mockToArray.mockResolvedValue(mockSermons);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons");

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockSermons);
    expect(data.data[0]).toHaveProperty("subtitle");
    expect(data.data[0]).toHaveProperty("series");
    expect(data.data[0]).toHaveProperty("podcastLinks");
    expect(data.data[0].podcastLinks).toHaveProperty("spotify");
    expect(data.data[0].podcastLinks).toHaveProperty("apple");
    expect(data.data[0].podcastLinks).toHaveProperty("youtube");
  });
});

describe("POST /api/v1/admin/sermons", () => {
  let mockInsertOne: ReturnType<typeof vi.fn>;
  let mockCollection: ReturnType<typeof vi.fn>;
  let mockDb: any;
  let mockCookieStore: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock cookie store with authenticated session
    mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: "authenticated" }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    // Setup mock chain: db.collection().insertOne()
    mockInsertOne = vi.fn();
    mockCollection = vi.fn().mockReturnValue({
      insertOne: mockInsertOne,
    });
    mockDb = {
      collection: mockCollection,
    };

    // Mock getDatabase to return our mock db
    vi.mocked(mongodb.getDatabase).mockResolvedValue(mockDb);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue(undefined);

    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should return 401 when session cookie has invalid value", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue({ value: "invalid" });

    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should successfully create a sermon with valid data", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "test-sermon",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject(sermonData);

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockInsertOne).toHaveBeenCalledOnce();
  });

  it("should generate slug from title when slug is not provided", async () => {
    // Arrange
    const sermonData = {
      title: "Amazing Grace: A Story of Faith",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("amazing-grace-a-story-of-faith");
    expect(data.data.title).toBe(sermonData.title);

    // Verify the slug was generated correctly
    const insertedData = mockInsertOne.mock.calls[0][0];
    expect(insertedData.slug).toBe("amazing-grace-a-story-of-faith");
  });

  it("should generate slug with special characters removed", async () => {
    // Arrange
    const sermonData = {
      title: "God's Love & Grace: Part #1 (Introduction)",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("gods-love-grace-part-1-introduction");
  });

  it("should generate slug with multiple spaces collapsed", async () => {
    // Arrange
    const sermonData = {
      title: "The    Power   of    Prayer",
      tag: "Prayer",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("the-power-of-prayer");
  });

  it("should return 400 when title is missing", async () => {
    // Arrange
    const sermonData = {
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.title).toBeDefined();
  });

  it("should return 400 when tag is missing", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.tag).toBeDefined();
  });

  it("should return 400 when tag is invalid", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "InvalidTag",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
  });

  it("should return 400 when date is missing", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.date).toBeDefined();
  });

  it("should return 400 when pastor is missing", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.pastor).toBeDefined();
  });

  it("should return 400 when multiple fields are missing", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(Object.keys(data.details).length).toBeGreaterThan(1);
  });

  it("should successfully create sermon with all optional fields", async () => {
    // Arrange
    const sermonData = {
      title: "Complete Sermon",
      subtitle: "A complete example",
      series: "Test Series",
      tag: "Identity",
      date: "February 1, 2024",
      dateISO: "2024-02-01",
      pastor: "John Doe",
      pastorRole: "Senior Pastor",
      scripture: "John 3:16",
      excerpt: "This is a test excerpt",
      body: "Full sermon content here",
      featured: true,
      slug: "complete-sermon",
      podcastLinks: {
        spotify: "https://open.spotify.com/episode/123",
        apple: "https://podcasts.apple.com/episode/456",
        youtube: "https://youtube.com/watch?v=789",
      },
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject(sermonData);
    expect(data.data.podcastLinks).toEqual(sermonData.podcastLinks);
  });

  it("should handle database insertion errors", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "test-sermon",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: false,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create sermon");
  });

  it("should handle database connection errors", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "test-sermon",
    };

    vi.mocked(mongodb.getDatabase).mockRejectedValue(new Error("Database connection failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create sermon");
  });

  it("should handle invalid JSON in request body", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: "invalid json",
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create sermon");
  });

  it("should handle duplicate slug scenario gracefully", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "test-sermon",
    };

    // Simulate MongoDB duplicate key error
    const duplicateError = new Error("E11000 duplicate key error");
    (duplicateError as any).code = 11000;
    mockInsertOne.mockRejectedValue(duplicateError);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create sermon");
  });

  it("should preserve provided slug instead of generating one", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon With Custom Slug",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "custom-slug-123",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("custom-slug-123");
  });

  it("should generate slug when provided slug is empty string", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("test-sermon");
  });

  it("should generate slug when provided slug is only whitespace", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      slug: "   ",
    };

    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: "mock-id-123",
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "POST",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("test-sermon");
  });
});

describe("PUT /api/v1/admin/sermons", () => {
  let mockFindOne: ReturnType<typeof vi.fn>;
  let mockUpdateOne: ReturnType<typeof vi.fn>;
  let mockCollection: ReturnType<typeof vi.fn>;
  let mockDb: any;
  let mockCookieStore: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock cookie store with authenticated session
    mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: "authenticated" }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    // Setup mock chain: db.collection().findOne() and db.collection().updateOne()
    mockFindOne = vi.fn();
    mockUpdateOne = vi.fn();
    mockCollection = vi.fn().mockReturnValue({
      findOne: mockFindOne,
      updateOne: mockUpdateOne,
    });
    mockDb = {
      collection: mockCollection,
    };

    // Mock getDatabase to return our mock db
    vi.mocked(mongodb.getDatabase).mockResolvedValue(mockDb);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue(undefined);

    const updatedSermonData = {
      slug: "test-sermon",
      title: "Updated Test Sermon",
      tag: "Prayer",
      date: "January 20, 2024",
      pastor: "Jane Smith",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should return 401 when session cookie has invalid value", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue({ value: "invalid" });

    const updatedSermonData = {
      slug: "test-sermon",
      title: "Updated Test Sermon",
      tag: "Prayer",
      date: "January 20, 2024",
      pastor: "Jane Smith",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should successfully update a sermon with valid data", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const updatedSermonData = {
      slug: "test-sermon",
      title: "Updated Test Sermon",
      tag: "Prayer",
      date: "January 20, 2024",
      pastor: "Jane Smith",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockUpdateOne.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject(updatedSermonData);

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFindOne).toHaveBeenCalledWith({ slug: "test-sermon" });
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { slug: "test-sermon" },
      { $set: updatedSermonData }
    );
  });

  it("should successfully update sermon with partial data", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      excerpt: "Original excerpt",
    };

    const partialUpdate = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
      excerpt: "Updated excerpt",
      featured: true,
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockUpdateOne.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(partialUpdate),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.excerpt).toBe("Updated excerpt");
    expect(data.data.featured).toBe(true);
  });

  it("should return 404 when sermon does not exist", async () => {
    // Arrange
    const updatedSermonData = {
      slug: "non-existent-sermon",
      title: "Non-existent Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockFindOne.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Sermon not found");

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFindOne).toHaveBeenCalledWith({ slug: "non-existent-sermon" });
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it("should return 400 when slug is missing", async () => {
    // Arrange
    const sermonData = {
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for updating a sermon");

    // Verify MongoDB calls - should not reach database
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it("should return 400 when slug is empty string", async () => {
    // Arrange
    const sermonData = {
      slug: "",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for updating a sermon");
  });

  it("should return 400 when slug is only whitespace", async () => {
    // Arrange
    const sermonData = {
      slug: "   ",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for updating a sermon");
  });

  it("should return 400 when title is missing", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.title).toBeDefined();
  });

  it("should return 400 when tag is invalid", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "InvalidTag",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
  });

  it("should return 400 when date is missing", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      pastor: "John Doe",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.date).toBeDefined();
  });

  it("should return 400 when pastor is missing", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(data.details.pastor).toBeDefined();
  });

  it("should return 400 when multiple validation errors occur", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      title: "",
      tag: "InvalidTag",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
    expect(Object.keys(data.details).length).toBeGreaterThan(1);
  });

  it("should successfully update sermon with all optional fields", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "complete-sermon",
      title: "Complete Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const updatedSermonData = {
      slug: "complete-sermon",
      title: "Updated Complete Sermon",
      subtitle: "An updated example",
      series: "Updated Series",
      tag: "Identity",
      date: "February 1, 2024",
      dateISO: "2024-02-01",
      pastor: "Jane Smith",
      pastorRole: "Lead Pastor",
      scripture: "Romans 8:28",
      excerpt: "Updated excerpt",
      body: "Updated sermon content",
      featured: true,
      podcastLinks: {
        spotify: "https://open.spotify.com/episode/updated",
        apple: "https://podcasts.apple.com/episode/updated",
        youtube: "https://youtube.com/watch?v=updated",
      },
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockUpdateOne.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toMatchObject(updatedSermonData);
    expect(data.data.podcastLinks).toEqual(updatedSermonData.podcastLinks);
  });

  it("should handle database connection errors", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    vi.mocked(mongodb.getDatabase).mockRejectedValue(new Error("Database connection failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update sermon");
  });

  it("should handle update operation errors", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const updatedSermonData = {
      slug: "test-sermon",
      title: "Updated Test Sermon",
      tag: "Prayer",
      date: "January 20, 2024",
      pastor: "Jane Smith",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockUpdateOne.mockResolvedValue({
      acknowledged: false,
      matchedCount: 0,
      modifiedCount: 0,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update sermon");
  });

  it("should handle invalid JSON in request body", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: "invalid json",
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update sermon");
  });

  it("should handle findOne query errors", async () => {
    // Arrange
    const sermonData = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockFindOne.mockRejectedValue(new Error("Query execution failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(sermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update sermon");
  });

  it("should handle updateOne query errors", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    const updatedSermonData = {
      slug: "test-sermon",
      title: "Updated Test Sermon",
      tag: "Prayer",
      date: "January 20, 2024",
      pastor: "Jane Smith",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockUpdateOne.mockRejectedValue(new Error("Update operation failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "PUT",
      body: JSON.stringify(updatedSermonData),
    });

    // Act
    const response = await PUT(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update sermon");
  });
});

describe("DELETE /api/v1/admin/sermons", () => {
  let mockFindOne: ReturnType<typeof vi.fn>;
  let mockDeleteOne: ReturnType<typeof vi.fn>;
  let mockCollection: ReturnType<typeof vi.fn>;
  let mockDb: any;
  let mockCookieStore: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock cookie store with authenticated session
    mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: "authenticated" }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookieStore);

    // Setup mock chain: db.collection().findOne() and db.collection().deleteOne()
    mockFindOne = vi.fn();
    mockDeleteOne = vi.fn();
    mockCollection = vi.fn().mockReturnValue({
      findOne: mockFindOne,
      deleteOne: mockDeleteOne,
    });
    mockDb = {
      collection: mockCollection,
    };

    // Mock getDatabase to return our mock db
    vi.mocked(mongodb.getDatabase).mockResolvedValue(mockDb);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue(undefined);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should return 401 when session cookie has invalid value", async () => {
    // Arrange
    mockCookieStore.get.mockReturnValue({ value: "invalid" });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");

    // Verify MongoDB was not called
    expect(mongodb.getDatabase).not.toHaveBeenCalled();
  });

  it("should successfully delete a sermon with valid slug", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockDeleteOne.mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Sermon deleted successfully");

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFindOne).toHaveBeenCalledWith({ slug: "test-sermon" });
    expect(mockDeleteOne).toHaveBeenCalledWith({ slug: "test-sermon" });
  });

  it("should return 404 when sermon does not exist", async () => {
    // Arrange
    mockFindOne.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "non-existent-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Sermon not found");

    // Verify MongoDB calls
    expect(mongodb.getDatabase).toHaveBeenCalledOnce();
    expect(mockCollection).toHaveBeenCalledWith("sermons");
    expect(mockFindOne).toHaveBeenCalledWith({ slug: "non-existent-sermon" });
    expect(mockDeleteOne).not.toHaveBeenCalled();
  });

  it("should return 400 when slug is missing", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({}),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for deleting a sermon");

    // Verify MongoDB calls - should not reach database
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockDeleteOne).not.toHaveBeenCalled();
  });

  it("should return 400 when slug is empty string", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for deleting a sermon");
  });

  it("should return 400 when slug is only whitespace", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "   " }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for deleting a sermon");
  });

  it("should return 400 when slug is not a string", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: 123 }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Slug is required for deleting a sermon");
  });

  it("should handle database connection errors", async () => {
    // Arrange
    vi.mocked(mongodb.getDatabase).mockRejectedValue(new Error("Database connection failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete sermon");
  });

  it("should handle delete operation errors", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockDeleteOne.mockResolvedValue({
      acknowledged: false,
      deletedCount: 0,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete sermon");
  });

  it("should handle invalid JSON in request body", async () => {
    // Arrange
    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: "invalid json",
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete sermon");
  });

  it("should handle findOne query errors", async () => {
    // Arrange
    mockFindOne.mockRejectedValue(new Error("Query execution failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete sermon");
  });

  it("should handle deleteOne query errors", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "test-sermon",
      title: "Test Sermon",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockDeleteOne.mockRejectedValue(new Error("Delete operation failed"));

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "test-sermon" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete sermon");
  });

  it("should successfully delete sermon with special characters in slug", async () => {
    // Arrange
    const existingSermon: Sermon = {
      slug: "gods-love-grace-part-1",
      title: "God's Love & Grace: Part #1",
      tag: "Faith",
      date: "January 15, 2024",
      pastor: "John Doe",
    };

    mockFindOne.mockResolvedValue(existingSermon);
    mockDeleteOne.mockResolvedValue({
      acknowledged: true,
      deletedCount: 1,
    });

    const request = new NextRequest("http://localhost:3000/api/v1/admin/sermons", {
      method: "DELETE",
      body: JSON.stringify({ slug: "gods-love-grace-part-1" }),
    });

    // Act
    const response = await DELETE(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Sermon deleted successfully");
  });
});
