# Sessions
*CS142 Lecture Notes — Mendel Rosenblum*

---
## Identifying users across requests

HTTP is stateless. Learn how web servers track who is talking to them using cookies, session IDs, and modern storage APIs.

## The statelessness problem

HTTP requests arrive at the server with almost no information to identify which user — or which "session" — they belong to. But web apps need to know who is making the request on every single call.

The web server is inherently stateless — session data must live in storage, with a reference carried in the HTTP request.


### How Do We Know What User Sent a Request?

Web applications need to authenticate users and have that information available with every request. More generally, web apps need to maintain **session state** per active browser — a persistent record of who is using the app and what they've been doing.

```js
expressApp.get('/user/:user_id', function (httpRequest, httpResponse) {
  // Need to make a decision to accept the request or reject it
  let sessionState = GetSessionState(httpRequest);
});
```

---

### Where Does Session State Come From?
 
```
Web Browser  ←——HTTP——→  Web Server  ←——LAN——→  Storage System
  (Maybe Here)              (Not Here            (Here)
                             Stateless)
```

HTTP is **stateless** — the web server itself cannot store session data between requests. Session data must live either in the browser or in a backing storage system, with a reference passed along via HTTP.

---
### Session State
#### What is Session?
A session is simply the span of time a user is actively using your app — from when they log in to when they log out (or close the browser).

Think of it like a restaurant visit. When you walk in, the host recognizes you and seats you. For the rest of your visit, the waitstaff knows your table, your order, your preferences — without you having to re-introduce yourself every time someone comes over. When you leave, that context disappears.

In web terms, a session is that same concept packaged as data:

- It **starts** when a user logs in
- It **persists** across many separate HTTP requests
- It **ends** when the user logs out or the session expires
- It holds things like who you are, your preferences, your cart, etc.

The tricky part is that HTTP requests are completely independent of each other — the server has no built-in way to know that request #47 came from the same person as request #46. A session is the mechanism that stitches those disconnected requests back together into a coherent "this is one user doing one continuous thing."

#### What is Session State?

Session state is just the server's memory of "who you are and what you've been doing" across multiple HTTP requests.

Since HTTP itself is stateless — every request arrives with no built-in identity — the server needs a way to remember context between them. **Session state is that context.** 
Concretely, it's a small bundle of data associated with your browser, stored server-side, that might look like:

```js
{
  userId: "mendel",
  isLoggedIn: true,
  cartItems: ["item_1", "item_3"],
  lastPageVisited: "/photos/42"
}
```

Every time your browser makes a request, the server looks up this bundle (using a session ID stored in a cookie) and knows who you are without you having to log in again on every click.

The key insight is that "state" here means the same thing it does in programming generally — the current snapshot of relevant data. "Session" just scopes it to one user's active time using the app, as opposed to permanent data stored in a database.


#### what is the different between session and cache?

Great question — they're often confused because both involve temporarily storing data. Here's the core difference:

**Session** is data stored **per user** — it's personal and identity-bound.
**Cache** is data stored **for everyone** — it's shared and performance-driven.

| | Session | Cache |
|---|---|---|
| **Purpose** | Remember *who you are* | Avoid repeating expensive work |
| **Scope** | One specific user | Shared across all users |
| **Content** | userId, login status, cart | Database query results, rendered pages, API responses |
| **Expires when** | User logs out or times out | Data becomes stale or memory runs out |
| **If lost** | User gets logged out | A little slower — just re-fetch the data |

A concrete example using the photo app from your lecture:

- **Session** stores `{ userId: "mendel", isLoggedIn: true }` — that's yours alone, nobody else sees it
- **Cache** might store the full user list that appears in the sidebar — instead of hitting the database every time *any* user loads the page, the server computes it once and saves it for everyone

Another way to think about it:

- Losing your **session** is like being kicked out of a restaurant and having to get back in line — you lose your place
- Losing the **cache** is like the kitchen having to re-read the recipe — slightly slower, but the meal still comes out the same

In practice they often live in the same place (like Redis), but for completely different reasons — sessions for personalization, cache for speed.



### Session State Lookup Problem

- HTTP requests arrive at the web server with very little information to uniquely identify a "session."
- **Solution:** Include something in the request that identifies the session — but care must be taken to avoid forgeries.
- **Early HTTP solution:** Cookies — state set by the web server that the browser attaches to every subsequent request.
- **Modern alternative:** Browser `localStorage` API.




---



## Cookies: the classic solution
The server adds a Set-Cookie header to the response. The browser attaches it automatically to every future request to the same domain.

### What is the relations between session and cookies?

They work together as a team — cookies are the **messenger**, sessions are the **memory**.

Here's the relationship in plain terms:

**The session** lives on the server — it's the actual data (who you are, what you're doing). But the server handles thousands of users simultaneously, so it needs a way to know *which session belongs to which browser*.

**The cookie** solves that. It's a tiny piece of data the server sends to your browser that says "your session ID is `abc123`". The browser then attaches that cookie to every future request automatically, like showing your ticket stub at a concert venue every time you re-enter.

So the flow looks like this:

```
1. You log in
         ↓
2. Server creates a session  { userId: "mendel", isLoggedIn: true }
         ↓
3. Server sends back a cookie  Set-Cookie: sessionId=abc123
         ↓
4. Your browser stores the cookie
         ↓
5. Every future request automatically includes  Cookie: sessionId=abc123
         ↓
6. Server looks up session abc123 → knows who you are
```

A useful analogy: the **session is your coat check ticket stub's record** (kept by the venue), and the **cookie is the physical ticket stub** in your pocket. You hand over the stub, they find your coat. You never carry the coat around with you — just the reference to it.

This is also why storing actual data in the cookie directly is risky — it's like writing your home address on the ticket stub instead of just a number. If someone steals the stub, they now have your address too.

### HTTP Cookies: Basic Idea

The web server adds `Set-Cookie:` headers to an HTTP response:

```js
Set-Cookie: cookie_name1=cookie_value1
Set-Cookie: cookie_name2=cookie_value2; expires=Sun, 16 Jul 2016 06:23:41 GMT
```

Each cookie is a **name-value pair**. Future requests from the browser to the same server include the `Cookie:` header:

```
Cookie: cookie_name1=cookie_value1; cookie_name2=cookie_value2
```

---

### Cookie Contents

A cookie contains:

- **Name and data** — the key-value pair itself
- **Domain** — the server, optional port, and optional URL prefix; the cookie is only sent to matching domains
- **Expiration date** — the browser can delete old cookies automatically

**Limits:**
- Data size is typically limited to **< 4 KB**
- Browsers limit the number of cookies per server (around **50**)



---

### Cookies as Web App Storage

Cookies have significant reliability and security concerns:

- Users can **view, modify, corrupt, delete, or create** cookies
- Users can lose cookies to hackers
- Switching browsers looks like all cookies were deleted
- Cookies have a history of misuse — users are suspicious of them

As a result, cookies are best used only for **hints, shortcuts, or data that can be safely recovered if missing**. For active communication with the app, **session cookies** are the appropriate use.

---

### Session State with Cookies

Early web frameworks like Rails provided a `session` object that could store arbitrary data:

```ruby
session[:user_id] = "mendel"
```

Rails packaged the session into a cookie in the HTTP response, making it available in all future requests from the same browser. Rails automatically:

1. Checks for a session cookie at the start of each request
2. If a cookie exists — uses it to find session data
3. If no cookie — creates a new session and a new cookie
4. At the end of each request — saves session data for future requests

---

### Session State in Cookies: Security

Storing session state directly in a cookie is risky because cookies can be viewed, changed, deleted, and stolen. For example:

```js
session.user_id = "mendel";
session.password = "foobar";  // Dangerous!
```

Using **cryptography** you can:
- Hide content from viewers and hackers
- Detect forgeries and tampering

A better alternative is to store only a **pointer** (session ID) to the session state in the cookie:

A session ID is just an opaque reference. Actual session data (user ID, preferences, etc.) stays safely on the server. The ID itself must still be cryptographically signed to prevent forgery — but it reveals nothing sensitive on its own.

```js
// HTTP Response headers
Set-Cookie: session=0x4137fd6a; Expires=Wed, 09 Jun 2012 10:18:14 GMT

// Browser sends it back automatically
Cookie: session=0x4137fd6a

```

This reduces transfer overhead but still requires cryptographic protection.

---



## ExpressJS Session Middleware

```js
let session = require('express-session');
```

ExpressJS provides a middleware layer for session state management:

- signing the session ID
- Safely stores a `sessionID` in a cookie
- Stores session state in a configurable session store
- Like Rails, handles creation and fetching of session state automatically
- attaching it to every request.

**Usage:**

```js
app.use(session({ secret: 'badSecret' }));
// `secret` is used to cryptographically sign the sessionID cookie

app.get('/user/:user_id', function (httpRequest, httpResponse) {
  // httpRequest.session is an object you can read or write
});


```

---

### Express Session Usage Example

```js
// Login handler — store the authenticated user
httpRequest.session.user_id = "mendel";

// All other handlers — read the stored user
if (!httpRequest.session.user_id) {
  // Error or redirect to login page
} else {
  // We know who is logged in
}

// On logout — destroy the session entirely
httpRequest.session.destroy(function (err) { });
```

#### Setup & usage


```js
const session = require('express-session');

// Mount middleware
app.use(session({ secret: 'yourSecret' }));

// In a route handler
app.post('/login', (req, res) => {
  req.session.userId = 'mendel';  // store on login
  res.redirect('/');
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  // userId is available on every request
});

// On logout
req.session.destroy((err) => { });

```
---

### Express Session: Session Store

The **default session store** is Node.js in-memory — fine for development, but not suitable for production.

ExpressJS supports many backend session store options. Example with **MongoDB via Mongoose**:

```js
var MongoStore = require('connect-mongo')(express);

expressApp.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
```

---


## Options for Storing Session State

| Storage Location | Pros | Cons |
|---|---|---|
| **Web server memory** | Fastest access | May be too large for many active users; makes load balancing hard |
| **Storage system** | Easy to share across servers | May be overkill; high load (needed on every request) |
| **Specialized in-memory store** | Fast, supports small short-lived data | Extra infrastructure |

Examples of specialized stores: **memcache**, **redis** (in-memory key-value stores).

---
## Web Storage API: modern alternative

Modern browsers offer the **Web Storage API** as an alternative to cookies:

- **`sessionStorage`** — per-origin storage available only while the page is open
- **`localStorage`** — per-origin storage with a longer (persistent) lifetime

**Standard key-value interface:**

```js
localStorage.appSetting = 'Anything';
localStorage.setItem('appSetting', 'Anything');
sessionStorage['app2Setting'] = 2;
```

**Limitations:**
- Limited space (~10 MB)
- Similar reliability concerns to cookies (user can clear it)


### Key difference from cookies: 
Web Storage is never automatically sent to the server. You must read it with JavaScript and include it manually in requests.