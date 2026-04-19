# Input and Validation

_CS142 Lecture Notes — Mendel Rosenblum_

Collecting data from users is one of the most common things a web app does — and one of the easiest to get wrong. This tutorial walks you through the full journey: how traditional HTML forms work, why React handles input differently, how to validate data both in the browser and on the server, and how modern single-page apps send data without ever reloading the page. By the end, you'll understand not just how each technique works, but why it exists.

---

## Early Web App Input: HTML Form Tag

Traditional web apps used the HTML `<form>` element:

Before JavaScript frameworks like React existed, every web application collected user input the same way: through the native HTML `<form>` element. Think of a form as a container that bundles up everything the user typed and sends it to the server in one go — like stuffing a letter into an envelope and mailing it.

A form has two essential attributes: action (the URL to send the data to) and method (how to send it). Here's a simple example with a text field, a checkbox, and a submit button:

```html
<form action="/product/update" method="post">
  Product: <input type="text" name="product" /><br />
  Deluxe: <input type="checkbox" name="delux" /><br />
  <input type="submit" value="Submit" />
</form>
```

When the user clicks "Submit", the browser collects all the named inputs and packages them into an HTTP request directed at /product/update.

### **Two submission methods:**

The method attribute controls how the data travels. There are two options, and the difference matters more than it might seem at first.

1. `method="get"` — encodes form fields as query parameters:

With method="get", the form data gets appended directly to the URL as query parameters. You've seen these before — they're the ?key=value parts at the end of a web address. This approach is fine for things like search queries, but bad for sensitive data because the values are visible in the browser's address bar, in server logs, and in browser history.

```js
HTTP GET product/update?product=foobar&delux=on
```

Notice that product=foobar and delux=on are right there in the URL — anyone watching the network or checking browser history can read them.

2. `method="post"` — encodes form fields in the message body:

With method="post", the data is placed in the body of the HTTP request rather than the URL. This keeps it out of the address bar and server logs, making it far more appropriate for passwords, payment details, or any user data you'd rather keep discreet.

```js
HTTP POST product/update
Content-Type: application/x-www-form-urlencoded
product=foobar&delux=on
```

The request body carries the same data, but it's no longer visible in the URL — the Content-Type header tells the server how to decode it.

- Key Takeaway
  HTML forms send data to a server by packaging field values into an HTTP request. Use GET for safe, bookmark-able queries (like search), and POST for actions that change data or handle sensitive information. The difference is where the data travels — in the URL vs. in the request body.

---

## The Classic Server-Side Flow: Rails Pattern

Before single-page applications existed, the standard flow for handling form input was what's called the **POST/Redirect/GET pattern**, popularized by frameworks like Ruby on Rails. Understanding it gives you a mental model for why things work the way they do — even in modern apps.

Imagine signing up for a new account. Here's what happens under the hood in a traditional server-rendered app:

First, your browser makes a GET request to load the signup page. The server responds with an HTML page containing a form. So far, nothing has been submitted — you're just looking at the form.

When you fill in your details and click "Submit", the browser fires a POST request to the server with your form data in the body. This is where the interesting logic happens. The server now has three possible paths:

If everything is valid and the operation succeeds — say, your new account was created — the server doesn't return a page directly. Instead it sends back a redirect telling the browser to make a new GET request for a "success" page. This redirect is deliberate: it ensures that if the user hits the browser's refresh button, they're re-loading the success page (a harmless GET), not re-submitting the form (which would try to create a duplicate account).

If the submitted data fails validation — for example, a required field was blank — the server redirects back to the original form page, this time with the invalid fields highlighted so the user knows exactly what to fix.

If something went wrong on the server's end — a database error, a network timeout — the server redirects to an error page explaining what happened.

Key Takeaway

The POST/Redirect/GET pattern solves a real problem: it prevents duplicate form submissions on browser refresh.

- Success → redirect to a new page.
- Validation failure → redirect back to the form with errors shown.
- Server error → redirect to an error page.

React and single-page apps replace the redirect with in-page state updates, but the same logical flow applies.

### Rails Input Pattern Using Form POST

The classic Rails form flow:

1. **GET** the page containing the form (`method="post"` form points to a POST endpoint)
2. **POST** page — validate and perform the operation (create or update):
   - If **successful** → redirect to a "done" page (another GET)
   - If **validation fails** → redirect back to the GET page with incorrect fields highlighted
   - If **error** → redirect to an error/oops page

---

## Validation Requirements in Web Applications

Validation isn't one thing — it's two things that happen to share the same name. Mixing them up leads to bad decisions about where to put your validation code and how seriously to take each layer. Let's separate them clearly.

### Two Very Different Reasons

There are two distinct reasons to validate input:

#### **1. Protect storage integrity**

Prevent bad, malicious, or malformed data from reaching your database. Required fields, correct data types, security constraints. This is non-negotiable — the server must enforce it.

- Required fields, correct data types, security constraints
- HTTP requests can arrive from anywhere — including outside your app
- **Must be enforced at the web server API level — no exceptions**

#### **2. Provide a good user experience**

Warn users about mistakes as early as possible — ideally while they're still typing, not after they've submitted. The closer to the user, the less frustrating the experience.

- Don't let users make mistakes, or warn them as early as possible
- Pushing validation closer to the user is helpful

Here's the critical insight: these two goals require validation in two different places.

- Protecting your database requires **server-side validation** that runs no matter what.
- Improving UX requires **client-side validation** that runs in the browser in real time. You need both.

### **Two rules for React (and all JavaScript frameworks):**

- **Rule #1:** Still need server-side validation to protect storage system integrity
  Client-side checks can be bypassed. Server-side validation is the real protection for your data. Never treat browser validation as sufficient on its own.

- **Rule #2:** Inform the user about validity problems as early as possible
  The sooner you tell a user something is wrong, the less frustrating the experience. Inline, real-time feedback as they type is far better than a page reload with errors.

Key Takeaway
Validation serves two masters: data integrity (server-side, non-negotiable) and user experience (client-side, real-time). You always need both — client-side validation is a UX convenience, not a security measure. Anyone can bypass it with a direct HTTP request.

---

## Input in ReactJS: Familiar Form Model

### Controlled Components

React uses standard HTML form elements — `<input>`, `<textarea>`, and `<select>` — — but it introduces a new way of thinking about them called **controlled components**.

In a plain HTML form, the DOM is the source of truth. The input field holds its own value, and you read it when the form is submitted. In React, the component's state is the source of truth instead. The input's value is always whatever this.state says it is, and every keystroke updates the state — which then updates the input. It's a continuous loop: state → render → user types → state update → render again.

This might sound like extra work, but it gives you precise control. At any moment, this.state has the exact current value of every input, which makes validation and form submission dramatically simpler.

A React form with text, textarea, and select — all controlled

```jsx
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={this.state.inputValue}   // controlled by state
          onChange={this.handleChangeInput}  // updates state on each keystroke
        />
      </label>
      <label>
        Essay:
        <textarea
          value={this.state.textValue}
          onChange={this.handleChangeText}
        />
      </label>
      <label>
        Pick:
        <select value={this.state.selValue} onChange={this.handleChangeSelect}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Every element's value is driven by this.state, and every onChange handler updates that state. React re-renders the component after each state change, keeping the UI perfectly in sync.

Key Takeaway
In React, form inputs are controlled — their values live in component state, not in the DOM. This gives you a single source of truth for all form data, making validation, conditional logic, and submission straightforward. Every change goes through onChange → setState → re-render.

---

### Input in ReactJS: Handling Events

Now that the form's structure is clear, let's look at the JavaScript that powers it. In a class-based React component, you define event handlers as methods on the class, then wire them up via JSX props like **onChange** and **onSubmit**.

```js
class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // Common approach: push input value into component state
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    // Process submit using this.state
    event.preventDefault(); // Stop the DOM from generating a native POST
  }
}
```

**handleChange** runs on every single keystroke, keeping state in sync.
**handleSubmit** calls event.preventDefault() — without this line, the browser would do its default thing: make a full-page HTTP POST request, losing all your React state.

Key Takeaway
**event.preventDefault()** is essential in React form handlers. Without it, the browser's default form submission takes over and causes a full page reload, wiping out your component's state. Always call it at the top of your onSubmit handler.

---

### JSX and `this` Binding — No Ideal Way

A common gotcha: specifying a method directly as a DOM event callback doesn't work because `this` is undefined:

This is one of the most common gotchas for JavaScript developers learning React, and it trips up nearly everyone at least once. Here's the problem: when you pass a class method as a callback to a DOM event, JavaScript doesn't automatically keep the correct value of this. The method loses its context, and this becomes undefined inside it.

The broken approach — this is undefined when the handler fires

```jsx
// ❌ Wrong — this.formSubmit will be called with this = undefined
<form onSubmit={this.formSubmit}>
```

When the browser calls formSubmit in response to a submit event, it calls it as a plain function — not as a method on the component instance. The result is that this is lost and you'll get a runtime error when you try to call this.setState.

There's no single "correct" fix — React leaves the choice to you. Here are the three standard solutions, each with its own tradeoffs:

**Three solutions:**

#### Option 1: Arrow function in JSX

```jsx
<form onSubmit={event => this.formSubmit(event)}>
```

The arrow function captures this from the surrounding scope. Clean and simple, but creates a new function on every render, which can affect performance in large lists.

#### Option 2: Binding in constructor

```jsx
// In constructor:
this.formSubmit = this.formSubmit.bind(this);
// In JSX:
<form onSubmit={this.formSubmit}>

```

Done once in the constructor, so no new function is created on each render. Slightly more boilerplate, but the most explicit and predictable approach.

#### Option 3: Class field (modern JS)

```jsx
formSubmit = (event) => {
  /* this works correctly here */
};
```

The modern syntax. Arrow functions defined as class fields automatically bind this. Requires a Babel transform (already included in most React setups).

Key Takeaway
Passing a class method as a DOM callback loses this. Fix it with one of three approaches: an inline arrow function in JSX, binding in the constructor, or defining the method as a class field arrow function. Choose one and stick to it — consistency matters more than which option you pick.

---

### Validation in ReactJS

React is **unopinionated** about validation — many packages and approaches exist.

**Example library: [Formik](https://formik.org/)** — handles form setup, validation methods, and error reporting.

For teams that want a battle-tested solution, libraries like Formik handle all the boilerplate: tracking which fields have been touched, running validation functions, and rendering error messages. This is a great starting point for complex forms.

**Custom validation approach** — run arbitrary JavaScript in the `handleChange` handler:

if you want to understand what's happening under the hood — or if your validation logic is simple — you can write it yourself directly in the handleChange handler. Since handleChange runs on every keystroke, you can validate as the user types and update the UI immediately:

```js
handleChange(event) {
   // Run your validation logic against the new value and current state
  if (this.validateIt(event.target.value, this.state)) {
    this.setState({ renderValidationError: true });
  }
  else{
  this.setState({ renderValidationError: false });}

  // Always update the value — don't block typing, just show an error
  this.setState({ value: value });

}
```

Arbitrary JavaScript can inspect `event.target.value` and `this.state`, then call `setState` to trigger a re-render with validation feedback.

Setting **renderValidationError: true** in state triggers a re-render. Your render method can then show or hide an error message based on that flag — the user sees feedback the instant they make a mistake.

Key Takeaway
React validation is flexible — you can use a library like Formik or write it yourself in handleChange. Because controlled components update state on every keystroke, you can validate in real time and show errors immediately, without waiting for the user to submit the form.

---

### Asynchronous Validation

Some validation requires a **round-trip to the server**, for example: checking whether a username is already taken.


Some validation simply cannot happen in the browser alone — because the answer lives on the server. The most common example is checking whether a username is already taken. Your client-side code has no way of knowing what names are in the database without asking.

The solution is asynchronous validation: while the user is typing, the browser quietly sends a request to the server in the background and waits for the answer. If the server says the name is taken, the UI shows an error — all without the user ever clicking Submit.

A library like React-AutoSuggest takes this idea further by not just validating, but actively suggesting valid options as the user types — turning a validation problem into a discovery feature:

**Example: Autocomplete with [React-AutoSuggest](https://react-autosuggest.js.org/)**

```jsx
<Autosuggest
  suggestions={suggestions}
  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
  getSuggestionValue={getSuggestionValue}
  renderSuggestion={renderSuggestion}
  inputProps={inputProps}
/>
```

**onSuggestionsFetchRequested** is called as the user types — it's where you'd make an API call to fetch matching options. The component handles debouncing and rendering the dropdown automatically.




The general trend is towards using **recommendation systems** for input guidance — suggesting valid values rather than waiting for the user to make an error.


The broader trend in modern web apps is shifting from "block the user until they get it right" toward "guide the user toward valid input." Autocomplete, suggestions, and real-time availability checks are all expressions of this philosophy.


Key Takeaway
Some validation requires a server round-trip — for example, checking username availability. This is done asynchronously in the background while the user types, keeping the UI responsive. The modern approach goes even further: rather than waiting for errors, proactively suggest valid options as the user types.


---

## Single Page App Input
Traditional form submission causes a full page reload — the browser packages the data, sends it to the server, and then loads whatever the server sends back. In a single-page application (SPA), this would destroy all your React component state and feel jarring to the user. SPAs need a different approach.


Instead of a form POST with a redirect, SPAs use **XMLHttpRequest** (or a library) to perform POST/PUT without a page reload.
React is **unopinionated** — many options exist. A popular choice is **[Axios](https://axios-http.com/)** — a promise-based HTTP client for both browser and Node.js:


The solution is to send data using JavaScript in the background, using **XMLHttpRequest** or a library that wraps it. The most popular library for this in the React ecosystem is **Axios** — a promise-based HTTP client that works in both the browser and Node.js.

### Axios  APIs 
Axios exposes a clean API that maps directly to HTTP methods:


```js
axios.get(url);  //Fetch data from the server
axios.delete(url); // Request deletion of a resource
axios.post(url, body); // Send new data to create a resource
axios.put(url, body); //Send data to update an existing resource
```

---

### Axios Model Fetch

Every Axios call returns a Promise — a JavaScript object that represents a value that isn't available yet. You chain .then() to handle a successful response, and .catch() to handle errors:

```js
axios
  .get(URLpath)
  .then((response) => {
    // response.status      — HTTP status code (e.g. 200)
    // response.statusText  — HTTP status text (e.g. "OK")
    // response.data        — Response body, JSON-parsed automatically
     this.setState({ users: response.data });
  })
  .catch((err) => {
     // err.response.status  — e.g. 404, 500
    // err.response.data    — error details from the server
    // !err.response        — no response at all (network error)
     console.error('Request failed:', err);
  });
```
Axios automatically parses the JSON response body into a JavaScript object — you never have to call JSON.parse() yourself. Non-2xx status codes (like 404 or 500) automatically land in the .catch() block.



**Alternative error handling** — second argument to `.then()`:

```js
axios.get(URLpath).then(
  (response) => { /* success */ },
  (err)      => { /* error   */   },
);
```
This style is functionally similar but subtly different: errors thrown inside the success callback won't be caught by the second argument. Use .catch() at the end of the chain for broader error coverage.

---

### Axios Model Uploading

Sending data to the server — for a new comment, a photo upload, a registration — uses axios.post(). You pass the URL and a plain JavaScript object; Axios serializes it to JSON automatically:


```js
axios
  .post(URLpath, objectWithParameters)
  .then((response) => {
    // response.status      — HTTP status code (e.g. 200)
    // response.statusText  — HTTP status text (e.g. "OK")
    // response.data        — Response body, JSON-parsed automatically
    this.setState({ comments: [...this.state.comments, response.data] });
  })
  .catch((err) => {
    // err.response.{status, data, headers} — Non-2xx HTTP response
    // if !err.response — No reply at all; check err.request
  });
```

The object you pass as the second argument is automatically serialized to JSON and sent as the request body. The server reads it with something like req.body in Express (assuming express.json() middleware is set up).

Key Takeaway
Single-page apps replace full-page form submissions with background HTTP requests using Axios (or similar libraries). Axios returns Promises — chain .then() for success and .catch() for errors. It handles JSON serialization and parsing automatically, so you work with plain JavaScript objects throughout.

---

## Server-Side Validation

**Regardless of browser validation, the server must check everything.**

It is trivially easy to access a server API directly, bypassing all browser-side validation. Client-side validation is only a UX convenience.

No matter how thorough your client-side validation is, the server must always validate again. This isn't redundancy for its own sake — it's a fundamental security requirement. Anyone with basic technical knowledge can send an HTTP request directly to your API, completely bypassing your React form, your JavaScript validation, and every check you've built in the browser.

Think of client-side validation like the bouncer at the door of a club — friendly, fast, and good for most cases. Server-side validation is the ID check behind the bar. You need both, but only the second one is actually enforcing the rules.


### Schema-level validation with Mongoose

If you're using MongoDB with Mongoose, you can attach validator functions directly to your schema fields. These validators run every time a document is saved, regardless of where that save was triggered from:

**Mongoose allows validator functions** on schema fields:

Mongoose schema validator — enforcing a phone number format at the database layer
```js
var userSchema = new Schema({
  phone: {
    type: String,
    // Returns true if valid, false if not
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: "{VALUE} is not a valid phone number!",
    },
  },
});
```

If the validator returns false, Mongoose rejects the save operation and returns the error message. This happens at the database layer — no invalid data reaches persistent storage, even if someone bypasses every other check.

---

### Some Integrity Enforcement Requires Special Code: When schema validators aren't enough

Not everything can be expressed as a simple field validator. Examples requiring custom logic:

- Maintaining **relationships between objects** (e.g. referential integrity)
- Enforcing **resource quotas**

Some integrity rules are too complex for a simple field validator. They require custom application logic because they involve relationships between multiple objects or cross-cutting concerns:




**Examples related to the Photo App:**

- Only the **author** or an **admin** user can delete a photo comment
- A user can only upload **50 photos** unless they have a premium account

**Relationship enforcement**
Imagine a photo comment — only the person who wrote it, or an admin, should be able to delete it. A field validator on the comment schema can't know who is making the request. You need application-level code that checks the logged-in user's ID against the comment's author field before allowing the delete.

**Resource quotas**
If free-tier users can only upload 50 photos, you can't encode that as a schema validator on a single photo document. You need to count how many photos the user already has before allowing a new upload. This is application logic, not schema logic.


Key Takeaway
Server-side validation is non-negotiable. Schema-level validators (like Mongoose's validate) are great for field format checks. But rules involving relationships between objects, user permissions, or resource quotas require custom application code. Always assume that any data arriving at your API could have been crafted by hand — validate accordingly.

