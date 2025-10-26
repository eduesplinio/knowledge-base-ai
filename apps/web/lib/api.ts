async function getAuthHeaders() {
  // Pega o token da sessão NextAuth
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
    credentials: 'include',
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
