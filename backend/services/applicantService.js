const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Applicant = require('../models/Applicant');

//Task 2
const registerApplicant = async (userData) => {
    const existing = await Applicant.findOne({ email: userData.email });
    if (existing) {
        throw new Error('Email already exists');
    }
    
    const applicant = new Applicant(userData);
    return await applicant.save();
};


// Task 3
const loginApplicant = async (email, password) => {
    const applicant = await Applicant.findOne({ email });
    if (!applicant) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, applicant.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { id: applicant._id, email: applicant.email, role: applicant.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
    );

    return { token, applicant };
};

module.exports = { registerApplicant, loginApplicant };