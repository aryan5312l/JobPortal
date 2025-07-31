import { findBestJobs } from "../../services/matchingService.js";
import { User } from "../../models/userModel.js";

export const suggestJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.id);

        if (!user?.profile?.embedding) {
            return res.status(400).json({ 
                success: false,
                message: "User embedding not found. Please upload your resume first.",
                actionRequired: true
            });
        }

        const recommendJobs = await findBestJobs(user.profile.embedding);

        const total = recommendJobs.length;
        const paginatedJobs = recommendJobs.slice(skip, skip + limit);

        const response = {
            success: true,
            jobs: paginatedJobs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalJobs: total,
            hasMore: page < Math.ceil(total / limit)
        };

        return res.json(response);
    } catch (error) {
        console.error("Job recommendation error:", error);
        res.status(500).json({ 
            success: false,
            error: "Job recommendation failed.",
            retryable: true
        });
    }
}