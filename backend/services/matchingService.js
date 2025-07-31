import { Job } from "../models/jobModel.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

export async function findBestJobs(userEmbedding) {
    const jobs = await Job.find({embedding: {$exists : true}});

    const rankedJobs = jobs.map((job) => ({
        job,
        score: cosineSimilarity(userEmbedding, job.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    

    return rankedJobs;
}