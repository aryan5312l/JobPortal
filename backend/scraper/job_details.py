from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import pandas as pd
import random
from urllib.parse import urlparse

driver = webdriver.Chrome()
job_data = []

def human_like_delay():
    time.sleep(random.uniform(2, 10))

def get_element_text(driver, by, value):
    """Helper function to safely get the text of an element."""
    try:
        element = driver.find_element(by, value)
        return element.text.strip() if element else "N/A"
    except Exception:
        return "N/A"

def extract_section_text(section_id):
    try:
        section = driver.find_element(By.ID, section_id)
        return section.text.strip()
    except Exception as e:
        return f"Error extracting {section_id}: {e}"

def scrape_job_details(job_urls):
    """Scrape job details from given URLs."""
    
    for url in job_urls:
        
        try:
            driver.get(url['link'])
            human_like_delay()
            #time.sleep(2)  # Wait for the page to load

            
            # Extract job details
            # Function to extract text content from a section


            # Extracting the Description section
            try:
                description_section = driver.find_element(By.CSS_SELECTOR, 'section[data-ui="job-description"]')
                description= description_section.text
                
            except Exception as e:
                print("Error extracting text:", e)

            # Extracting the Role section
            

            # Extracting the Requirements section
            try:
                requirements_section = driver.find_element(By.CSS_SELECTOR, 'section[data-ui="job-requirements"]')
                requirements = requirements_section.text
                
            except Exception as e:
                print("Error extracting text:", e)

            # Print out the sections
            print("Description:", description)
            
            print("Requirements:", requirements)

            '''    # Requirements
            requirements_section = driver.find_element(By.ID, "job-requirements-title")
            requirements = requirements_section.find_element(By.XPATH, "following-sibling::div")
            if requirements:
                requirements = requirements.text.strip()
            
            try:
                    # Parse the URL
                    path = urlparse(url).path
                    # Extract the second segment (company name), handling cases like "wati-dot-i-o"
                    company_name = path.split('/')[1] if len(path.split('/')) > 1 else "Unknown"
                    company_name = company_name.replace('-dot-', '.')  # Handling special case like "wati-dot-i-o"
                    
            except Exception as e:
                    print(f"Failed to process URL {url}: {e}")
                '''    
            
           

            job_data.append({
                'title': url['title'],
                'link': url['link'],
                "Job Description": description,
                "requirements": requirements,
            })
            human_like_delay()
        except Exception as e:
            print(f"Failed to process URL {url}: {e}")

    driver.quit()
    print(job_data)
    return job_data

def save_data(job_details):
    """Save the collected job details to a CSV file."""
    df = pd.DataFrame(job_details)
    df.to_csv("job_details.csv", index=False)
    print("Data saved to 'job_details.csv'.")

if __name__ == "__main__":
    # Example: Replace with actual URLs from previous step
    example_urls = ["https://example.com/job1", "https://example.com/job2"]
    details = scrape_job_details(example_urls)
    save_data(job_data)
    print("Job details saved to 'job_details.csv'")
