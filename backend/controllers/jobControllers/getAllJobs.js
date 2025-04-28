import { Job } from "../../models/jobModel.js";

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const locationFilters = req.query.location || []; // array
        const industryFilters = req.query.industry || []; // array
        const salaryFilters = req.query.salary || [];     // array (expecting ranges)

        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                        { companyName: { $regex: keyword, $options: "i" } },
                    ]
                }
            ]
        };

        // Location filter
        if (locationFilters.length > 0) {
            query.$and.push({
                location: { $in: Array.isArray(locationFilters) ? locationFilters : [locationFilters] }
            });
        }

        // Industry filter (assuming "position" field holds the industry/role type)
        if (industryFilters.length > 0) {
            query.$and.push({
                title: { $in: Array.isArray(industryFilters) ? industryFilters : [industryFilters] }
            });
        }

        // Salary filter
        if (salaryFilters.length > 0) {
            // Salary filter could be like ["5", "10"] meaning "salary >= 5LPA and <= 10LPA"
            let salaryConditions = [];
            salaryFilters.forEach(filter => {
                const salaryValue = parseInt(filter);
                if (!isNaN(salaryValue)) {
                    salaryConditions.push({ salary: { $gte: salaryValue } });
                }
            });
            if (salaryConditions.length > 0) {
                query.$and.push({ $or: salaryConditions });
            }
        }

        const totalJobs = await Job.countDocuments(query);

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        return res.status(200).json({
            jobs,
            totalJobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: page,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
