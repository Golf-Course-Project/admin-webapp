## Prepare course rankings csv

Go thru each row, one at a time. Go through the rows prompted. If the row does not have a CourseId value. Use MCP Server to search for a course by name. Start by looking at the Course Name. If the course name is in this format `course name (text)` then look at the text before the (text). If that does not return a result, try looking at the value in between brackets. For example: 

Sand Valley (Sedge Valley)

First search is "Sand Valley". If that does not match. Try "Sedge Valley". If that does not match try "Sand Valley Sedge Valley". 

If you still do not get a match try looking up just the via City and State. These fields are in the Location field. City is left of the comm and state is right of it. 

For example "West Point, MS"

West Point is the city. MS is the state

If you get a list of more than one result, try and match that with the course name.

If you find a match, update the csv file right away and then move on to the next row.

Leave CourseId blank if you cannot find the course. Move on to the next row. Go through the entire file untill completion. Do not remove any rows and do not remove any fields.

You don;t need to script anything. Just iterate thru one row at a time, updating the courseId value as you go. Do not provide a summary of what has been done.