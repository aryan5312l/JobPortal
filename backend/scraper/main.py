from job_scraper import save_html_pages
from collect import search_google_and_extract
from job_details import scrape_job_details
import pandas as pd

def save_data(job_details):
    """Save the collected job details to a CSV file."""
    df = pd.DataFrame(job_details)
    df.to_csv("scraper/job_details.csv", index=False)
    print("Data saved to 'job_details.csv'.")



# Step 2: Extract job URLs from the saved HTML
'''
query = "software engineer site:https://apply.workable.com"
job_urls = search_google_and_extract(query)
print(job_urls)
save_data(job_urls)

# Step 1: Extract and save HTML pages
save_html_pages("scraper/data", job_urls)

# Print the extracted URLs for verification
print(f"Extracted {len(job_urls)} job URLs.")
#print("Sample URLs:", job_urls[:5])  # Print the first 5 URLs for debugging
'''
# Step 3: Scrape job details from the extracted URLs

job_urls = [{'title': 'Software Engineer, Platform Engineering (Mercari India)', 'link': 'https://apply.workable.com/mercari-india/j/8400CC9BF0/'}, {'title': 'Software Engineer (Frontend, Backend, or Full stack)', 'link': 'https://apply.workable.com/subscript/j/E58599B066/'}, {'title': 'Senior Software Engineer (Hybrid or On-site) - more.com', 'link': 'https://apply.workable.com/more-com/j/081FFF5AE2'}, 
{'title': 'Software Engineer, Backend - Mercari, Inc. (India)', 'link': 'https://apply.workable.com/mercari-india/j/1C9B45B4E9/'}, {'title': 'Software Engineer - Passage', 'link': 'https://apply.workable.com/passagehq/j/CE67B522C8'}, {'title': 'Software engineer - WATI.io', 'link': 'https://apply.workable.com/wati-dot-i-o/j/BB9A5AE0FD/'}, {'title': 'Software Engineer - Python - (PST) - Channel Factory', 'link': 'https://apply.workable.com/channel-factory/j/412E4E0BB2/'}, {'title': 'Software Engineer - Freelancer.com', 'link': 'https://apply.workable.com/freelancer/j/9639EE1B11/'}, {'title': 'Software Engineer - Agility', 'link': 'https://apply.workable.com/agility/j/D408E6B2C7/'}, {'title': 'Software Engineer - Insignis Cash', 'link': 'https://apply.workable.com/insignis-cash-solutions/j/14665E45F2/'}]

job_data = scrape_job_details(job_urls)
print(job_data)
# Step 4: Save job details to a CSV file
df = pd.DataFrame(job_data)
df.to_csv("scraper/job_details.csv", index=False)
print("Job details saved to 'job_details.csv'")
