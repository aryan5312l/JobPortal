import cron from 'node-cron'
import { fetchAndSaveJobs } from '../services/linkedinJobFetcher.js';
 
console.log('Starting cron job to fetch LinkedIn jobs...');

 cron.schedule('* * * * *', async () => {
    console.log('Running daily job fetch at 2AM...');
    await fetchAndSaveJobs();
  });