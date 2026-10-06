const jobService = require('../services/jobService');

const getJobs = async (req, res) => {
    try {
        const jobs = await jobService.getJobs();

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs',
            error: error.message,
        });
    }
};

const searchJobs = async (req, res) => {
    try {
        const searchTerm = req.query.q || req.query.keyword || req.query.search || '';
        const jobs = await jobService.searchJobs(searchTerm);

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to search jobs',
            error: error.message,
        });
    }
};

module.exports = { getJobs, searchJobs };
