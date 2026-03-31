# Controller/Server Communication

**CS142 Lecture Notes — Mendel Rosenblum**

Master how controllers fetch models from servers — covering AJAX, REST, Promises, async/await, WebSockets, RPC, and GraphQL.

---

## 1. Controller's Role in MVC

```
View       ->    Controller   ->  AJAX Request    ->   WebServer
(Need Data)    (Fetch model)     (XMLHttpRequest)    (Return Json)
```

🧩 Controller's Role

- The **Controller's** job is to fetch the model for the view from the server.

- May have other server communication needs (e.g. authentication services)
- The browser is already talking to a web server — ask it for the model

📜 History of AJAX

- **Early approach:** have the browser perform an HTTP request for the model
  - People at Microsoft liked XML, so the DOM extension was named: `XMLHttpRequest`
- Allowed JavaScript to make HTTP requests without inserting DOM elements
- Widely used and called **AJAX** — Asynchronous JavaScript and XML
- Since it uses an HTTP request, it can carry XML _or anything else_
  - More often used with **JSON**

Key Insight: AJAX (XMLHttpRequest) is just a regular HTTP request made by JavaScript in the background — no page reload required.

---

## 2. XMLHttpRequest

XMLHttpRequest is the low-level API that enables HTTP requests from JavaScript. It uses an event-based model.

### Sending a Request

```js
xhr = new XMLHttpRequest();
xhr.onreadystatechange = xhrHandler;
xhr.open("GET", url); // Any HTTP method works: GET, POST, PUT, DELETE
xhr.send(); // Fires the request
```

- Any HTTP method (`GET`, `POST`, etc.) is possible
- Responses/errors come in as events

### Event Handling

```js
function xhrHandler(event) {
  // this === xhr
  if (this.readyState != 4) {
    // DONE
    return;
  }
  if (this.status != 200) {
    // OK
    return; // Handle error ...
  }
  let text = this.responseText;
  let data = JSON.parse(text); // Modern: parse as JSON
}
```

### readyState Values

| State | Constant         | Description                                  |
| ----- | ---------------- | -------------------------------------------- |
| 0     | UNSENT           | open() has not been called yet               |
| 1     | OPENED           | send() has been called                       |
| 2     | HEADERS_RECEIVED | Headers and status are available             |
| 3     | LOADING          | Downloading; responseText holds partial data |
| 4     | DONE             | The operation is complete                    |

---

### Traditional AJAX Use Patterns

Note:

- Old-school AJAX patterns to avoid:
  `Setting elem.innerHTML = xhr.responseText (HTML response) or using eval(xhr.responseText) (JS response)`
- Modern approach — Response is model data (JSON): parse JSON with JSON.parse()

  ```js
  JSON.parse(xhr.responseText);
  ```

---

### Fetching Models with XMLHttpRequest

📥 Response Formats

- responseText — raw string
- responseXML — XML document
- Can also set/read request/response headers

🔗 Encoding the Model in the Request

- URL path: /userModel/78237489/fullname
- Query params: ?id=78237489
- Request body: POST with form-encoded data

URL path:

```js
xhr.open("GET", "userModel/78237489/fullname");
```

Query params:

```js
xhr.open("GET", "userModel?id=78237489&type=fullname");
```

Request body:

```js
xhr.open("POST", url);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send("id=78237489&type=fullname");
```

---

## 3. REST APIs

**REST (Representational State Transfer)** provides design guidelines for web app-to-server communication. Introduced in a 2000 PhD dissertation, it became the dominant API style.

### 🏛 Core REST Principles

- Server exports resources with unique names (**URIs**)
  - Collection URI: http://example.com/photo/
  - Resource URI: http://example.com/photo/78237489
- Servers should be **stateless** \
  - Support easy load balancing across web servers
  - Allow caching of resources
- HTTP methods map to **CRUD** operations on resources specified in the URL

### HTTP Methods → CRUD

Server supports a set of HTTP methods mapping to **Create, Read, Update, Delete (CRUD)** on resource specified in the URL

| HTTP Method | CRUD Operation | Description     |
| ----------- | -------------- | --------------- |
| GET         | Read           | Read resource   |
| PUT         | Update         | Update resource |
| POST        | Create         | Create resource |
| DELETE      | Delete         | Delete resource |

### 📐 REST API Design Process

1: Define the resources of the service and give them unique names (URIs) (Photos, Users, Comments…)
2: Have clients Map CRUD operations to HTTP methods
3: Extend where needed (e.g. transactions across multiple resources)

Honest Assessment:
REST has good ideas but doesn't work for everything. It works best for straightforward resource operations. Complex operations (fetching many resources at once, transactions) often need to extend or break REST conventions.

---

Great question! Here's how they relate and how to use them together.

### XMLHttpRequest and REST APIs — The Relationship

**XMLHttpRequest (XHR) is the _transport mechanism_; REST is the _design convention_.**

Think of it this way: REST tells you _what_ to request and _how to structure_ the URL and HTTP method. XHR (or Axios/fetch) is the JavaScript tool you use to actually _send_ that request from the browser.

They operate at different levels:

- **REST** = a set of rules for designing your API (use nouns as URLs, map CRUD to HTTP methods, keep the server stateless)
- **XHR** = the browser API that physically sends HTTP requests and receives responses

They don't _require_ each other — you can use XHR to call a non-RESTful endpoint, and a REST API can be consumed by curl, Postman, or any HTTP client. But in web apps, **XHR is the classic tool for consuming REST APIs from a browser controller.**

---

### How to Use Them Together

The pattern is straightforward — you pick the right HTTP method for the operation you want, then fire it with XHR:

**REST Read → XHR GET**

```javascript
xhr.open("GET", "/photos/78237489");
xhr.send();
// No body needed — the resource is identified by the URL
```

**REST Create → XHR POST**

```javascript
xhr.open("POST", "/photos");
xhr.setRequestHeader("Content-type", "application/json");
xhr.send(JSON.stringify({ caption: "Sunset", url: "..." }));
```

**REST Update → XHR PUT**

```javascript
xhr.open("PUT", "/photos/78237489");
xhr.setRequestHeader("Content-type", "application/json");
xhr.send(JSON.stringify({ caption: "Updated caption" }));
```

**REST Delete → XHR DELETE**

```javascript
xhr.open("DELETE", "/photos/78237489");
xhr.send();
```

---

### In Practice: Use Axios, Not Raw XHR

Raw XHR is verbose. Your lecture notes are clear that the modern approach — especially in React — is to use **Axios**, which wraps XHR and adds Promise support, automatic JSON parsing, and cleaner error handling:

```javascript
// Read
const response = await axios.get("/photos/78237489");
console.log(response.data); // already parsed JSON

// Create
await axios.post("/photos", { caption: "Sunset", url: "..." });

// Update
await axios.put("/photos/78237489", { caption: "Updated" });

// Delete
await axios.delete("/photos/78237489");
```

Axios uses XHR under the hood — so the REST-to-HTTP mapping is exactly the same, just with far less boilerplate.

---

### The Mental Model

```
REST API Design          XHR / Axios (the tool)
─────────────────        ──────────────────────
GET  /photos         →   axios.get("/photos")
POST /photos         →   axios.post("/photos", data)
PUT  /photos/:id     →   axios.put("/photos/123", data)
DELETE /photos/:id   →   axios.delete("/photos/123")
```

REST defines the _contract_; XHR/Axios _fulfills_ it. Your Controller's job is to know the REST contract of your server and use Axios to execute it, then hand the resulting model data to the View.

## Promises

### Promises vs Callbacks
Callbacks are the traditional way to handle async code — but they have serious problems. Promises are a cleaner alternative.

#### 😤 Problems with Callbacks

- Out-of-order execution — code runs in non-obvious order

  ```js
  fs.ReadFile(fileName, function (error, fileData) {
    console.log("Got error", error, "Data", fileData);
  });
  console.log("Finished reading file");
  <!-- What order to the console.log statements appear? -->
  ```

- Pyramid of Doom — deeply nested callbacks are hard to read

  ```js
  fs.ReadFile(fileName, function (error, fileData) {
    doSomethingOnData(fileData, function (tempData1) {
      doSomethingMoreOnData(tempData1, function (tempData2) {
        finalizeData(tempData2, function (result) {
          doneCallback(result); // ← buried 4 levels deep!
        });
      });
    });
  });
  ```

- Scattered control flow — logic jumps between functions

  ```js
  fs.ReadFile(fileName, readDone);
  function readDone(error, fileData) {
    doSomethingOnData(fileData, doSomeDone);
  }
  function doSomeDone(someData) {
    doSomethingMoreOnData(someData, doSomeMoreDone);
  }
  function doSomeMoreDone(someMoreData) {
    finalizeData(someMoreData, doneCallback);
  }
  ```

#### 💡 The Promise Idea

Instead of passing a callback, return a promise that will be filled in when operation done:

- Doesn't need to wait until you need the promise to be filled in
- Still using callbacks - - under the covers

```
BEFORE (callback)
doSomething(args, doneCallback);
↓
AFTER (promise)
let donePromise = doSomething(args);
// Filled in when operation completes
```

#### then() - Waiting on a promise

Get the value of a promise (waiting if need be) with then

```js
donePromise.then(
  function (value) {
    // value is the promised result when successful
  },
  function (error) {
    // Error case
  },
);
```

#### Promises

- Note no Pyramid of Doom
- Every variable is a promise
  - A standard usage: Every variable - If `thenable` call then() on it otherwise just use the variable as is.

```js
let myFile = myReadFile(fileName);
let tempData1 = myFile.then(function (fileData) {
  return doSomethingOnData(fileData);
});
let finalData = tempData1.then(function (tempData2) {
  return finalizeData(tempData2);
});
return finalData;
```

#### Chaining Promises (No Pyramid!)

Promise → Callback: Easy — just call .then(callbackFunc): Waiting on a promise
Get the value of a promise (waiting if need be) with `then`

```js
return myReadFile(fileName)
  .then(function (fileData) {
    return doSomethingOnData(fileData);
  })
  .then(function (data) {
    return finalizeData(data);
  })
  .catch(errorHandlingFunc);
```

Add in ES6 JavaScript arrow functions:
```js
return (
  myReadFile(fileName)
    // fileData is the promised result when successful
    // doSomethingOnData is the callback function, called when promise is fulfilled
    .then((fileData) => doSomethingOnData(fileData))
    .then((data) => finalizeData(data))
    .catch(errorHandlingFunc)
);
```

#### Promise VS Callback
- Easy to go from Promise to Callback: Just call .then(callbackFunc) 
  `axios.get(url).then(callback)`
- Going from Callback to Promise requires creating a Promise 
  let newPromise = new // calls  Promise( function (fulfill, reject) { fulfill (value) to have promise return value // calls reject });


Callback → Promise: Wrap with new Promise(function(fulfill, reject) {...})

```js
function myReadFile(filename) {
  return new Promise(function (fulfill, reject) {
    fs.readFile(filename, function (err, res) {
      if (err) reject(err);
      else fulfill(res);
    });
  });
}
```
------------------

### What do resolve and reject mean?
   
```js
new Promise(function(resolve, reject) {
  //                ↑         ↑
  //         "I succeeded"  "I failed"
  //         call this to   call this to
  //         return a value  signal an error
});
```

Think of a Promise like an IOU note:
```
new Promise created
      │
      │ time passes... (network request, file read, etc.)
      │
      ├── resolve({ data })  → Promise is FULFILLED ✅
      │                         .then(result => ...) runs
      │
      └── reject({ status }) → Promise is REJECTED ❌
                                .catch(err => ...) runs
```

Concrete example:

```js
function fetchModel(url) {
  return new Promise(function(resolve, reject) {

    // SUCCESS case
    resolve({ data: { name: "John" } });
    // caller gets: .then(result => result.data.name) → "John"

    // FAILURE case
    reject({ status: 404, statusText: "Not Found" });
    // caller gets: .catch(err => err.status) → 404

  });
}

// How the caller uses it:
fetchModel("/user/1")
  .then(result => console.log(result.data))   // resolve value lands here
  .catch(err  => console.log(err.status));    // reject value lands here

```

 -------------------





## 4. Axios

React frameworks prefer higher-level HTTP clients over raw XMLHttpRequest. Axios is the most popular — a **Promise-based** wrapper that's cleaner and more powerful.

### ⚡ Why Axios?

- Promise-based — no callback nesting
- Automatically serializes/deserializes JSON
- Works in browser and Node.js
- Similar browser-native API: fetch()

### Axios CRUD Methods

```js
// REST Read (GET)
let result = axios.get(URL);

// REST Create (POST) — object is JSON-encoded into body
let result = axios.post(URL, object);

// REST Update (PUT)
let result = axios.put(URL, object);

// REST Delete (DELETE)
let result = axios.delete(URL);
```

### Handling Responses

```js
result = axios
  .get(URL) // Note: no callback specified!  It's a Promise
  .then((response) => {
    // response.status     → e.g. 200
    // response.statusText → e.g. "OK"
    // response.data       → parsed JSON body
    console.log(response.data);
  })
  .catch((err) => {
    // err.response.{status, data, headers}
    // Non-2xx: err.response.{status, data, headers}
    // No reply: inspect err.request
    console.error(err);
  });
```

Note: axios.get(URL) returns a Promise — no callback is specified inline. You chain .then() to handle the result. This brings us to the next section: Promises.

### Axios vs Flask / FastAPI / Tornado

#### The Core Difference

**Axios** is a **client-side HTTP tool** — it _sends_ requests from the browser.

**Flask / FastAPI / Tornado** are **server-side frameworks** — they _receive and handle_ those requests on the server.

They sit on **opposite ends** of the same connection:

```
Browser (JavaScript)          Network          Server (Python)
─────────────────────         ───────          ───────────────
axios.get("/photos")    →→→→→→→→→→→→→→→→→→    Flask / FastAPI / Tornado
                        ←←←←←←←←←←←←←←←←←←    returns JSON response
```

Axios is the _caller_. Flask/FastAPI/Tornado is the _answerer_.

---

#### What Each One Actually Does

**Axios (JavaScript, browser)**

- Runs inside the user's browser
- Sends HTTP requests to a server
- Receives and parses the response
- Hands data to your React/JS controller

**Flask / FastAPI / Tornado (Python, server)**

- Runs on a remote machine (or localhost in dev)
- Listens for incoming HTTP requests
- Executes business logic, queries databases, etc.
- Returns a response (usually JSON)

---

#### A Concrete Example

Here's the full round-trip — Axios on the front end, FastAPI on the back end:

**Frontend (JavaScript + Axios):**

```javascript
// Controller asks for photo 123
const response = await axios.get("/photos/123");
console.log(response.data); // { id: 123, caption: "Sunset" }
```

**Backend (Python + FastAPI):**

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/photos/{photo_id}")
def get_photo(photo_id: int):
    # query DB, do logic...
    return { "id": photo_id, "caption": "Sunset" }
```

Axios fires the GET request → FastAPI catches it, runs the Python function, returns JSON → Axios delivers that JSON to your JS code.

---

#### So What Is the Python Equivalent of Axios?

If you want the Python _equivalent_ of Axios — something that _sends_ HTTP requests — that would be the **`requests`** library (or `httpx` for async):

```python
import requests

# This is the Python equivalent of axios.get()
response = requests.get("http://example.com/photos/123")
data = response.json()
```

| Role                               | JavaScript       | Python                  |
| ---------------------------------- | ---------------- | ----------------------- |
| **Send HTTP requests** (client)    | Axios, fetch     | `requests`, `httpx`     |
| **Receive HTTP requests** (server) | Express, Fastify | Flask, FastAPI, Tornado |

---

#### How Flask, FastAPI, and Tornado Differ From Each Other

They all play the same _role_ (server framework), but have different personalities:

**Flask** — Minimal and flexible. You add what you need. Great for small APIs and learning.

```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.get("/photos/<int:id>")
def get_photo(id):
    return jsonify({ "id": id, "caption": "Sunset" })
```

**FastAPI** — Modern, fast, async-first. Auto-generates API docs. Type-safe via Pydantic. The current industry favorite for new Python APIs.

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/photos/{id}")
async def get_photo(id: int):
    return { "id": id, "caption": "Sunset" }
```

**Tornado** — Built for high-concurrency and real-time use cases (like WebSockets). Less common for pure REST APIs today.

```python
import tornado.web

class PhotoHandler(tornado.web.RequestHandler):
    def get(self, id):
        self.write({ "id": id, "caption": "Sunset" })
```

---

#### The Big Picture

The full stack looks like this:

```
┌─────────────────────────────────┐
│  BROWSER                        │
│  React View                     │
│  ↕ (calls)                      │
│  JS Controller                  │
│  ↕ (uses)                       │
│  Axios  ──── HTTP request ────► │
└─────────────────────────────────┘
                                  │
                          ┌───────▼───────────────────┐
                          │  SERVER (Python)          │
                          │  Flask / FastAPI /Tornado │
                          │  ↕ (queries)              │
                          │  Database                 │
                          └───────────────────────────┘
```

Axios and Flask/FastAPI/Tornado are partners, not competitors — one sends, the other receives.

---


### async/await with Axios

- async function - Declare a function to return a Promise 
  `async function returnOne() { // returns a Promise   return 1; } `
- await - Resolve the promise and returns its value 
  `let one = await returnOne(); console.log(one);              // Prints 1 `
- await only valid inside of async function functions

- async and await makes it easier to use promises

```js
async function doIt(fileName) {
  // file, data, moreData are regular variables!
  // doIt() itself returns a Promise
  let file = await ReadFile(fileName);
  let data = await doSomethingOnData(file);
  let moreData = await doSomethingMoreOnData(data);
  return finalizeData(moreData);
}
```

Under the hood: async/await still uses Promises and breaks the function into internal callbacks at each await point. It's purely syntactic sugar — but much easier to read and reason about.


Example:

```js
async function fetchUser(id) {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (err) {
    console.error("Failed:", err);
  }
}
```

---

## WebSockets

Beyond standard HTTP requests, the web platform offers WebSockets for real-time bidirectional communication and the classic Remote Procedure Call pattern.

```js
// Event-based interface like XMLHttpRequest:
let socket = new WebSocket("ws://www.example.com/socketserver");

socket.onopen = function (event) {
  socket.send(JSON.stringify(request)); // Send JSON message
};

socket.onmessage = function (event) {
  JSON.parse(event.data); // Receive JSON message
};
```


---



## RPC(Remote Procedure Call)

- Traditional distributed computation — calling a function on a remote machine.
Can be done over HTTP (POST) or WebSockets.

  - Browser packages arguments into a message to the web server
  - Function is invoked on the server with those arguments
  - Return value is sent back to the browser

- Allows arbitrary code to be run on server 
  - handles complex, multiple resource operations
  - Reduces round-trip messages and simplifies failure handling

- Can result in more complex to use interface compared to REST 
  - Need to document the API (i.e. functions and calling sequence)

- RPC can be done over HTTP (e.g. POST) or WebSockets
---

## GraphQL

GraphQL is a trending alternative to REST, created by Facebook. It addresses several REST limitations — especially the need to fetch entire models in one query.

✅ Like REST
- Server exports resources that the client can fetch
- Client/server separation
- Stateless communication

⚡ Unlike REST
- Server exports a schema describing resources and queries
- Client specifies exactly which fields it needs
- Fetch from multiple resources in a single request

Standard protocol from Facebook. Client specifies exactly which properties it wants.
Can fetch from many different resources in one request.

### GRAPHQL — Example Query
```js
// # Fetch user + their photos in ONE request
query {
  user(id: "78237489") {
    name
    email
    photos {
      id
      url
      caption
    }
  }
}
📈
```

📈 Why GraphQL is Gaining Popularity
- No over-fetching — client asks for exactly what it needs
- No under-fetching — get related resources in one request
- Mutations provide an RPC-like interface for updates
- Self-documenting via the exported schema
- Gives a program-accessible backend — a proper API

### Summary — API Styles Compared:
REST: Simple CRUD on resources. Works for most cases.
RPC: Call server functions. Great for complex ops.
GraphQL: Query exactly what you need from any resource combination.



Great questions. Let me address both clearly.

---


## XMLHttpRequest vs WebSocket  vs RPC
🔄 XMLHttpRequest / fetch
- Standard HTTP request/response
- Works over HTTP/HTTPS
- XHR is strictly client-initiated — the server can never send data unless the browser asks first.
- Good for REST APIs
- Supported everywhere


⚡ WebSockets
- Full TCP connection
- Bidirectional pipes
- Server can push data
- Good for real-time apps
- Uses ws:// or wss://

📞 RPC
- Call functions on server
- Handles complex operations
- Fewer round trips
- Over HTTP or WebSockets
- Requires API docs

### 1. Server-Push (the biggest one)

XHR is **strictly client-initiated** — the server can *never* send data unless the browser asks first.

```
XHR:         Browser ──request──► Server
                     ◄──response── Server
             (done. server is silent until next request)

WebSocket:   Browser ──request──► Server   (handshake)
                     ◄──message──  Server  ✓ server pushes!
                     ──message──►  Server  ✓ client pushes!
                     ◄──message──  Server  ✓ server pushes again!
                     (connection stays open indefinitely)
```

Real-world use cases XHR simply *cannot* handle:
- **Live chat** — server pushes new messages to all clients
- **Stock tickers** — price updates without polling
- **Multiplayer games** — position updates from other players
- **Collaborative editing** — seeing someone else type in real-time
- **Live notifications** — "you have a new email"

---

### 2. Persistent Connection (no per-request overhead)

Every XHR request goes through a full HTTP handshake cycle. WebSockets do **one** handshake and keep the pipe open:

```
XHR (repeated requests):
  connect → request → response → disconnect
  connect → request → response → disconnect   ← overhead every time
  connect → request → response → disconnect

WebSocket:
  connect (once) → message → message → message → message → ...
                                                  ↑ no reconnect cost
```

This matters a lot for high-frequency data (games, trading, sensors).

---

### 3. RPC — Arbitrary Server-Side Logic in One Call

XHR + REST is great for CRUD on a *single resource*. But what if you need to do something that touches many resources atomically — like "transfer money from account A to account B and log the transaction"?

```
REST approach (XHR):          RPC approach:
  GET  /accounts/A             call transferMoney(A, B, amount)
  GET  /accounts/B             ← one round trip
  PUT  /accounts/A  (debit)    ← one function, runs entirely on server
  PUT  /accounts/B  (credit)   ← server handles atomicity & failure
  POST /transactions
  ← 5 round trips, client must handle partial failures
```

RPC lets you say **"run this function on the server"** rather than choreographing multiple resource operations from the client.

---

## Streaming

This is a nuanced area — let me be precise.

### XHR *does* have partial streaming (readyState 3)

From your lecture notes, `readyState 3 = LOADING` means `responseText` holds **partial data**. So technically XHR can read chunks as they arrive — but it's awkward and not designed for it.

### The modern streaming answer: `fetch()` + ReadableStream

The **`fetch` API** (the modern replacement for XHR) has **first-class streaming support** via `ReadableStream`:

```javascript
const response = await fetch("/api/stream");
const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log("chunk:", new TextDecoder().decode(value));
}
```

This is how **OpenAI / Claude streaming responses** work in the browser — the server sends tokens one by one, and `fetch` reads each chunk as it arrives without waiting for the full response.

### WebSockets for streaming

WebSockets can also stream, but it's **message-based**, not byte-stream-based:

```javascript
socket.onmessage = (event) => {
  // each "chunk" is a discrete message the server chose to send
  appendToken(event.data);
};
```

### Summary table

| Capability | XHR | `fetch` | WebSocket |
|---|---|---|---|
| Client-initiated request | ✅ | ✅ | ✅ |
| Server-push | ❌ | ❌ | ✅ |
| Persistent connection | ❌ | ❌ | ✅ |
| Streaming response | ⚠️ awkward | ✅ native | ✅ message-based |
| Bidirectional | ❌ | ❌ | ✅ |
| Works with REST | ✅ | ✅ | ❌ (different model) |
| Overhead per message | high | high | very low |

**Bottom line:**
- Use **XHR / fetch / Axios** for standard REST calls (most of your app)
- Use **fetch streaming** for LLM-style token streaming or large file downloads
- Use **WebSockets** when the *server* needs to push data, or you need persistent low-latency bidirectional communication