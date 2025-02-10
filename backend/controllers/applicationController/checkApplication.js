import { Application } from "../../models/applicationModel.js";

export const checkApplication = async (req, res) => {
    const { jobId } = req.body; // Get the jobId from the request body
    const userId = req.id; // Assuming tokenAuthentication middleware populates req.id
    // console.log(`CA: ${jobId}`);
    // console.log(`CA: uid: ${userId}`);
    if (!jobId) {
        return res.status(400).json({ success: false, message: "Missing jobId" });
    }

    try {
        // Directly check if the user has applied for the job
        const hasApplied = await Application.exists({ job: jobId, applicant: userId });

        if (hasApplied) {
            
            res.status(200).json({ applied: true, message: 'You have already applied for this job.' });
        } else {
            res.status(200).json({ applied: false, message: 'You have not applied for this job.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}