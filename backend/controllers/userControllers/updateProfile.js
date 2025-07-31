import { User } from "../../models/userModel.js";
import cloudinary from "../../utils/cloudinary.js";
import getDataUri from "../../utils/datauri.js";
import { parseResumeWithGemini } from "./resumeParserController.js";

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "No User found",
                success: false
            });
        }

        //cloudinary 
        if(file){
            const fileUri = getDataUri(file) 
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            if(cloudResponse){
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname
            }
        }
        

        let skillsArray = [];
        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim()); // Trim spaces
        }
        
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        

        await user.save();

        user = {
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        
        return res.status(200).json({
            
            message: "Profile updated successfully",
            user,
            success: true
        })
        
    } catch (error) {
        console.log(error);
    }
}