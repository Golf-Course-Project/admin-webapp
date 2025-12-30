---
name: 'clean-up-data-csv'
description: 'This custom agent process the csv file provided and go thru it one row a time. It will go and clean up any data issues found in the csv. It will go out to the internet to find additional information as needed.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'todo']
---

## Inputs

- csv file: name or path of the csv file to process.
- rows: start row and end row to process. If not provided, process all rows.

## Instructions

Go thru the csv provided. Go thru it one row at a time. Start with the row as provided. For each row, check for common data issues such as missing values, incorrect formats, or outdated information.

Go through the following fix each data issue found in the row. Do not skip any fields. Update one row at a time. Do not fetch all rows at once.

## Steps for cleaning up the data

For each row, search for ALL missing information for that facility or course on the internet. Update the row with the correct information found.

Search once per facility to gather ALL available information (phone, website, email, social media, etc.) then update all fields for that facility at once.

Gather complete information in one search rather than making multiple searches per facility.

Go through the following examples and fix each data issue found in the row. Do not skip any fields.

### Examples of data issues to fix

- If the City field is missing or has a number in it. Remove the number and search the itnernet to find the correct city name. You can use the `FacilityName` to help find the correct location. It is possible that that the number in the city field belongs to the postal code field. If so, move the number to the postal code field.

- If the `FacilityName` and/or `CourseName` field has a `Gc` in in it. For example,`Quail Ridge Gc` or `Saskatoon Gc`. Use the internet to find the correct name. It will either be `Golf Club` or `Golf Course`. Update the name to the correct value.

- If the `FacilityName` and/or `CourseName` field has a `At` in the name, change the uppercase `A` to lowercase `a`. For example, `Hillside At St. Andrews` should be changed to `Hillside at St. Andrews`.

- If the the field is missing a value that can be found on the internet, go and search for the value and update the field. For example, if the `YearOpened` field is missing a value, search the internet to find the year the facility or course opened and update the field. But the same for City, PostalCode, State, Email, Instagram, Facebook, Website, Phone, etc. If you cannot find the definitive value, leave the field blank.

- If the `Type` field has a value that is empty or `-1`, update it to be either `public` or `private`. You can search the internet to find the correct value. 1 = public, 2 = private, 3 = Semi-Private. If you cannot find the value, leave it as `-1`.

- Phone numbers should be in the format `(123) 456-7890`. If they are not, update them to be in that format.

## Do not do these

- Do not change the format of the csv. Keep the same columns and order.
- Do not add or remove any columns.
- Do not make any assumptions. Always search the internet to find the correct value.
- Do not make any changes that are not specified in the instructions above.
- Do not use any MCP Server to make updates. Only make changes to the csv file.