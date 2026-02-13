# Clean/Validate Ranked Course Websites

## Scope

- File: `.imports/data/isRanked.csv`  
- Relevant columns: `CourseName`, `FacilityName`, `City`, `State`, `Website`, `IsFlagged`  
- Task: Clean and validate the `Website` column only, row by row.
- start with Row 1 and do batches of 25 at a time unless instructed otherwise

---

## Data Sources & Tools

- Allowed inputs:
  - Data in the CSV row: `CourseName`, `FacilityName`, `City`, `State`, existing `Website`.
  - Public HTML fetched via the MCP golf-course scraper: `mcp_golf-course-p_web_scrape_website`.
- Not allowed:
  - Generic HTTP/URL fetch tools outside MCP.
  - Google or other external search APIs (unless explicitly added later).
  - Scripts or bulk-processing beyond “one row at a time”.

---

## Other instructions
- Do NOT Follow any other instrctions in the `.github\instructions` folder. Only follow these instructions in `clean-csv.md`

## Row-By-Row Workflow

For each row in the specified range:

1. **Identify the row**
   - Note `CourseName`, `FacilityName`, `City`, `State`, `Website`.

2. **If `Website` is empty**
   - leave `Website` empty.

3. **If `Website` is present**
   - MCP-scrape the exact URL from the CSV.
   - If the scraper returns usable HTML:
     - Check:
       - Page title, headings, logo/branding.
       - Address, city, state, phone where available.
     - If this clearly matches the CSV row (same club and location): **KEEP** the URL.
     - If it clearly belongs to a different club: treat the existing URL as wrong and proceed as in step 4.
   - If the scraper does *not* return usable HTML (errors, redirects only, etc.):
     - Treat the current URL as bad and proceed as in step 4

4. **When the existing URL is wrong or dead**
     - **CLEAR** the `Website` value for that row (leave it blank).

5. **Move to the next row**
   - Do not summarize after each row; just continue until the requested range is complete.
   - Do not ask for validation, do as instructed

6. **No Assumptions or Diversions**
  - Follow these instructions and do not diverge.
  - Do not assume or try something different to make the process more effecient

---

## URL Classification Rules

### Acceptable URL (KEEP / REPLACE)

A URL is acceptable if **all** are true:

- MCP scraper returns HTTP 200 with meaningful HTML (not just a trivial redirect stub or parking page).
- The content clearly identifies:
  - The same course/club (or a very obvious naming variant) as in `CourseName` / `FacilityName`.
  - The same city and state as the CSV row.

Examples of “clearly identifies”:

- `<title>` or page header includes the course/club name.
- Address block matches the city/state in the row.
- Site is clearly the official club/resort page, not a directory or third-party booking site.

### Bad URL (CLEAR / REPLACE)

Treat a URL as bad and **do not keep it** if:

- MCP scraper shows:
  - DNS failure / “no such host”.
  - SSL handshake failure.
  - Connection refused / timeouts.
  - Persistent 3xx (301/302/etc.) where the chain never yields usable HTML for the club.
  - Only a generic “lander”, parking, or placeholder page with no clear club identity.
- Or, the HTML clearly belongs to a *different* club or location than the CSV row.

In all such cases:

- If no alternative official site can be confidently found: **CLEAR** the `Website`.

---

## Finding Candidate URLs (When Current URL Is Wrong/Dead)

When you need a replacement:

- Use only information from the CSV row:
  - Course/facility name.
  - City and state.
- Form a small set (usually 1–3) of obvious candidates, for example:
  - `https://<normalized-course-name>.com`
  - `https://<normalized-course-name>.org`
  - For “<Name> Golf Club” / “<Name> Country Club”, try:
    - `https://<name>golfclub.com`
    - `https://<name>cc.com` or `https://<name>countryclub.com`
  - For resorts with multiple courses, consider the resort’s main domain.

For each candidate:

- MCP-scrape the URL.
- Apply the classification rules above.

Do **not**:

- Brute force many domain combinations.
- Infer a URL from outside knowledge; always validate with MCP HTML.

---

## Special Cases

### Multi-Course Resorts

Examples: Bandon Dunes, Turning Stone, Las Vegas Paiute, etc.

- If individual course URLs:
  - Are dead or return unusable content, **but**
  - The resort main site:
    - Loads and clearly lists the course as part of the resort,
- Then it is acceptable to set the course’s `Website` to the **resort’s main domain**.

### Misassigned Shared Domains

If the current URL belongs to a different club than the row’s data:

- Example patterns:
  - Fenway row pointing to Apawamis Club.
  - Century / Blind Brook rows pointing to Purchase Country Club.
- In such cases:
  - Treat the existing URL as wrong and clear it from the row 

### Clubs with No Clearly Resolvable Modern Site

If, after trying a few reasonable candidates:

- All candidates fail HTTP checks or
- None of the HTML clearly matches the club and location,

then:

- Leave `Website` **blank**.
- Do not guess or rely on memory.

---

## Edit Discipline & Constraints

- Only edit the `Website` field for the specific row you are working on.
- Do **not**:
  - Change any other columns.
  - Delete rows.
  - Reorder rows.
- Work only within the row ranges you are explicitly asked to handle (e.g., 450–475, 500–550), but within that range, **check every row** in order.

---

## Confidence & Conservatism

- **REPLACE** only when:
  - The new URL has strong evidence of being the official site for that exact club and location.
- **CLEAR** when:
  - You cannot reach a confident conclusion from MCP HTML.
- Never rely on unverified assumptions or external “memory”; decisions must be grounded in:
  - The CSV row, and
  - The MCP-scraped HTML.

