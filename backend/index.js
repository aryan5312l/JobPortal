import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import connectDB from "./utils/db.js";
import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js"
import jobRouter from './routes/jobRoute.js'
import applicationRouter from "./routes/applicationRoute.js"

const app = express();
dotenv.config();
app.use((req, res, next) => {
    console.log("Before cookie-parser, raw cookie header:", req.headers.cookie);
    next();
});

const FRONTEND_URL = process.env.FRONTEND_URL || "https://job-portal-a.vercel.app";
app.use(cookieParser());
//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const allowedOrigins = [FRONTEND_URL, "https://job-portal-gfznaou6c-aryan-rajs-projects-e6fdfb79.vercel.app"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Connect to Database
connectDB();

// Export as Vercel serverless function
export default app;