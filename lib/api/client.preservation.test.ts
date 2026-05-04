/**
 * Preservation Property Tests for Sermon API Authentication Mismatch Fix
 * 
 * **Property 2: Preservation** - Non-Sermon API Behavior Unchanged
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * These tests verify that the fix does not break existing functionality:
 * - Request methods (GET, POST, PUT, DELETE) continue to work correctly
 * - Content-Type headers are preserved
 * - Error handling continues to work correctly
 * - Non-sermon endpoints continue to function as expected
 * 
 * These tests should PASS on unfixed code to establish baseline behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { ApiClient } from './client';

describe('Property 2: Preservation - Non-Sermon API Behavior Unchanged', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Save original fetch
    originalFetch = global.fetch;
    
    // Create mock fetch
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: {} }),
    } as Response);
    
    global.fetch = fetchMock;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe('Request Method Preservation', () => {
    it('should preserve GET request behavior', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      await client.get('/events');
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(options?.method).toBe('GET');
    });

    it('should preserve POST request behavior', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      await client.post('/events', { name: 'Test Event' });
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(options?.method).toBe('POST');
      expect(options?.body).toBeDefined();
    });

    it('should preserve PUT request behavior', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      await client.put('/events', { name: 'Updated Event' });
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(options?.method).toBe('PUT');
      expect(options?.body).toBeDefined();
    });

    it('should preserve DELETE request behavior', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      await client.delete('/events', { id: '123' });
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(options?.method).toBe('DELETE');
    });

    it('property-based: all HTTP methods should work correctly for non-sermon endpoints', async () => {
      // Test multiple combinations of methods and endpoints
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
      const endpoints = ['/events', '/content', '/giving', '/livestream'];
      
      for (const method of methods) {
        for (const endpoint of endpoints) {
          const client = new ApiClient('http://localhost:3000/api/v1');
          
          // Reset mock for each iteration
          fetchMock.mockClear();
          fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ success: true, data: {} }),
          } as Response);
          
          // Execute request based on method
          switch (method) {
            case 'GET':
              await client.get(endpoint);
              break;
            case 'POST':
              await client.post(endpoint, { test: 'data' });
              break;
            case 'PUT':
              await client.put(endpoint, { test: 'data' });
              break;
            case 'DELETE':
              await client.delete(endpoint, { id: '123' });
              break;
            case 'PATCH':
              await client.patch(endpoint, { test: 'data' });
              break;
          }
          
          expect(fetchMock).toHaveBeenCalledTimes(1);
          const [url, options] = fetchMock.mock.calls[0];
          expect(options?.method).toBe(method);
        }
      }
    });
  });

  describe('Content-Type Header Preservation', () => {
    it('should include Content-Type: application/json header', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      await client.post('/events', { name: 'Test Event' });
      
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      
      expect(options?.headers).toBeDefined();
      const headers = options.headers as Record<string, string>;
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Error Handling Preservation', () => {
    it('should handle 404 errors correctly', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } }),
      } as Response);
      
      await expect(client.get('/events/nonexistent')).rejects.toThrow();
    });

    it('should handle 500 errors correctly', async () => {
      const client = new ApiClient('http://localhost:3000/api/v1');
      
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } }),
      } as Response);
      
      await expect(client.get('/events')).rejects.toThrow();
    });
  });
});
