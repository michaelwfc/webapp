

# mongosh — Complete Tutorial

> The official MongoDB interactive shell. Run queries, explore data, manage collections — all from the command line.

## Reference

- [MongoDB Crash Course](https://www.youtube.com/watch?v=ofme2o29ngU)

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Navigation](#2-navigation)
3. [CRUD Operations](#3-crud-operations)
4. [Querying & Filters](#4-querying--filters)
5. [Update Operators](#5-update-operators)
6. [Indexes](#6-indexes)
7. [Aggregation Pipeline](#7-aggregation-pipeline)
8. [Admin Commands](#8-admin-commands)
9. [Tips & Tricks](#9-tips--tricks)
10. [Quick Reference Card](#10-quick-reference-card)

---


## 0. Install

### MongoDB Server (mongod)
MongoDB Server (mongod) — the database engine that listens on port 27017 (this is missing ✗)
- [安装 MongoDB Community Edition](https://www.mongodb.com/zh-cn/docs/manual/installation/)

### MongoDB Shell (mongosh)
- [MongoDB Shell mongosh](https://www.mongodb.com/zh-cn/docs/mongodb-shell/)
  
```bash
$ where mongod
C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe


$ where mongosh
C:\Users\michael\AppData\Local\Programs\mongosh\mongosh.exe

```
### MongoDB Compass


----
## 1. Getting Started

### Start mongodb
```cmd
mongod
```

### Connect to mongosh

mongosh is the **client** — it needs MongoDB Server (mongod) running to connect to.

### Connect to local MongoDB

```bash
# Default — connects to localhost:27017
$ mongosh
Current Mongosh Log ID: 69dd7e964fe158b1043682d0
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.2
Using MongoDB:          8.2.6
Using Mongosh:          2.8.2

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-04-14T07:38:49.239+08:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-04-14T07:38:49.240+08:00: This server is bound to localhost. Remote systems will be unable to connect to this server. Start the server with --bind_ip <address> to specify which IP addresses it should serve responses from, or with --bind_ip_all to bind to all interfaces. If this behavior is desired, start the server with --bind_ip 127.0.0.1 to disable this warning
------

test>   ← you are now in the shell
```

### Connect to other hosts

```bash
# Connect directly to a named database
$ mongosh "mongodb://localhost:27017/myapp"

# Connect with credentials
$ mongosh "mongodb://user:password@localhost:27017/myapp"

# Connect to MongoDB Atlas (cloud)
$ mongosh "mongodb+srv://user:pass@cluster0.abc.mongodb.net/myapp"

# Connect to a remote host
$ mongosh "mongodb://192.168.1.100:27017"
```

### Essential shell shortcuts

```shell
exit           quit the shell (also Ctrl+D)
cls            clear the screen
help           show general help
db.help()      database-level help
↑ / ↓          scroll command history
Tab            autocomplete collection names and methods
```

---

## 2. Navigation

### Move between databases

```js
// Show all databases on the server
test> show dbs
// admin   40.00 KiB
// config  80.00 KiB
// local   64.00 KiB
// appdb   2.1 MB

// Switch to a database (creates it on first write)
test> use appdb
// switched to db myapp

// See which database you're currently in
appdb>
// myapp
```

> **Note:** A database only appears in `show dbs` after it contains at least one document. `use newdb` switches to it but doesn't actually create it until you write something.

### Explore collections

```js
// List all collections in the current database
appdb> show collections
// users
// orders
// products

// Count documents in a collection
appdb> db.users.countDocuments()
// 1482

// See a sample document to understand the shape
appdb> db.users.findOne()


// Get collection stats (size, indexes, etc.)
appdb> db.users.stats()

// List all indexes on a collection
appdb> db.users.getIndexes()
```

---

## 3. CRUD Operations

### create db

```js
test> show dbs
admin   40.00 KiB
config  80.00 KiB
local   64.00 KiB

test> use appdb
switched to db appdb

appdb> show dbs
admin   40.00 KiB
config  88.00 KiB
local   64.00 KiB
```

### Create

```js
// Insert one document to a collection
appdb> db.users.insertOne({
|   name:   "Maya Rodriguez",
|   email:  "maya@example.com",
|   age:    31,
|   city:   "Tokyo",
|   active: true
| })
// {
//   acknowledged: true,
//   insertedId: ObjectId('69dd82fbf16a0d961d3682d1')
// }
appdb> db.users.findOne()


appdb> db.users.find()
[
  {
    _id: ObjectId('69dd82fbf16a0d961d3682d1'),
    name: 'Maya Rodriguez',
    email: 'maya@example.com',
    age: 31,
    city: 'Tokyo',
    active: true
  }
]

appdb> db.users.insertOne({ name: "Maya Rodriguez"})
// {
//   acknowledged: true,
//   insertedId: ObjectId('69dd841ef16a0d961d3682d2')
// }

appdb> db.users.find()
[
  {
    _id: ObjectId('69dd82fbf16a0d961d3682d1'),
    name: 'Maya Rodriguez',
    email: 'maya@example.com',
    age: 31,
    city: 'Tokyo',
    active: true
  },
  { _id: ObjectId('69dd841ef16a0d961d3682d2'), name: 'Maya Rodriguez' }
]


// Insert many documents at once
db.users.insertMany([
  { name: "Carlos Ruiz", age: 24, city: "Madrid", balance: 100 ,debt: 200},
  { name: "Aiko Tanaka", age: 29, city: "Osaka" , balance: 300,debt: 400 },
  { name: "Sara Ahmed",  age: 35, city: "Cairo" , balance: 500,debt: 0 }
])
// { acknowledged: true, insertedCount: 3 }
```

> MongoDB automatically adds `_id` to every document. You can supply your own: `{ _id: "custom-id", ... }`

### Read

```js
// Get ALL documents
db.users.find()

// Filter by a field value
db.users.find({ city: "Tokyo" })

// Get only the first match
db.users.findOne({ email: "maya@example.com" })

// Find by _id
db.users.findOne({ _id: ObjectId("64ab12...") })

// Projection — 1 = include, 0 = exclude
db.users.find({}, { name: 1, email: 1, _id: 0 })

// Sort, skip, limit — pagination
db.users.find({})
  .sort({ age: -1 })   // -1 = descending
  .skip(0)
  .limit(10)
```

### Update

```js
// Update specific fields with $set
db.users.updateOne(
  { email: "maya@example.com" },   // filter
  { $set: { city: "Osaka", age: 32 } }  // update
)

// Update ALL matching documents
db.users.updateMany(
  { city: "Madrid" },
  { $set: { country: "Spain" } }
)

// Increment a number
db.users.updateOne(
  { name: "Carlos Ruiz" },
  { $inc: { age: 1 } }
)

// Push an item into an array
db.users.updateOne(
  { name: "Maya Rodriguez" },
  { $push: { tags: "vip" } }
)

// Upsert — insert if not found, update if found
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User", age: 20 } },
  { upsert: true }
)

// Find AND return the updated document
db.users.findOneAndUpdate(
  { name: "Aiko Tanaka" },
  { $set: { active: false } },
  { returnDocument: "after" }
)
```

### Delete

```js
// Delete the first matching document
db.users.deleteOne({ email: "maya@example.com" })

// Delete ALL matching documents
db.users.deleteMany({ active: false })

// SAFE PATTERN: count first, then delete
db.users.countDocuments({ active: false })   // check what will be deleted
db.users.deleteMany({ active: false })       // then delete

// Drop the entire collection (no undo!)
db.users.drop()
```

> ⚠️ **Warning:** `deleteMany({})` with an empty filter deletes every document. Always count first.

---

## 4. Querying & Filters

### Sort

```js
appdb> db.users.find().sort({name: -1})
// [
//   {
//     _id: ObjectId('69dd82fbf16a0d961d3682d1'),
//     name: 'Maya Rodriguez',
//     email: 'maya@example.com',
//     age: 31,
//     city: 'Tokyo',
//     active: true
//   },
//   { _id: ObjectId('69dd841ef16a0d961d3682d2'), name: 'Maya Rodriguez' },
//   { _id: ObjectId('69dea22ef16a0d961d3682d3'), name: 'John' }
// ]


appdb> db.users.find().sort({name: 1})
// [
//   { _id: ObjectId('69dea22ef16a0d961d3682d3'), name: 'John' },
//   {
//     _id: ObjectId('69dd82fbf16a0d961d3682d1'),
//     name: 'Maya Rodriguez',
//     email: 'maya@example.com',
//     age: 31,
//     city: 'Tokyo',
//     active: true
//   },
//   { _id: ObjectId('69dd841ef16a0d961d3682d2'), name: 'Maya Rodriguez' }
// ]
```

### Filter

```js
appdb> db.users.find({name:"John"})
// [ { _id: ObjectId('69dea22ef16a0d961d3682d3'), name: 'John' } ]
```

All query operators start with `$`.

### Comparison operators

```js
// $eq — equal (same as plain { field: value })
db.users.find({ age: { $eq: 31 } })
// [
//   {
//     _id: ObjectId('69dd82fbf16a0d961d3682d1'),
//     name: 'Maya Rodriguez',
//     email: 'maya@example.com',
//     age: 31,
//     city: 'Tokyo',
//     active: true
//   }
// ]

// $eq and show fields {filed:1, ...}
appdb> db.users.find({age:{$eq: 31}}, {name:1, age:1})
// [
//   {
//     _id: ObjectId('69dd82fbf16a0d961d3682d1'),
//     name: 'Maya Rodriguez',
//     age: 31
//   }
// ]


// without fields: {field:0, ...}
appdb> db.users.find({age:{$eq: 31}}, { age:0})
// [
//   {
//     _id: ObjectId('69dd82fbf16a0d961d3682d1'),
//     name: 'Maya Rodriguez',
//     email: 'maya@example.com',
//     city: 'Tokyo',
//     active: true
//   }
// ]


// $ne — not equal
db.users.find({ city: { $ne: "Tokyo" } })

// $gt, $gte, $lt, $lte — greater/less than
db.users.find({ age: { $gt: 25 } })
db.users.find({ age: { $gte: 18, $lte: 40 } })

// $in — match any value in a list
db.users.find({ city: { $in: ["Tokyo", "Osaka", "Kyoto"] } })

// $nin — NOT in list
db.users.find({ city: { $nin: ["Tokyo", "Osaka"] } })

// $exists — field is present (or absent)
db.users.find({ phone: { $exists: true } })
db.users.find({ phone: { $exists: false } })
```

### Logical operators

```js
// Multiple fields auto-AND
db.users.find({ age: { $gt: 25 }, city: "Tokyo" })

// Explicit $and
db.users.find({
  $and: [
    { age: { $gt: 25 } },
    { city: "Tokyo" }
  ]
})

// $or — either condition can match
db.users.find({
  $or: [{ city: "Tokyo" }, { city: "Osaka" }]
})

// AND + OR combined
db.users.find({
  active: true,
  $or: [{ age: { $lt: 25 } }, { city: "Tokyo" }]
})

// $nor — none of the conditions match
db.users.find({
  $nor: [{ city: "Tokyo" }, { active: false }]
})
```

### Arrays and nested fields

```js
// Array contains a specific value
db.users.find({ tags: "vip" })

// Array contains ALL values
db.users.find({ tags: { $all: ["vip", "active"] } })

// Array has exactly N elements
db.users.find({ tags: { $size: 2 } })

// Nested field using dot notation
db.users.find({ "address.city": "Tokyo" })
db.users.find({ "address.country": "Japan", active: true })

// Match element in array of objects
db.orders.find({ "items.productId": ObjectId("abc123") })
```


### expression

an expression is  a function that returns a boolean
```js
appdb> db.users.find({$expr:{$gt: ["$balance","$debt"]}})
// [
//   {
//     _id: ObjectId('69dea773f16a0d961d3682d6'),
//     name: 'Sara Ahmed',
//     age: 35,
//     city: 'Cairo',
//     balance: 500,
//     debt: 0
//   }
// ]
```

### Regex and type queries

```js
// Regex — names starting with "A"
db.users.find({ name: { $regex: /^A/ } })

// Case-insensitive regex
db.users.find({ name: { $regex: "rodriguez", $options: "i" } })

// Type check
db.users.find({ age: { $type: "number" } })
db.users.find({ email: { $type: "string" } })
```

---

## 5. Update Operators

### Field operators

| Operator | Effect |
|---|---|
| `$set` | Set or add a field value |
| `$unset` | Remove a field entirely |
| `$inc` | Increment (or decrement with negative) a number |
| `$mul` | Multiply a number |
| `$rename` | Rename a field |
| `$min` | Update only if new value is lower |
| `$max` | Update only if new value is higher |
| `$currentDate` | Set field to current date/time |

### Array operators

| Operator | Effect |
|---|---|
| `$push` | Append item to array |
| `$pull` | Remove matching items from array |
| `$addToSet` | Push only if value doesn't already exist |
| `$pop` | Remove first (-1) or last (1) element |
| `$each` | Push multiple items in one operation |
| `$sort` | Sort array items after push |
| `$slice` | Trim array to N elements after push |

### Examples

```js
// $unset — remove a field
db.users.updateMany({}, { $unset: { legacyField: "" } })

// $inc — decrement stock, increment views
db.products.updateOne({ _id: id },
  { $inc: { stock: -1, views: 1 } })

// $rename — rename a field across all docs
db.users.updateMany({},
  { $rename: { "fname": "first_name" } })

// $addToSet — push only if unique
db.users.updateOne({ name: "Maya" },
  { $addToSet: { tags: "premium" } })

// $pull — remove a value from array
db.users.updateOne({ name: "Maya" },
  { $pull: { tags: "premium" } })

// $push with $each — push multiple items
db.users.updateOne({ name: "Maya" },
  { $push: { tags: { $each: ["vip", "beta"] } } })

// $currentDate — timestamp to now
db.users.updateOne({ name: "Maya" },
  { $currentDate: { updatedAt: true } })
```

---

## 6. Indexes

Indexes are the single biggest performance lever. Without one, MongoDB scans every document (COLLSCAN). With the right index, queries on millions of documents complete in milliseconds (IXSCAN).

### Creating indexes

```js
// Single field (1 = ascending, -1 = descending)
db.users.createIndex({ email: 1 })

// Unique — reject duplicate values
db.users.createIndex({ email: 1 }, { unique: true })

// Compound — covers queries on both fields
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Text index — for full-text search
db.products.createIndex({ name: "text", description: "text" })

// TTL — auto-delete documents after N seconds
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // 1 hour
)

// Sparse — only index documents that have the field
db.users.createIndex({ phone: 1 }, { sparse: true })
```

### Managing and diagnosing indexes

```js
// List all indexes on a collection
db.users.getIndexes()

// Drop a specific index by name
db.users.dropIndex("email_1")

// Drop ALL non-_id indexes
db.users.dropIndexes()

// explain() — see if an index is being used
db.users.find({ email: "maya@example.com" })
  .explain("executionStats")

// In explain output:
//   IXSCAN   = used an index      ✓ good
//   COLLSCAN = full document scan ✗ add an index
//
// Also check: totalDocsExamined should ≈ nReturned
```

> **Leftmost prefix rule:** An index on `{userId, createdAt}` supports queries on `userId` alone, or both fields together. It does NOT efficiently support queries on `createdAt` alone.

> **Trade-off:** Every index speeds up reads but slows down writes. Only index fields you actually query frequently.

---

## 7. Aggregation Pipeline

The aggregation pipeline processes documents through a series of stages — like Unix pipes for your data.

### Stage reference

```
$match      filter documents (put FIRST to hit indexes)
$project    reshape — include, exclude, compute fields
$group      group + aggregate ($sum, $avg, $max, $min, $count)
$sort       order results
$limit      take first N documents
$skip       skip N documents
$lookup     join another collection (like SQL LEFT JOIN)
$unwind     flatten an array into separate documents
$count      count documents passing through
$out        write pipeline results to a new collection
$addFields  add or overwrite fields without hiding others
```

### Full example — top cities by active user count

```js
db.users.aggregate([
  // Stage 1: only active users (hits index if one exists)
  { $match: { active: true } },

  // Stage 2: group by city
  { $group: {
      _id:    "$city",
      count:  { $sum: 1 },
      avgAge: { $avg: "$age" }
  }},

  // Stage 3: round avgAge nicely
  { $project: {
      city:   "$_id",
      count:  1,
      avgAge: { $round: ["$avgAge", 1] },
      _id:    0
  }},

  // Stage 4: sort highest count first
  { $sort: { count: -1 } },

  // Stage 5: top 5 only
  { $limit: 5 }
])
```

### $lookup — joining two collections

```js
db.orders.aggregate([
  // Join the users collection on userId
  { $lookup: {
      from:         "users",
      localField:   "userId",
      foreignField: "_id",
      as:           "user"
  }},

  // $lookup returns an array — flatten it
  { $unwind: "$user" },

  // Shape the output
  { $project: {
      amount:    1,
      userName:  "$user.name",
      userEmail: "$user.email"
  }}
])
```

---

## 8. Admin Commands

### Database & collection management

```js
// Drop the entire current database (irreversible!)
db.dropDatabase()

// Rename a collection
db.oldName.renameCollection("newName")

// Backup a collection into a new one
db.users.aggregate([{ $out: "users_backup" }])

// Create a capped collection (fixed-size circular buffer)
db.createCollection("logs", {
  capped: true,
  size:   10485760,  // 10 MB max
  max:    10000      // 10,000 docs max
})
```

### Server diagnostics

```js
// Overall server status
db.serverStatus()

// Currently running operations
db.currentOp()

// Kill a long-running operation by opid
db.killOp(12345)

// Database stats (size, collections, indexes)
db.stats()

// Validate a collection for corruption
db.users.validate({ full: true })
```

### User management

```js
// Switch to admin database first
use admin

// Create a user
db.createUser({
  user:  "appUser",
  pwd:   "securePassword",
  roles: [
    { role: "readWrite", db: "myapp" }
  ]
})

// List all users
db.getUsers()

// Drop a user
db.dropUser("appUser")

// Common built-in roles:
// read, readWrite        — collection access
// dbAdmin, userAdmin     — db-level admin
// dbOwner                — full control of one db
// clusterAdmin           — server-wide admin
// root                   — superuser
```

---

## 9. Tips & Tricks

### Assign a collection to a variable (saves typing)

```js
const U = db.users
U.find({ city: "Tokyo" })
U.countDocuments({ active: true })
```

### Store and inspect a query result

```js
const user = db.users.findOne({ name: "Maya" })
user.email       // "maya@example.com"
user._id         // ObjectId('64ab12...')
user.address     // { city: "Tokyo", ... }
```

### Get distinct values

```js
// All unique cities in the collection
db.users.distinct("city")

// Unique cities among active users only
db.users.distinct("city", { active: true })
```

### mongosh is a full JavaScript REPL

```js
// Use it as a calculator
1024 * 1024
// 1048576

// Generate a date
new Date()

// Write a loop to bulk-insert test data
for (let i = 0; i < 100; i++) {
  db.test.insertOne({ index: i, val: Math.random() })
}
```

### Run a .js script file

```bash
# Run a script against a specific database
$ mongosh myapp seed.js
```

```js
// seed.js
db.users.insertMany([
  { name: "Alice", city: "Tokyo"  },
  { name: "Bob",   city: "London" },
])
print("Seed complete!")
```

### Configure the shell (~/.mongoshrc.js)

This file runs every time mongosh starts. Good for shortcuts and defaults:

```js
// ~/.mongoshrc.js

// Shorthand to switch and assign in one step
const use = (name) => { db = db.getSiblingDB(name); return db; }

// Increase nested object display depth
config.set("inspectDepth", 10)
```

---

## 10. Quick Reference Card

```
show dbs                                  list all databases
use <db>                                  switch database
show collections                          list collections

db.col.find()                             get all documents
db.col.find({ field: val })               filter documents
db.col.findOne({ field: val })            first match only
db.col.find({}, { f1:1, f2:1, _id:0 })   projection

db.col.insertOne({ ... })                 insert one document
db.col.insertMany([{...}, {...}])         insert many

db.col.updateOne(filter, { $set:{...} })  update one
db.col.updateMany(filter, { $set:{...} }) update all matching
db.col.findOneAndUpdate(f, u, opts)       update + return doc

db.col.deleteOne({ field: val })          delete one
db.col.deleteMany({ field: val })         delete all matching

db.col.countDocuments()                   count all
db.col.countDocuments({ field: val })     count matching
db.col.distinct("field")                  unique values
db.col.aggregate([...])                   pipeline query

db.col.createIndex({ field: 1 })          add index
db.col.createIndex({ f: 1 }, {unique:1})  unique index
db.col.getIndexes()                       list indexes
db.col.dropIndex("name")                  remove index
db.col.find({}).explain("executionStats") diagnose query

db.col.drop()                             drop collection
db.dropDatabase()                         drop database
db.serverStatus()                         server health
exit                                      quit the shell
```

---

*mongosh documentation: [mongodb.com/docs/mongodb-shell](https://www.mongodb.com/docs/mongodb-shell/)*
