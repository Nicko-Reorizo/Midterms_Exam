const Job = require('../models/Job');

const getJobs = async () => {
    return await Job.find().sort({ createdAt: -1 });
};

module.exports = { getJobs };
