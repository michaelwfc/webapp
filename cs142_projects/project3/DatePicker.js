"use strict";

/**
The constructor takes an argument consisting of the id attribute for an existing div and a date selection callback function. 
When a date is selected the callback function should be called with the id argument and an object containing the properties month, day, year 
with the number encoding of the date (e.g. {month: 1, day: 30, year: 2016} is the encoding of January 30, 2016).

The object should have a render method that takes one argument consisting of a Date object that selects a particular month (the object can refer to any time within the month). 
When render is invoked it replaces the contents of the date picker's div with HTML that displays a small one-month calendar 
such as those you might see in a travel reservation website:

- The calendar must display the days of the selected month in a grid with one line for each week and one column for each day of the week.
- Weeks run from Sunday on the left to Saturday on the right. The calendar must contain a header row displaying abbreviations for the days of the week, such as "Su", "Mo", etc.
- Each day of the month is displayed as a number.
- Some weeks when displayed in the date picker may contain days not in the selected month. These days should be displayed as the number in their respective month, 
but in a dimmed fashion to indicate they are not part of the current month.
- All weeks displayed should contain at least one day belonging to the current month. Most months will display 5 weeks, but some months may display 4 or 6 depending on the days. 
The number of rows in your calendar should not be fixed.
- The calendar must display the name of the month and year at the top of the calendar. 
In addition, it must display controls such as "<" and ">" that can be clicked to change the calendar's display to the previous or next month.
- Clicking on a valid day of the current month should invoke the callback specified on the constructor with the arguments described above. 
Clicking on days belonging to months other than the current month should not invoke the callback.

Once you have created the JavaScript class, we have provided a file datepicker.html (you do not need to modify this html file) containing two empty div elements,
plus a bit of JavaScript code that invokes the DatePicker class to display a date picker in each of the divs. 
One of the date pickers initially displays the current month and the other displays the month of January 2009. 
It should be possible to change the month of each date picker independently using the controls on that date picker.

The provided html file has no styling so please create a stylesheet with the filename datepicker.css to apply styling to the calendars and make them look nice. 
The corresponding link tag that requires the css file has already been added for you in the html file.

 */

const calendar_html = `<div class="calendar">
  <div class="calendar-header">
    <button id="prev">&lt;</button>
    <div id="monthYear"></div>
    <button id="next">&gt;</button>
  </div>

  <div class="weekdays">
    <div>Sun</div>
    <div>Mon</div>
    <div>Tue</div>
    <div>Wen</div>
    <div>Thu</div>
    <div>Fri</div>
    <div>Sat</div>
  </div>

  <div id="calendarGrid" class="calendar-grid"></div>

</div>
`;

class DatePicker {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
  }
  render(date) {
    // get the DOM element by id
    let container = document.getElementById(this.id);
    container.innerHTML = calendar_html;

    // querySelector: inside a specific element
    const monthYear = container.querySelector("#monthYear");

    if (!(date instanceof Date)) {
      // show the content
      container.textContent = "Hello DatePicker";
      return;
    }

    // set the content of monthYear
    const monthName = date.toLocaleString("default", { month: "long" });
    monthYear.innerText = `${monthName} ${date.getFullYear()}`;

    // first day
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    const prevMonthDays = new Date(
      date.getFullYear(),
      date.getMonth(),
      0,
    ).getDate();

    let cell = [];
    // privious month days
    for (let i = firstDay; i > 0; i--) {
      cell.push({
        day: prevMonthDays - i + 1,
        isCurrentMonth: false,
      });
    }

    // current month days
    for (let i = 1; i < daysInMonth; i++) {
      cell.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    // next month days
    let nextMonthDays = 1;
    while (cell.length % 7 != 0) {
      cell.push({
        day: nextMonthDays,
        isCurrentMonth: false,
      });
      nextMonthDays++;
    }

    // render cells
    const calendarGrid = container.querySelector("#calendarGrid");

    cell.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.textContent = cell.day;

      if (!cell.isCurrentMonth) {
        cellDiv.classList.add("other-month");
      } else {
        cellDiv.classList.add("current-month");
        // add click event
        cellDiv.addEventListener("click", () => {
          // create date object
          const selectedDate = {
            month: date.getMonth() + 1,
            day: cell.day,
            year: date.getFullYear(),
          };

          this.callback(this.id, selectedDate);
        });
      }
      calendarGrid.appendChild(cellDiv);
    });

    // Navigation control
    const prev = container.querySelector("#prev");
    prev.addEventListener("click", () => {
      const prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      this.render(prevDate);
    });
    const next = container.querySelector("#next");
    next.addEventListener("click", () => {
      const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      this.render(nextDate);
    });
  }
}

// var datePicker = new DatePicker("div1", function (id, fixedDate) {
//   console.log(
//     "DatePicker with id",
//     id,
//     "selected date:",
//     fixedDate.month + "/" + fixedDate.day + "/" + fixedDate.year,
//   );
// });
// datePicker.render(new Date("July 4, 1776"));
