"use strict";

/**
Problem 2: Simple Table Template Processing (15 points)
Create a file TableTemplate.js that implements a JavaScript class named TableTemplate with a static method fillIn.

Requirements for the fillIn method:

This method takes three arguments consisting of the id attribute for a <table>, a dictionary object, and a string columnName.
The method must first examine the header row of the table and and replace any text of the form {{property}} with the corresponding property of the dictionary object. 
It then fills in all {{property}} elements in the column specified by columnName if there exists such a column.

The method assumes that the first row of the table holds the column names. You are guaranteed that the column names of the input table are unique.
If no columnName argument is specified, the method should process the entire table.
If the specified columnName is not matched, the method should return without replacing any text in the columns. Note that you should still replace template strings in the header row 
regardless of whether the specified columnName is matched.
For example if you find a td element in the matching column (assuming columnName is specified) that has the text string "The date is the {{day}} day of month {{month}} of the year {{year}}" 
and the dictionary object argument is {month: "January", day: "30", year: "2016"}, you should update the text of the td to be "The date is the 30 day of month January of the year 2016".

Calling TableTemplate.fillIn("table", dict, 'Part Number'), where "table" is the table on the left and dict is a dictionary of strings, should generate the table on the right:



If the template specifies a property that is not defined in the dictionary object the template should be replaced with an empty string. Your system need only handle properly formatted templates. 
Its behavior can be left undefined in the case of nested templates (e.g., {{foo {{bar}}}} or unbalanced {{). You do not need to handle nested tables or complex table cells.

You should use your cs142-template-processor.js solution from project 2 to help you implement the fillIn method. See the script tag ordering in the html file in the project3 directory 
to see how your cs142-template-processor.js code would be loaded.

Beware that browsers insert a <tbody> element around all of the <tr> elements in a table, if the table doesn't already contain a <tbody>.

Once your function has processed the entire table you should examine the visibility property of the table's style and if it is hidden update it to be visible.

Once you have created the JavaScript class, open the file cs142-test-table.html in your browser. This file represents an HTML page containing a sample template table that that will run your code 
and shows what your output should look like. Do not modify this file.
 * 
 */

// Because cs142-template-processor.js loads first, whatever class/function it exports is available as a global by the time TableTemplate.js runs.
class TableTemplate {
  /**
   * @param {string} id         - id of the <table> element
   * @param {object} dict       - dictionary of substitution values
   * @param {string} columnName - (optional) name of column to fill;
   *                              if omitted, fill all columns
   */

  static fillIn(tableId, dict, columnName) {
    // get table element
    const table = document.getElementById(tableId);
    if (!table) return;

    // step 1: process header row
    const headerRow = table.rows[0];
    const headerCells = headerRow.cells; // all <td>/<th> elements in the header row
    for (let i = 0; i < headerCells.length; i++) {
      const cell = headerCells[i];
      let templateProcessor = new Cs142TemplateProcessor(cell.textContent);
      const processedContent = templateProcessor.fillIn(dict);
      cell.textContent = processedContent;
    }

    // step 2: for which columns to process

    let columnIndex = -1; // index of columnName in headerCells, -1 means fill all columns
    if (columnName !== undefined) {
      for (let i = 0; i < headerCells.length; i++) {
        if (headerCells[i].textContent === columnName) {
          columnIndex = i;
          break;
        }
      }
    }
    // columnName was given but not found — leave body rows alone
    if (columnName !== undefined && columnIndex === -1) {
      // if table is hidden, make it visible
      if (table.style.visibility === "hidden") {
        table.style.visibility = "visible";
      }
      return;
    }

    // step 3: process body rows
    // table rows include all rows(header + body) ,so start at index 1
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      if (columnIndex === -1) {
        // no column match, process all columns
        for (let j = 0; j < row.cells.length; j++) {
          const cell = row.cells[j];
          let templateProcessor = new Cs142TemplateProcessor(cell.textContent);
          const processedContent = templateProcessor.fillIn(dict);
          cell.textContent = processedContent;
        }
      } else {
        // column match, process only the specified column
        const cell = row.cells[columnIndex];
        let templateProcessor = new Cs142TemplateProcessor(cell.textContent);
        const processedContent = templateProcessor.fillIn(dict);
        cell.textContent = processedContent;
      }
    }

    // step4: make table visible
    if (table.style.visibility === "hidden") {
      table.style.visibility = "visible";
    }
  }
}
