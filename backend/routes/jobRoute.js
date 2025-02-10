import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/companyControllers/registerCompany.js";
import { postJob } from "../controllers/jobControllers/postJob.js";
import { getAllJobs } from "../controllers/jobControllers/getAllJobs.js";
import { getAdminJobs } from "../controllers/jobControllers/getAdminJobs.js";
import { getJobById } from "../controllers/jobControllers/getJobById.js";

const router = express.Router();

router.route('/post').post(isAuthenticated, postJob);
router.route('/get').get(getAllJobs);
router.route('/getadminjobs').get(isAuthenticated, getAdminJobs)
router.route('/get/:id').get(isAuthenticated, getJobById);

export default router;