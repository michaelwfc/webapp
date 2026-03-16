# CS142 Lecture Notes - Front End Programming

_Mendel Rosenblum_

---

## Brief History of Web Applications

- Initially: static HTML files only with HTML forms for input
- **Common Gateway Interface (CGI)**
  - Certain URLs map to executable programs that generate web pages
  - Program exits after web page is complete
  - Introduced the notion of **stateless servers**: each request independent, no state carried over from previous requests (made scale-out architectures easier)
  - Perl typically used for writing CGI programs

---

## First-Generation Web App Frameworks

_Examples: PHP, ASP.net, Java Servlets_

- Incorporate language runtime system directly into the web server
- **Templates**: mix code and HTML — HTML/CSS describes the view
- Web-specific library packages:
  - URL handling
  - HTML generation
  - Sessions
  - Interfacing to databases

---

## Second-Generation Frameworks

_Examples: Ruby on Rails, Django_

- **Model-View-Controller**: stylized decomposition of applications
- **Object-Relational Mapping (ORM)**: simplify the use of databases (make database tables and rows appear as classes and objects)
  - Easier fetching of dynamic data

---

## Third-Generation Frameworks

_Example: AngularJS_

- JavaScript frameworks running in browser — more app-like web apps
  - Interactive, quick-responding applications — don't need server round-trip
- Frameworks not dependent on particular server-side capabilities
  - Node.js — server-side JavaScript
  - No-SQL databases (e.g. MongoDB)
- Many concepts of previous generations carry forward:
  - Model-View-Controller
  - Templates — HTML/CSS view description

---

## Model-View-Controller (MVC) Pattern

- **Model**: manages the application's data
  - JavaScript objects. _Photo App: user names, pictures, comments, etc._
- **View**: what the web page looks like
  - HTML/CSS. _Photo App: view users, view photo with comments_
- **Controller**: fetch models and control view, handle user interactions
  - JavaScript code. _Photo App: DOM event handlers, web server communication_

> MVC pattern has been around since the late 1970s — originally conceived in the Smalltalk project at Xerox PARC.

---

## View Generation

- Web apps ultimately need to generate HTML and CSS
- **Templates** are a commonly used technique:
  - Write an HTML document containing parts of the page that are always the same
  - Add bits of code that generate the parts computed for each page
  - The template is expanded by executing code snippets, substituting results into the document
- **Benefits of templates** (compared with direct JavaScript-to-DOM programming):
  - Easy to visualize HTML structure
  - Easy to see how dynamic data fits in
  - Can be rendered on either server or browser

### AngularJS View Template (HTML/CSS)

```html
<body>
  <div class="greetings">Hello {{models.user.firstName}},</div>
  <div class="photocounts">
    You have {{models.photos.count}} photos to review.
  </div>
</body>
```

Angular has a rich templating language (loops, conditions, subroutines, etc.).

---

## Controllers

Third-generation: JavaScript running in the browser.

**Responsibilities:**

- **Connect models and views**
  - Server communication: fetch models, push updates
- **Control view templates**
  - Manage the view templates being shown
- **Handle user interactions**
  - Buttons, menus, and other interactive widgets

### AngularJS Controller (JavaScript Function)

```javascript
function userGreetingView($scope, $modelService) {
  $scope.models = {};
  $scope.models.users = $modelService.fetch("users");
  $scope.models.photos = $modelService.fetch("photos");

  $scope.okPushed = function okPushed() {
    // Code for ok button pushing
  };
}
```

Angular creates `$scope` and calls the controller function when the view is instantiated.

---

## Model Data

- All non-static information needed by view templates or controllers
- Traditionally tied to the application's database schema
  - **Object-Relational Mapping (ORM)** — a model is a table row
- Web application model data needs are specified by the view designers, but must be persisted by the database
- **Conflict**: database schemas don't like changing frequently, but web application model data might

### Angular / Mongoose Example

Angular provides support for fetching data from a web server via **REST APIs** and **JSON**.

On the server, **Mongoose's Object Definition Language (ODL)** defines models:

```javascript
var userSchema = new Schema({
  firstName: String,
  lastName: String,
});

var User = mongoose.model("User", userSchema);
```

---

## Fourth-Generation Frameworks

_Examples: React.js, Vue.js, Angular (v2)_

- Many concepts of previous generations carry forward:
  - JavaScript in browser
  - Model-View-Controllers
  - Templates
- **Focus on JavaScript components** rather than pages/HTML
  - Views apps as assembled reusable components rather than pages
  - Software engineering focus: modular design, reusable components, testability, etc.
- **Virtual DOM**
  - Renders the view into a DOM-like data structure (not the real DOM)
  - Benefits: performance, server-side rendering, native apps
