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

const router = express.Router();

router.route('/register').post(singleUpload ,register);
router.route('/login').post(login);
router.route('/logout').get(logout)
router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);
router.route('/auth/validate').get(verifyToken);

//OTP based login routes
router.route("/otp-login").post(requestOTP);
router.route("/verify-otp").post(verifyOTP);

export default router;