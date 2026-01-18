---
name: 'create-csv-from-html'
description: 'This custom agent will extract the required information from the provided HTML and create a CSV file with the specified format.'
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runSubagent']
---
I would like you to go thru this supplied HTML from an article about the top courses. Pull out CourseName, Resort Name, Ranking, Designers (which is Architects), Location, Type Course, Year Opened and put them this csv file. Match that exact format. The CourseId column will be emtpy. So each row would start with an empty value followed by a comma. For example...

,Course Name, Resort Name, Ranking, Designers, Location, Type Course, Year Opened

Note that the course name is in the title of the resort. For example, "Pinehurst Resort (No. 2)" the course name is "No. 2". Or Bandon Dunes Golf Resort (Pacific Dunes). The course name is "Pacific Dunes".

The Resort Name is the main part of the title before the course name. In the above examples, "Pinehurst Resort" and "Bandon Dunes Golf Resort" are the resort names.

Go through the entire HTML and extract the necessary information to update the supplied CSV file with the specified format.

For course type, private or public, if the HTML does not specify, leave that field empty.

