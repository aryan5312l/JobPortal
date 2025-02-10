import { Application } from "../../models/applicationModel.js";
import {Job} from "../../models/jobModel.js"

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message: "Job id is required",
                success: false
            });
        };

        //check is user has already applied for the job
        const applicationExist = await Application.findOne({job: jobId, applicant: userId});
        if(applicationExist){
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        };

        //check job exsit
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message: "Job not found",
                success: false
            });
        };

        //create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job applied successfully",
            success: true,
            applicationId: newApplication._id
        })

    } catch (error) {
        console.log(error)
    }
}