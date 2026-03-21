# Web Servers
*CS142 Lecture Notes — Mendel Rosenblum*

---

## Web Application Architecture

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

```
loop forever doing:
    accept TCP connection from browser
    read HTTP request from TCP connection
    process HTTP request
    write HTTP response to TCP connection
    shutdown TCP connection (except if Connection: keep-alive)
```

---

## Processing HTTP Requests — File Reads

**Example: Process HTTP GET `index.html`**

```c
int fd = open("index.html");
int len = read(fd, fileContents, sizeOfFile(fd));
write(tcpConnection, httpResponseHeader, headerSize);
write(tcpConnection, fileContents, len);
```

> **Note:** `open` and `read` may have to talk to a slow disk device.
> Requests can be processed concurrently by starting a **new thread** or a **new process** per request.

---

## Processing HTTP Requests — cgi-bin

**Example: Process HTTP GET of `index.php`**

```c
runProgramInNewProcess(tcpConnection);
```

- Template processing program fetches models from the database system.

---

## 2nd Generation Web App Frameworks

The web server runs a **controller program** per request:

1. Parse URL and/or HTTP request body to get parameters to view
2. Use parameters to fetch model data from DBMS *(typically a SQL relational DBMS)*
3. Run HTML view template with model data to generate the HTML
4. Send an HTTP response with the HTML back to the browser

### Example: Rails Framework

URL: `/rails_intro/hello`

| Component | Description |
|-----------|-------------|
| Controller | `hello.rb` — Ruby program that fetches models via ORM |
| View Template | `hello.html.erb` — HTML embedded with Ruby |
| JavaScript | An asset (like an image or CSS) you can include |

---

## Web Servers for JavaScript Frameworks

Most of the web app consists of **simple static files** served by any standard HTTP web server:

- View templates (HTML, CSS)
- JavaScript files

### Remaining Browser ↔ Server Communication

Handles **model data** operations:

- **CRUD** — Create, Read, Update, Delete of model data
- **Session info** — e.g., login, etc. *(covered later)*

### Low Requirements on Web Request Processing

- HTTP GET static files
- Model data operations — mostly DBMS operations
