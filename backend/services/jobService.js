const Job = require('../models/Job');
const mongoose = require('mongoose');

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getJobs = async () => {
    return await Job.find().sort({ createdAt: -1 });
};

const getJobById = async (jobId) => {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return null;
    }

    return await Job.findById(jobId);
};

const searchJobs = async (searchTerm) => {
    const keyword = searchTerm ? searchTerm.trim() : '';

    if (!keyword) {
        return await getJobs();
    }

    const searchRegex = new RegExp(escapeRegex(keyword), 'i');

    return await Job.find({
        $or: [
            { title: searchRegex },
            { company: searchRegex },
            { location: searchRegex },
            { description: searchRegex },
            { requirements: searchRegex },
            { jobType: searchRegex },
            { status: searchRegex },
        ],
    }).sort({ createdAt: -1 });
};

module.exports = { getJobs, getJobById, searchJobs };
