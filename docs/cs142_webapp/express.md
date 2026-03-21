# Express.js
*CS142 Lecture Notes — Mendel Rosenblum*

---

## What is Express.js?

Express.js is a thin layer on top of Node.js that makes building web servers significantly easier.

Express.js is a **fast, unopinionated, minimalist web framework** for Node.js. It sits as a relatively thin layer on top of base Node.js functionality.

### What a web server implementor needs

- **Speak HTTP**: Accept TCP connections, process HTTP requests, send HTTP replies — Node's HTTP module does this
- **Routing**: Map URLs to the web server function for that URL — needs to support a routing table (like React Router)
- **Middleware support**: Allow request processing layers to be added in — makes it easy to add custom support for sessions, cookies, security, compression, etc.

---

## Basic Setup

```js
let express = require('express');
let expressApp = express(); // module uses factory pattern

// expressApp object has methods for:
// - Routing HTTP requests
// - Rendering HTML (e.g. run a preprocessor like Jade templating engine)
// - Configuring middleware and preprocessors

expressApp.get('/', function (httpRequest, httpResponse) {
  httpResponse.send('hello world');
});

expressApp.listen(3000); // default address localhost use port 3000
```

---

## Express Routing

### Route by HTTP Method

```js
expressApp.get(urlPath, requestProcessFunction);
expressApp.post(urlPath, requestProcessFunction);
expressApp.put(urlPath, requestProcessFunction);
expressApp.delete(urlPath, requestProcessFunction);
expressApp.all(urlPath, requestProcessFunction);   // matches all HTTP methods
```

- Many other less frequently used methods exist
- `urlPath` can contain parameters like React Router (e.g. `'/user/:user_id'`)

---

## The `httpRequest` Object

```js
expressApp.get('/user/:user_id', function (httpRequest, httpResponse) { ... });
```

The request object has a large number of properties. Middleware (like JSON body parser, session manager, etc.) can add additional properties.

| Property | Description |
|---|---|
| `request.params` | Object containing URL route params (e.g. `user_id`) |
| `request.query` | Object containing query params (e.g. `&foo=9` → `{foo: '9'}`) |
| `request.body` | Object containing the parsed body |
| `request.get(field)` | Returns the value of the specified HTTP header field |

---

## The `httpResponse` Object

```js
expressApp.get('/user/:user_id', function (httpRequest, httpResponse) { ... });
```

The response object has methods for setting HTTP response fields. Methods return the response object so they can be **chained**.

| Method | Description |
|---|---|
| `response.write(content)` | Build up the response body with content |
| `response.status(code)` | Set the HTTP status code of the reply |
| `response.set(prop, value)` | Set the response header property to value |
| `response.end()` | End the request by responding to it |
| `response.end(msg)` | End the request by responding with `msg` |
| `response.send(content)` | Do a `write()` and `end()` |

**Chaining example:**
```js
response.status(code).write(content1).write(content2).end();
```

---

## Middleware

Middleware gives other software the ability to **interpose on requests**.

### Using route-based middleware
```js
expressApp.all(urlPath, function (request, response, next) {
  // Do whatever processing on request (or setting response)
  next(); // pass control to the next handler
});
```

### Applying middleware globally
```js
expressApp.use(function (request, response, next) { ... });
```

### Common middleware use cases
- Check if user is logged in; otherwise send error response and don't call `next()`
- Parse the request body as JSON and attach the object to `request.body`, then call `next()`
- Session and cookie management, compression, encryption, etc.

---

## Example: Simple Web Server (Project #4)

```js
let express = require('express');
let app = express(); // Creating an Express "App"

app.use(express.static(__dirname)); // Adding middleware

app.get('/', function (request, response) { // A simple request handler
  response.send('Simple web server of files from ' + __dirname);
});

app.listen(3000, function () { // Start Express on the requests
  console.log('Listening at http://localhost:3000 exporting the directory ' + __dirname);
});
```

---

## Example: Model Fetching Routes (Project #5)

```js
app.get('/user/list', function (request, response) {
  response.status(200).send(cs142models.userListModel());
  return;
});

app.get('/user/:id', function (request, response) {
  let id = request.params.id;
  let user = cs142models.userModel(id);
  if (user === null) {
    console.log('User with _id:' + id + ' not found.');
    response.status(400).send('Not found');
    return;
  }
  response.status(200).send(user);
  return;
});
```

---

## A Simple Model Fetcher — Reading from a JSON File

```js
expressApp.get("/object/:objid", function (request, response) {
  let dbFile = "DB" + request.params.objid;
  fs.readFile(dbFile, function (error, contents) {
    if (error) {
      response.status(500).send(error.message);
    } else {
      let obj = JSON.parse(contents); // JSON.parse accepts Buffer types
      obj.date = new Date();
      response.json(obj); // shorthand for setting Content-Type and sending JSON
    }
  });
});
```

> **Note:** Always make sure you call `end()` or `send()`.

---

## Fetching Multiple Models (Async Pattern)

```js
app.get("/commentsOf/:objid", function (request, response) {
  let comments = [];

  fs.readFile("DB" + request.params.objid, function (error, contents) {
    let obj = JSON.parse(contents);
    async.each(obj.comments, fetchComments, allDone);
  });

  function fetchComments(commentFile, callback) {
    fs.readFile("DB" + commentFile, function (error, contents) {
      if (!error) comments.push(JSON.parse(contents));
      callback(error);
    });
  }

  function allDone(error) {
    if (error) response.status(500).send(error.message);
    else response.json(comments);
  }
});
```
