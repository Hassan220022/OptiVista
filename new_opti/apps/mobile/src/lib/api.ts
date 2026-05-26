import { supabase } from './supabase';
import { API_BASE_URL } from './constants';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token
      ? {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      : { 'Content-Type': 'application/json' };
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }
    return url.toString();
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const headers = await this.getAuthHeaders();
    const url = this.buildUrl(path, params);
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return response.json();
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return response.json();
  }

  async delete<T>(path: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${path}`, { method: 'DELETE', headers });
    if (!response.ok) throw new ApiError(response.status, await response.text());
    return response.json();
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_BASE_URL);
