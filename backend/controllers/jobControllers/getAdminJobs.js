import { Job } from "../../models/jobModel.js";

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        //const jobs = await Job.find({created_by: adminId});
        const jobs = await Job.find({created_by: adminId}).populate("company", "name"); // Populate only the 'name' field of company

        if(!jobs){
            return res.status(404).json({
                message: "Job Not found",
                success: false
            });
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}