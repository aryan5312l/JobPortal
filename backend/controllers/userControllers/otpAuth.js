import { User } from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const otpStorage = new Map(); // Temporary storage for OTPs

// Function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,           // Your Gmail email
    pass: process.env.EMAIL_PASSWORD,  // App password
  },
});

// 📌 Route to request OTP
export const requestOTP = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({
                message: "Email and role are required",
                success: false
            });
        }

        // Check if user exists
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User Already Exists",
                success: false
            });
        }

        // Generate OTP and store it
        const otp = generateOTP();
        otpStorage.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Expires in 5 mins

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for Login",
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
        });

        res.json({ message: "OTP sent to email", success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// 📌 Route to verify OTP and login
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp, role, fullname, phoneNumber, profile, password } = req.body; // Add fields for new user

        if (!email || !otp || !role) {
            return res.status(400).json({
                message: "Email, OTP, and role are required",
                success: false
            });
        }

        const storedOTP = otpStorage.get(email);
        if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        otpStorage.delete(email); // Remove OTP after successful verification

        let user = await User.findOne({ email });

        if (!user) {
            // ✅ If user does not exist, create a new user
            if(!fullname || !phoneNumber || !password){
                return res.status(400).json({
                    message: "All fields are required",
                    success: false
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                email,
                role,
                fullname, // Use provided fullname, or default to empty string
                phoneNumber, // Use provided phoneNumber, or default to empty string
                profile, // Use provided profile, or default to empty string
                password: hashedPassword // Use provided password, or default to empty string
            });

            await user.save();
        }

        // ✅ Check if role matches (after creating user)
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false
            });
        }

        const tokenData = { userId: user._id };

        let token;
        try {
            token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
        } catch (err) {
            console.error("Token generation failed:", err);
            return res.status(500).json({ message: "Internal Server Error", success: false });
        }

        res.status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                path: "/",
            })
            .json({
                message: user.isNew ? `Account created successfully! Welcome, ${user.fullname}` : `Welcome back ${user.fullname}`,
                user,
                success: true
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
