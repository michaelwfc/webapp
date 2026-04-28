# Sessions
*CS142 Lecture Notes — Mendel Rosenblum*

HTTP is a protocol with no memory — every request arrives at the server as if it's the first time the two have ever met. Yet websites remember you, keep you logged in, and maintain your preferences across dozens of page loads. How? This tutorial traces the full story, from the fundamental statelessness problem all the way to modern Express session middleware and the Web Storage API.

---

## The Statelessness Problem

HTTP requests arrive at the server with almost no information to identify which user — or which "session" — they belong to. But web apps need to know who is making the request on every single call.

The web server is inherently stateless — session data must live in storage, with a reference carried in the HTTP request.


### How Do We Know What User Sent a Request?

Web applications need to authenticate users and have that information available with every request. More generally, web apps need to maintain **session state** per active browser — a persistent record of who is using the app and what they've been doing.

```js
expressApp.get('/user/:user_id', function (httpRequest, httpResponse) {
  // Before doing anything useful, we need to know who this is.
  // Can we trust this request? Is the user authenticated?

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

- HTTP is **stateless**, each request is independent, and the web server remembers nothing between them
- The web server sits in the middle but cannot hold state — it processes a request and moves on.
- Session data must live either in the browser or in a backing storage system, with a reference passed along via HTTP so the server can find it.


The web server is the one place you can't reliably store session data. It processes each request in isolation and may be one of many servers behind a load balancer. The browser and the storage system are the two candidates — and the challenge is deciding what to put where, and how to pass the reference between them securely.
The web server's job is to look up the right session using a reference that arrives with each request.


---

## The Session Lookup Problem: Connecting Requests to Identity

### Session State Lookup Problem

- HTTP requests arrive at the web server with very little information to uniquely identify a "session."
- **Solution:** Include something in the request that identifies the session — but care must be taken to avoid forgeries.
- **Early HTTP solution:** Cookies — state set by the web server that the browser attaches to every subsequent request.
- **Modern alternative:** Browser `localStorage` API.

So session data must live outside the web server. But that immediately raises a practical question: if each HTTP request is anonymous, how does the server know which session it belongs to?

The answer is that something must be included in the request itself — a token, an identifier, a reference — that tells the server "this request belongs to session #12345." The server receives this token, looks up the associated session data, and uses it to authenticate and personalize the response.

This sounds simple, but there's an important constraint: the system must be resistant to forgery. If session identifiers are easy to guess or manufacture, then a malicious user could craft a request that pretends to belong to someone else's session. Imagine guessing a session ID and suddenly seeing — or acting as — a different user. This is called session hijacking, and it's a real attack that has affected many systems.

#### Two main mechanisms
Over the history of the web, two main mechanisms have emerged for carrying this session reference:

**Cookies** were the original solution, introduced in the early days of the commercial web. The server tells the browser to store a small piece of data, and the browser dutifully includes that data in every subsequent request to the same server. Cookies became the standard way to maintain session state for decades.

**The Web Storage API** (localStorage and sessionStorage) is a more modern alternative. Unlike cookies, Web Storage data isn't automatically sent to the server — you have to explicitly include it in requests. This gives developers more control, but also more responsibility.



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








---



## Cookies: the classic solution
The server adds a Set-Cookie header to the response. The browser attaches it automatically to every future request to the same domain.


### How HTTP Cookies Work

The mechanics work through two HTTP headers. When the server wants to set a cookie, it includes` Set-Cookie` headers in its response. The browser stores these cookies locally and automatically includes them in a `Cookie` header on every future request to that domain.


```js
// The server adds these to its HTTP response
Set-Cookie: cookie_name1=cookie_value1
Set-Cookie: cookie_name2=cookie_value2; expires=Sun, 16 Jul 2016 06:23:41 GMT
```
Each `Set-Cookie` header creates one cookie. The browser stores both and will include them in future requests. The optional expires attribute tells the browser when to automatically delete the cookie.

Each cookie is a **name-value pair**. Future requests from the browser to the same server include the `Cookie:` header:

```js
// The browser automatically adds this header to every request
Cookie: cookie_name1=cookie_value1; cookie_name2=cookie_value2
```
The browser bundles all matching cookies into a single Cookie header. The server reads this header and knows exactly which session to look up — without the user doing anything at all.

The word "automatically" is key here. The developer doesn't write JavaScript to send cookies — the browser handles that entirely. This is both the power of cookies (zero developer effort to transmit) and a source of their security concerns (the browser sends them everywhere, including to malicious pages that trigger requests to your domain).

Key Takeaway
Cookies work through a two-step handshake: the server sets them with Set-Cookie response headers, and the browser sends them back with every request via the Cookie header — automatically, without any JavaScript required. This automation is what makes cookies so effective for session management, and what also makes them a frequent security consideration.


#### Example
Great question. Let me walk through exactly what happens step by step.

**What's actually in the cookie**

When you log in, the server doesn't store your name or email in the cookie. It creates a random, meaningless ID — something like:

```
Set-Cookie: sessionId=a3f9b2c1e7d84f12
```

That string `a3f9b2c1e7d84f12` means nothing on its own. It's just a random token.

**What's stored on the server**

On the server side, there's a lookup table (in memory, Redis, MongoDB, etc.) that maps that random ID to real data:

```
a3f9b2c1e7d84f12  →  { userId: "mendel", loggedInAt: "2024-01-15", role: "admin" }
f7e2d91a3b6c5042  →  { userId: "alice",  loggedInAt: "2024-01-15", role: "user"  }
```

**What happens on the next request**

When your browser sends the cookie back:

```
Cookie: sessionId=a3f9b2c1e7d84f12
```

The server does exactly one thing — it looks up that ID in the table and retrieves the associated object. Now it knows everything about you without you ever sending your username or password again.

In Express, this is what `req.session` gives you — not the raw cookie, but the already-looked-up object that was mapped to that ID.

**The analogy**

It's exactly like a coat check. The ticket stub (cookie) is just a number — `#47`. The coat check attendant (server) uses that number to find your actual coat (session data) in the rack. The number itself tells you nothing about the coat.

**So to directly answer your question** — the server knows the session because it has a table on its own side that connects the random cookie value to real user data. The cookie never contains the real data itself. It's purely a key to look something up.


---

### Cookie Contents

A cookie is more than just a key-value pair — it comes with a set of attributes that control when, where, and to whom it's sent. Understanding these attributes is essential for writing secure, well-behaved web applications.

A cookie contains:

####  **Name and data** ： The payload
The actual key-value pair. The name identifies the cookie; the value is the data. For session cookies, the value is typically an opaque session ID — not readable data.

#### **Domain** ： Scope restriction

the server, optional port, and optional URL prefix; the cookie is only sent to matching domains

Specifies which server (and optionally which port and URL prefix) the cookie is sent to. The browser only includes a cookie in requests that match its domain — cookies from your bank don't go to your shopping site.


#### **Expiration date** ： Lifetime control
the browser can delete old cookies automatically

An optional date after which the browser automatically deletes the cookie. Without an expiration, the cookie is a "session cookie" — it lives only as long as the browser tab is open.



**Limits:**
- Data size is typically limited to **< 4 KB**
- Browsers limit the number of cookies per server (around **50**)

These constraints are a hint about the intended use. Cookies were designed to carry session references, not session data. The right pattern is to store a small, opaque identifier in the cookie, and keep all the actual data on the server where there are no such size limits.

---

### The Reliability Problem: Why Cookies Make Poor Storage

Cookies have significant reliability and security concerns:

- Users can **view, modify, corrupt, delete, or create** cookies
- Users can lose cookies to hackers
- Switching browsers looks like all cookies were deleted
- Cookies have a history of misuse — users are suspicious of them

Important Constraint
Because users can view, modify, corrupt, delete, or steal cookies at any time, they should only be used for data that can be safely lost or recovered — hints, preferences, and session tokens. Never store sensitive information (passwords, personal data, authorization tokens) directly in a cookie value without cryptographic protection.

The practical upshot is that cookies are best suited for one specific purpose: carrying a session token back and forth so the server can look up the real session data in a secure backend store. Everything else — the actual user data, preferences, permissions — lives server-side where the user can't touch it.


---
## Session Cookies in Practice:

### How Rails Solved It First

Early web frameworks had to invent session management from scratch. Ruby on Rails set the pattern that most modern frameworks — including Express — have adopted in some form. Understanding how Rails approached it makes the Express solution feel familiar rather than arbitrary.

Early web frameworks like Rails provided a `session` object behaved like a simple JavaScript object — you could read and write arbitrary data to it, and Rails handled all the HTTP plumbing transparently:

```ruby
# Store the authenticated user's ID in the session
session[:user_id] = "mendel"
```
One line of Ruby. Rails took care of packaging this into a cookie, signing it cryptographically, sending it with the response, reading it back on the next request, and making it available in the controller. The developer never touched an HTTP header directly.



Rails followed a consistent lifecycle for every request, which is the same lifecycle modern frameworks use today:

1. Checks for a session cookie at the start of each request
   At the very start of each request, before any route handler runs, the framework looks for a session cookie in the request headers.

2. Load or create the session:
   If a valid session cookie is found, the framework loads the associated session data. 
   If not — or if the cookie is invalid — it creates a brand-new empty session.

3. Run your route handler
  Your application code runs with full access to the session object — read existing data, write new data, or clear it on logou

4. Save and send the cookie
  At the end of the request, the framework saves any session changes and ensures the session cookie is included in the response — creating one if it's a new session.

Key Takeaway
Session middleware follows a consistent four-step lifecycle on every request: find the session cookie → load the session → run your handler → save and send the cookie. Your code only sees the session object — the framework handles all the HTTP mechanics transparently. This is the same pattern Rails pioneered and Express adopted.

---

### Session Security: Never Trust Cookie Data

Because cookies live in the browser — a place the user controls — a critical security principle applies: never store sensitive data directly in a cookie value without protection. The data can be read, and it can be modified.

Consider what happens if an early developer naively stores session state directly in a cookie:

```js
// ❌ Never do this — both values are visible in the browser
session.user_id = "mendel";
session.password = "foobar";  // Dangerous!
```
Anyone who opens their browser's developer tools can read these values in plain text. An attacker who steals the cookie (via XSS, network interception, or physical access) gets the password immediately. This is a foundational security mistake.

#### Cryptography
Using **cryptography** you can:
- Hide content from viewers and hackers
- Detect forgeries and tampering


Cryptography provides two tools for making cookies safer. 
- **Encryption** hides the content of the cookie from anyone who reads it — even if a cookie is stolen, the thief can't read the data without the server's secret key. 
- **Digital signing** (often called a MAC or HMAC) doesn't hide the data, but detects if it's been tampered with — if the user modifies a signed cookie, the server knows and rejects it.

But even with cryptography, there's a cleaner architectural choice: don't put session data in the cookie at all. Store only an opaque session ID — a random, unforgeable token that means nothing on its own — and keep all the actual data on the server. The cookie is just a reference:

```js
// ✓ Correct — the cookie value is an opaque reference, not real data
Set-Cookie: session=0x4137fd6a; Expires=Wed, 09 Jun 2012 10:18:14 GMT

// Browser sends it back automatically
Cookie: session=0x4137fd6a

```


A better alternative is to store only a **pointer** (session ID) to the session state in the cookie:

A session ID is just an opaque reference. Actual session data (user ID, preferences, etc.) stays safely on the server. The ID itself must still be cryptographically signed to prevent forgery — but it reveals nothing sensitive on its own.


### Where to Store Session Data: Three Options

Once you've decided to keep session data on the server rather than in the cookie, you need to choose a storage backend. There are three main options, each with a distinct performance and complexity profile. The right choice depends on your scale, infrastructure, and how long sessions need to live.



| Storage location	| Speed	 | Advantages	 | Disadvantages |
| --- | --- | --- | --- |
| Web server memory	 | fastest	| Zero network latency — data is right there in the process. Simplest to set up for development.	| Sessions are lost when the server restarts. Doesn't work with multiple servers (load balancers route to different machines). Memory grows with active user count. |
| Database (e.g. MongoDB, PostgreSQL)	| medium	| Shared across all servers. Survives server restarts. Works naturally with your existing data infrastructure.	| A database round-trip on every single request adds latency. Databases are built for durability, not for small, frequently-read transient data — this may be overkill. |
| Specialized in-memory store (Redis, Memcache)	| fast	| Designed exactly for this use case: fast, shared, short-lived data. Shared across all servers. Supports automatic expiration. Scales well.	| Another piece of infrastructure to deploy, monitor, and maintain. Adds operational complexity to your stack. |

For most production applications, Redis is the standard choice for session storage. It's fast (data lives in memory), supports TTL-based expiration (sessions auto-delete after they expire), can be shared across many server instances, and has excellent client libraries for Node.js. Memcache is a similar option with a simpler feature set.

For development and small single-server deployments, in-process memory is fine. Just remember that every time you restart your dev server, all sessions are cleared — which means you'll be logged out.


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


---



## ExpressJS Session Middleware


Express doesn't include session management in its core, but the express-session middleware package provides everything you need — and follows the same lifecycle we described in the Rails section. Setting it up takes just a few lines of code.


```js
let session = require('express-session');

// Mount the session middleware — must come before your route handlers
app.use(session({
  secret: 'yourSecretKey'  // used to sign the session ID cookie cryptographically
}));
// The secret option is how express-session signs the session ID cookie to prevent forgery. In production, this should be a long, random string stored in an environment variable — never hardcoded in source code.


// Now every route handler gets httpRequest.session for free
app.get('/user/:user_id', function (httpRequest, httpResponse) {
  // httpRequest.session is an object — read it, write it, it persists
)

```
### How the secret signing the session ID: 

The secret comes from the **web server** — specifically, you as the developer create it and store it on the server. The browser never sees it or knows it exists.

Here's the clearest way to think about it:

**The secret is like a stamp only the server owns**

Imagine a wax seal on an envelope. Only the king has the signet ring that makes that specific seal. Anyone can *look* at the seal, but nobody can *fake* it without the ring. The secret key is the signet ring — it lives exclusively on the server.

**How you actually create it**

You generate it once, yourself, using any random string generator. A common way in Node.js:

```js
// Run this once in your terminal to generate a secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

// Output looks like:
// a3f9b2c1e7d84f12b8a3c9d2e1f7b6a4c8d3e2f1a9b8c7d6e5f4a3b2c1d0e9f8...
```

You then store that output as an **environment variable** on your server — never in your code:

```js
// .env file (on the server, never committed to git)
SESSION_SECRET=a3f9b2c1e7d84f12b8a3c9d2e1f7b6a4...

// In your app
app.use(session({
  secret: process.env.SESSION_SECRET  // read from environment, not hardcoded
}));
```

**What the secret actually does**

When the server creates a session ID like `a3f9b2c1e7d84f12`, it runs it through a mathematical function using the secret to produce a signature:

```js
sessionId = a3f9b2c1e7d84f12
signature = HMAC(sessionId, secret) = 9f3e2b1c...

Cookie sent to browser: a3f9b2c1e7d84f12.9f3e2b1c
```

When the browser sends that cookie back, the server re-computes the signature using its secret and checks if it matches. If someone tampered with the session ID, the signature won't match and the server rejects it.

The browser only ever sees `a3f9b2c1e7d84f12.9f3e2b1c` — the ID plus the signature. It never sees the secret that was used to produce the signature, so it can never forge one.

**The short answer:** you generate the secret once on your machine, store it as an environment variable on your server, and it never leaves the server. The browser has no involvement with it whatsoever.

---

### Reading, writing, and destroying sessions
ExpressJS provides a middleware layer for session state management:

- signing the session ID
- Safely stores a `sessionID` in a cookie
- Stores session state in a configurable session store
- Like Rails, handles creation and fetching of session state automatically
- attaching it to every request.

Once the middleware is mounted, working with sessions in your route handlers is straightforward. The `httpRequest.session` object behaves like a plain JavaScript object — you can add properties, read them, and delete them. Changes are automatically persisted to the session store at the end of each request.

```js
// ── Login handler ─────────────────────────────────────
app.post('/login', function(req, res) {
  // After verifying credentials, store the authenticated user ID in the session
  req.session.user_id = "mendel";
  res.redirect('/');
});


// ── Protected route ───────────────────────────────────
app.get('/dashboard', function(req, res) {
  if (!req.session.user_id) {
    // No session — this user is not logged in
    return res.redirect('/login');
  }
  // Session exists — we know who this is
  res.render('dashboard', { userId: req.session.user_id });
});




// All other handlers — read the stored user
if (!httpRequest.session.user_id) {
  // Error or redirect to login page
} else {
  // We know who is logged in
}

// ── Logout handler ────────────────────────────────────
app.post('/logout', function(req, res) {
  // Destroy the session entirely — not just clear one field
  req.session.destroy(function(err) {
    res.redirect('/login');
  });
});

// On logout, always call session.destroy() rather than just setting fields to null. This removes the session from the store entirely, invalidating the session ID even if someone has a copy of the cookie.
```


#### How to verify credentials 

Great question — the code snippet skips over that part. Here's what actually happens inside that verification step.

**The full login flow**

```js
app.post('/login', async function(req, res) {

  // 1. Grab what the user typed in the form
  const { username, password } = req.body;

  // 2. Look up the user in the database by username
  const user = await User.findOne({ username: username });

  // 3. If no user found, reject immediately
  if (!user) {
    return res.status(401).render('login', { error: 'Invalid username or password' });
  }

  // 4. Compare the typed password against the stored (hashed) password
  const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

  // 5. If password is wrong, reject
  if (!passwordMatches) {
    return res.status(401).render('login', { error: 'Invalid username or password' });
  }

  // 6. ✓ Both checks passed — now it's safe to create the session
  req.session.user_id = user._id;
  res.redirect('/dashboard');
});
```

**The critical detail: passwords are never stored as plain text**

This is the most important thing to understand. Your database never stores `"foobar"`. It stores a **hash** — a one-way scrambled version of the password:

```
Plain text:  "foobar"
Stored hash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

A hash is one-way — you can never reverse it back to `"foobar"`. So when the user logs in and types their password, you don't un-hash the stored value. Instead you hash the *typed* password and check if the two hashes match. That's what `bcrypt.compare()` does.

**Why not just compare passwords directly?**

Because if your database is ever leaked or hacked, plain text passwords expose every user immediately. With hashing, the attacker gets a list of scrambled strings they can't reverse. It also means *you* as the developer never know your users' passwords — which is the correct situation to be in.

**Where does the stored hash come from?**

When the user first registers, you hash their password before saving it:

```js
app.post('/register', async function(req, res) {
  const { username, password } = req.body;

  // Hash the password before storing — never save plain text
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username: username,
    hashedPassword: hashedPassword  // store the hash, not "password"
  });

  await newUser.save();
  res.redirect('/login');
});
```

**The full picture end to end**

```
Registration:
  User types "foobar"  →  bcrypt.hash()  →  "$2b$10$..." stored in DB

Login:
  User types "foobar"  →  bcrypt.compare("foobar", "$2b$10$...")  →  true ✓
                                                                    →  session created

Next request:
  Cookie arrives  →  session ID looked up  →  req.session.user_id available
```

So "verifying credentials" is really two sequential checks: does this username exist in the database, and does the typed password hash-match what we stored when they registered? Only if both pass do you write to the session.


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

### Switching to a production session store

The **default session store** is Node.js in-memory — fine for development, but not suitable for production. which prints a warning in the console and is explicitly not recommended for production. 

The fix is to provide a store option pointing to a persistent backend. ExpressJS supports many backend session store options.
Here's how to hook it up to **MongoDB via Mongoose**:


Using MongoDB as the session store via connect-mongo
```js
const MongoStore = require('connect-mongo')(express);

expressApp.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
```

connect-mongo uses the existing Mongoose database connection — no separate configuration needed. Sessions are stored as documents in MongoDB, survive server restarts, and can be shared across multiple server instances.




---
## Web Storage API: modern alternative
Cookies have been around since 1994. In the decades since, browsers have added a more capable and developer-friendly storage mechanism: the Web Storage API. 

Modern browsers offer the **Web Storage API** as an alternative to cookies:

- **`sessionStorage`** — Per-tab, temporary storage
  per-origin storage available only while the page is open

  Data lives only while the browser tab is open. Closing the tab clears it entirely. Useful for wizard-style multi-step flows where you don't want data persisting after the user leaves.

- **`localStorage`** — Persistent, cross-session storage
  per-origin storage with a longer (persistent) lifetime

  Data survives tab closures, browser restarts, and even reboots. Persists until explicitly cleared by JavaScript or the user. Useful for user preferences, cached data, and anything that should persist between visits.

Both APIs share the same simple key-value interface, making them easy to work with:

```js


// Writing — dot notation, setItem(), and bracket notation all work
localStorage.appSetting = 'dark-mode';
localStorage.setItem('appSetting', 'dark-mode');
sessionStorage['wizardStep'] = '3';

// Reading
const setting = localStorage.getItem('appSetting');
const step    = sessionStorage['wizardStep'];

// Removing a specific key
localStorage.removeItem('appSetting');

// Clearing everything
localStorage.clear();

```

Web Storage data stays in the browser — unlike cookies, it is never automatically sent to the server. If you want to include a token stored in `localStorage` in a request, you must read it with JavaScript and add it manually (typically as an HTTP header like `Authorization: Bearer <token>`).


**Limitations:**
- Limited space (~10 MB)
- Similar reliability concerns to cookies (user can clear it)


### Key difference from cookies: 
Web Storage is never automatically sent to the server. You must read it with JavaScript and include it manually in requests.



---

# Example: Session for Photo Share App

## How Express Sessions Work Across Requests

Express sessions use **cookies** to maintain state across multiple HTTP requests from the same client. Here's how it works:

### 1. **Session Creation & Persistence**
- When you call `app.use(session({...}))`, Express sets up session middleware.
- On the first request, Express creates a unique session ID and sends it to the client as a cookie (e.g., `connect.sid`).
- The session data is stored server-side (in memory by default, or in a database like Redis for production).
- On subsequent requests, the client sends the session cookie back, allowing Express to retrieve the stored session data.

### 2. **Storing Data in Login**
In `/admin/login`:
```js
request.session.user_id = user._id;  // Stores user_id in the session
```
- This associates the `user_id` with the client's session.
- The session persists until it expires or is destroyed (e.g., on logout).

### 3. **Checking in Other Handlers**
In other routes like `/user/:id`, you access the same session data:
```js
app.get("/user/:id", function (request, response) {
  // Check if user is logged in by verifying session.user_id exists
  if (!request.session.user_id) {
    response.status(401).send("Unauthorized");
    return;
  }
  
  // Proceed with the request...
  User.findOne({ _id: request.params.id }, function (err, user) {
    // ... rest of handler
  });
});
```

### 4. **Why This Works Across Requests**
- **Same Client**: The browser automatically sends the session cookie with every request to the same domain.
- **Server Retrieval**: Express uses the cookie to look up the session data from server storage.
- **Stateful**: Unlike stateless APIs (e.g., JWT), sessions maintain state on the server.

### 5. **Project Requirement**
As per the project spec, you need to add session checks to **all endpoints except `/admin/login` and `/admin/logout`**:
- Return `401 Unauthorized` if `request.session.user_id` is not set.
- This ensures only logged-in users can access protected routes.

### 6. **Example Implementation**
Update your `/user/:id` handler:
```js
app.get("/user/:id", function (request, response) {
  // Session check
  if (!request.session.user_id) {
    response.status(401).send("Unauthorized");
    return;
  }

  // Existing logic...
  const id = request.params.id;
  User.findOne({ _id: id }, function (err, user) {
    // ... rest of code
  });
});
```

Apply similar checks to `/user/list`, `/photosOfUser/:id`, etc. This ensures the app enforces authentication across all requests.


## What is the Cookie in Express Sessions?

In your webServer.js, `app.use(session({...}))` uses a **session cookie** to maintain state across requests. Here's how it works:

### 1. **What is the Cookie?**
- **Name**: Typically `connect.sid` (or custom name if configured).
- **Purpose**: Stores a unique session ID (not the actual data like `user_id`).
- **Type**: HTTP-only cookie for security (not accessible via JavaScript).
- **Content**: Just an ID string (e.g., `s:abc123xyz...`), not sensitive data.

### 2. **How Does the Client Get the Cookie?**
The server automatically sends it via the `Set-Cookie` HTTP header in responses.

**Flow Example**:
1. **Client Request** (e.g., `POST /admin/login`):
   - No cookie sent initially.

2. **Server Response**:
   - Server creates session: `request.session.user_id = user._id;`
   - Sends `Set-Cookie: connect.sid=s:abc123xyz...; Path=/; HttpOnly` in response headers.
   - Client browser stores this cookie.

3. **Subsequent Requests** (e.g., `GET /user/:id`):
   - Client sends `Cookie: connect.sid=s:abc123xyz...` in request headers.
   - Server uses the ID to retrieve `request.session.user_id` from server-side storage.

### 3. **Why Cookies?**
- **Stateless HTTP**: Cookies allow the server to "remember" the client across requests.
- **Security**: `HttpOnly` prevents XSS attacks; `Secure` (in production) ensures HTTPS.
- **Automatic**: Browsers handle sending/receiving cookies transparently.

### 4. **Viewing in Browser**
- Open DevTools → Network tab → Check response headers for `Set-Cookie`.
- Application tab → Cookies → See stored session cookies.

If sessions aren't persisting, check:
- Browser accepting cookies.
- No `HttpOnly` issues.
- Server restarting (sessions are in-memory by default).

This is how login state persists across your app's requests! If you have issues, share network logs.


## Breaking Down the Set-Cookie Header

`Set-Cookie: connect.sid=s%3A071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd.jKG8lZvi%2BpEq%2Bk3d7Zc4JOdmwZI8C7ZxD%2FcRg%2FCX%2Fug; Path=/; HttpOnly`

### 1. **`connect.sid=s%3A...`** — The Cookie Name and Value
- **Name**: `connect.sid` (standard name for Express session cookies)
- **Value**: `s%3A071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd.jKG8lZvi%2BpEq%2Bk3d7Zc4JOdmwZI8C7ZxD%2FcRg%2FCX%2Fug`
  - `%3A` is URL encoding for `:`
  - Decoded: `s:071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd.jKG8lZvi+pEq+k3d7Zc4JOdmwZI8C7ZxD/cRg/CX/ug`
  - `s:` prefix = "signed" (Express signs it for security)
  - The rest is the actual session ID

### 2. **`Path=/`** — Where Cookie is Sent
- Cookie is sent with **all requests** to the domain (from `/` and all sub-paths)

### 3. **`HttpOnly`** — Security Flag
- Cookie is **NOT accessible** via JavaScript (`document.cookie`)
- Only sent with HTTP requests to the server
- Prevents XSS attacks where malicious scripts steal cookies

---

## How `connect.sid` Relates to Session ID

### The Flow:

1. **Server creates session** (`POST /admin/login`):
   ```js
   request.session.user_id = user._id;  // Store data
   ```

2. **Server sends Set-Cookie header**:
   - Creates a unique session ID (e.g., `071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd`)
   - Stores server-side mapping:
     ```
     Session Store:
     {
       "071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd": {
         "user_id": "69ea9738f3ccb80fff9cc725"
       }
     }
     ```
   - Sends `Set-Cookie: connect.sid=s:071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd...`

3. **Client stores and sends cookie**:
   - Browser saves `connect.sid` cookie
   - On next request (`GET /user/:id`), sends:
     ```
     Cookie: connect.sid=s:071ZBzJfJO7nhhYL7GTzsPyKEdUgfSAd...
     ```

4. **Server retrieves session**:
   - Extracts session ID from cookie
   - Looks up in store: finds `user_id`
   - Query passes: `if (!request.session.user_id)` succeeds ✓

### Diagram:
```
Login Request
    ↓
Server: request.session.user_id = user._id
    ↓
Server response: Set-Cookie: connect.sid=s:ABC123...
    ↓
Browser: stores cookie
    ↓
Next request: Cookie: connect.sid=s:ABC123...
    ↓
Server: looks up ABC123 → finds user_id → request.session.user_id available
    ↓
Protected route allows access ✓
```

---

## In Summary

- **`connect.sid`** = the cookie name/ID sent to the client
- **Session ID** (inside the cookie) = the key to look up session data on the server
- **`request.session`** = server-side storage that the session ID unlocks
- **The cookie itself** = just the reference; actual user data stays server-side (secure)

This is why login persists across requests — the cookie bridges frontend and backend!