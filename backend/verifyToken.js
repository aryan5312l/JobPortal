import jwt from "jsonwebtoken";
import { User } from "./models/userModel.js";

export const verifyToken = async (req, res) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.token;
        console.log("Received token:", token); // Debugging: Log the received token

        // Check if the token exists
        if (!token) {
            return res.status(401).json({ 
                message: "User not authenticated", 
                success: false 
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
            //console.log("Decoded token:", decoded); // Debugging: Log the decoded token
        } catch (jwtError) {
            if (jwtError.name === "TokenExpiredError") {
                return res.status(401).json({ 
                    message: "Token expired", 
                    success: false 
                });
            } else if (jwtError.name === "JsonWebTokenError") {
                return res.status(401).json({ 
                    message: "Invalid token", 
                    success: false 
                });
            } else {
                throw jwtError; // Re-throw unexpected errors
            }
        }

        // Find the user associated with the token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            });
        }

        // Return the user data (excluding the password)
        return res.status(200).json({ 
            success: true, 
            user 
        });

    } catch (error) {
        console.error("Error in verifyToken:", error); // Debugging: Log the error
        return res.status(500).json({ 
            message: "Internal server error", 
            success: false 
        });
    }
};