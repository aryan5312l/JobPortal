import mongoose from "mongoose";


const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    jobId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    }]
}, {
    timestamps: true
});

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);