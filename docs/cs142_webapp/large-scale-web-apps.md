# Building Web Apps That Never Fall Over
### A Developer's Guide to Large-Scale Web Architecture

*CS142 · Web Application Development · Mendel Rosenblum, Stanford University*

Most tutorials teach you how to build a web app for a handful of users. This one teaches you how to architect for millions. You'll learn why single servers become bottlenecks, how the industry solved that problem with scale-out architecture, and how modern cloud services let a two-person startup behave like a Fortune 500 infrastructure team.

---

## Table of Contents

1. [Scale-Out vs. Scale-Up Architecture](#1-scale-out-vs-scale-up-architecture)
2. [Load Balancing: The Traffic Director](#2-load-balancing-the-traffic-director)
3. [nginx: The Workhorse in Front of Node](#3-nginx-the-workhorse-in-front-of-node)
4. [The Statelessness Requirement](#4-the-statelessness-requirement)
5. [Scaling the Storage Layer](#5-scaling-the-storage-layer)
6. [Memcache: Trading Memory for Speed](#6-memcache-trading-memory-for-speed)
7. [Cloud Computing: Renting the Infrastructure](#7-cloud-computing-renting-the-infrastructure)
8. [Beyond VMs: Containers, Serverless, and Managed DBs](#8-beyond-vms-containers-serverless-and-managed-dbs)
9. [Content Distribution Networks](#9-content-distribution-networks)
10. [Summary](#10-summary)

---

## 1. Scale-Out vs. Scale-Up Architecture

*Before diving into the mechanics of large-scale systems, you need to understand the fundamental choice every engineering team faces when traffic grows: do you get a bigger machine, or more machines?*

Imagine you're running a small restaurant. One day it gets wildly popular and you can't seat everyone. You have two options: rent a bigger dining room (**scale up**), or open more locations (**scale out**). The same choice exists in software. In a classic single-server architecture, a web browser sends HTTP requests across the Internet to one web server, which talks over a LAN to one storage system. That works fine until traffic grows beyond what one machine can handle.

**Scale-up architecture** — also called "vertical scaling" — means replacing your server with a more powerful one: more CPUs, more RAM, faster disks. The problem is that hardware has hard physical limits. At some point there simply is no bigger machine to buy, and the biggest machines available are disproportionately expensive. You're also left with a single point of failure: if that one server dies, your entire application goes with it.

**Scale-out architecture** — "horizontal scaling" — solves both problems by running many instances of your server simultaneously. Instead of one powerful machine, you deploy a fleet of ordinary commodity servers. Adding capacity is as simple as launching another instance; removing it is equally simple. Crucially, if one instance fails, the others keep serving traffic as if nothing happened. This natural redundancy is why virtually every large web application uses a scale-out model.

```
SCALE-UP   [ One giant server ]  ⚠  hits physical limit; single point of failure

SCALE-OUT  [ Server 1 ] [ Server 2 ] [ Server N ]  ✓  add/remove as needed
```

The challenge scale-out introduces is coordination: if you have a hundred web servers, how do incoming requests get spread across them evenly? How do all those servers share data? These are exactly the problems the rest of this tutorial addresses.

> **⚡ Key Takeaway**
>
> Scale-up architecture hits physical limits quickly and creates a single point of failure. Scale-out architecture adds more instances instead — it's cheaper, more resilient, and can grow (or shrink) with demand. Nearly every large web application in production today uses scale-out. The trade-off is that coordination between instances requires deliberate design choices for load balancing, shared storage, and session management.

---

## 2. Load Balancing: The Traffic Director

*Once you have multiple web servers, you need something to decide which server handles each incoming request. That "something" is a load balancer.*

Think of a load balancer like the host at a busy restaurant who greets every customer at the door and directs them to an available table. The customers (HTTP requests) don't know or care which table they get — they just want to be seated quickly. The host (load balancer) knows which servers are busy and which have capacity, and distributes the guests accordingly.

There are two primary strategies for implementing load balancing in web applications.

The first is **HTTP redirection**. When a browser connects to a front-end machine, that machine inspects the request and responds with an HTTP redirect telling the browser to try a specific back-end server instead. This is the approach Hotmail famously used in its early days. It is simple but not ideal for performance, because the extra round-trip of the redirect adds latency before the user gets any real content.

The second, more common approach is **DNS load balancing**. DNS — the Domain Name System — is the internet's phonebook: it translates human-readable names like `example.com` into numeric IP addresses that computers actually use. In DNS load balancing, a single domain name is configured to map to multiple IP addresses, each corresponding to a different server. Each time a browser looks up the domain, the DNS server returns a different IP from a rotating list, spreading requests across the server pool.

**DNS Round-Robin — Conceptual**

```dns
; Each lookup of "app.example.com" returns a different IP,
; distributing requests across all three servers.

app.example.com.  60  IN  A  203.0.113.10   ; Server 1 (US-West)
app.example.com.  60  IN  A  203.0.113.20   ; Server 2 (US-East)
app.example.com.  60  IN  A  203.0.113.30   ; Server 3 (EU-West)

; TTL of 60 seconds — DNS caches update frequently,
; so traffic shifts quickly if a server is removed.
```

*DNS round-robin distributes load by returning different IP addresses on each lookup. The short TTL (time-to-live) means the browser re-queries DNS frequently, so changes propagate quickly.*

For higher-performance needs, companies deploy a **Layer 4–7 load-balancing switch**. This is specialized network hardware (or software) that sits between the internet and your server pool, inspecting incoming TCP/IP packets as they arrive. When a connection request comes in, the switch picks a server from the pool — based on random selection, current load estimates, or even the contents of session cookies — and forwards all subsequent packets for that connection to the same server. Because it operates below the application layer, it is extremely fast and capable of handling millions of connections per second.

> **⚡ Key Takeaway**
>
> A load balancer is the traffic cop for your server fleet. DNS load balancing is simple and geographically aware but is limited by DNS caching delays. Hardware/software Layer 4–7 switches are faster and smarter — they can inspect session cookies to guarantee a user's requests always reach the same server. Both approaches are often used together in real deployments.

---

## 3. nginx: The Workhorse in Front of Node

*If you've deployed a Node.js application in production, you've almost certainly encountered nginx. Understanding why it exists — and what problem it solves — is essential knowledge for any backend developer.*

**nginx** (pronounced "Engine X") is an extraordinarily efficient web server and reverse proxy. While a Node.js server handles tens or hundreds of simultaneous connections well, nginx is engineered specifically to handle *tens of thousands* of concurrent HTTP connections simultaneously, with minimal memory overhead. It achieves this through an event-driven, non-blocking architecture distinct from the per-thread model used by older web servers.

In a typical production deployment, nginx does not serve your application code directly. Instead, it acts as a "gatekeeper" that sits in front of a pool of Node.js application servers. Every request from the internet hits nginx first. nginx then **proxies** (forwards) that request to one of the Node.js servers in its pool and relays the response back to the browser. This pattern is called a **reverse proxy**.

What nginx provides in this configuration:

- **Load Balancing** — nginx forwards requests across a pool of Node.js instances, routing around any that go offline automatically.
- **Static Files** — Images, CSS, and built JS bundles are served directly by nginx — far faster than hitting Node for static assets.
- **DoS Mitigation** — nginx can enforce request rate limits, blocking or throttling clients that send too many requests per second.
- **Dynamic Pool** — Node instances can be added or removed from the pool without downtime; nginx detects failures and stops routing to dead servers.

**nginx reverse proxy config — essentials**

```nginx
# Define the pool of Node.js backend servers
upstream nodejs_pool {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name example.com;

    # Serve static assets directly — much faster
    location /static/ {
        root /var/www/app;
        expires 30d;
    }

    # Forward all other requests to the Node pool
    location / {
        proxy_pass http://nodejs_pool;
        proxy_set_header Host $host;
    }
}
```

*nginx sits in front of three Node.js processes (on ports 3000–3002) and distributes incoming requests across them. Static files bypass Node entirely, reducing load on your application code.*

> **⚡ Key Takeaway**
>
> nginx is the standard "shield" in front of Node.js production deployments. It handles the raw concurrency that Node isn't optimized for, performs load balancing across a pool of Node instances, serves static files without involving your application code, and provides request rate limiting against abuse. If you're deploying Node.js to production, nginx almost certainly belongs in your architecture.

---

## 4. The Statelessness Requirement

*Load balancing works beautifully under one critical assumption: it doesn't matter which server handles a given request. But what if your servers are keeping track of information about the current user? That assumption breaks.*

A **stateless server** is one that holds no memory of previous requests. Every time a request arrives, the server reads everything it needs from the request itself (headers, cookies, body) and from the shared database — not from memory on the local machine. When a server is stateless, any server in your pool can handle any request from any user, which is exactly what load balancers need to be effective.

The problem arises with **session state** — information that persists across multiple requests in a user's visit, like their login status or shopping cart contents. If that state is stored in-memory on Server A, and the load balancer routes the user's next request to Server B, Server B has no idea who this user is.

**Stateful vs. Stateless Session Handling**

```js
// ❌ STATEFUL — session stored in local server memory
// Works with one server; breaks under load balancing
const sessions = {};  // lives only on THIS server
app.post('/login', (req, res) => {
  sessions[req.body.userId] = { loggedIn: true };
  // If next request hits a different server → user is "logged out"
});

// ✅ STATELESS — session stored in shared database / Redis
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
// Any server can now read this session from Redis ✓
```

*Storing session data in a shared, external store (like Redis) makes your Node.js servers truly stateless — any server in the pool can pick up any user's session, so load balancing works freely.*

There is one more complication: **WebSockets**. Unlike regular HTTP, which is request-response and stateless, a WebSocket creates a persistent bidirectional connection between a specific browser and a specific server. That connection is "pinned" to one server for its lifetime, which means you cannot freely re-route WebSocket traffic with a standard load balancer. Architectures that rely heavily on WebSockets require "sticky sessions" in the load balancer, or dedicated WebSocket infrastructure.

Session state needs to be not only shared but also *fast*. Because session data is accessed on virtually every request, reading it from a traditional database would add significant latency. This is why session stores like Redis or Memcache — which hold data in memory, not on disk — are the industry standard for session persistence.

> **⚡ Key Takeaway**
>
> For load balancing to work, your web servers must be stateless: they should not store any user-specific state in local memory. Instead, session data must live in a shared external store (Redis, Memcache) that every server in the pool can read. WebSockets are an exception — they create persistent connections to a single server and require special handling in load-balanced environments.

---

## 5. Scaling the Storage Layer

*Scaling web servers is relatively straightforward — just add more instances. Scaling the database is much harder, because databases must maintain consistency across all the data they hold.*

The web started with relational databases — systems like MySQL and PostgreSQL that organize data into tables with rows and columns, and support powerful query languages. These systems are excellent for complex queries and strong consistency guarantees. But a single relational database instance has a hard limit on how many reads and writes it can process per second. When traffic grows beyond that limit, you face the same problem as with web servers: you need to spread the load.

The primary technique is called **data sharding** — splitting your database across multiple independent instances, each of which holds a subset of the overall data. Each individual piece is called a **shard**. Think of it like organizing a library: instead of one enormous room where every book is jumbled together, you split the collection across multiple rooms. Books A–M go in Room 1, N–Z go in Room 2. Any librarian (your application) who wants a specific book first figures out which room it's in, then goes there.

**Selecting a Data Shard with a Hash Function**

```js
// Facebook's early approach: hash userId to determine which
// of 4000 MySQL servers holds that user's data.

const NUM_SHARDS = 4000;

function getShardForUser(userId) {
  // A consistent hash ensures the same userId always
  // maps to the same shard — critical for reads!
  const hash = cyrb53(String(userId));  // fast non-crypto hash
  return hash % NUM_SHARDS;             // shard index 0–3999
}

async function getUserProfile(userId) {
  const shardIndex = getShardForUser(userId);
  const db = dbPool[shardIndex];        // pick the right shard
  return db.query('SELECT * FROM users WHERE id = ?', [userId]);
}
```

*A hash function maps a user ID to a specific shard number. The same user ID always hashes to the same shard, ensuring reads and writes for that user always go to the same database instance.*

Sharding also improves resilience. If you store three copies of each shard on three different physical machines, then a single machine failure only affects a fraction of your data, and the remaining replicas take over seamlessly. Facebook's growth story illustrates the scale this eventually reaches: they started with one database per university campus, and by 2009 were running **4,000 MySQL servers**, using hash functions to route each query to the right shard.

The downside of sharding is complexity. Queries that span multiple shards — like "show me all posts from users in my friend list" — become expensive and complicated because data lives on different machines. This is one reason large companies invest heavily in custom database infrastructure and why NoSQL databases (which are designed with sharding in mind from the start) became popular.

> **⚡ Key Takeaway**
>
> A single database instance eventually becomes your bottleneck. Data sharding distributes data across many independent database instances using a hash function to determine which shard holds which data. Replication (three copies per shard) adds fault tolerance. The cost is added application complexity — cross-shard queries are hard, which is a fundamental architectural tension at scale.

---

## 6. Memcache: Trading Memory for Speed

*Even a well-sharded database has a fundamental limitation: it lives on disk. Reading from disk takes tens of milliseconds — fast by human standards, but agonizingly slow when your servers need to make hundreds of database queries per request.*

**Memcache** is a distributed, in-memory key-value store — a caching layer that lives entirely in RAM. Unlike a database, it does not persist data to disk. If a Memcache server restarts, its contents are gone. But what it lacks in durability it makes up for in raw speed: Memcache access times are around **500 microseconds**, compared to **10–50 milliseconds** for a database read. That is a 20–100× speed improvement.

| Metric | Value |
|---|---|
| Database read time | 10–50 ms |
| Memcache read time | ~500 µs |
| Speed improvement | **20–100×** |
| Facebook scale (2009) | **2,000 Memcache servers** |

The pattern works like this: before making a database query, your application checks Memcache first. If the data is there (a **cache hit**), you return it immediately without touching the database. If it's not there (a **cache miss**), you query the database, return the result, and store a copy in Memcache so the next request gets the fast path.

**Cache-Aside Pattern in Node.js**

```js
const memcache = require('memcachejs');

async function getUserProfile(userId) {
  const cacheKey = `user:${userId}`;

  // 1. Try the cache first (500 µs)
  const cached = await memcache.get(cacheKey);
  if (cached) return JSON.parse(cached);  // cache hit ✓

  // 2. Cache miss — hit the database (10–50 ms)
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

  // 3. Store in cache for next time (TTL: 5 minutes)
  await memcache.set(cacheKey, JSON.stringify(user), 300);

  return user;
}

// ⚠ When user data changes, YOU must invalidate the cache!
async function updateUser(userId, data) {
  await db.query('UPDATE users SET ... WHERE id = ?', [userId]);
  await memcache.delete(`user:${userId}`);  // flush stale cache
}
```

*The cache-aside pattern checks Memcache before querying the database. On a write, the cache entry must be explicitly deleted to prevent stale data from being served on the next read.*

There are important limitations to understand. Memcache only helps with *reads* — writes always have to go to the database, so write-heavy workloads see no benefit. Cache misses still pay the full database cost. And critically, **you are responsible for cache consistency**: if you update a user's data in the database without deleting the corresponding Memcache entry, future reads will return stale data until the entry expires. Getting cache invalidation right is famously one of the two hardest problems in computer science.

> **⚡ Key Takeaway**
>
> Memcache is a distributed in-memory key-value cache that sits in front of your database. It delivers a 20–100× speed improvement for read-heavy workloads by storing frequently accessed data in RAM. The key trade-offs: it only benefits reads, data is lost on restart, and *you* are responsible for invalidating cache entries when the underlying database data changes.

---

## 7. Cloud Computing: Renting the Infrastructure

*Building a scale-out architecture from scratch used to require enormous capital investment and specialized expertise. Cloud computing changed the economics of infrastructure entirely.*

Before cloud computing, deploying a web application at scale meant physically purchasing server hardware, racking it in a data center, signing multi-year lease agreements, and hiring sysadmins to maintain everything. A startup in 1998 bought server machines before writing a single line of product code. The upfront investment was staggering, and the lead time for new hardware was weeks.

**Virtualization** is the key technology that made cloud computing possible. A virtual machine is not a physical computer — it is a software simulation of a computer, running on top of a physical host. The virtualization layer lets one physical server run dozens of independent virtual machines simultaneously, each with its own isolated operating system, memory, and storage. Virtual machines can be created, started, stopped, and deleted in seconds — and they exist as portable disk images that can run on any compatible physical host.

```
VM Images (logical)          Virtualization Layer          Physical Servers
──────────────────                    ⇄                   ──────────────────
Load Balancer  ×1                                          srv  srv  srv
Web Server     ×100                                        srv  srv  srv
Database       ×50                                         srv  srv  srv
Memcache       ×20                                         srv  srv  srv
```

Cloud providers like **Amazon Web Services (EC2)**, **Microsoft Azure**, and **Google Cloud** take virtualization one step further: they manage enormous data centers full of physical hardware, and let you rent virtual machines by the hour. You specify what you need — how many CPUs, how much memory, how much storage — and the cloud provider allocates it from their pool of physical servers.

The economics of this model are transformative:

**1998 Software Startup** — First purchase: server machines. Weeks of lead time. Massive upfront capital. Hire sysadmins.

**2012 Software Startup** — No server machines. Sign up for AWS. Launch infrastructure in minutes. Pay by the request.

**Today** — Large companies eventually build their own data centers when cloud costs exceed custom-build costs, but start on cloud.

> **⚡ Key Takeaway**
>
> Cloud computing, enabled by virtualization, fundamentally changed the economics of web infrastructure. Instead of massive upfront capital and weeks of lead time, you rent virtual machines by the hour from AWS, Azure, or Google Cloud. You get instant scaling (up or down), no hardware management, and global deployment — at the cost of ongoing operational expenses that eventually motivate large companies to build their own data centers.

---

## 8. Beyond VMs: Containers, Serverless, and Managed DBs

*Managing virtual machines is still a lot of work. You still need to handle operating system updates, security patches, capacity planning, and deployment pipelines. A new generation of cloud services abstracts all of that away.*

Virtual machines are powerful and flexible, but they carry significant overhead: each VM runs an entire operating system, which consumes memory and takes minutes to boot. **Containers** (like Docker) offer a lighter alternative. Instead of virtualizing the entire machine, a container packages just your application and its dependencies as an isolated process that runs on a shared OS kernel. Containers boot in seconds, use far less memory than VMs, and are trivially portable between environments. Container orchestration systems like **Kubernetes** manage fleets of containers automatically — scheduling them across available hardware, restarting failed containers, and scaling counts up or down based on load.

| Approach | What You Manage | Best For |
|---|---|---|
| Virtual Machines | OS, runtime, app, scaling | Full control, legacy apps |
| Containers (Docker/K8s) | App + dependencies; K8s manages the rest | Microservices, portability |
| Cloud Database (Spanner, DynamoDB) | Schema + data; cloud runs the DB | Managed storage at scale |
| Serverless (Lambda, Cloud Functions) | Function code only | Event-driven, unpredictable load |

**Cloud managed databases** remove the need to run database instances yourself. Services like Google Spanner and Amazon DynamoDB are fully managed: you define a schema and issue queries, and the cloud provider handles replication, backups, sharding, failover, and patching. They offer high availability, global replication, consistent performance at any scale, and usage-based pricing.

**Serverless computing** — through services like Amazon Lambda, Microsoft Azure Functions, and Google Cloud Functions — takes abstraction the furthest. You write individual functions, associate each with a URL route and HTTP verb (much like an Express route handler), and upload them to the cloud. The cloud provider handles everything else: allocating hardware to run the function, scaling that allocation up when traffic spikes, shrinking it when traffic falls, and routing HTTP requests to the correct function. You pay per invocation rather than for continuously running servers.

**Serverless — AWS Lambda handler (Node.js)**

```js
// This is a complete Lambda function — no server setup, no Express,
// no port management. Just the handler logic.

exports.handler = async (event) => {
  const userId = event.pathParameters?.id;

  if (!userId) {
    return { statusCode: 400, body: 'Missing user ID' };
  }

  const user = await getUserFromDynamo(userId);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  };
};

// AWS routes GET /users/{id} → this function.
// Infrastructure, scaling, and monitoring: handled by AWS.
// You pay only when this function actually runs.
```

*A Lambda function looks just like a Node.js Express handler, but with no server configuration required. AWS allocates compute automatically, scales to zero when idle, and charges only per invocation.*

Serverless comes with trade-offs. You are constrained to the runtimes the provider supports (Python, JavaScript, Java, Go, and a few others). Cold starts — the brief delay when a new function instance is initialized after being idle — can add latency for infrequently used endpoints. And debugging distributed serverless functions can be significantly harder than debugging a traditional application server.

> **⚡ Key Takeaway**
>
> Each layer of abstraction above raw VMs trades control for convenience. Containers (Docker/Kubernetes) remove OS management. Managed cloud databases remove database operations. Serverless removes server management entirely — you write function handlers and the cloud platform handles all scaling, routing, and infrastructure. For many web applications today, a serverless backend plus a managed database is a compelling default architecture.

---

## 9. Content Distribution Networks

*Not all content needs to come from your application servers. Static assets — images, CSS files, compiled JavaScript bundles — can be served from somewhere much closer to the user.*

When a browser requests a file, the request must physically travel from the user's device to your server and back. A user in Tokyo fetching content from a server in Virginia experiences a round-trip time of roughly 150 milliseconds just from the physics of distance — before any server processing even begins. For a page that requires dozens of asset fetches, those latencies add up.

A **Content Distribution Network (CDN)** is a global network of servers strategically positioned in cities and countries around the world. You upload your static content to the CDN and receive a URL in return. When you embed that URL in your application (in an `<img src="...">` or `<script src="...">` tag), browsers that request it are automatically directed — using the same DNS tricks described in the load balancing section — to the CDN server closest to them.

```
User: Tokyo     → DNS → CDN Edge: Tokyo    (~2ms)
User: London    → DNS → CDN Edge: London   (~3ms)
User: São Paulo → DNS → CDN Edge: São Paulo (~4ms)

Without CDN: all three users hit origin server (e.g., Virginia) → 80–180ms each.
```

Beyond latency reduction, CDNs dramatically reduce the load on your origin servers. If you have a popular image that receives a million requests per hour, those requests are absorbed by the CDN's edge nodes — your backend never sees them. This is the difference between your origin servers handling a million requests and handling essentially zero for that asset.

The critical constraint is that CDNs are for **read-only, cacheable content**. They work because the same file can be served from any edge location without modification. Dynamic content — an API response personalized to a specific user, a shopping cart, real-time data — cannot be meaningfully CDN-cached and must continue to come from your application servers. Effective use of a CDN therefore requires consciously separating your application's static assets from its dynamic content.

> **⚡ Key Takeaway**
>
> A CDN distributes static content (images, CSS, JS bundles) to edge servers around the world, so users fetch assets from a geographically nearby node rather than a single distant origin server. This reduces latency dramatically and eliminates a huge fraction of requests from your origin infrastructure. The constraint: CDNs only work for content that is identical for all users and doesn't need to change frequently.

---

## 10. Summary

You've just covered the architectural patterns that underpin nearly every large web application on the internet. Here is the essence of what matters.

**01 — Scale out, not up.**
Adding more commodity server instances is cheaper, more resilient, and more flexible than buying a single bigger machine. This is the foundational choice of large-scale web architecture, and every other pattern in this tutorial supports it.

**02 — Stateless servers enable free load balancing.**
Servers that hold no local state can handle any request from any user. Move session data into a shared external store (Redis, Memcache) so your load balancer can distribute traffic freely. nginx is the industry-standard "shield" that sits in front of Node.js servers to make this work.

**03 — Database sharding plus caching handles read scale.**
A single database is always the bottleneck. Sharding spreads data across many instances; Memcache eliminates most read traffic entirely at 20–100× the speed. Writes always go to the database, and cache invalidation is your responsibility.

**04 — Cloud computing democratized scale.**
Virtualization lets cloud providers (AWS, Azure, GCP) rent you virtual machines by the hour — no upfront capital, instant scaling, global distribution. Higher-level abstractions (containers, managed databases, serverless functions) let you focus on application logic instead of infrastructure operations.

**05 — CDNs eliminate latency for static content.**
Serve your images, CSS, and JavaScript bundles from a global CDN, not your origin servers. Users get assets from a nearby edge node in milliseconds; your backend is freed from serving millions of static file requests.

---

*CS142 · Web Application Development · Large-Scale Web Apps · Lecture by Mendel Rosenblum, Stanford University*
