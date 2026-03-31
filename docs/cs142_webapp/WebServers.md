# Web Servers
*CS142 Lecture Notes — Mendel Rosenblum*

Every time you open a webpage, a web server quietly accepts your request, fetches the right data, and sends back a response — all in milliseconds. This tutorial unpacks exactly how that works.

---

## Web Application Architecture

### The Three-Layer Model
![Full Stack Web Application Architecture](../../images/Full%20Stack%20Web%20Application%20Architecture.png)

Every web application at its core consists of three connected components:
1. **Web Browser (Client)**,The user's interface. Sends HTTP requests and renders the HTTP responses it receives.
2. **Web Server** : The middleman. Receives requests, applies logic, fetches data, and returns responses. Lives on the Internet or LAN.
3. **Storage System** :Databases, filesystems, caches. The web server talks to storage via the LAN (fast, local network).

HTTP as the Glue Browser and server speak HTTP. 
Server and storage speak SQL or other protocols.

Key insight: The browser never talks directly to the database. The web server acts as a gatekeeper, applying security, business logic, and data formatting.

```
Web Browser  ←——— HTTP ———→  Web Server
                                  ↕
                          Storage System
     Internet                   LAN
```

---

## How Web Servers Work

Browsers speak HTTP and Web Servers speak HTTP:

- **Browsers**: send HTTP requests and receive HTTP responses
- **Web Server**: receives HTTP requests and sends HTTP responses

HTTP is layered on TCP/IP, so a web server operates as follows:

### The Server Loop
A web server never sleeps. It runs an infinite loop, handling one connection after another. Here's exactly what happens on every iteration.

**The Core Loop**: At the heart of every web server is a simple, repeating algorithm:
```
loop forever doing:
    accept TCP connection from browser
    read HTTP request from TCP connection
    process HTTP request
    write HTTP response to TCP connection
    shutdown TCP connection (except if Connection: keep-alive)
```

#### Step by Step
1. Accept TCP Connection
The server listens on port 80 (HTTP) or 443 (HTTPS) and accepts an incoming TCP connection from the browser.

2. Read HTTP Request
The server reads the full HTTP request from the TCP stream — method, URL, headers, optional body.

3. Process the Request
The core work: read a file, run a program, query a database, and build an appropriate response.

4. Write HTTP Response
The server sends back an HTTP response with headers (status, content-type, etc.) followed by the response body.

5. Close or Keep-Alive
By default the TCP connection closes. With Connection: keep-alive it stays open for reuse — faster for multiple assets.


Note: Keep-alive keeps the underlying TCP connection open so it can be reused for multiple requests, avoiding the overhead of opening a new TCP connection each time.

---
### HTTP Over TCP/IP

HTTP doesn't exist in a vacuum — it's layered on top of the TCP/IP networking stack:


| Layer | Protocol | Role |
|---|---|---|
| Application | HTTP/HTTPS | Request/response messages |
| Transport | TCP | Reliable byte streams |
| Network | IP | Routing packets across networks |
| Link | Ethernet/WiFi | Physical/logical data link |


Note on concurrency: A simple single-threaded loop handles one request at a time. Real servers handle thousands of concurrent connections using multi-threading, multi-processing, or async I/O (event loops).


----

### Processing HTTP Requests — File Reads

The simplest type of request a web server handles: "give me this file." This is the foundation of every static website.

**Example: Process HTTP GET `index.html`**
HTTP GET → File Read → Response
When a browser sends GET /index.html, the server executes roughly this logic:

```c
// 1. Open the file from disk
int fd = open("index.html");

// 2. Read its contents into a buffer
int len = read(fd, fileContents, sizeOfFile(fd));

// 3. Send HTTP headers first
write(tcpConnection, httpResponseHeader, headerSize);

// 4. Send the file contents as the body
write(tcpConnection, fileContents, len);
```

#### The Slow Disk Problem
Performance concern: open() and read() must wait for the disk — which is orders of magnitude slower than RAM and CPU.

> **Note:** `open` and `read` may have to talk to a slow disk device.

#### Concurrency: Threads vs Processes
To avoid blocking while one request waits for disk, web servers handle requests concurrently:
> Requests can be processed concurrently by starting a **new thread** or a **new process** per request.

1. Thread per Request
Spawn a new OS thread per connection. Threads share memory — lighter weight. Used by Apache (worker mode), Java servlets.


2. Process per Request
Fork a new OS process per connection. Stronger isolation. Original Apache (prefork). Expensive but robust.

Modern approach: Async/event-driven servers (Node.js, Nginx) use a single thread with non-blocking I/O — no waiting, extremely high throughput.

---

#### Web Servers for JavaScript Frameworks

Most of the web app consists of **simple static files** served by any standard HTTP web server:

- HTML documents (.html)
- CSS stylesheets (.css)
- JavaScript files (.js)
- Images (.jpg, .png, .svg)
- Fonts, videos, PDFs, and other binary assets
  
----------

### Processing HTTP Requests — cgi-bin

Static files only get you so far. For dynamic content — personalized pages, search results, form submissions — servers need to run programs.

**Example: Process HTTP GET of `index.php`**

```c
// Process HTTP GET of index.php
runProgramInNewProcess(tcpConnection);
```

- Template processing program fetches models from the database system.

#### CGI: Common Gateway Interface

CGI is the original mechanism for running programs from a web server. When the server receives a request for a dynamic resource (like a PHP file), it spawns a new process to handle it:


#### What CGI Programs Do

1. Template Processing
Reads an HTML template, fills in dynamic values from the database, outputs final HTML.

2. Database Queries
Fetches model data (users, posts, products) from a DBMS and injects it into the response.


3. Form Processing
Receives POST data from HTML forms, validates it, writes to storage, redirects the browser.

4. Auth & Sessions
Checks cookies/tokens, validates user identity, controls access to protected resources.


**CGI performance drawback**: 
Forking a new process for every single request is expensive. Each new process has to load the interpreter (PHP, Python, Perl), connect to the DB, etc. FastCGI and persistent processes solve this.

---





## 2nd Generation Web App Frameworks

As the web matured, raw CGI scripts became hard to maintain. A new generation of frameworks introduced structure: **the Model-View-Controller pattern**.

### The Controller Pipeline
In 2nd generation frameworks, The web server runs a **controller program** per request:

> Request → Response Pipeline

1. Parse URL & Request Body
   Parse URL and/or HTTP request body to get parameters to view
2. Fetch Model Data:
   Use parameters to fetch model data from DBMS *(typically a SQL relational DBMS)*
3. Run View Template:
   Run HTML view template with model data to generate the HTML
4. Return HTTP Response
   Send an HTTP response with the HTML back to the browser

### Example: Ruby on Rails — A Concrete Example

Rails runs a controller program per URL. 
Example: URL `/rails_intro/hello`



| Component | FILE | Description |
|-----------|-------------|-----------|
| Controller | `hello.rb` | Ruby program that fetches models via ORM |
| View Template | `hello.html.erb` | HTML embedded with Ruby— generates final HTML |
| Assets | .js, .css, images| Included like any static file |

---


### What is an ORM?
An Object-Relational Mapper lets you interact with the database using your programming language's objects instead of writing raw SQL:


```ruby
# Raw SQL (what ORM hides)
SELECT * FROM users WHERE id = 42;

# ActiveRecord ORM (Ruby)
user = User.find(42)
puts user.name
```

### Other 2nd Gen Frameworks

- Ruby on Rails
Convention over configuration. Pioneered MVC for web. Very expressive ORM (ActiveRecord).

- Django (Python)
"Batteries included" framework. Built-in admin, ORM, authentication, templating.

- Laravel (PHP)
Modern PHP framework with elegant MVC. Eloquent ORM. Huge ecosystem.

- Spring MVC (Java)
Enterprise-grade. Dependency injection, AOP, powerful but verbose.



## JavaScript Framework Era

Modern SPAs (Single Page Applications) shift most rendering to the browser. The web server's role changes dramatically — it becomes simpler and more focused.

- JS framework architectures shift rendering to the browser. 
- The server mainly delivers static files (HTML/CSS/JS bundles) and JSON data via API endpoints.


### Two Kinds of Content

1. Static Files (most of the app)
HTML shell, CSS, JavaScript bundles, images, fonts. Any HTTP server can serve these — no special logic needed.

2. API Calls (model data)
JSON data fetched dynamically from the server. Minimal processing — mostly DBMS reads/writes.


### CRUD Operations via API

In the JS framework model, the browser communicates with the server primarily for CRUD operations on model data:

**CRUD** — Create, Read, Update, Delete of model data

| Operation | HTTP Method | Example |
|---|---|---|
| Create | POST | POST /api/users → creates a new user |
| Read | GET | GET /api/users/42 → fetches user #42 |
| Update | PUT / PATCH | PUT /api/users/42 → updates user #42 |
| Delete | DELETE | DELETE /api/users/42 → removes user #42 |


### What's Still on the Server?
🔐 Session management — login, logout, auth tokens (JWT, cookies)
🗄️ Database operations — CRUD on persistent data
🔒 Authorization — "can this user access this resource?"
📧 Background tasks — sending emails, processing uploads, webhooks



### Popular JS Framework Stacks

- React + Node.js
Frontend: React SPA. 
Backend: Express/Fastify API on Node.js. 
Same language end-to-end.


- Vue + Django REST
Vue.js frontend, 
Django REST Framework backend. 
Clean Python API with powerful ORM.


- Angular + Spring Boot
TypeScript throughout. 
Enterprise-grade Java backend, 
strongly typed frontend.


- Next.js / Nuxt.js
Full-stack JS frameworks with SSR + SPA. 
Server and client in one unified project.


Low server requirements: 
Because the browser does the rendering, the web server just needs to serve static files via HTTP GET and handle DBMS operations for model data. Much simpler than server-side rendering!