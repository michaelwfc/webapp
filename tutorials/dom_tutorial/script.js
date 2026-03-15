// "use strict";

/**
jsdom is for server-side HTML parsing (Node.js). For a draggable element in a browser,
you don't need it at all — the browser provides document automatically.
Drop the jsdom import entirely.

import { JSDOM } from "jsdom";
import fs from "fs";

const html = fs.readFileSync("example.html", "utf8");
const dom = new JSDOM(html);
const document = dom.window.document;
*/

// Two global variables. isMouseDown acts as a flag — it's false when the user isn't dragging, true when they are.
// prevX and prevY remember where the mouse was on the previous event, so we can calculate how far it moved.
var isMouseDown = false; // Dragging?
var prevX, prevY;

/**
 * "mousedown"  →  the browser's built-in event (fires when mouse button is pressed)
 * mouseDown()  →  your function that handles it (you named it, you wrote it)
 *
 * The actual event is "mousedown" — that is built into the browser.
 * Your function is the handler (the code that runs in response to the event).
 *
 * Called when the user presses the mouse button down on the div.
 * It snapshots the current mouse position into prevX/prevY, then sets the flag to true to signal that a drag has started.
 * event.pageX and event.pageY are the mouse coordinates relative to the top-left corner of the whole document.
 * @param {*} event
 */
function mouseDown(event) {
  prevX = event.pageX;
  prevY = event.pageY;
  isMouseDown = true;

  console.log(event instanceof MouseEvent); // true
  console.log(event instanceof UIEvent); // true
  console.log(event instanceof Event); // true
  console.log(event.type); // "mousedown"
  console.log(Object.getPrototypeOf(event)); // MouseEvent prototype
}

/**
 * Called when the user releases the mouse button. Simply resets the flag to false — drag is over, mouseMove will now do nothing.
 * @param {*} event
 */
function mouseUp(event) {
  isMouseDown = false;
}

/**
 * Called continuously as the mouse moves over the div. The core logic is in the two assignment lines — here's how they work:

event.pageX - prevX is the delta — how many pixels the mouse moved since the last event. For example, if prevX was 200 and the mouse is now at 215, the delta is +15px.
elem.offsetLeft is the div's current left position in pixels.
Adding them together gives the new position: current position + how much to move.
The + "px" converts the number to a CSS string like "215px", which style.left requires.
After moving the element, prevX and prevY are updated to the current mouse position, ready for the next mouseMove event.

 * @param {
 * } event 
 * @returns 
 */
function mouseMove(event) {
  if (!isMouseDown) {
    return;
  }
  var elem = document.getElementById("div1");
  elem.style.left = elem.offsetLeft + (event.pageX - prevX) + "px";
  elem.style.top = elem.offsetTop + (event.pageY - prevY) + "px";
  prevX = event.pageX;
  prevY = event.pageY;
}
