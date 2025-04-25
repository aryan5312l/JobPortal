import { Job } from "../../models/jobModel.js";


export const getAllJobs = async(req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const query = {
            $or:[
                {title : {$regex: keyword, $options: "i"}},
                {description : {$regex: keyword, $options: "i"}},
            ]
        };

        const totalJobs = await Job.countDocuments(query);
        const jobs = await Job.find(query)
        .populate("company")
        .sort({createdAt: -1})
        .limit(limit)
        .skip(skip);
        
        return res.status(200).json({
            jobs,
            totalJobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: page,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}