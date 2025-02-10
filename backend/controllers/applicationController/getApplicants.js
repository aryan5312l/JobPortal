import mongoose from "mongoose";
import { Application } from "../../models/applicationModel.js";

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        //console.log(jobId)
        // Check if jobId is valid
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID",
                success: false,
            });
        }
        // Fetch applications for the given job ID and populate applicant details
        const applications = await Application.find({ job: jobId })
            .populate("applicant", "fullname email phoneNumber profile.resume")
            .sort({ createdAt: -1 });

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No applicants found for this job",
                success: false,
            });
        }

        return res.status(200).json({
            applicants: applications,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching job applicants:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
