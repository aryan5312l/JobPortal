import { Job } from "../../models/jobModel.js";
import { generateEmbedding } from "../../services/embeddingService.js";

export const postJob = async(req, res) => {
    try {
        console.log(req.body);
        
        const {title, description, salary, jobType, position, companyId, requirements, experienceLevel, location} = req.body;
        const userId = req.id;
       console.log({ title, description, salary, jobType, position, companyId, requirements, experienceLevel, location });
        if (
            title == null || 
            description == null || 
            salary == null || 
            location == null || 
            jobType == null || 
            experienceLevel == null || 
            position == null || 
            companyId == null
        ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Generate job embedding
        const jobText = `
            Title: ${title}
            Description: ${description}
            Requirements: ${requirements}
            Experience Level: ${experienceLevel}
            Job Type: ${jobType}
            Location: ${location}
        `;
        
        const jobEmbedding = await generateEmbedding(jobText);

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company: companyId,
            created_by: userId,
            embedding: jobEmbedding
        });

        return res.status(201).json({
            message: "New Job Created",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating job",
            success: false,
            error: error.message
        });
    }
}