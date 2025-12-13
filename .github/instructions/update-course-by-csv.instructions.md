## Update course and facility info with csv

Go thru the csv provided. Go thru it one row at a time. Start with the row as provided. If there is a courseId value, then fetch the course. Check to see if the Designer and YearOpened field have a value. If the value in the fetch is different than the csv, take the values from the csv and update the course. Only update Designer and YearOpened field. 

Do not update any other fields. Only update if the values are missing from the fetch or different from the csv. You should only unpdate the yearOpened and desinger fileds. The update request should look like this:

```
{
  "body": {
    "yearOpened": 1924,
    "designer": "A.W. Tillinghast",
    "id": "21d9991c-c82b-41cd-bfcb-a9e76f13a1d4"
  }
}
```

### Do not update the longitude or latitude fields.

Then use the facilityId from that `course_fetch` and call the `facility_fetch` tool. If the `type` field is -1, then update the `type` field from the row in the csv. If the value is "public" then set the `type` value to 1. If the value is "private" then set the `type` value to 2. Only update the `type` field. Do not update any other fields. Onlu update the type field, do not update any other fields. Example request should be:

```
{
  "body": {
    "type": 2,
    "id": "A0500F1C-CF25-4DA0-B531-8C3C4724AC43"
  }
}
```

### Do not update the longitude or latitude fields.

Do not create any powershell scripts. Just go thru the csv one row at a time.

Go row by row. Do not provide a summary of what been done after each row. Just move on to the next row after updating the course and facility.