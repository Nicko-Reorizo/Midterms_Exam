import { useMemo, useState } from 'react'
import './App.css'

const jobs = [
  {
    id: 'JOB-001',
    title: 'Frontend Developer',
    company: 'BrightPath Solutions',
    location: 'Makati City',
    type: 'Full-time',
    salary: 'PHP 35,000 - 45,000',
    deadline: 'Oct 18, 2026',
    status: 'Open',
    department: 'Engineering',
    postedDate: 'Oct 1, 2026',
    description:
      'Build responsive application pages and reusable React components for the job application system.',
    requirements:
      'React basics, CSS layout skills, Git workflow knowledge, and attention to accessible UI.',
  },
  {
    id: 'JOB-002',
    title: 'Backend Developer',
    company: 'Northstar Digital',
    location: 'Quezon City',
    type: 'Full-time',
    salary: 'PHP 40,000 - 55,000',
    deadline: 'Oct 21, 2026',
    status: 'Open',
    department: 'Engineering',
    postedDate: 'Oct 2, 2026',
    description:
      'Develop API endpoints, connect database models, and support secure applicant and job workflows.',
    requirements:
      'Node.js, Express, MongoDB or Mongoose, API validation, and basic authentication knowledge.',
  },
  {
    id: 'JOB-003',
    title: 'UI/UX Designer',
    company: 'PixelForge Studio',
    location: 'Remote',
    type: 'Contract',
    salary: 'PHP 28,000 - 38,000',
    deadline: 'Oct 25, 2026',
    status: 'Open',
    department: 'Design',
    postedDate: 'Oct 3, 2026',
    description:
      'Design clean user flows, improve form usability, and prepare interface mockups for applicants.',
    requirements:
      'UI design fundamentals, wireframing, user research basics, and collaboration with frontend developers.',
  },
  {
    id: 'JOB-004',
    title: 'QA Tester',
    company: 'ClearWorks IT',
    location: 'Cebu City',
    type: 'Part-time',
    salary: 'PHP 18,000 - 24,000',
    deadline: 'Oct 30, 2026',
    status: 'Open',
    department: 'Quality Assurance',
    postedDate: 'Oct 4, 2026',
    description:
      'Test applicant, job, and application features to catch bugs before release.',
    requirements:
      'Manual testing, bug reporting, test case writing, and careful review of user workflows.',
  },
]

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id)
  const [appliedJobId, setAppliedJobId] = useState('')

  const filteredJobs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return jobs
    }

    return jobs.filter((job) =>
      Object.values(job).some((value) =>
        String(value).toLowerCase().includes(keyword),
      ),
    )
  }, [searchTerm])

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0]

  const handleApply = (job) => {
    setSelectedJobId(job.id)
    setAppliedJobId(job.id)
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Job Application System</p>
          <h1>Available Jobs</h1>
        </div>
        <p className="job-count">
          {filteredJobs.length} of {jobs.length} jobs shown
        </p>
      </header>

      <section className="table-section" aria-labelledby="jobs-table-title">
        <div className="section-heading">
          <div>
            <h2 id="jobs-table-title">Job Listing Table</h2>
            <p>Browse current openings and review basic job information.</p>
          </div>

          <label className="search-field">
            <span>Search jobs</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, company, location..."
              aria-describedby="search-help"
            />
          </label>
        </div>
        <p id="search-help" className="sr-only">
          Search filters the job listing table by any visible job information.
        </p>

        <div className="table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th scope="col">Job ID</th>
                <th scope="col">Position</th>
                <th scope="col">Company</th>
                <th scope="col">Location</th>
                <th scope="col">Type</th>
                <th scope="col">Salary Range</th>
                <th scope="col">Deadline</th>
                <th scope="col">Status</th>
                <th scope="col">Details</th>
                <th scope="col">Apply</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className={job.id === selectedJob?.id ? 'selected-row' : ''}
                >
                  <td data-label="Job ID">{job.id}</td>
                  <td data-label="Position">
                    <strong>{job.title}</strong>
                  </td>
                  <td data-label="Company">{job.company}</td>
                  <td data-label="Location">{job.location}</td>
                  <td data-label="Type">{job.type}</td>
                  <td data-label="Salary Range">{job.salary}</td>
                  <td data-label="Deadline">{job.deadline}</td>
                  <td data-label="Status">
                    <span className="status-pill">{job.status}</span>
                  </td>
                  <td data-label="Details">
                    <button
                      type="button"
                      className="details-button"
                      onClick={() => setSelectedJobId(job.id)}
                      aria-pressed={job.id === selectedJob?.id}
                    >
                      View
                    </button>
                  </td>
                  <td data-label="Apply">
                    <button
                      type="button"
                      className="apply-button"
                      onClick={() => handleApply(job)}
                      disabled={appliedJobId === job.id}
                    >
                      {appliedJobId === job.id ? 'Applied' : 'Apply'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="empty-state" role="status">
            No jobs found for "{searchTerm}". Try another keyword.
          </div>
        )}
      </section>

      {selectedJob && (
        <section className="details-panel" aria-labelledby="job-details-title">
          <div className="details-header">
            <div>
              <p className="eyebrow">Selected Job</p>
              <h2 id="job-details-title">{selectedJob.title}</h2>
              <p>
                {selectedJob.company} - {selectedJob.location}
              </p>
            </div>
            <span className="status-pill">{selectedJob.status}</span>
          </div>

          {appliedJobId === selectedJob.id && (
            <div className="application-alert" role="status">
              You selected this job for application.
            </div>
          )}

          <dl className="details-grid">
            <div>
              <dt>Job ID</dt>
              <dd>{selectedJob.id}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{selectedJob.department}</dd>
            </div>
            <div>
              <dt>Employment Type</dt>
              <dd>{selectedJob.type}</dd>
            </div>
            <div>
              <dt>Salary Range</dt>
              <dd>{selectedJob.salary}</dd>
            </div>
            <div>
              <dt>Posted Date</dt>
              <dd>{selectedJob.postedDate}</dd>
            </div>
            <div>
              <dt>Application Deadline</dt>
              <dd>{selectedJob.deadline}</dd>
            </div>
          </dl>

          <div className="details-copy">
            <h3>Job Description</h3>
            <p>{selectedJob.description}</p>
          </div>

          <div className="details-copy">
            <h3>Requirements</h3>
            <p>{selectedJob.requirements}</p>
          </div>

          <div className="details-actions">
            <button
              type="button"
              className="apply-button apply-button-large"
              onClick={() => handleApply(selectedJob)}
              disabled={appliedJobId === selectedJob.id}
            >
              {appliedJobId === selectedJob.id
                ? 'Application Selected'
                : 'Apply for this Job'}
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
