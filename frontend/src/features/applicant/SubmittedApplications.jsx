import { useEffect, useState } from 'react'
import { api } from './features/applicant/api'
import './features/applicant/applicant.css'

export default function SubmittedApplications({ token, onBack, onExpired }) {
  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()

    async function loadApplications() {
      try {
        const data = await api.getApplications(token, controller.signal)

        const applications = Array.isArray(data)
          ? data
          : data?.applications

        if (!Array.isArray(applications)) {
          throw new Error('The server returned an unexpected response.')
        }

        if (!controller.signal.aborted) {
          setResult({
            token,
            attempt,
            applications,
            error: '',
            expired: false,
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({
            token,
            attempt,
            applications: [],
            error:
              error.status === 401
                ? 'Your session expired. Please log in again.'
                : error.message || 'Unable to load your applications.',
            expired: error.status === 401,
          })
        }
      }
    }

    loadApplications()

    return () => controller.abort()
  }, [token, attempt])

  const current =
    result?.token === token && result?.attempt === attempt

  const loading = Boolean(token) && !current
  const applications = current ? result.applications : []
  const error = current ? result.error : ''
  const expired = current ? result.expired : false

  useEffect(() => {
    if (expired) onExpired?.()
  }, [expired, onExpired])

  function refresh() {
    setAttempt((value) => value + 1)
  }

  return (
    <div className="applicant-portal">
      <main>
        <section aria-labelledby="applications-heading">
          <h1 id="applications-heading">My applications</h1>
          <p>View your submitted applications and their current statuses.</p>

          <div className="actions">
            <button
              type="button"
              onClick={refresh}
              disabled={!token || loading || expired}
            >
              {loading ? 'Loading...' : 'Refresh applications'}
            </button>

            {onBack && (
              <button type="button" onClick={onBack}>
                Back to jobs
              </button>
            )}
          </div>

          {!token && (
            <p className="notice" role="status">
              Please log in to view your applications.
            </p>
          )}

          {loading && (
            <p role="status">Loading your applications...</p>
          )}

          {error && (
            <div className="error" role="alert">
              <p>{error}</p>

              {!expired && (
                <button type="button" onClick={refresh}>
                  Try again
                </button>
              )}
            </div>
          )}

          {token && !loading && !error && applications.length === 0 && (
            <div className="panel">
              <h2>No applications yet</h2>
              <p>Browse available jobs and submit your first application.</p>
            </div>
          )}

          <div className="application-list" aria-busy={loading}>
            {applications.map((application) => {
              const job =
                typeof application.jobId === 'object'
                  ? application.jobId
                  : null

              const status = application.status || 'Pending'
              const knownStatuses = [
                'Pending',
                'Reviewed',
                'Accepted',
                'Rejected',
              ]
              const statusClass = knownStatuses.includes(status)
                ? `status-${status.toLowerCase()}`
                : ''

              const submittedDate = new Date(application.createdAt)
              const resumeUrl = safeResumeUrl(application.resumeLink)

              return (
                <article
                  className="panel application-card"
                  key={application._id}
                >
                  <div>
                    <h2>{job?.title || 'Job details unavailable'}</h2>
                    <p>{job?.company || 'Company unavailable'}</p>

                    {job?.location && (
                      <p>
                        <strong>Location:</strong> {job.location}
                      </p>
                    )}

                    {!Number.isNaN(submittedDate.getTime()) && (
                      <small>
                        Submitted {submittedDate.toLocaleDateString()}
                      </small>
                    )}
                  </div>

                  <span className={`status ${statusClass}`}>
                    {status}
                  </span>

                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View submitted resume
                    </a>
                  )}

                  {application.coverLetter && (
                    <div className="cover-letter">
                      <h3>Cover letter</h3>
                      <p>{application.coverLetter}</p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

function safeResumeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null

  try {
    const url = new URL(value)

    return ['http:', 'https:'].includes(url.protocol)
      ? url.href
      : null
  } catch {
    return null
  }
}