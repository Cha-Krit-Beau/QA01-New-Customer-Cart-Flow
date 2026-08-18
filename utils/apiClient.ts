import { APIRequestContext, APIResponse } from '@playwright/test';
import { environment } from '../config/environments';

/**
 * Thin wrapper around Playwright's APIRequestContext so tests call
 * `apiClient.get('/users')` instead of repeating base URL / header wiring
 * (and the auth header) in every spec file.
 */
export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = environment.apiBaseURL,
  ) {}

  private headers(): Record<string, string> {
    return environment.apiKey ? { Authorization: `Bearer ${environment.apiKey}` } : {};
  }

  private url(pathOrUrl: string): string {
    return pathOrUrl.startsWith('http') ? pathOrUrl : `${this.baseURL}${pathOrUrl}`;
  }

  async get(path: string, params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(this.url(path), { headers: this.headers(), params });
  }

  async post(path: string, data: unknown): Promise<APIResponse> {
    return this.request.post(this.url(path), { headers: this.headers(), data });
  }

  async put(path: string, data: unknown): Promise<APIResponse> {
    return this.request.put(this.url(path), { headers: this.headers(), data });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(this.url(path), { headers: this.headers() });
  }
}
