import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";


dotenv.config();

const router = express.Router();

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });


                if (!user) {
                    user = new User({
                        //googleId: profile.id,
                        email: profile.emails[0].value,
                        fullname: profile.displayName,
        
                        role: "student", // Provide a default role
                        //password: "oauth", // Dummy password (not used, since OAuth handles login)
                        //phoneNumber: 0,
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Serialize & Deserialize (needed for session-based auth, but not used in JWT flow)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, done));

// Google Auth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        try {
            const user = req.user;

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.SECRET_KEY,
                { expiresIn: "1d" }
            );

            // Redirect to frontend with JWT
            res.redirect(`http://localhost:5173/auth/google/callback?token=${token}`);
        } catch (error) {
            console.error("Error generating JWT:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

export default router;
