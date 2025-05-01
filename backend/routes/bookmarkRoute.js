import express from "express";
const router = express.Router();
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { Bookmark } from "../models/bookmark.js";
import mongoose from "mongoose";


//Get user's bookmarks
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const bookmark = await Bookmark.findOne({ userId: req.id })
            .populate({
                path: 'jobId',
                populate: {
                    path: "company",
                    select: "name logo about website",
                    model: "Company"
                }
            })
            .lean();

        if (!bookmark) {
            return res.status(200).json({ bookmarks: [] });
        }
        //console.log(bookmark);
        const bookmarks = bookmark.jobId.map(job => ({
            ...job,
            // companyName: job.company?.name || job.companyName,
            // companyLogo: job.company?.logo || job.companyLogo,
            // savedAt: job.savedAt || job.createdAt // Or specific bookmark timestamp if available
        }));

        res.status(200).json({ bookmarks });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

//Add a bookmark
router.post("/", isAuthenticated, async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { jobId } = req.body;
        const userId = req.id;


        console.log("User ID:", userId);
        console.log("Job ID:", jobId);

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid jobId format" });
        }

        let bookmark = await Bookmark.findOneAndUpdate(
            { userId },
            { $addToSet: { jobId } }, // Use $addToSet to prevent duplicates
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Bookmark added successfully",
            bookmark
        })

    } catch (error) {
        console.error("Error adding bookmark:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//Remove a bookmark
router.delete("/:jobId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.jobId;

        await Bookmark.updateOne({ userId }, { $pull: { jobId: jobId } });
        res.status(200).json({ success: true, message: "Bookmark removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;