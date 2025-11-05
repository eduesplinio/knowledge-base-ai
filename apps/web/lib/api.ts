import { apiRequest } from './api-client';
import type { Space, Article } from './types';

export async function fetchSpaces(): Promise<Space[]> {
  return apiRequest('/spaces');
}

export async function createSpace(data: { name: string; description?: string }): Promise<Space> {
  return apiRequest('/spaces', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchSpace(id: string): Promise<Space> {
  return apiRequest(`/spaces/${id}`);
}

export async function updateSpace(
  id: string,
  data: { name: string; description?: string }
): Promise<Space> {
  return apiRequest(`/spaces/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSpace(id: string): Promise<void> {
  return apiRequest(`/spaces/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchArticles(spaceId?: string): Promise<Article[]> {
  const url = spaceId ? `/articles?spaceId=${spaceId}` : '/articles';
  return apiRequest(url);
}

export async function createArticle(data: {
  title: string;
  content: string;
  spaceId: string;
  tags?: string[];
}): Promise<Article> {
  return apiRequest('/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchArticle(id: string): Promise<Article> {
  return apiRequest(`/articles/${id}`);
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    spaceId?: string;
    tags?: string[];
  }
): Promise<Article> {
  return apiRequest(`/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteArticle(id: string): Promise<void> {
  return apiRequest(`/articles/${id}`, {
    method: 'DELETE',
  });
}

export async function searchArticles(query: string): Promise<Article[]> {
  return apiRequest(`/articles/search?q=${encodeURIComponent(query)}`);
}
