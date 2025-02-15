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

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


const FRONTEND_URL = process.env.FRONTEND_URL.replace(/\/$/, "");
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL); // Fix manually set headers
    res.status(200).send("Hello");
});

//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

app.listen(PORT, () => {
    connectDB();
    console.log(`Listening on Port ${PORT}`)
})