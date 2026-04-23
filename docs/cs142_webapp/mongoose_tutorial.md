# Reference
- https://www.mongodb.com/zh-cn/docs/drivers/node/current/integrations/mongoose/mongoose-get-started/#std-label-node-mongoose-get-started




# setting

```bash
mkdir mongodb-mongoose
cd mongodb-mongoose
npm init -y
npm i mongoose
npm i -D nodemon
```

在首选代码编辑器中打开项目。本教程使用 ES 模块而不是 CommonJS。必须添加 module 类型才能使用 ES 模块。Gopackage.json文件并添加以下代码：

```json
...
"scripts": {
  "dev": "nodemon index.js"
},
"type": "module",
...
```

通过运行以下命令，使用 nodemon 启动应用程序：
`npm run dev`




## Nodemon 是什么？

- `nodemon` 是一个开发工具，用于监视 Node.js 项目中的文件变化。
- 当你修改代码后，`nodemon` 会自动重启应用程序，无需手动停止/重启。
- 常用于开发阶段，提高开发效率。

例如：
```bash
npm install -D nodemon
npm run dev
```

---

## ES 模块 vs CommonJS

### 什么是 ES 模块（ESM）？

- ES 模块是 JavaScript 规范中的模块系统。
- 语法是 `import` 和 `export`。
- 浏览器和现代 Node.js 都支持这种语法。

例子：
```js
import express from 'express';
export function hello() { ... }
```

如果在 Node.js 中使用 `.js` 文件作为 ES 模块，需要在 `package.json` 中加：
```json
"type": "module"
```

---

### 什么是 CommonJS？

- CommonJS 是 Node.js 传统的模块系统。
- 语法是 `require()` 和 `module.exports` / `exports`。
- 它是 Node.js 早期默认的模块方式。

例子：
```js
const express = require('express');
module.exports = { hello };
```

---

### 关键区别

- 语法不同：`import/export` vs `require/module.exports`
- Node.js 默认：
  - 没有 `type` 时，`.js` 采用 CommonJS
  - 有 `"type":"module"` 时，`.js` 采用 ES 模块
- 互操作时需要注意：ESM 和 CommonJS 不是完全等价，部分导入/导出行为不同

> 在你的教程里，作者选择使用 ES 模块，所以需要在 `package.json` 中加 `"type": "module"`。



# Mongoose

## Overview
Mongoose is an Object Data Modeling (ODM) library for MongoDB. You can use Mongoose to help with data modeling, schema enforcement, model validation, and general data manipulation. Because MongoDB has a flexible data model that allows you to alter and update databases in the future, there aren't rigid schemas. However, Mongoose enforces a semi-rigid schema from the beginning, so you must define a schema and model.

### Schemas
A schema defines the structure of your collection documents. A Mongoose schema maps directly to a MongoDB collection.

The following example creates a new Schema named blog:

```js
const blog = new Schema({
  title: String,
  slug: String,
  published: Boolean,
  author: String,
  content: String,
  tags: [String],
  comments: [{
    user: String,
    content: String,
    votes: Number
  }]
}, {
  timestamps: true
});
```

When you create a schema, you must define each field and its data types. The following types are permitted:

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Int32
- Decimal128
- Double
- Map

### Models
Models take your schema and apply it to each document in its collection. Models are responsible for all document interactions such as create, read, update, and delete (CRUD) operations.

Tip
The first argument you pass to the model is the singular form of your collection name. Mongoose automatically changes this to the plural form, transforms it to lowercase, and uses that for the database collection name.

The following example shows how to declare a model named Blog that uses the blog schema:
```const Blog = mongoose.model('Blog', blog);`


## Connect to MongoDB

在项目的根级别中，创建一个名为 index.js 的文件，并将以下代码添加到文件顶部：


```js
import mongoose from 'mongoose';

mongoose.connect("<connection string>")
```
Set up your environment to use Mongoose


## Create a Mongoose schema and model

## Insert, update, find, and delete data

## Project document fields

## Validate your data


## Use multiple schemas and middleware