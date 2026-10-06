import { useState } from 'react'
import { api } from './api'
import './applicant.css'

export default function ApplicationForm({
  job,
  token,
  onSuccess,
  onCancel,
  onExpired,
}) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Please log in before submitting an application.')
      return
    }

    const form = event.currentTarget
    const body = new FormData(form)
    const resume = body.get('resume')
    const extension = resume?.name?.split('.').pop()?.toLowerCase()

    if (!resume?.size) {
      setError('Please select a non-empty resume file.')
      return
    }

    if (!['pdf', 'doc', 'docx'].includes(extension)) {
      setError('Your resume must be a PDF, DOC, or DOCX file.')
      return
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError('Your resume must be 5 MB or smaller.')
      return
    }

    body.set('jobId', job._id)
    body.set(
      'coverLetter',
      String(body.get('coverLetter') || '').trim(),
    )

    setLoading(true)

    try {
      const application = await api.apply(body, token)

      form.reset()
      setSubmitted(true)
      setSuccess('Your application was submitted successfully.')
      onSuccess?.(application)
    } catch (error) {
      if (error.status === 401) {
        setError('Your session expired. Please log in again.')
        onExpired?.()
      } else if (error.status === 409) {
        setError('You have already applied for this job.')
      } else {
        setError(error.message || 'Unable to submit your application.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!job?._id) {
    return (
      <div className="applicant-portal">
        <main>
          <section className="panel auth-panel">
            <h1>Apply for a job</h1>
            <p>Please select a job from the job listings first.</p>

            {onCancel && (
              <button type="button" onClick={onCancel}>
                Back to jobs
              </button>
            )}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="applicant-portal">
      <main>
        <section className="panel auth-panel">
          <h1>Apply for {job.title}</h1>
          <p>{job.company} · {job.location}</p>

          {job.status === 'Closed' && (
            <p className="notice" role="status">
              This job is no longer accepting applications.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={loading || submitted || job.status === 'Closed'}
            >
              <label htmlFor="application-resume">Resume</label>
              <input
                id="application-resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                aria-describedby="resume-help"
                required
              />
              <small id="resume-help">
                Upload a PDF, DOC, or DOCX file. Maximum size: 5 MB.
              </small>

              <label htmlFor="application-cover-letter">
                Cover letter (optional)
              </label>
              <textarea
                id="application-cover-letter"
                name="coverLetter"
                rows={6}
                maxLength={5000}
                placeholder="Explain why you are a good fit for this role."
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
                {loading
                  ? 'Submitting...'
                  : submitted
                    ? 'Application submitted'
                    : 'Submit application'}
              </button>
            </fieldset>
          </form>

          {onCancel && (
            <button
              className="text-button"
              type="button"
              onClick={onCancel}
              disabled={loading}
            >
              Back to jobs
            </button>
          )}
        </section>
      </main>
    </div>
  )
}