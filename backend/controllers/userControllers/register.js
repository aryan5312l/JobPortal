import { User } from "../../models/userModel.js";
import bcrypt from "bcrypt";
import getDataUri from "../../utils/datauri.js";
import cloudinary from "../../utils/cloudinary.js";

export const register = async (req, res) => {
    try{
        const {fullname, email, password, role, phoneNumber} = req.body;
        if(!fullname || !email || !password || !role || !phoneNumber){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
    
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "User already exist",
                success: false
            });
        };
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const file = req.file;
        let cloudResponse = ''
        if(file){
            const fileUri = getDataUri(file) 
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            phoneNumber,
            profile:{
                profilePhoto: cloudResponse.secure_url
            }
        });

        return res.status(201).json({
            message: "Register Successfully",
            success: true
        })
    }catch(error){
        console.log(error);
    }
}