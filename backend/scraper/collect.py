from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import pandas as pd


# Perform Google search and extract search result information
def search_google_and_extract(query):
    driver = webdriver.Chrome()
    try:
        # Open Google
        driver.get("https://www.google.com")
        time.sleep(2)
        # Find the search bar and enter the query
        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys(query)
        search_box.send_keys(Keys.RETURN)

        time.sleep(2)  # Wait for results to load
        
        # Extract search result titles and links
        search_results = driver.find_elements(By.CSS_SELECTOR, "div.tF2Cxc")
        results = []
        for result in search_results:
            title_element = result.find_element(By.CSS_SELECTOR, "h3")
            link_element = result.find_element(By.CSS_SELECTOR, "a")
            title = title_element.text
            link = link_element.get_attribute("href")
            results.append({"title": title, "link": link})

        return results
    finally:
        driver.quit()

# Save results to a file (optional)
def save_data(job_details):
    """Save the collected job details to a CSV file."""
    df = pd.DataFrame(job_details)
    df.to_csv("scraper/job_details.csv", index=False)
    print("Data saved to 'job_details.csv'.")

# Main function to execute the script
if __name__ == "__main__":
    query = "software engineer site:https://apply.workable.com"  # Replace with your search query
    results = search_google_and_extract(query)
    print(results)
    # Save results to a file
    save_data(results)
