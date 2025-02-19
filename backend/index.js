import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import connectDB from "./utils/db.js";
import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js"
import jobRouter from './routes/jobRoute.js'
import applicationRouter from "./routes/applicationRoute.js"
import path from "path";

const app = express();
dotenv.config();

const __dirname = path.resolve();

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const corsOptions = {
    origin: "https://jobportal-n1sh.onrender.com",
    credentials: true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

/*
app.get('/', (req, res) => {
    res.status(200).send("Hello");
})
*/
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});


//api's
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Listening on Port ${PORT}`)
})