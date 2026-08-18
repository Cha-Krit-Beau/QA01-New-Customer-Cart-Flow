import { APIResponse } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';

export interface CreateUserPayload {
  name: string;
  job: string;
}

/**
 * Endpoint-specific API wrapper, built on top of the generic ApiClient.
 * Keeps "which endpoint, which shape" out of the spec files (section 12
 * pattern: one *.api.ts per resource, e.g. auth.api.ts / order.api.ts).
 */
export class UserApi {
  constructor(private readonly client: ApiClient) {}

  async list(): Promise<APIResponse> {
    return this.client.get('/users');
  }

  async getById(id: number): Promise<APIResponse> {
    return this.client.get(`/users/${id}`);
  }

  async create(payload: CreateUserPayload): Promise<APIResponse> {
    return this.client.post('/users', payload);
  }
}
