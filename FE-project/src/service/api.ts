export const API_BASE = 'http://localhost:3000'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Request gagal')
  }
  return data
}
