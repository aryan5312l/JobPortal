from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import random

def human_like_delay():
    time.sleep(random.uniform(2, 10))

def save_html_pages(output_dir, urls):
# Set up the Selenium WebDriver (make sure the browser driver is installed and in PATH)
    driver = webdriver.Chrome()

    for url in urls:

        try:
            # Open the Google homepage
            driver.get(url['link'])

            # Wait for the page to load
            human_like_delay()
            #time.sleep(2)

            elems = driver.find_elements(By.CLASS_NAME, "job_seen_beacon")
            print(f'Length is {len(elems)}')

            file = 0
            for elem in elems:
                d = elem.get_attribute("outerHTML")
                with open(f"{output_dir}/smartphone_{file}.html", "w", encoding="utf-8") as f:
                    f.write(d)
                    file += 1
        # Find the search bar using its name attribute
        #search_box = driver.find_element(By.NAME, "q")

        # Type a query into the search bar
        #search_box.send_keys("Selenium Python testing")

        # Submit the query (or use Keys.ENTER)
        #search_box.send_keys(Keys.RETURN)

        # Wait for the results to load
            time.sleep(3)

        # Print the title of the current page
        #print("Page title is:", driver.title)

        # Close the browser
            driver.quit()

        except Exception as e:
            print("An error occurred:", e)
            driver.quit()

if __name__ == "__main__":
    save_html_pages("scraper/data")