# Hypertext Transport Protocol (HTTP)
*CS142 Lecture Notes — Mendel Rosenblum*

---

## Web Application Architecture

A typical web application involves three tiers communicating over a network:

- **Web Browser** (Chrome, Firefox, Safari, Internet Explorer) — communicates over the Internet via HTTP
- **Web Server / Application Server** (Node.js, Apache, Ruby on Rails) — communicates over a LAN
- **Storage System** (MongoDB, MySQL)

The browser and server speak HTTP across the Internet; the server and storage system communicate over a local area network (LAN).

---

## Universal Resource Locator (URL)

```
http://www.example.com:80/index.html
```

- To display a page, the browser fetches `index.html` from a web server.
- Defaults: port `80`, file `index.html`, protocol `http`

**HTTP (HyperText Transport Protocol)** is a simple request-response protocol layered on TCP/IP.

Steps to fetch a page:
1. Establish a TCP/IP connection to `www.example.com:80`
2. Send an HTTP GET request along the connection
3. Read the response from the web server

---

## Sending an HTTP Request

An HTTP request is written as lines to a socket:

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html, */*
Accept-Language: en-us
Accept-Charset: ISO-8859-1,utf-8
Connection: keep-alive

[blank line]
[optional body]
```

| Part | Description |
|------|-------------|
| `GET /index.html HTTP/1.1` | Method, URL path, and protocol version |
| Headers | Key-value metadata about the request |
| Blank line | Separates headers from the body |
| Body (optional) | Data payload (used with POST, PUT) |

---

## HTTP Methods (Verbs)

| Method | Purpose |
|--------|---------|
| `GET` | Fetch a URL |
| `HEAD` | Fetch information about a URL (headers only) |
| `PUT` | Store to a URL |
| `POST` | Send form data to a URL and get a response back |
| `DELETE` | Delete a URL |

- **GET** and **POST** (forms) are most commonly used.
- **REST APIs** use GET, PUT, POST, and DELETE.

---

## HTTP Response

An HTTP response is read as lines from a socket:

```
HTTP/1.1 200 OK
Date: Thu, 24 Jul 2008 17:36:27 GMT
Server: Apache-Coyote/1.1
Content-Type: text/html;charset=UTF-8
Content-Length: 1846

[blank line]
<?xml ... >
<!DOCTYPE html ... >
<html ... >
...
</html>
```

| Part | Description |
|------|-------------|
| `HTTP/1.1 200 OK` | Protocol version, status code, status message |
| Headers | Metadata about the response |
| Blank line | Separates headers from the body |
| Body | The actual content (HTML, JSON, image, etc.) |

---

## Common HTTP Response Status Codes

| Code | Message | Meaning |
|------|---------|---------|
| `200` | OK | Success |
| `307` | Temporary Redirect | Browser retries using `Location` header |
| `400` | Bad Request | Use if web app sends a bogus request |
| `401` | Unauthorized | Use if user isn't logged in |
| `403` | Forbidden | Use if even logging in wouldn't help |
| `404` | Not Found | The famous one — resource doesn't exist |
| `500` | Internal Server Error | Something is messed up on the server |
| `501` | Not Implemented | Coming soon |
| `503` | Service Unavailable | Something crashed on the server |
| `550` | Permission Denied | Not allowed to perform request |

> The **404 Not Found** error is one of the most recognisable responses on the web.

---

## Browser Caching Control

```
Cache-Control: max-age=<Seconds>
```

The browser can reuse a cached reply younger than the `max-age` value.

**Example:**
```
Cache-Control: max-age=120   ← Age out in two minutes
```

Frequently used for static content: images, templates, CSS, JavaScript.

| Pro | Con |
|-----|-----|
| Reduces app startup latency | Changes might not be picked up immediately |
| Reduces server load | Stale cache can cause bugs after deployments |

> **Consider:** What happens when you deploy a new version of your web app? Browsers may still serve cached old files.

---

## How the Browser Fetches Resources

The browser spends its life fetching things using HTTP. Fetches happen in three modes:

### 1. Synchronous (blocks page rendering)
```html
<link href="angular-material.css" rel="stylesheet" />
<script src="compiled/p2.bundle.js" type="text/javascript" />
```
Processing is paused while waiting for the HTTP reply.

Also triggered programmatically:
```javascript
window.location = "http://www.example.com";
```

### 2. Asynchronous & Parallel
```html
<img src="smiley.gif">
<img src="foobar.jpg">
<img src="foobar2.jpg">
```
Images are fetched in parallel without blocking the page.

### 3. Background (prefetch)
```html
<a href="http://www.example.com"></a>
```
Links may be prefetched in the background by the browser.

A typical console error:
```
GET http://localhost:3000/favicon.ico 404 (Not Found)
```

---

## Dynamic Script Loading via innerHTML

```javascript
elm.innerHTML =
  "<script src=\"http://www.example.com/myJS.js\" " +
  "type=\"text/javascript\"></script>";
```

This uses HTTP to fetch `myJS.js` and **runs it**. Powerful — but potentially dangerous if the source is untrusted.
