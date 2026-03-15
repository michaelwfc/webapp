# Document Object Model (DOM)

_CS142 Lecture Notes — Mendel Rosenblum_

---

The **Document Object Model (DOM)** is a programming interface that represents an HTML (or XML) document as a tree of JavaScript objects. When a browser loads a webpage, it parses the HTML and builds this tree structure in memory — giving JavaScript a live, manipulable representation of the page.

Think of it as the bridge between your HTML and your JavaScript code.

---

### Browser JavaScript Interface to HTML Document

HTML documents are exposed as a collection of JavaScript objects and methods — this is the **Document Object Model (DOM)**.

- JavaScript can query or modify the HTML document
- Accessible via the JavaScript global scope, with aliases:
  - `window`
  - `this` (when not using `'use strict'`)

### DOM Hierarchy

- Rooted at `window.document` (the `<html>` tag), following the HTML document structure
- `window.document.head`
- `window.document.body`
- Tree nodes (DOM objects) have ~250 properties, most private
- Objects (representing elements, raw text, etc.) share a common set of properties and methods called a DOM **Node**

## How the DOM is Structured

The DOM is a hierarchy rooted at `window.document`. Every HTML element, text node, and attribute becomes a **Node** in this tree.

For example, `<p>Sample <b>bold</b> display</p>` becomes:

```
P
├── #text "Sample "
├── B
│   └── #text "bold"
└── #text " display"
```

Each node has properties like `parentNode`, `firstChild`, `nextSibling`, and methods like `getAttribute()` / `setAttribute()`.

---

## DOM Node Properties and Methods

- **Identification**: `nodeName` is the element type (uppercase: `P`, `DIV`, etc.) or `#text`
- **Hierarchical structure**: `parentNode`, `nextSibling`, `previousSibling`, `firstChild`, `lastChild`
- **Accessor/mutator methods**: e.g. `getAttribute()`, `setAttribute()`

### Example: `<p>Sample <b>bold</b> display</p>`

```
P (nodeType: 1, Element)
├── #text "Sample "   (nodeType: 3, firstChild)
├── B (nodeType: 1)
│   └── #text "bold" (nodeType: 3, firstChild/lastChild)
└── #text " display"  (nodeType: 3, lastChild)
```

## Commonly Used Node Properties/Methods

| Property/Method                     | Description                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| `textContent`                       | Text content of a node and its descendants. E.g., `P` node → `"Sample bold display"`          |
| `innerHTML`                         | HTML syntax of the element's descendants. E.g., `P` node → `"Sample <b>bold</b> display"`     |
| `outerHTML`                         | Like `innerHTML` but includes the element itself. E.g., `"<p>Sample <b>bold</b> display</p>"` |
| `getAttribute()` / `setAttribute()` | Get or set an element's attribute                                                             |

---

# Key Ways to Use the DOM in Web Development

## **1. Finding elements/Accessing DOM Nodes**

```javascript
document.getElementById("header");
document.querySelector(".btn-primary");
document.querySelectorAll("li");
```

**Walk the DOM hierarchy** (not recommended):

```javascript
element = document.body.firstChild.nextSibling.firstChild;
element.setAttribute(…)
```

**Use DOM lookup by id** (preferred):

```html
<div id="div42">...</div>
```

```javascript
element = document.getElementById("div42");
element.setAttribute(…)
```

Other lookup methods: `getElementsByClassName()`, `getElementsByTagName()`, and more — these can also start from any element:

```javascript
document.body.firstChild.getElementsByTagName();
```

```javascript
element.textContent = "Hello!";
element.innerHTML = "Click <b>here</b>";
```

## 2. Reading and changing element content

```javascript
element.textContent = "Hello!";
element.innerHTML = "This text is <i>important</i>";
// Replaces content, retains attributes, updates DOM Node structure
```

## 3. DOM and CSS Interactions

**Change an `<img>` src (e.g. toggle on click):**

```javascript
img.src = "newImage.jpg";
```

**Toggle visibility (e.g. expandable sections, modals):**

```javascript
element.style.display = "none"; // Invisible
element.style.display = ""; // Visible
element.className = "active"; // apply CSS class
element.style.color = "#ff0000"; // **Update element's style** (not preferred):
```

**Query DOM by CSS selector:**

```javascript
document.querySelector();
document.querySelectorAll();
```

---

## **4. Reacting to user events**

```javascript
button.addEventListener("click", () => {
  modal.style.display = ""; // show a modal
});
```

## **5. Changing the Node Structure: Creating and removing elements dynamically**

**Create a new element:**

```javascript
const li = document.createElement("li");
element = document.createElement("P");
// or
element = document.createTextNode("My Text");
// or clone an existing node:
element = existingNode.cloneNode();
```

**Add to an existing element:**

```javascript
parent.appendChild(element);
// or
parent.insertBefore(element, sibling);
```

**Remove a node:**

```javascript
node.removeChild(oldNode);
```

> Note: Setting `innerHTML` is often simpler and more efficient.

## **6. Positioning and layout**

```javascript
element.style.position = "absolute";
element.style.left = "50px";
element.style.top = "100px";
// Read dimensions:
console.log(element.offsetWidth, element.offsetHeight);
```

### DOM Coordinate System

- Screen origin is at the **upper left**; Y increases downward
- An element's position is determined by the **upper-left outside corner of its margin**
- Read location with `element.offsetLeft`, `element.offsetTop`
- Coordinates are relative to `element.offsetParent`, which is **not necessarily the same as `element.parentNode`**

---

### Positioning Elements

By default, elements are positioned automatically by the browser as part of the document flow.

**To position explicitly:**

```javascript
element.style.position = "absolute"; // anything but "static"
element.style.left = "40px";
element.style.top = "10px";
```

- `"absolute"` — the element no longer occupies space in the document flow
- The origin inside an `offsetParent` (for positioning descendants) is just inside the upper-left corner of its border

---

### Positioning Context

Each element has an `offsetParent` (some ancestor element). When an element is positioned, coordinates like `element.style.left` are relative to its `offsetParent`.

- Default `offsetParent` is the `<body>` element
- Some elements define a **new positioning context**:
  - `position: absolute` — element is explicitly positioned
  - `position: relative` — element is positioned automatically by the browser in the usual way
- Such elements become the `offsetParent` for all descendants (unless overridden by another positioning context)

### Positioning Example

```html
<!-- div2 creates a positioning context (position: relative) -->
<div id="div2">
  <p>div2</p>
  <div id="div2-1">
    <p>div2-1</p>
  </div>
</div>
```

```css
#div2 {
  width: 300px;
  height: 200px;
  position: relative;
  background: #d0e0ff;
}
#div2-1 {
  width: 150px;
  height: 80px;
  position: absolute;
  top: 50px;
  left: 100px;
  background: #d0e0ff;
}
```

> `div2-1` is positioned relative to `div2` (its `offsetParent`).

```html
<!-- div3 does NOT create a positioning context -->
<div id="div3">
  <p>div3</p>
  <div id="div3-1">
    <p>div3-1</p>
  </div>
</div>
```

```css
#div3 {
  width: 300px;
  height: 200px;
  background: #ffffe0;
}
#div3-1 {
  width: 150px;
  height: 80px;
  position: absolute;
  top: 50px;
  left: 100px;
  background: #ffffe0;
}
```

> `div3-1` is positioned relative to `<body>` (the default `offsetParent`), so it escapes `div3`.

---

### Element Dimensions

**Reading dimensions** (includes contents, padding, border, but **not** margin):

```javascript
element.offsetWidth;
element.offsetHeight;
```

**Updating dimensions:**

```javascript
element.style.width = "200px";
element.style.height = "100px";
```

---

---

---

## More DOM Operations

**Redirect to a new page:**

```javascript
window.location.href = "newPage.html";
// Note: may terminate JavaScript script execution
```

**Communicate with the user:**

```javascript
console.log("Reached point A"); // Message to browser log
alert("Wow!");
confirm("OK?"); // Popup dialogs
```

---

---

# Events

## DOM Communicates to JavaScript with Events

The key mental model is this — the browser is constantly watching everything that happens (mouse, keyboard, network, timers, DOM changes).
Your job as a developer is just to **declare which events you care about** and **what to do when they happen**:

```
User/Browser action
       ↓
Browser detects event
       ↓
Browser checks: is there a listener registered for this event on this element?
       ↓ yes
Browser calls your handler function with an Event object
       ↓
Your code runs (move element, update text, fetch data, etc.)
```

### **Event types:**

- **Mouse-related**: mouse movement, button click, enter/leave element
- **Keyboard-related**: key down, key up, key press
- **Focus-related**: focus in, focus out (blur)
- **Input field changed**, form submitted
- **Timer events**
- **Miscellaneous**:
  - Content of an element has changed
  - Page loaded/unloaded
  - Image loaded
  - Uncaught exception

---

### Event Handling

Creating an event handler requires specifying 3 things:

1. **What happened** — the event of interest
2. **Where it happened** — an element of interest
3. **What to do** — the JavaScript to invoke when the event occurs on the element

---

### Specifying the JavaScript of an Event

**Option 1 — inline in the HTML:**

```html
<div onclick="gotMouseClick('id42'); gotMouse=true;">...</div>
```

**Option 2 — from JavaScript using the DOM:**

```javascript
element.onclick = mouseClick;
// or
element.addEventListener("click", mouseClick);
```

> The `addEventListener` pattern is an example of the powerful **listener/emitter pattern**.

---

### Event Object

Event listener functions are passed an `Event` object (typically sub-classed as `MouseEvent`, `KeyboardEvent`, etc.).

| Property        | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `type`          | Name of the event (`'click'`, `'mouseDown'`, `'keyUp'`, …) |
| `timeStamp`     | Time the event was created                                 |
| `currentTarget` | Element that the listener was registered on                |
| `target`        | Element that dispatched the event                          |

### Deciding Which Handler(s) Are Invoked

When elements are nested or overlapping, multiple handlers may apply. For example, clicking on `xyz` in:

```html
<body>
  <table>
    <tr>
      <td>xyz</td>
    </tr>
  </table>
</body>
```

If handlers are registered on `td`, `tr`, `table`, and `body` — which ones get called?

- Sometimes only the **innermost** element should handle the event
- Sometimes it's more convenient for an **outer** element to handle it

---

## The inheritance chain of Events

### The Inheritance Chain

```
Event                          ← base class (all events)
  └── UIEvent                  ← events from user interface interactions
        └── MouseEvent         ← events from mouse actions
              └── "mousedown"  ← a specific instance of MouseEvent
```

`"mousedown"` is not itself a class — it is a **specific event type** that gets instantiated as a `MouseEvent` object. So more precisely:

- `MouseEvent` is a subclass of `UIEvent`
- `UIEvent` is a subclass of `Event`
- When `"mousedown"` fires, the browser creates a **`MouseEvent` instance** with `type: "mousedown"`

---

### Visualising the Properties Each Layer Adds

Each level in the chain inherits everything above it and adds its own properties:

```javascript
// Event (base) — every event has these
event.type; // "mousedown"
event.target; // element that was clicked
event.timeStamp; // when it happened
event.bubbles; // does it bubble up?
event.stopPropagation(); // method: stop bubbling
event.preventDefault(); // method: cancel default behaviour

// UIEvent — adds info about the user interface
event.view; // the window object
event.detail; // click count (1 for single, 2 for double click)

// MouseEvent — adds mouse-specific info
event.pageX; // ← what your mouseDown() uses
event.pageY; // ← what your mouseDown() uses
event.screenX;
event.screenY;
event.clientX;
event.clientY;
event.button; // which mouse button
event.ctrlKey; // was Ctrl held?
event.shiftKey; // was Shift held?
```

Because `MouseEvent` inherits from `UIEvent` which inherits from `Event`, a `mousedown` event object has **all of the above** — you can access `event.type` (from `Event`), `event.detail` (from `UIEvent`), and `event.pageX` (from `MouseEvent`) on the same object.

---

### You Can Verify This in the Browser Console

```javascript
div.addEventListener("mousedown", function (event) {
  console.log(event instanceof MouseEvent); // true
  console.log(event instanceof UIEvent); // true
  console.log(event instanceof Event); // true

  console.log(event.type); // "mousedown"
  console.log(Object.getPrototypeOf(event)); // MouseEvent prototype
});
```

---

### The Full Event Class Family

`MouseEvent` is just one branch. Here is how the broader event class tree looks:

```
Event
  ├── UIEvent
  │     ├── MouseEvent
  │     │     ├── "mousedown"
  │     │     ├── "mouseup"
  │     │     ├── "mousemove"
  │     │     ├── "click"
  │     │     └── "dblclick"
  │     │
  │     ├── KeyboardEvent
  │     │     ├── "keydown"
  │     │     ├── "keyup"
  │     │     └── "keypress"
  │     │
  │     └── FocusEvent
  │           ├── "focus"
  │           └── "blur"
  │
  ├── InputEvent
  │     └── "input"
  │
  └── CustomEvent          ← for your own custom events (more below)
        └── "my-event"
```

---

### Bonus — You Can Also Create Your Own Custom Events

Since `CustomEvent` is a subclass of `Event`, you can define and dispatch your own:

```javascript
// Create a custom event
const myEvent = new CustomEvent("my-event", {
  detail: { message: "hello!", value: 42 }, // attach any data you want
});

// Listen for it
div.addEventListener("my-event", function (event) {
  console.log(event.detail.message); // "hello!"
  console.log(event.detail.value); // 42
});

// Fire it manually
div.dispatchEvent(myEvent);
```

This is useful when you want different parts of your code to communicate through events — the same pattern the browser itself uses, but for your own application logic.

---

## MouseEvent

### `MouseEvent` types

```javascript
const div = document.getElementById("div1");

div.addEventListener("click", (e) => console.log("clicked"));
div.addEventListener("mousedown", (e) => console.log("button pressed"));
div.addEventListener("mouseup", (e) => console.log("button released"));
div.addEventListener("mousemove", (e) =>
  console.log(`mouse at ${e.pageX}, ${e.pageY}`),
);
div.addEventListener("mouseenter", (e) => console.log("mouse entered element"));
div.addEventListener("mouseleave", (e) => console.log("mouse left element"));
```

### `MouseEvent` properties (inherits from `Event`):

| Property             | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `button`             | Mouse button that was pressed                                  |
| `pageX`, `pageY`     | Mouse position relative to the top-left corner of the document |
| `screenX`, `screenY` | Mouse position in screen coordinates                           |

```javascript
// This is roughly what the browser builds and passes to you
event = {
  // WHERE the mouse is
  pageX: 215,        // pixels from left edge of the document
  pageY: 340,        // pixels from top edge of the document
  screenX: 430,      // pixels from left edge of the physical screen
  screenY: 520,      // pixels from top edge of the physical screen
  clientX: 215,      // pixels from left edge of the visible viewport
  clientY: 290,      // pixels from top edge of the visible viewport

  // WHICH button was pressed
  button: 0,         // 0 = left, 1 = middle, 2 = right

  // WHAT element was clicked
  target: <div#div1>,        // the element the user clicked on
  currentTarget: <div#div1>, // the element the listener is attached to

  // WHEN it happened
  timeStamp: 1734123456789,

  // OTHER info
  type: "mousedown",
  ctrlKey: false,    // was Ctrl held?
  shiftKey: false,   // was Shift held?
  altKey: false,     // was Alt held?
}
```

### Example: Draggable Rectangle

**HTML/CSS:**

```html
<style>
  #div1 {
    position: absolute;
  }
</style>

<div
  id="div1"
  onmousedown="mouseDown(event);"
  onmousemove="mouseMove(event);"
  onmouseup="mouseUp(event);"
>
  Drag Me!
</div>
```

**JavaScript:**

```javascript
var isMouseDown = false; // Dragging?
var prevX, prevY;

function mouseDown(event) {
  prevX = event.pageX;
  prevY = event.pageY;
  isMouseDown = true;
}

function mouseUp(event) {
  isMouseDown = false;
}

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
```

---

## KeyboardEvent

Keyboard events are usually registered on document rather than a specific element, because keyboard input isn't tied to where the mouse is.

### `KeyboardEvent` types (inherits from `Event`):

```javascript
document.addEventListener("keydown", (e) => console.log(`key down: ${e.key}`));
document.addEventListener("keyup", (e) => console.log(`key up: ${e.key}`));
document.addEventListener("keypress", (e) =>
  console.log(`char code: ${e.charCode}`),
);
```

### `KeyboardEvent` properties (inherits from `Event`):

| Property   | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `keyCode`  | Identifier for the keyboard key pressed (not necessarily an ASCII character) |
| `charCode` | Integer Unicode value corresponding to the keypress, if there is one         |

---

## Focus Events

```javascript
const input = document.getElementById("myInput");

input.addEventListener("focus", (e) => console.log("input focused"));
input.addEventListener("blur", (e) => console.log("input lost focus"));
```

## Input & Form Events

input fires on every keystroke; change fires only when the field loses focus after a change.

```javascript
const input = document.getElementById("myInput");
const form = document.getElementById("myForm");

input.addEventListener("change", (e) =>
  console.log(`value changed to: ${e.target.value}`),
);
input.addEventListener("input", (e) =>
  console.log(`live value: ${e.target.value}`),
);

form.addEventListener("submit", (e) => {
  e.preventDefault(); // stops the page from reloading
  console.log("form submitted");
});
```

## Capturing and Bubbling Events

### Capture phase ("trickle-down")

- Starts at the outermost element and works **down** to the innermost nested element
- Each element can stop the capture so its children never see the event:

```javascript
event.stopPropagation();
element.addEventListener(eventType, handler, true); // true = capture phase
```

### Bubble phase

- Invokes handlers on the **innermost** nested element first (usually the right thing)
- Then repeats on its parent, grandparent, etc.
- Any element can stop the bubbling:

```javascript
event.stopPropagation();
element.addEventListener(eventType, handler, false); // false = bubble phase
```

> Most `on*` handlers (e.g. `onclick`) use the **bubble** phase. Notable exceptions: `onfocus` / `onblur` do not bubble.
> Handlers in the bubble phase are more common than in the capture phase.

---

## Timer Events

Timer events work differently — they aren't DOM events, they're scheduled directly by calling browser functions:

**Run a function once, after a delay:**

```javascript
const timeoutToken = setTimeout(myFunc, 5 * 1000); // calls myFunc after 5 seconds
```

**Run a function repeatedly at an interval:**

```javascript
const intervalToken = setInterval(myFunc, 50); // calls myFunc every 50 milliseconds
```

**Cancel a timer:**

```javascript
clearTimeout(timeoutToken);
clearInterval(intervalToken);
```

> Used for animations, automatic page refreshes, etc.

---

## Event Concurrency

- Events are **serialized** and processed one at a time
- Event handling does **not** interleave with other JavaScript execution:
  - Handlers run to completion
  - No multi-threading
- Makes reasoning about concurrency easier — locks are rarely needed
- Background processing is harder than with threads

---

## Event-Based Programming is Different

- Must **wait** for someone to invoke your code
- Must **return quickly** from the handler (otherwise the application will lock up)
- Key is to maintain control through events:
  - Make sure you have declared enough handlers
  - Last resort is a timer
- Node.js uses an event dispatching engine in JavaScript for server-side programming

---

# Real-World Use Cases

| Use case                      | DOM technique                                                  |
| ----------------------------- | -------------------------------------------------------------- |
| Form validation               | Read input values, show/hide error messages                    |
| Modals & dropdowns            | Toggle `display: none` / `""`                                  |
| Infinite scroll / pagination  | `appendChild()` new content as user scrolls                    |
| Drag and drop                 | Read `offsetLeft`/`offsetTop`, update `style.left`/`style.top` |
| Theme switching               | Update `className` on `<body>`                                 |
| Single-page apps (React, Vue) | Frameworks manage the DOM for you via a _virtual DOM_          |

---

## Dom & Modern frameworks

Modern frameworks like **React**, **Vue**, and **Angular** abstract direct DOM manipulation away by maintaining a _virtual DOM_ — a lightweight copy they diff and sync with the real DOM efficiently. So while you may not write `document.getElementById` day-to-day, understanding the DOM is fundamental to understanding how those frameworks work under the hood.

---

# Debugging the DOM in VScode

Great question! Here are the main ways to debug browser JavaScript from VS Code.

---

## Method 1 — VS Code + Browser Debugger (Recommended)

VS Code has a built-in debugger that can connect directly to Chrome or Edge.

### Step 1 — Install the Extension

Search for and install **"Debugger for Chrome"** (or it may already be built in as **"JavaScript Debugger"** in newer VS Code versions).

### Step 2 — Create a Launch Configuration

In VS Code, go to **Run → Add Configuration**, or create `.vscode/launch.json` manually:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "file": "${workspaceFolder}/example.html"
    }
  ]
}
```

### Step 3 — Set a Breakpoint in `script.js`

Click the **red dot** in the gutter next to the line you want to pause at:

```javascript
function mouseDown(event) {
  prevX = event.pageX; // ← click gutter here to set breakpoint
  prevY = event.pageY;
  isMouseDown = true;
}
```

### Step 4 — Start Debugging

Press **F5** (or Run → Start Debugging). VS Code opens Chrome and connects to it.

### Step 5 — Trigger the Event

Click the mouse button on the div in the browser. VS Code will **pause execution** at your breakpoint and you can inspect everything:

```
VARIABLES panel shows:
  event       → MouseEvent { pageX: 215, pageY: 340, ... }
  event.pageX → 215
  event.pageY → 340
  prevX       → undefined  (before line runs)
  prevX       → 215        (after line runs)
```

---

### What You Can Do While Paused

Once paused at a breakpoint, VS Code gives you full control:

```
F5   → Continue (resume running until next breakpoint)
F10  → Step Over (run current line, move to next)
F11  → Step Into (jump inside a function call)
F9   → Toggle breakpoint on/off
```

And in the **Debug Console** at the bottom you can type any expression live:

```javascript
> event.pageX
215
> event.pageY
340
> event instanceof MouseEvent
true
> event.type
"mousedown"
```

---

## Method 2 — `console.log` (Quickest for Simple Cases)

No setup needed — just add logs directly in your function:

```javascript
function mouseDown(event) {
  console.log("mouseDown fired!");
  console.log("event object:", event);
  console.log("pageX:", event.pageX, "pageY:", event.pageY);
  console.log("button pressed:", event.button); // 0=left, 1=middle, 2=right

  prevX = event.pageX;
  prevY = event.pageY;
  isMouseDown = true;

  console.log("state after:", { prevX, prevY, isMouseDown });
}
```

Open the browser's **DevTools Console** (F12 → Console tab) to see the output as you click.

---

## Method 3 — `debugger` Statement (No Extension Needed)

Add the `debugger` keyword directly in your code — it acts like a breakpoint:

```javascript
function mouseDown(event) {
  debugger; // ← browser pauses here automatically
  prevX = event.pageX;
  prevY = event.pageY;
  isMouseDown = true;
}
```

Open browser DevTools (F12) first, then click the div. The browser pauses at `debugger` and you get a full inspector inside DevTools — hover over any variable to see its value.

> Remove `debugger` statements before deploying to production — they will pause your app for real users if DevTools is open.

---

## Method 4 — Browser DevTools Breakpoints (No VS Code Needed)

You can set breakpoints directly in the browser without VS Code:

1. Open DevTools → **Sources** tab
2. Find `script.js` in the file tree
3. Click the line number next to `prevX = event.pageX` — a blue marker appears
4. Click the div — browser pauses at that line

---

## Quick Comparison

| Method               | Setup                     | Best for                              |
| -------------------- | ------------------------- | ------------------------------------- |
| VS Code debugger     | `launch.json` + extension | Full debugging, stepping through code |
| `console.log`        | None                      | Quick value checks                    |
| `debugger` statement | None                      | One-off pauses without setup          |
| Browser DevTools     | None                      | Debugging without VS Code             |

For actively developing and debugging `mouseDown`, the recommended flow is **VS Code debugger (Method 1)** for stepping through logic, combined with **`console.log` (Method 2)** for quick sanity checks on values like `event.pageX` and `event.pageY`.
