import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob } from "../controllers/applicationController/applyJob.js";
import { getAppliedJobs } from "../controllers/applicationController/getAppliedJobs.js";
import { getApplicants } from "../controllers/applicationController/getApplicants.js";
import { updateStatus } from "../controllers/applicationController/updateApplicationStatus.js";
import { checkApplication } from "../controllers/applicationController/checkApplication.js";

const router = express.Router();

router.route('/apply/:id').get(isAuthenticated, applyJob);
router.route('/get').get(isAuthenticated, getAppliedJobs);
router.route('/:id/applicants').get(isAuthenticated, getApplicants)
router.route('/status/:id/update').put(isAuthenticated ,updateStatus);
router.route('/checkApplication').post(isAuthenticated, checkApplication);
export default router;