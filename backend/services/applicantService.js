const Applicant = require('../models/Applicant');

const registerApplicant = async (userData) => {
    const existing = await Applicant.findOne({ email: userData.email });
    if (existing) {
        throw new Error('Email already exists');
    }
    
    const applicant = new Applicant(userData);
    return await applicant.save();
};

module.exports = { registerApplicant };