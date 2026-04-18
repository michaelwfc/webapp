# CS142 — Database & Storage Layer: Notes + Tutorial

> **Source:** CS142 Lecture Notes — Database (Mendel Rosenblum, Stanford)


---

## The Storage Tier in Web Apps

A typical web application has three tiers:

```
Web Browser:HTTP ->  Web Server: LAN ->  Storage System
```

The **storage tier** is responsible for persisting all application data — user accounts, photos, comments, sessions — so that it survives server restarts and can be shared across multiple server instances.

---

### What a Storage System Must Do

A good storage system for a web app must be:

| Property | What it means |
|---|---|
| **Always available** | Fetch and store data at any time |
| **Scalable** | Handle many concurrent requests from around the world |
| **Reliable / Fault tolerant** | Keep working even if individual pieces fail |
| **Well-organized** | Quickly generate model data for views |
| **Evolvable** | Adapt gracefully as the application changes |
| **Easy to reason about** | Good software engineering interface |

---

## Relational Databases

Historically, the database community converged on the **relational model** as the standard answer to web app storage.

### Core Concepts

- Data is organized as **tables** (also called *relations*)
- A table is made of **rows** (also called *tuples* or *records*)
- Each row has a fixed set of **typed columns**

### Common Column Types

| SQL Type | Description |
|---|---|
| `VARCHAR(n)` | String up to n characters |
| `INTEGER` | Whole number |
| `FLOAT`, `DOUBLE` | Floating-point number |
| `DATE`, `TIME`, `DATETIME` | Date/time values |

### Example: User Table

| ID | first_name | last_name | location |
|----|-----------|-----------|----------|
| 1 | Ian | Malcolm | Austin, TX |
| 2 | Ellen | Ripley | Nostromo |
| 3 | Peregrin | Took | Gondor |
| 4 | Rey | Kenobi | D'Qar |
| 5 | April | Ludgate | Awnee, IN |
| 6 | John | Ousterhout | Stanford, CA |

Column types: `ID` → INTEGER, `first_name` / `last_name` / `location` → VARCHAR(20)

---

### Database Schema

The **schema** is the *structure* of the database — not the data itself. It includes:

- Table names (e.g., `User`, `Photo`, `Comments`)
- Column names and their types
- Constraints (e.g., NOT NULL, UNIQUE)

Think of a schema as a blueprint. The actual rows are the house built from that blueprint.

---

### SQL — Structured Query Language

SQL is the standard language for working with relational databases. Its power lies in **queries** — you specify *what* you want, and the database figures out *how* to get it efficiently.

#### Creating a Table

```sql
CREATE TABLE Users (
  id         INT AUTO_INCREMENT,
  first_name VARCHAR(20),
  last_name  VARCHAR(20),
  location   VARCHAR(20)
);
```

#### Inserting a Row

```sql
INSERT INTO Users (first_name, last_name, location)
VALUES ('Ian', 'Malcolm', 'Austin, TX');
```

#### Reading Data

```sql
-- Get all users
SELECT * FROM Users;

-- Get a specific user by ID
SELECT * FROM Users WHERE id = 2;
```

#### Updating a Row

```sql
UPDATE Users
SET location = 'New York, NY'
WHERE id = 2;
```

#### Deleting a Row

```sql
DELETE FROM Users WHERE last_name = 'Malcolm';
```

> **Key insight:** You *declare* what you want with SQL. The database engine optimizes the execution plan automatically.

---

### Keys and Indexes

#### The Problem

Consider this query:

```sql
SELECT * FROM Users WHERE id = 2;
```

Without an index, the database must **scan every row** in the table — slow for large datasets.

#### Primary Keys

Declaring a **primary key** tells the database to build an efficient index automatically:

```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT,
  PRIMARY KEY(id),
  ...
);
```

#### Secondary Keys (Indexes)

You can also add indexes on other columns:

```sql
-- Regular index (speeds up lookups)
CREATE INDEX idx_last_name ON Users(last_name);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_username ON Users(username);
```

#### Trade-offs of Indexes

| Benefit | Cost |
|---|---|
| Faster reads / queries | Slower writes (inserts, updates, deletes must update index) |
| Can enforce uniqueness | Uses extra storage space |

**When to add an index:**
- Queries on that column are slow and frequent
- You need to enforce uniqueness on a column

---

## Object Relational Mapping (ORM)

Raw SQL in web apps can be awkward — developers think in *objects*, but SQL databases think in *tables*. This mismatch led to **ORMs**.

### What an ORM Does

An ORM maps:
- **Classes** → tables
- **Objects** (instances) → rows
- **Object attributes** → columns

The ORM handles generating all SQL behind the scenes. Rails' **Active Record** popularized this approach.

```
User object.save()  →  INSERT INTO users (...) VALUES (...)
User.find(42)       →  SELECT * FROM users WHERE id = 42
```

---

# NoSQL and MongoDB

As web apps grew, SQL databases showed limitations — particularly around flexibility (schema changes are hard) and horizontal scaling. This gave rise to **NoSQL** databases.

## What is MongoDB?
MongoDB is a document database — instead of storing data in rows and columns like a spreadsheet (SQL), it stores data as JSON-like documents. That means your data can be nested, flexible, and shaped however your application actually needs it.

It's open-source, scales horizontally, and is the backbone of many major apps you use daily.

Analogy
Think of a SQL database as a rigid Excel spreadsheet — every row must have the same columns. MongoDB is more like a folder of Post-it notes — each note can have different information, structured however makes sense for that note.



### MongoDB — The Most Prominent NoSQL DB

| Feature | NoSQL DB | Relational Database |
|---|---|-----------|
| Data model | Collections of **documents** (JSON objects) |  Tables with fixed columns|
| Schema | Flexible — documents in the same collection don't need identical fields |  Schema must be defined upfront| 
| Related Data | Related data can be embedded | Rows relate via foreign keys |
| Scenari| Great for hierarchical / JSON data | Great for structured, relational data |
| Query language | Expressive, JSON-based queries | SQL|
| Indexing | Changed B+tree indexes | B+-tree indexes |
| Scalability | Designed for horizontal scale and fault tolerance |

### Core concepts
MongoDB has a simple mental model — just three levels: database → collection → document. Once you understand these, everything else clicks.


- Database
The top-level container. One MongoDB server can run many databases (e.g. myapp_dev, myapp_prod). Each database holds collections.

- Collection
Like a SQL table — but without a fixed schema. A collection groups related documents (e.g. users, products, orders). Documents in the same collection don't need identical fields.

- Document
The actual data — a JSON object. Documents can be nested (objects inside objects), and fields can be arrays. Every document gets a unique _id automatically.

#### Terminology Comparison

| Relational DB | MongoDB |
|---|---|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| JOIN   | Embedded doc or $lookup |

A sample document — notice how address and hobbies are embedded right inside:

users collection — one document: 
_id is automatically added to every document. You can provide your own (e.g. a UUID string), or let MongoDB generate an ObjectId — a 12-byte unique identifier that encodes a timestamp.

```json
{
  "_id":       ObjectId("64ab12..."),
  "name":      "Maya Rodriguez",
  "email":     "maya@example.com",
  "age":       31,
  "address": {
    "city":    "Tokyo",
    "country": "Japan"
  },
  "hobbies":   ["hiking", "coding"],
  "active":    true
}
```
---

## CRUD operations

CRUD stands for Create, Read, Update, Delete — the four fundamental operations for any database. In MongoDB, these map cleanly to shell commands (and driver methods in Node, Python, etc.).

### Create
Use insertOne() to add a single document, or insertMany() for a batch. MongoDB automatically adds _id if you don't provide one.

```js
// Insert one document
db.users.insertOne({
  name:  "Maya Rodriguez",
  email: "maya@example.com",
  age:   31,
  city:  "Tokyo"
})

// Insert many at once
db.users.insertMany([
  { name: "Carlos Ruiz",  age: 24, city: "Madrid" },
  { name: "Aiko Tanaka", age: 29, city: "Osaka"  }
])
```

### Read
find() returns a cursor (list) of matching documents. findOne() returns just the first match. Pass an empty object {} to get everything.

```js
// Find ALL users
db.users.find({})

// Find users in Tokyo
db.users.find({ city: "Tokyo" })

// Find ONE user by email
db.users.findOne({ email: "maya@example.com" })

// Find and return only name + email (projection)
db.users.find({}, { name: 1, email: 1, _id: 0 })
```

### Update

Use $set to change specific fields without touching the rest. updateOne() changes the first match; updateMany() changes all matches.


```js
// Update one field on a specific user
db.users.updateOne(
  { email: "maya@example.com" },
  { $set: { city: "Osaka", age: 32 } }
)

// Update all users in Madrid — add a field
db.users.updateMany(
  { city: "Madrid" },
  { $set: { country: "Spain" } }
)

// Increment a number field
db.users.updateOne(
  { name: "Carlos Ruiz" },
  { $inc: { age: 1 } }
)

// upsert: insert if not found
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User" } },
  { upsert: true }
)
```

### Delete

Be careful — deleteMany({}) with an empty filter deletes everything! Always double-check your filter before running delete commands.

```js
// Delete one document
db.users.deleteOne({ email: "maya@example.com" })

// Delete all inactive users
db.users.deleteMany({ active: false })

// Drop the entire collection (irreversible!)
db.users.drop()
```

Always run a find() with your filter first to see what will be deleted before firing deleteMany(). Production accidents from empty filters are surprisingly common.


## Queries & Filters

MongoDB's query language uses special operator keywords that start with $. Combine them to filter, compare, and match documents with precision.

### comparison operators
```js
// Greater than, less than
db.users.find({ age: { $gt: 25, $lte: 40 } })

// Not equal
db.users.find({ city: { $ne: "Tokyo" } })

// Match any of a list (like SQL's IN)
db.users.find({ city: { $in: ["Tokyo", "Osaka", "Kyoto"] } })

// Exists check
db.users.find({ phone: { $exists: true } })

```

### logical operators
```js

copy
// AND — fields automatically AND together
db.users.find({ age: { $gt: 25 }, city: "Tokyo" })

// Explicit $and
db.users.find({
  $and: [
    { age:  { $gt: 25 } },
    { city: "Tokyo"      }
  ]
})

// OR
db.users.find({
  $or: [
    { city: "Tokyo"  },
    { city: "Madrid" }
  ]
})

// NOT
db.users.find({ age: { $not: { $gt: 30 } } })

```
### array & nested queries

```js
// Find docs where hobbies array contains "hiking"
db.users.find({ hobbies: "hiking" })

// Array contains all of these values
db.users.find({ hobbies: { $all: ["coding", "hiking"] } })

// Query nested field with dot notation
db.users.find({ "address.city": "Tokyo" })

// Sort, skip, limit — for pagination
db.users.find({})
  .sort({ age: -1 })   // -1 = descending
  .skip(20)
  .limit(10)
```

### text search

```js
// First create a text index
db.products.createIndex({ name: "text", description: "text" })

// Then search
db.products.find({ $text: { $search: "wireless headphones" } })
```
--------


## Indexes

Without an index, MongoDB scans every document to find matches — called a collection scan. Indexes let the database jump directly to matching documents, like a book's index vs reading every page.

They're one of the biggest performance levers you have.

### creating indexes
💡Every index speeds up reads but slows down writes — the index must be updated on every insert, update, and delete. Don't index every field; index the fields you actually query frequently. Use explain() to verify an index is being used.

⚠️ Compound indexes are directional — an index on {userId: 1, createdAt: -1} supports queries that filter on userId alone, or on both userId + createdAt. It does not efficiently support queries on createdAt alone (the leftmost rule).

```js
// Single field index
db.users.createIndex({ email: 1 })

// Unique index (enforces no duplicates)
db.users.createIndex({ email: 1 }, { unique: true })

// Compound index (covers queries on both fields)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// TTL index — auto-delete after N seconds
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // 1 hour
)

// List all indexes on a collection
db.users.getIndexes()

// Explain a query — see if index is used
db.users.find({ email: "maya@example.com" }).explain("executionStats")
```


## Aggregation Pipeline

The aggregation pipeline is MongoDB's answer to SQL's GROUP BY, JOIN, and complex transformations. Data flows through a series of stages, each transforming the documents before passing them to the next stage.

```js
$match → Filter documents (like a WHERE clause)
$group → Group by a field and compute aggregates (sum, avg, count)
$sort → Order the results
$project → Reshape documents — include, exclude, or compute new fields
$lookup → Join with another collection (like SQL LEFT JOIN)
$limit / $skip → Paginate the output
$unwind → Flatten an array field into multiple documents

```

example — orders by city

```js
db.orders.aggregate([
  // Stage 1: only look at completed orders
  { $match: { status: "completed" } },

  // Stage 2: group by city, sum the totals
  { $group: {
      _id:        "$city",
      totalSales: { $sum: "$amount" },
      orderCount: { $sum: 1 }
  }},

  // Stage 3: sort highest sales first
  { $sort: { totalSales: -1 } },

  // Stage 4: top 10 cities only
  { $limit: 10 }
])
```

<!-- $lookup — joining collections -->
```js
db.orders.aggregate([
  // Join the 'users' collection on userId
  { $lookup: {
      from:         "users",
      localField:   "userId",
      foreignField: "_id",
      as:           "userInfo"
  }},

  // Flatten the array (lookup returns an array)
  { $unwind: "$userInfo" },

  // Shape the output
  { $project: {
      orderId:   "$_id",
      amount:    1,
      userName:  "$userInfo.name",
      userEmail: "$userInfo.email"
  }}
])
```

## Mongosh (shell)

MongoDB's shell is a command-line interface (CLI) for interacting with MongoDB. It's a great way to test queries and explore the database.

### Start Mongodb server and  mongosh
```powershell
# mongod --dbpath /data/db
# make a data directory
mkdir C:\data\db
mongod --dbpath C:\mongodb\data

# Once the MongoDB server has started successfully, you can connect using mongosh:
mongosh
```

## Mongoose(Node.js)
Mongoose is an Object Document Mapper (ODM) for Node.js. It adds schemas, validation, and a clean API on top of MongoDB — making it much easier to work with in a real application.

analogy
Mongoose is to MongoDB what Sequelize or Prisma is to SQL — it adds structure, type safety, and convenience methods so you're not manually constructing queries everywhere.


### Schema Enforcement with Mongoose

Pure MongoDB is very flexible (no enforced schema), but that can be a problem:

```html
<!-- What if person.informalName is null, a 1GB object, or undefined? -->
<h1>Hello {{ person.informalName }}</h1>
```

**Mongoose** is a Node.js library that adds a schema layer on top of MongoDB. It is an **Object Document Mapper (ODM)** — the document equivalent of an ORM.

### Why Mongoose?

- Adds schema validation to MongoDB documents
- Provides a clean, ORM-like API
- Masks low-level MongoDB driver complexity
- Exports a *Persistent Object* abstraction

---

### Connecting to MongoDB via Mongoose

```js
// npm install mongoose
const mongoose = require('mongoose');

// 1. Connect to the MongoDB instance
mongoose.connect('mongodb://localhost/cs142');

// 2. Wait for the connection to open
mongoose.connection.on('open', function () {
  console.log('Connected! Ready to handle requests.');
});

// 3. Handle connection errors
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error:', err);
});

// Other events you can listen for:
// 'connecting', 'connected', 'disconnecting', 'disconnected'
```

---

### Defining Schemas and Models

#### Step 1 — Define a Schema

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name:     String,
  last_name:      String,
  emailAddresses: [String],       // Array of strings
  location:       String
});
```

##### Mongoose Schema Types

| Type | Example |
|---|---|
| `String` | `'hello'` |
| `Number` | `42` |
| `Date` | `new Date()` |
| `Buffer` | Binary data |
| `Boolean` | `true` / `false` |
| `Array` | `[ObjectId]`, `[String]` |
| `ObjectId` | Reference to another document |
| `Mixed` | Any value |

##### Adding Indexes and Defaults

```js
const userSchema = new mongoose.Schema({
  // Simple index
  first_name: { type: String, index: true },

  // Unique index
  user_name: { type: String, index: { unique: true } },

  // Default value
  created_at: { type: Date, default: Date.now }
});
```

#### Step 2 — Create a Model from the Schema

```js
// mongoose.model('CollectionName', schema)
const User = mongoose.model('User', userSchema);
```

The `User` variable is now a **constructor** (class) for User documents.

#### Step 3 — Create a Document

```js
User.create(
  { first_name: 'Ian', last_name: 'Malcolm' },
  function (err, newUser) {
    if (err) throw err;
    console.log('Created user with ID:', newUser._id);
  }
);
```

---

### Querying with Mongoose

#### Find All Documents

```js
User.find(function (err, users) {
  // users is an array of all User documents
  console.log(users);
});
```

#### Find a Single Document

```js
User.findOne({ _id: user_id }, function (err, user) {
  if (err) throw err;
  console.log(user.first_name);
});
```

#### Update a Document

```js
User.findOne({ _id: user_id }, function (err, user) {
  if (err) throw err;
  // Mutate the object...
  user.location = 'New York, NY';
  // ...then save it back
  user.save();
});
```

#### Advanced Queries — The Query Builder

Mongoose provides a chainable query builder:

```js
let query = User.find({});

// Select only certain fields (projection)
query.select('first_name last_name').exec(callback);

// Sort results
query.sort('first_name').exec(callback);

// Limit number of results
query.limit(50).exec(callback);

// Chain multiple operations
User.find({})
  .sort('-location')         // sort descending by location
  .select('first_name')      // only return first_name field
  .exec(callback);
```

---

####  Deleting Documents

```js
// Delete a single user by ID
User.remove({ _id: user_id }, function (err) {
  if (err) throw err;
  console.log('Deleted!');
});

// Delete ALL users (use with caution!)
User.remove({}, function (err) {
  if (err) throw err;
  console.log('All users removed.');
});
```

---

### Putting It All Together — Tutorial Project

Here's a minimal but complete example that ties everything together — a simple user management module using Mongoose.

#### Setup

```bash
npm install mongoose
```

#### `db.js` — Connection Module

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp');

mongoose.connection.on('open', () => {
  console.log('MongoDB connected.');
});

mongoose.connection.on('error', (err) => {
  console.error('Connection error:', err);
});

module.exports = mongoose;
```

#### `models/User.js` — User Schema + Model

```js
const mongoose = require('../db');

const userSchema = new mongoose.Schema({
  first_name:  { type: String, required: true },
  last_name:   { type: String, required: true },
  email:       { type: String, index: { unique: true } },
  location:    String,
  created_at:  { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

#### `routes/users.js` — CRUD Operations

```js
const User = require('../models/User');

// CREATE
async function createUser(req, res) {
  try {
    const user = await User.create({
      first_name: req.body.first_name,
      last_name:  req.body.last_name,
      email:      req.body.email,
      location:   req.body.location
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// READ all
async function getAllUsers(req, res) {
  const users = await User.find({})
    .select('first_name last_name email')
    .sort('last_name')
    .limit(100);
  res.json(users);
}

// READ one
async function getUserById(req, res) {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
}

// UPDATE
async function updateUser(req, res) {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(404).json({ error: 'Not found' });
  Object.assign(user, req.body);
  await user.save();
  res.json(user);
}

// DELETE
async function deleteUser(req, res) {
  await User.remove({ _id: req.params.id });
  res.json({ message: 'Deleted successfully' });
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
```


## Best Practices

A few principles that will save you a lot of pain as your app grows.

1. Design your schema around your queries, not your data
In SQL, you normalize data. In MongoDB, ask "what does my app need to read?" and design around that. Embedding data that is always read together avoids expensive lookups.

2. Index early — but not everything
Add indexes on fields you query frequently or sort by. Use explain("executionStats") regularly. Too many indexes slow down writes and waste disk space.

3. Avoid unbounded arrays
Arrays that grow without limit (e.g. storing all events on a document) will eventually cause document size issues. Store high-volume sub-items in a separate collection instead.

4. Use projection to limit returned data
Always pass a projection as the second argument to find() when you don't need all fields. Transferring less data = faster responses.

5. Use connection pooling in production
Don't open a new connection per request. Use a single Mongoose connection (or the official driver's pool) shared across your entire app. Connection pools are the default — don't call connect() inside request handlers.

6. Enable transactions for multi-document operations
MongoDB supports multi-document ACID transactions (replica sets required). Use them when you need atomicity across multiple documents — e.g. transferring balance between two accounts.


### Key Takeaways

| Concept | Relational (SQL) | Document (MongoDB/Mongoose) |
|---|---|---|
| Structure unit | Table | Collection |
| Data unit | Row | Document (JSON) |
| Schema | Rigid, defined upfront | Flexible, enforced optionally via Mongoose |
| Query language | SQL | Mongoose query API / MongoDB query objects |
| Relationships | Foreign keys + JOINs | Embedded documents or ObjectId references |
| Best for | Structured, relational data | Hierarchical/JSON-friendly data, fast iteration |

---

*Notes based on CS142 Web Applications — Stanford University (Mendel Rosenblum)*
