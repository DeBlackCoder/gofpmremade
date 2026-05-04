/**
 * Bug Condition Exploration Test for Sermon API Authentication Mismatch
 * 
 * **Property 1: Bug Condition** - Sermon API Requests Missing Credentials
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 * 
 * This test verifies that API client requests to sermon endpoints are missing
 * the `credentials: "include"` option, which prevents the `admin_session` cookie
 * from being sent with requests, causing authentication failures.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { ApiClient } from './client';

describe('Property 1: Bug Condition - Sermon API Requests Missing Credentials', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Save original fetch
    originalFetch = global.fetch;
    
    // Create mock fetch that captures the request options
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: [] }),
    } as Response);
    
    global.fetch = fetchMock;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('should fail: GET request to /admin/sermons does not include credentials option', async () => {
    const client = new ApiClient('http://localhost:3000/api/v1');
    
    await client.get('/admin/sermons');
    
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    
    // This assertion should FAIL on unfixed code
    // After fix: credentials should be "include"
    expect(options?.credentials).toBe('include');
  });

  it('should fail: POST request to /admin/sermons does not include credentials option', async () => {
    const client = new ApiClient('http://localhost:3000/api/v1');
    const payload = {
      title: 'Test Sermon',
      slug: 'test-sermon',
      speaker: 'John Doe',
      date: '2024-01-01',
      description: 'Test description',
      videoUrl: 'https://example.com/video',
      audioUrl: 'https://example.com/audio',
      thumbnailUrl: 'https://example.com/thumb',
      duration: 3600,
      tags: ['test'],
      series: 'Test Series',
      scripture: 'John 3:16',
    };
    
    await client.post('/admin/sermons', payload);
    
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    
    // This assertion should FAIL on unfixed code
    expect(options?.credentials).toBe('include');
  });

  it('should fail: PUT request to /admin/sermons does not include credentials option', async () => {
    const client = new ApiClient('http://localhost:3000/api/v1');
    const payload = {
      title: 'Updated Sermon',
      slug: 'test-sermon',
      speaker: 'John Doe',
      date: '2024-01-01',
      description: 'Updated description',
      videoUrl: 'https://example.com/video',
      audioUrl: 'https://example.com/audio',
      thumbnailUrl: 'https://example.com/thumb',
      duration: 3600,
      tags: ['test'],
      series: 'Test Series',
      scripture: 'John 3:16',
    };
    
    await client.put('/admin/sermons', payload);
    
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    
    // This assertion should FAIL on unfixed code
    expect(options?.credentials).toBe('include');
  });

  it('should fail: DELETE request to /admin/sermons does not include credentials option', async () => {
    const client = new ApiClient('http://localhost:3000/api/v1');
    
    await client.delete('/admin/sermons', { slug: 'test-sermon' });
    
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    
    // This assertion should FAIL on unfixed code
    expect(options?.credentials).toBe('include');
  });

  it('property-based: all sermon API requests should include credentials option', async () => {
    // Test multiple combinations of methods and payloads
    const methods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
    const payload = {
      title: 'Test Sermon',
      slug: 'test-sermon',
      speaker: 'John Doe',
      date: '2024-01-01',
      description: 'Test description',
      videoUrl: 'https://example.com/video',
      audioUrl: 'https://example.com/audio',
      thumbnailUrl: 'https://example.com/thumb',
      duration: 3600,
      tags: ['test'],
      series: 'Test Series',
      scripture: 'John 3:16',
    };
    
    for (const method of methods) {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      // Reset mock for each iteration
      fetchMock.mockClear();
      fetchMock.mockResolvedValue({
        ok: true,
        status: method === 'POST' ? 201 : 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: method === 'DELETE' ? null : payload }),
      } as Response);
      
      // Execute request based on method
      switch (method) {
        case 'GET':
          await client.get('/admin/sermons');
          break;
        case 'POST':
          await client.post('/admin/sermons', payload);
          break;
        case 'PUT':
          await client.put('/admin/sermons', payload);
          break;
        case 'DELETE':
          await client.delete('/admin/sermons', { slug: payload.slug });
          break;
      }
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      
      // This assertion should PASS on fixed code
      // After fix: all requests should include credentials: "include"
      expect(options?.credentials).toBe('include');
    }
  });
});
