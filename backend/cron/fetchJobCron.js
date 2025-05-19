import cron from 'node-cron'
import { fetchAndSaveJobs } from '../services/linkedinJobFetcher.js';

console.log('Starting cron job to fetch LinkedIn jobs...');

cron.schedule('0 2 * * *', async () => {
  const today = new Date();
  const day = today.getDate();

  // Run only on even days (or odd days, your choice)
  if (day % 2 === 0) {
    console.log('Running job on even day:', day);
    await fetchAndSaveJobs();
  } else {
    console.log('Skipping job on odd day:', day);
  }
});