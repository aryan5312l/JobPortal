import cron from 'node-cron'
import { fetchAndSaveJobs } from '../services/linkedinJobFetcher.js';
 

 cron.schedule('* * * * *', async () => {
    console.log('Running daily job fetch at 2AM...');
    await fetchAndSaveJobs();
  });