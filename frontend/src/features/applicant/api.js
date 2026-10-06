const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

// Change only these paths when the backend team confirms its routes.
export const endpoints = {
  register: '/applicants/register',
  login: '/applicants/login',
  jobs: '/jobs',
  applications: '/applications',
}

export async function request(path, { method = 'GET', body, token, signal } = {}) {
  const multipart = body instanceof FormData
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body && !multipart) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method, headers, signal,
      body: body ? multipart ? body : JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Cannot connect to the server. Please try again.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status}).`)
    error.status = response.status
    throw error
  }
  return data
}

export const api = {
  register: (body) => request(endpoints.register, { method: 'POST', body }),
  login: (body) => request(endpoints.login, { method: 'POST', body }),
  getJobs: (signal) => request(endpoints.jobs, { signal }),
  apply: (body, token) => request(endpoints.applications, { method: 'POST', body, token }),
  getApplications: (token, signal) => request(endpoints.applications, { token, signal }),
}
