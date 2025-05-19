import linkedIn from 'linkedin-jobs-api';
import { Job } from '../models/jobModel.js';

const industries = [
    "Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Scientist",
    "UI/UX Designer", "Product Manager", "Software Engineer", "DevOps Engineer",
    "Business Analyst", "Marketing Manager", "HR Manager", "Data Analyst",
    "Graphic Designer", "Sales Manager", "Cloud Architect", "Project Manager",
    "Android Developer", "iOS Developer", "Security Analyst", "Quality Assurance",
    "Machine Learning Engineer", "Artificial Intelligence Engineer", "Blockchain Developer",
    "Game Developer", "Network Engineer", "Technical Writer", "Database Administrator",
    "SAP Consultant", "Embedded Systems Engineer", "Web Designer", "System Administrator",
    "SEO Specialist", "Content Writer", "Digital Marketing Expert", "Research Scientist",
    "Financial Analyst", "Product Designer", "Operations Manager", "Customer Support",
    "Consultant", "Trainer", "Enterprise Architect", "Business Development Manager"
];

const experienceLevels = [
    "internship", "entry level", "associate", "senior", "director", "executive"
];

const jobTypes = [
    "full time", "part time", "contract", "temporary", "volunteer", "internship"
];

const remoteOptions = ["remote", "on-site", "hybrid"];

const location = "India";
const dateSincePosted = "past week";

export async function fetchAndSaveJobs() {
    console.log('🔁 fetchAndSaveJobs initialized at:', new Date().toISOString());

    try {
        for (const keyword of industries) {
            for (const experienceLevel of experienceLevels) {
                for (const jobType of jobTypes) {
                    for (const remoteFilter of remoteOptions) {
                        const queryOptions = {
                            keyword,
                            location,
                            dateSincePosted,
                            jobType,
                            remoteFilter,
                            salary: '0', // optional, or remove
                            experienceLevel,
                            limit: '5',
                            sortBy: 'recent',
                            page: '1',
                        };

                        console.log(`Searching for: ${keyword}, ${experienceLevel}, ${jobType}, ${remoteFilter}`);

                        const jobs = await linkedIn.query(queryOptions);

                        for (const jobData of jobs) {
                            const companyName = jobData.company || '';
                            const position = jobData.position || 'Untitled';
                            const existingJob = await Job.findOne({ companyName, position });

                            if (existingJob) {
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
                                console.log(`Saved: ${position} at ${companyName}`);
                            } catch (err) {
                                console.error('Error saving job:', err.message);
                            }
                        }

                        // Optional: delay between requests to avoid API throttling
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        }

        console.log('Finished saving all job combinations.');
    } catch (err) {
        console.error('Error fetching/saving jobs:', err);
    }
}
