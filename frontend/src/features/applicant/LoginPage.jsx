import { useState } from 'react'
import { api } from './api'
import './applicant.css'

export default function LoginPage({ onLoggedIn, onRegister }) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const form = event.currentTarget
    const fields = new FormData(form)

    const email = String(fields.get('email') || '').trim()
    const password = String(fields.get('password') || '')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const data = await api.login({ email, password })

      if (typeof data?.token !== 'string' || !data.token) {
        throw new Error('The server did not return a valid login token.')
      }

      const session = {
        token: data.token,
        applicant: data.applicant || data.user,
      }

      sessionStorage.setItem(
        'jobconnect.applicant.session',
        JSON.stringify(session),
      )

      form.reset()
      setSuccess('You have logged in successfully.')
      onLoggedIn?.(session)
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="applicant-portal">
      <main>
        <section className="panel auth-panel">
          <h1>Welcome back</h1>
          <p>Log in to apply for jobs and track your applications.</p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={loading}>
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="username"
                required
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="notice" role="status">
                  {success}
                </p>
              )}

              <button className="primary" type="submit">
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </fieldset>
          </form>

          {onRegister && (
            <button
              className="text-button"
              type="button"
              onClick={onRegister}
              disabled={loading}
            >
              Don't have an account? Register
            </button>
          )}
        </section>
      </main>
    </div>
  )
}