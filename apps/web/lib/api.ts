async function getAuthHeaders() {
  const session = await fetch('/api/auth/session').then((res) => res.json());

  return {
    'Content-Type': 'application/json',
    ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
  };
}

export async function fetchSpaces() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces`, {
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Erro da API:', res.status, error);
    throw new Error(`Erro ao buscar espaços: ${res.status}`);
  }

  return res.json();
}

export async function createSpace(data: { name: string; description?: string }) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao criar espaço');
  }

  return res.json();
}

export async function fetchSpace(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces/${id}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar espaço');
  }

  return res.json();
}

export async function updateSpace(id: string, data: { name: string; description?: string }) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao atualizar espaço');
  }

  return res.json();
}

export async function deleteSpace(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    throw new Error('Erro ao deletar espaço');
  }

  return res.json();
}
export async function fetchArticles(spaceId?: string) {
  const headers = await getAuthHeaders();
  const url = spaceId
    ? `${process.env.NEXT_PUBLIC_API_URL}/articles?spaceId=${spaceId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/articles`;

  const res = await fetch(url, {
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar artigos');
  }

  return res.json();
}

export async function createArticle(data: {
  title: string;
  content: string;
  spaceId: string;
  tags?: string[];
}) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao criar artigo');
  }

  return res.json();
}

export async function fetchArticle(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar artigo');
  }

  return res.json();
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    content?: string;
    spaceId?: string;
    tags?: string[];
  }
) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao atualizar artigo');
  }

  return res.json();
}

export async function deleteArticle(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    throw new Error('Erro ao deletar artigo');
  }

  return res.json();
}

export async function searchArticles(query: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/search?q=${encodeURIComponent(query)}`,
    {
      headers,
    }
  );

  if (!res.ok) {
    throw new Error('Erro na pesquisa');
  }

  return res.json();
}
