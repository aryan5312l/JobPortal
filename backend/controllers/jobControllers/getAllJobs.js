import { Job } from "../../models/jobModel.js";


export const getAllJobs = async(req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title : {$regex: keyword, $options: "i"}},
                {description : {$regex: keyword, $options: "i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({createdAt: -1});
        if(!jobs){
            return res.status(404).json({
                message: "Job Not found",
                success: false
            });
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}