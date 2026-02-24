---
name: update-course
description: This skill takes a course ID, fetches the course details, and updates the course information based on the provided data. It ensures that the course information is accurate and up-to-date.
---

# Update Course

The purpose of this skill is to update the details of a course based on the provided course ID **only when there is clear, explicit data available** from the official website. It must:

- Fetch the existing course details
- Determine the correct website URL
- Scrape the website for **explicitly stated** course and facility information
- Propose a set of changes back to the user for confirmation
- Only then call the update tools

All of this is done using the MCP Server Tools listed below.

# MCP Server Tools

These are the `golf-course-project` MCP Server tools that are used in this skill:

- `course_fetch`: Fetches the details of a course based on the provided course ID.
- `facility_fetch`: Fetches the details of a facility based on the provided facility ID that comes with the `course_fetch` results.
- `web_scrape_website`: Scrapes the course information from the provided website URL.
- `course_update`: Updates the course details based on the provided course ID and the new course information found from the website.
- `facility_update`: Updates the facility details based on the provided facility ID and the new facility information found from the website.
- `course_post_photos_from_urls`: Posts photos to the course based on the provided course ID and the photo URLs found from the website.

# Workflow

1. The skill receives a **course ID** as input.
2. It uses the `course_fetch` tool to retrieve the current details of the course, including the associated facility ID and the course website URL (if present).
3. It uses the `facility_fetch` tool to retrieve the facility details using the facility ID from `course_fetch`.
4. It determines the website URL to scrape:
  - First preference: the course website URL from `course_fetch`.
  - Fallback: the facility website URL from `facility_fetch`.
  - If **neither** contains a website URL, the skill must **stop** and return a clear error message indicating that no website URL is available for scraping. It must **not** guess or construct a URL.
5. It uses `web_scrape_website` with the selected website URL and, when available, **also scrapes clearly related internal subpages** (for example, public golf pages, contact pages, guest info pages, or footer-linked pages on the same domain) to extract only information that is **explicitly present** on the site:
  - Course data: course name, description, designer, year opened, rates/green fees (low and high), tags or notable attributes if clearly stated.
  - Location/contact data: address, city, state, postal code, phone.
  - Online presence: website (to confirm), Facebook URL, Instagram URL, other social links clearly labeled for the course/facility.
  - Photos: photo URLs that clearly depict the golf course or clubhouse (e.g., fairways, greens, tee boxes, bunkers, holes, practice areas, driving range, putting green, exterior clubhouse views). Avoid interior restaurant/bar shots, food images, or generic stock photos.
6. For **each** potential field to update, the skill must:
  - Verify that the value is clearly and unambiguously stated on the website.
  - Avoid inferring or “filling in” missing pieces (e.g., do not infer city/state from unrelated content, do not assume rates based on text that is not clearly green fees).
  - If there is **any doubt or ambiguity**, skip that field and leave the existing value unchanged.
7. The skill then compiles a **proposed change set** including, for each field:
  - Current value (from `course_fetch` / `facility_fetch`).
  - New scraped value (if any) and the page/section context it came from (in natural language, not the full HTML).
  - A clear indication of which fields will be updated on the course vs the facility vs photos.
8. The skill presents this proposed change set to the user and **asks for explicit confirmation** to proceed. The user must be able to see:
  - Which values will change.
  - Which values stay the same.
  - Which fields were skipped due to low confidence or missing data.
  - If the user does **not** confirm, the skill must stop and return a message indicating that the update has been cancelled, without calling any update tools.
9. If the user **confirms** the changes, the skill proceeds to update:
  - Uses `course_update` to update only the course fields where there is a high-confidence new value.
  - Uses `facility_update` to update only the facility fields where there is a high-confidence new value.
  - Uses `course_post_photos_from_urls` to post new photo URLs (respecting tool limits and avoiding duplicates when possible).
10. The skill then returns a summary of what was updated, what was skipped, and any fields that could not be determined from the website.

# Rules

- **No assumptions:** The skill must never invent, infer, or guess any value. It may only use values that are **explicitly and clearly** present on the website.
- **High-confidence only:** If the skill is not highly confident that a scraped value is correct and relevant to the course/facility, it must **not** update that field.
- **Field-by-field updates:** If some fields are clear and others are ambiguous, the skill should update only the clear fields and leave ambiguous fields unchanged.
- **Do not normalize beyond what is obvious:** The skill may perform simple, safe cleanup (e.g., trimming whitespace, converting phone numbers to a standard format) but must not transform values in a way that changes their meaning.
- **No URL construction:** The skill must never construct or guess a website URL. If no URL is present in course or facility data, it must stop with an error.
  - When following internal links, the skill may only use URLs that are explicitly present on the scraped pages and remain on the same domain as the original course/facility website.
- **Respect tool limits and content:** When posting photos, respect the `course_post_photos_from_urls` limit (maximum 5 URLs per call) and **only** use URLs that clearly represent the golf course or clubhouse. Prefer images showing fairways, greens, tees, bunkers, holes, practice facilities, or exterior clubhouse views. **Do not** select images that are primarily of food, drinks, people, animals, event setups, or unrelated indoor spaces.
- **User-in-the-loop:** The skill must always show the proposed changes and obtain explicit user confirmation **before** calling `course_update`, `facility_update`, or `course_post_photos_from_urls`.
- **Traceability:** Wherever possible, the skill should describe in natural language where on the site (e.g., “Rates page”, “Contact section footer”) each new value was found, so the user can verify it.
