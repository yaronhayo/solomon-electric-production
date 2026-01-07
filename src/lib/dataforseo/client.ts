/**
 * DataForSEO API Client
 * Core client for interacting with DataForSEO APIs
 * 
 * Authentication: Uses HTTP Basic Auth with base64 encoded credentials
 * Rate Limit: 2000 requests per minute
 * 
 * @see https://docs.dataforseo.com/v3/
 */

import type { DataForSEOResponse } from './types';

// ============================================
// Configuration
// ============================================

const API_BASE_URL = 'https://api.dataforseo.com/v3';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

interface ClientConfig {
  login: string;
  password: string;
  sandbox?: boolean;  // Use sandbox for testing
}

// ============================================
// Client Class
// ============================================

export class DataForSEOClient {
  private authHeader: string;
  private baseUrl: string;
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor(config: ClientConfig) {
    // Create base64 encoded auth header
    const credentials = `${config.login}:${config.password}`;
    const base64Credentials = typeof btoa === 'function' 
      ? btoa(credentials)
      : Buffer.from(credentials).toString('base64');
    
    this.authHeader = `Basic ${base64Credentials}`;
    this.baseUrl = config.sandbox 
      ? 'https://sandbox.dataforseo.com/v3'
      : API_BASE_URL;
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string): Promise<DataForSEOResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data: unknown[]): Promise<DataForSEOResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * Internal request method with retries and rate limiting
   */
  private async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: unknown[]
  ): Promise<DataForSEOResponse<T>> {
    await this.enforceRateLimit();

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const url = `${this.baseUrl}${endpoint}`;
        
        const options: RequestInit = {
          method,
          headers: {
            'Authorization': this.authHeader,
            'Content-Type': 'application/json',
          },
        };

        if (method === 'POST' && data) {
          options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new DataForSEOError(
            `HTTP error ${response.status}: ${response.statusText}`,
            response.status
          );
        }

        const result = await response.json() as DataForSEOResponse<T>;
        
        // Check for API-level errors
        if (result.status_code !== 20000) {
          throw new DataForSEOError(
            result.status_message || 'Unknown API error',
            result.status_code
          );
        }

        this.requestCount++;
        this.lastRequestTime = Date.now();
        
        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on 4xx errors (client errors)
        if (error instanceof DataForSEOError && error.statusCode >= 400 && error.statusCode < 500) {
          throw error;
        }

        // Wait before retry
        if (attempt < MAX_RETRIES - 1) {
          await this.delay(RETRY_DELAY_MS * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Enforce rate limiting (2000 req/min = ~33 req/sec)
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Minimum 30ms between requests to stay well under limit
    if (timeSinceLastRequest < 30) {
      await this.delay(30 - timeSinceLastRequest);
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.get<unknown>('/appendix/user_data');
      return response.status_code === 20000;
    } catch {
      return false;
    }
  }

  /**
   * Get account balance and usage info
   */
  async getAccountInfo(): Promise<DataForSEOResponse<AccountInfo>> {
    return this.get<AccountInfo>('/appendix/user_data');
  }
}

// ============================================
// Error Class
// ============================================

export class DataForSEOError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public taskId?: string
  ) {
    super(message);
    this.name = 'DataForSEOError';
  }
}

// ============================================
// Account Info Type
// ============================================

interface AccountInfo {
  login: string;
  timezone: string;
  balance: number;
  currency: string;
  limits: {
    day: LimitInfo;
    minute: LimitInfo;
  };
}

interface LimitInfo {
  limit: number;
  count: number;
}

// ============================================
// Singleton Instance (for convenience)
// ============================================

let clientInstance: DataForSEOClient | null = null;

/**
 * Get or create the DataForSEO client instance
 * Uses environment variables for credentials
 */
export function getClient(): DataForSEOClient {
  if (!clientInstance) {
    const login = import.meta.env.DATAFORSEO_LOGIN || process.env.DATAFORSEO_LOGIN;
    const password = import.meta.env.DATAFORSEO_PASSWORD || process.env.DATAFORSEO_PASSWORD;

    if (!login || !password) {
      throw new Error(
        'DataForSEO credentials not found. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in .env'
      );
    }

    clientInstance = new DataForSEOClient({ login, password });
  }

  return clientInstance;
}

/**
 * Create a sandbox client for testing
 */
export function getSandboxClient(): DataForSEOClient {
  const login = import.meta.env.DATAFORSEO_LOGIN || process.env.DATAFORSEO_LOGIN || 'test';
  const password = import.meta.env.DATAFORSEO_PASSWORD || process.env.DATAFORSEO_PASSWORD || 'test';

  return new DataForSEOClient({ login, password, sandbox: true });
}

export default DataForSEOClient;
