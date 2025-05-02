import express from "express"
import { register } from "../controllers/userControllers/register.js";
import { login } from "../controllers/userControllers/login.js";
import { updateProfile } from "../controllers/userControllers/updateProfile.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { logout } from "../controllers/userControllers/logout.js";
import { singleUpload } from "../middlewares/multer.js";
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";
import { verifyToken } from "../verifyToken.js";
import { requestOTP, verifyOTP } from "../controllers/userControllers/otpAuth.js";
import rateLimit from "express-rate-limit";
import { forgotPassword, resetPassword } from "../controllers/userControllers/forgetPassword.js";
import { loginValidation, registerValidation } from "../validators/authValidators.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per window
    message: { error: "Too many OTP requests. Try again later." }
});

router.route('/register').post(singleUpload, registerValidation, validateRequest, register);
router.route('/login').post(loginValidation, validateRequest, login);
router.route('/logout').get(logout)
router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);
router.route('/auth/validate').get(verifyToken);

//OTP based login routes
router.route("/otp-login").post(otpLimiter, requestOTP);
router.route("/verify-otp").post(verifyOTP);

router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//Forgot Password
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;