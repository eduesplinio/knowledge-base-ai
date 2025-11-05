import { getSession } from 'next-auth/react';

export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
  }
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const session = await getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  if (session?.user && 'id' in session.user) {
    headers['x-user-id'] = session.user.id as string;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(response.status, error.message || 'Request failed', error);
  }

  return response.json();
}
