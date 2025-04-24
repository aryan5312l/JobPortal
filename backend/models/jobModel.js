import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
    }],
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }],
    companyLogo: { type: String },
    companyName: { type: String },
    jobUrl: { type: String },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        index: { expires: 0 } // TTL index to auto-delete
    }
}, {timestamps: true})

export const Job = mongoose.model('Job', jobSchema)