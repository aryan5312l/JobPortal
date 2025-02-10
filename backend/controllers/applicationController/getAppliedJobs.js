import { Application } from "../../models/applicationModel.js";

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        //console.log("Request headers:", req.headers);
        const applications = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path: "job",
            options: {sort: {createdAt: -1}},
            populate: {
                path: "company",
                options: {sort: {createdAt: -1}}
            }
        });

        if(!applications){
            return res.status(404).json({
                message: "No application Found",
                success: false
            })
        }

        return res.status(200).json({
            applications,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}