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
  },
]

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredJobs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return jobs
    }

    return jobs.filter((job) =>
      Object.values(job).some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  }, [searchTerm])

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
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
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
    </main>
  )
}

export default App
