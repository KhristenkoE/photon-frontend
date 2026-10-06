import { BASE_URL } from '@/api/endpoints';
import { useUserStore } from '@/store/userStore/userStore';
import { authService } from './services/auth';
import { UploadProgressEvent } from './types/types';

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean; // Add option to skip auth for specific requests
  skipRefresh?: boolean; // Add option to skip refresh token for specific requests
  onUploadProgress?: (event: UploadProgressEvent) => void;
  baseUrl?: string;
};

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
    this.details = details;
  }
}

// Flag to prevent multiple refresh token requests at the same time
let isRefreshing = false;
// Queue of requests waiting for token refresh
let refreshQueue: Array<() => void> = [];

// Process all requests in the queue with the new token
const processQueue = () => {
  refreshQueue.forEach((callback) => callback());
  refreshQueue = [];
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl ? `${baseUrl}/api/v1` : '';
  }

  private async request<T>(
    endpoint: string,
    method: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const baseUrl = options.baseUrl ?? this.baseUrl;
    if (!baseUrl) {
      throw new ApiError('API endpoint is not configured for this archive', 0);
    }
    const url = new URL(`${baseUrl}${endpoint}`);

    // Add query parameters if any
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (method === 'DELETE' && !data) {
      delete headers['Content-Type'];
    }
    if (method === 'POST' && !data) {
      delete headers['Content-Type'];
    }

    // Add Authorization header if not skipped and token exists
    if (!options.skipAuth) {
      const accessToken = useUserStore.getState().accessToken;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    const fetchOptions: FetchOptions = {
      method,
      headers,
    };

    if (method === 'DELETE' && !data) {
      delete headers['Content-Type'];
    }

    if (data) {
      if (data instanceof FormData) {
        // Remove Content-Type header for FormData to let browser set it with boundary
        delete headers['Content-Type'];
        fetchOptions.body = data;
      } else {
        fetchOptions.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);

      // Handle 401 Unauthorized - refresh token logic
      if (
        response.status === 401 &&
        !options.skipRefresh &&
        !options.skipAuth
      ) {
        return this.handleUnauthorized<T>(endpoint, method, data, options);
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null); // вдруг тело не JSON

        throw new ApiError(
          `API error: ${response.statusText}`,
          response.status,
          errorBody,
        );
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) return {} as T;

      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error}`, 0);
    }
  }

  // Handle 401 Unauthorized - refresh token and retry original request
  private async handleUnauthorized<T>(
    endpoint: string,
    method: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const userStore = useUserStore.getState();
    const refreshToken = userStore.refreshToken;

    // If no refresh token, just clear auth and exit
    if (!refreshToken) {
      userStore.clearAuth();
      throw new ApiError('Unauthorized - No refresh token', 401);
    }

    // Return a promise that resolves when the token is refreshed or rejects with an error
    return new Promise((resolve, reject) => {
      // Add request to queue
      refreshQueue.push(() => {
        // Retry original request with new token
        this.request<T>(endpoint, method, data, {
          ...options,
          skipRefresh: true, // Prevent infinite refresh loops
        })
          .then(resolve)
          .catch(reject);
      });

      // If not already refreshing, start refresh process
      if (!isRefreshing) {
        isRefreshing = true;

        // Call refresh token API
        authService
          .refreshToken(refreshToken)
          .then((data) => {
            if (!data) {
              throw new ApiError('Failed to refresh token', 401);
            }
            // Update tokens in store and localStorage
            userStore.updateTokens({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            });
            // Process all queued requests
            processQueue();
          })
          .catch((error) => {
            console.error('Failed to refresh token', error);
            // Clear queue with error
            refreshQueue.forEach(() => {
              reject(new ApiError('Failed to refresh token', 401));
            });
            refreshQueue = [];
            // Clear auth
            userStore.clearAuth();
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
    });
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data, options);
  }

  delete<T>(
    endpoint: string,
    options?: RequestOptions,
    data?: unknown,
  ): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', data, options);
  }
}

export const apiClient = new ApiClient();
