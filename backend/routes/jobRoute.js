import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/companyControllers/registerCompany.js";
import { postJob } from "../controllers/jobControllers/postJob.js";
import { getAllJobs } from "../controllers/jobControllers/getAllJobs.js";
import { getAdminJobs } from "../controllers/jobControllers/getAdminJobs.js";
import { getJobById } from "../controllers/jobControllers/getJobById.js";
import { fetchAndSaveJobs } from "../services/linkedinJobFetcher.js";

const router = express.Router();

router.route('/post').post(isAuthenticated, postJob);
router.route('/get').get(getAllJobs);
router.route('/getadminjobs').get(isAuthenticated, getAdminJobs)
router.route('/get/:id').get(isAuthenticated, getJobById);

router.get('/fetch-jobs', async (req, res) => {
    try {
      await fetchAndSaveJobs();
      res.json({ success: true, message: 'Jobs fetched and stored.' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

export default router;