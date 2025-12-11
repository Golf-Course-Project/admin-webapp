---
name: 'create-csv-from-html'
description: 'This custom agent will extract the required information from the provided HTML and create a CSV file with the specified format.'
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runSubagent']
---
I would like you to go thru this supplied HTML from a Golfweek article about the top courses. Pull out CourseName, Ranking, Designers (which is Architects), Location, Type Course, Year Opened and put them this csv file. Match that exact format. The CourseId column will be emtpy. So each row would start with an empty value followed by a comma. For example...

,Course Name, Ranking, Designers, Location, Type Course, Year Opened

Go through the entire HTML and extract the necessary information to create a CSV file with the specified format. Put the CSV file into the `.imports` folder. Follow the naming conveentiun of the existing files in that folder, such as `golfweek_top_courses.csv`.