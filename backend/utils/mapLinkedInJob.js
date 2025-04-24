export function mapLinkedInJobToSchema(linkedInJob, createdById, companyId) {
    return {
      title: linkedInJob.position,
      description: `Job from LinkedIn scraped: ${linkedInJob.jobUrl}`,
      requirements: [],
      salary: parseSalary(linkedInJob.salary),
      location: linkedInJob.location || 'Remote',
      experienceLevel: 0,
      jobType: 'Full-time',
      position: 1,
      company: companyId,
      created_by: createdById,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    };
  }
  
  function parseSalary(salaryStr) {
    if (!salaryStr || salaryStr === "Not specified") return 0;
    const match = salaryStr.match(/\d+/g);
    return match ? parseInt(match.join("")) : 0;
  }
  