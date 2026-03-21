# CS142 Lecture Notes - Node.js

**Instructor:** Mendel Rosenblum

---

A deep dive into Node.js — the event-driven, non-blocking JavaScript runtime built on Chrome's V8 engine. Learn the patterns that power modern web servers.

## What is Node.js?

Node.js takes **Chrome's V8 JavaScript engine** — the one powering your browser — and runs it on the server. The result: the same JavaScript language, everywhere.
The JavaScript runtime that brought JS to the server


- Takes a JavaScript engine from a browser (Chrome's **V8 JavaScript Engine**)
  - Same JavaScript on both browser and server
  - No DOM needed on the server
- Includes DOM-like **events** and an event queue
  - Everything runs as a call from the event loop
- Makes **event interface** to all **OS operations**
  - Wraps all OS blocking calls (file and socket/network I/O)
  - Adds data handle support
- Adds a proper module system (predated `import/export`)
  - Each module gets its own scope (not everything in `window`)
  
Terminology:
- V8 Engine : Chrome's high-performance JavaScript engine, now running server-side
- Event Loop : Single-threaded loop that processes events and callbacks asynchronously
- No Blocking : All I/O is non-blocking — Node never waits, it callbacks
- npm: Node Package Manager, Massive ecosystem of reusable modules for virtually any task

## Threads versus Events
Two fundamentally different models for handling concurrency



### Thread-based approach (blocking)
- Traditional servers use threads — each request gets a thread that blocks while waiting for I/O. 
```js
request = readRequest(socket);
reply = processRequest(request);
sendReply(socket, reply);
```
**Implementation:** Thread switching (i.e. blocking) and a scheduler.

### Event-based approach (non-blocking)

- Node.js uses events — a single thread handles many requests by never blocking.
  
```js
startRequest(socket);
listen("requestAvail", processRequest);
listen("processDone", sendReplyToSock);
```
**Implementation:** Event queue processing.

### Callback-based (event queue)

```js
readRequest(socket, function(request) {
  processRequest(request, function(reply) {
    sendReply(socket, reply);
  });
});
```

---

### The Event Queue
The engine that drives all of Node.js

At the core of Node.js is a simple but powerful loop. It continuously checks for events to process, and dispatches them one at a time.

#### Inner loop
```js
while (true) {
  if (!eventQueue.notEmpty()) {
    eventQueue.pop().call();
  }
}
```

**Rule:** Never wait/block in an event handler.

### Example: `readRequest(socket)`
1. `launchReadRequest(socket);` — Returns immediately
2. When read finishes,, it pushes a completion event onto the queue. 
   `eventQueue.push(readDoneEventHandler);`


#### Example: Node.js Reading a File

```js
let fs = require("fs"); // require is a Node module call
                        // fs object wraps OS sync file system calls

// OS read() is synchronous but Node's fs.readFile is asynchronous
fs.readFile("smallFile", readDoneCallback); // Start read

function readDoneCallback(error, dataBuffer) {
  // Node callback convention: First argument is JavaScript Error object
  // dataBuffer is a special Node Buffer object
  if (!error) {
    console.log("smallFile contents", dataBuffer.toString());
  }
}
```

---

## Node Modules

### Importing with `require()`
- Can also use ES6 `import` if file name is `*.mjs`

```js
require("fs");           // System module — looks in node_modules directories
require("./XXX.js");     // From a file — reads specified file
require("./myModule");   // From a directory — reads myModule/index.js
```

### Module private scope
- Can declare variables that would be global in the browser
- `require()` returns what is assigned to `module.exports`

```js
var notGlobal; // Private to this file

function func1() {}
function func2() {}

module.exports = { func1: func1, func2: func2 }; // Export the public interface
```

---

### Node Module Ecosystem

#### Standard Node modules include:
- File system, process access, networking, timers, devices, crypto, etc.

#### npm — huge library of modules
- Can do pretty much anything you want

#### Key modules used in web development:
- **Express** — Fast, unopinionated, minimalist web framework (speak HTTP)
- **Mongoose** — Elegant MongoDB object modeling (speak to the database)

---

## Node Buffer Class

- Manipulating binary data wasn't a strength of JavaScript engines
- Web servers do a lot of binary I/O: `DBMS ⇔ Web Server ⇔ Browser`
- Node adds a `Buffer` class — optimized for storing and operating on binary data
  - Interface looks like an array of bytes (like OS system calls use)
  - Memory is allocated **outside of the V8 heap**
- Used by wrapped OS I/O calls (`fs`, `net`, …)
- Optimized sharing with pointers rather than always copying
  - `buffer.copy()`
  - For example: `fs.readFile` to `socket.write`

---

### Buffer Operations

```js
buf.toString("utf8");    // Convert to UTF8 — commonly used on the web
buf.toString("hex");     // Convert to hex encoding (2 digits per byte)
buf.toString("base64");  // Convert to base64 encoding
```


### Example: Node.js Reading a File (Redux)

```js
let fs = require("fs");
// fs has 81 properties: readFile, writeFile, most OS calls, etc.

fs.readFile("smallFile", readDoneCallback); // Start read
// Read has been launched — JavaScript execution continues
// Node.js exits when no callbacks are outstanding

function readDoneCallback(error, dataBuffer) {
  // console.log(dataBuffer) prints <Buffer 66 73 20 3d 20 72 65 71 ...
  if (!error) {
    console.log("smallFile contents", dataBuffer.toString());
  }
}
```

---

## Programming with Events/Callbacks

### Key difference
- **Threads:** Blocking/waiting is transparent
- **Events:** Blocking/waiting requires a callback

### Mental model
- If code doesn't block → Same as thread programming
- If code does block (or needs to block) → Need to set up a callback
- Often what was a `return` statement becomes a function call

---

### Example: Three-Step Process
#### Thread approach
```js
r1 = step1();
console.log('step1 done', r1);
r2 = step2(r1);
console.log('step2 done', r2);
r3 = step3(r2);
console.log('step3 done', r3);
console.log('All Done!');
```

#### Callback approach (wrong version)
```js
step1(function(r1) {
  console.log('step1 done', r1);
  step2(r1, function(r2) {
    console.log('step2 done', r2);
    step3(r2, function(r3) {
      console.log('step3 done', r3);
    });
  });
});
console.log('All Done!'); // ❌ Wrong! Runs before steps finish
// Common mistake: Putting console.log('All Done!') after the callback chain — it runs immediately, before any async work finishes. Always place completion logic inside the innermost callback.
```

#### Callback approach (correct version)
```js
step1(function(r1) {
  console.log('step1 done', r1);
  step2(r1, function(r2) {
    console.log('step2 done', r2);
    step3(r2, function(r3) {
      console.log('step3 done', r3);
      console.log('All Done!'); // ✅ Correct placement
    });
  });
});
```

---

## Listener/Emitter Pattern
Listen for events, emit signals — the backbone of Node.js

The listener/emitter pattern is the foundation of event-driven programming.
When programming with events (rather than threads), the **listener/emitter** pattern is often used.

- **Listener** — Function to be called when the event is signaled
  - Should be familiar from DOM programming (`addEventListener`)
- **Emitter** — Signals that an event has occurred
  - Emitting an event causes all listener functions to be called

---

###  EventEmitter

```js
const EventEmitter = require('events');

myEmitter.on('myEvent', function(param1, param2) {
  console.log('myEvent occurred with ' + param1 + ' and ' + param2 + '!');
});

myEmitter.emit('myEvent', 'arg1', 'arg2');
```

- On `emit`, listeners are called **synchronously** and **in registration order**
- If no listener, `emit()` is a no-op

---

### Typical EventEmitter Patterns

```js
myEmitter.on('conditionA', doConditionA);
myEmitter.on('conditionB', doConditionB);
myEmitter.on('conditionC', doConditionC);
myEmitter.on('error', handleErrorCondition);
```

> **Important:** Handling `'error'` is critical — Node exits if an error event is not caught!

```js
myEmitter.emit('error', new Error('Ouch!'));
```

---

## Streams
Pipelines of data — the Node.js way to handle I/O at scale
Streams let you process data piece by piece, without loading it all into memory. They're composable — you can chain them like Unix pipes.

- Build modules that produce and/or consume streams of data
- A popular way of structuring servers:
  ```
  Network interface ⇔ TCP/IP ⇔ HTTP processing ⇔ your code
  ```
- Can build connected streams dynamically:
  ```
  Network interface ⇔ TCP/IP ⇔ Encryption ⇔ HTTP processing
  ```

### Node's stream types:
- **Readable streams** — e.g., `fs.createReadStream`
- **Writable streams** — e.g., `fs.createWriteStream`
- **Duplex streams** — e.g., `net.createConnection`
- **Transform streams** — e.g., `zlib`, `crypto`

---

### Readable Streams — File Reading

```js
var readableStreamEvent = fs.createReadStream("bigFile");

readableStreamEvent.on('data', function(chunkBuffer) {
  // Could be called multiple times
  console.log('got chunk of', chunkBuffer.length, 'bytes');
});

readableStreamEvent.on('end', function() {
  // Called after all chunks are read
  console.log('got all the data');
});

readableStreamEvent.on('error', function(err) {
  console.error('got error', err);
});
```

---

### Writable Streams — File Writing

```js
var writableStreamEvent = fs.createWriteStream('outputFile');

writableStreamEvent.on('finish', function() {
  console.log('file has been written!');
});

writableStreamEvent.write('Hello world!\n');
writableStreamEvent.end();
// Don't forget: writableStreamEvent.on('error', ...
```

---

## Digression: Socket Setup for TCP Connections

### Client (Browser)
```c
sock = socket(AF_INET, SOCK_STREAM, 0);
connect(sock, &serverAddr, sizeof(serverAddr));
write(sock, "Hi!", 3);
read(sock, buf, 3);
```

### Server (Web Server)
```c
lfd = socket(AF_INET, SOCK_STREAM, 0);
bind(lfd, &serverAddr, sizeof(serveraddr));
listen(lfd, 5);
sock = accept(lfd, &clientaddr, &clientlen);
read(sock, buf, 3);
write(sock, buf, 3);
```

> TCP/IP socket connection is a reliable, in-order byte stream.  
> Note: reads can return data in different chunks than sent.

---

### TCP Networking on Node.js

```js
let net = require('net');
net.createServer(processTCPconnection).listen(4000);
```

- Creates a socket, binds port 4000, and listens for connections
- Calls function `processTCPconnection` on each TCP connection

---

### Example: A Chat Server

```js
let clients = []; // List of connected clients

function processTCPconnection(socket) {
  clients.push(socket); // Add this client to the connected list

  socket.on('data', function(data) {
    broadcast("> " + data, socket); // Send received data to all
  });

  socket.on('end', function() {
    clients.splice(clients.indexOf(socket), 1); // Remove socket
  });
}

// Send message to all clients
function broadcast(message, sender) {
  clients.forEach(function(client) {
    if (client === sender) return; // Don't send it back to sender
    client.write(message);
  });
}
```

---

### Example: A Simple File Server

```js
net.createServer(function(socket) {
  socket.on('data', function(fileName) {
    fs.readFile(fileName.toString(), function(error, fileData) {
      if (!error) {
        socket.write(fileData);    // Writing a Buffer
      } else {
        socket.write(error.message); // Writing a String
      }
      socket.end();
    });
  });
}).listen(4000);
```

> Think about the concurrency going on here!

---

## Example: Reading N Files — The Problem

### Naive approach: Callback Hell / Pyramid of Doom
```js
fs.readFile("f1", function(error, data1) {
  fs.readFile("f2", function(error, data2) {
    fs.readFile("f3", function(error, data3) {
      // Callback Hell!
    });
  });
});
```

### Parallel reads — how to know when all are done?
```js
var fileContents = {};
['f1', 'f2', 'f3'].forEach(function(fileName) {
  fs.readFile(fileName, function(error, dataBuffer) {
    assert(!error);
    fileContents[fileName] = dataBuffer;
    // How do we know all reads are finished? Recall: Can't wait in Node.js!
  });
});
```

---

### Example: Reading N Files — Solution with `async`

```js
var async = require('async');
var fileContents = {};

async.each(['f1', 'f2', 'f3'], readIt, function(err) {
  if (!err) console.log('Done'); // fileContents is fully filled in
  if (err) console.error('Got an error:', err.message);
});

function readIt(fileName, callback) {
  fs.readFile(fileName, function(error, dataBuffer) {
    fileContents[fileName] = dataBuffer;
    callback(error);
  });
}
```

---

## Node.js Built-in Modules Reference

| Module | Description |
|---|---|
| `buffer` | Binary data handling |
| `child_process` | Spawn child processes |
| `cluster` | Multi-process load balancing |
| `console` | Debug console |
| `crypto` | Cryptographic functions |
| `dns` | DNS lookups |
| `events` | EventEmitter |
| `fs` | File system |
| `http` | HTTP server/client |
| `https` | HTTPS server/client |
| `net` | TCP networking |
| `os` | OS information |
| `path` | File path utilities |
| `process` | Process information |
| `readline` | Read line-by-line |
| `repl` | Read-Eval-Print Loop |
| `stream` | Streaming data |
| `timers` | setTimeout, setInterval |
| `tls` | TLS/SSL |
| `url` | URL parsing |
| `util` | Utility functions |
| `v8` | V8 engine stats |
| `zlib` | Compression |
