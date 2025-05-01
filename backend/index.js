import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import connectDB from "./utils/db.js";
import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js"
import jobRouter from './routes/jobRoute.js'
import applicationRouter from "./routes/applicationRoute.js"
import bookmarkRouter from "./routes/bookmarkRoute.js"
import path from "path";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";

const app = express();
dotenv.config();

const __dirname = path.resolve();

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoutes);

const corsOptions = {
    origin: ["https://jobportal-n1sh.onrender.com", "http://localhost:5173"],
    credentials: true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

/*
app.get('/', (req, res) => {
    res.status(200).send("Hello");
})
*/
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     next();
// });

import './cron/fetchJobCron.js'

//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/bookmark", bookmarkRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Listening on Port ${PORT}`)
})