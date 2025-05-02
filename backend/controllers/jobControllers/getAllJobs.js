import { Job } from "../../models/jobModel.js";

const industrySynonyms = {
    "Frontend Developer": ["Frontend", "React", "Angular", "Vue", "HTML", "CSS", "JavaScript"],
    "Backend Developer": ["Backend", "Node", "Express", "Django", "Flask", "Java Backend", "API Developer"],
    "Fullstack Developer": ["Fullstack", "MERN", "MEAN", "Java Fullstack", "React Node", "Full-stack"],
    "Data Scientist": ["Data Scientist", "ML", "Machine Learning", "AI", "Deep Learning", "Data Science"],
    "UI/UX Designer": ["UI", "UX", "User Interface", "User Experience", "Figma", "Sketch", "Adobe XD"],
    "Software Engineer": ["Software Engineer", "Software Developer", "Programmer", "Coder"],
    "DevOps Engineer": ["DevOps", "CI/CD", "Docker", "Kubernetes", "AWS", "Infrastructure"],
    "Data Analyst": ["Data Analyst", "Power BI", "Tableau", "Excel Analyst"],
    "Android Developer": ["Android", "Kotlin", "Java Android", "Mobile Developer"],
    "iOS Developer": ["iOS", "Swift", "Objective-C"],
    "Machine Learning Engineer": ["Machine Learning", "ML Engineer", "AI Engineer", "TensorFlow", "PyTorch"],
    "Blockchain Developer": ["Blockchain", "Solidity", "Web3", "Crypto Developer"],
    
};


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
            const locations = Array.isArray(locationFilters) ? locationFilters : [locationFilters];
            
            const locationConditions = locations.map(location => ({
                location: { 
                    $regex: location.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 
                    $options: "i" 
                }
            }));

            query.$and.push({
                $or: locationConditions
            });
        }

        if (industryFilters.length > 0) {
            const expandedKeywords = [];

            const industries = Array.isArray(industryFilters) ? industryFilters : [industryFilters];

            industries.forEach(industry => {
                const synonyms = industrySynonyms[industry] || [industry];
                expandedKeywords.push(...synonyms);
            });

            const industryConditions = expandedKeywords.map(keyword => ({
                title: { $regex: keyword, $options: "i" }
            }));

            query.$and.push({ $or: industryConditions });
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
