import { User } from "../../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        //Validating Fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        //Finding User in Database
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "No User found",
                success: false
            });
        }

        //Verifying password
        if(user.password){
            const verifyPassword = await bcrypt.compare(password, user.password);
            if (!verifyPassword) {
                return res.status(401).json({
                    message: "Wrong Password",
                    success: false
                });
            }
        }
        else{
            return res.status(401).json({
                message: "Please login with Google",
                success: false
            });
        }

        //Check role 
        if (role != user.role) {
            return res.status(400).json({
                message: "Account does not exit with current role",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: false, // Enable secure cookies only in production
            sameSite: "Lax",
            path: "/",
        })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true
            });

        //console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);

    } catch (error) {
        console.log(error);
    }
}
