import { useEffect, useState } from 'react'
import { api } from './api'
import './applicant.css'

export default function JobListings({ onApply }) {
  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadJobs() {
      try {
        const data = await api.getJobs(controller.signal)

        const jobs = Array.isArray(data) ? data : data?.jobs

        if (!Array.isArray(jobs)) {
          throw new Error('The server returned an unexpected response.')
        }

        if (!controller.signal.aborted) {
          setResult({ attempt, jobs, error: '' })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({
            attempt,
            jobs: [],
            error: error.message || 'Unable to load jobs.',
          })
        }
      }
    }

    loadJobs()

    return () => controller.abort()
  }, [attempt])

  const current = result?.attempt === attempt
  const loading = !current
  const jobs = current ? result.jobs : []
  const error = current ? result.error : ''

  return (
    <div className="applicant-portal">
      <main>
        <section aria-labelledby="jobs-heading">
          <h1 id="jobs-heading">Available jobs</h1>
          <p>Explore job openings and find your next opportunity.</p>

          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh jobs'}
          </button>

          {loading && (
            <p role="status">Loading available jobs...</p>
          )}

          {error && (
            <div className="error" role="alert">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="panel">
              <h2>No jobs available</h2>
              <p>Please check again later for new openings.</p>
            </div>
          )}

          <div className="job-grid" aria-busy={loading}>
            {jobs.map((job) => {
              const requirements = Array.isArray(job.requirements)
                ? job.requirements
                : job.requirements
                  ? [job.requirements]
                  : []

              return (
                <article className="panel job-card" key={job._id}>
                  <p className="company">{job.company}</p>

                  <h2>{job.title}</h2>

                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>

                  {job.jobType && (
                    <p>
                      <strong>Job type:</strong> {job.jobType}
                    </p>
                  )}

                  {job.salary != null && job.salary !== '' && (
                    <p>
                      <strong>Salary:</strong> {job.salary}
                    </p>
                  )}

                  <p className="description">{job.description}</p>

                  {requirements.length > 0 && (
                    <div>
                      <h3>Requirements</h3>
                      <ul>
                        {requirements.map((requirement, index) => (
                          <li key={`${index}-${requirement}`}>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {onApply && (
                    <button
                      className="primary"
                      type="button"
                      disabled={job.status === 'Closed'}
                      onClick={() => onApply(job)}
                    >
                      {job.status === 'Closed'
                        ? 'Applications closed'
                        : 'Apply'}
                    </button>
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