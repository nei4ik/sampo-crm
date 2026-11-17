import { authClient } from './auth-client'

export function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: 'include',
  })
}

export async function clearAuth(): Promise<void> {
  const { error } = await authClient.signOut()
  if (error) {
    throw new Error(error.message || 'Kirjautuminen ulos epäonnistui.')
  }
}