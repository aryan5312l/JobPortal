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

const router = express.Router();

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per window
    message: { error: "Too many OTP requests. Try again later." }
});

router.route('/register').post(singleUpload ,register);
router.route('/login').post(login);
router.route('/logout').get(logout)
router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);
router.route('/auth/validate').get(verifyToken);

//OTP based login routes
router.route("/otp-login").post(otpLimiter, requestOTP);
router.route("/verify-otp").post(verifyOTP);

export default router;