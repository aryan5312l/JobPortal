import linkedIn from 'linkedin-jobs-api';
import { Job } from '../models/jobModel.js'; // make sure your Job model file uses export default

const queryOptions = {
    keyword: 'software engineer',
    location: 'India',
    dateSincePosted: 'past Week',
    jobType: 'full time',
    remoteFilter: 'remote',
    salary: '100000',
    experienceLevel: 'entry level',
    limit: '50',
    sortBy: 'recent',
    page: '1',
};

export async function fetchAndSaveJobs() {
    try {
        const jobs = await linkedIn.query(queryOptions);

        for (const jobData of jobs) {
            const companyName = jobData.company || '';
            const position = jobData.position || 'Untitled';
            const existingJob = await Job.findOne({ companyName, position });

            if (existingJob) {
                console.log(`Duplicate found: ${companyName} - ${position}`);
                continue;
            }

            const job = new Job({
                title: jobData.position || 'Untitled',
                position: jobData.position || 'Untitled',
                description: jobData.description || 'No description provided.',
                requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [],
                salary: parseInt(jobData.salary?.replace(/[^0-9]/g, '')) || 0,
                location: jobData.location || 'Not specified',
                experienceLevel: jobData.experienceLevel || 'Not specified',
                jobType: jobData.jobType || 'Not specified',
                company: jobData.companyId || undefined,

                companyLogo: jobData.companyLogo || '',
                companyName: jobData.company || '',
                jobUrl: jobData.jobUrl || '',


                created_by: jobData.createdById || undefined,
                expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                applications: [],
            });

            try {
                await job.save();
                console.log(`Job saved: ${job.title} at ${job.companyName}`);
            } catch (error) {
                console.error('Failed to save job:', error.message);
            }
        }

        console.log('Jobs saved successfully');
    } catch (error) {
        console.error('Failed to fetch/save jobs:', error);
    }
}
