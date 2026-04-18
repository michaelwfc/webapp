/**
关键点
本地 MongoDB 默认地址：mongodb://127.0.0.1:27017
数据库名在 URI 末尾指定：/appdb
运行前确保本地 MongoDB 服务已启动
如果 MongoDB 服务未启动，连接会失败；先通过 mongod 或你的 MongoDB 服务管理工具启动它。
*/
import mongoose from "mongoose";
import Blog from "./model/Blog.js";

//  Connect to MongoDB
const uri = "mongodb://127.0.0.1:27017/appdb";

await mongoose.connect(uri);

console.log("Connected to MongoDB appdb");

// mongoose.connect('mongodb://127.0.0.1:27017/appdb')
//   .then(() => console.log('Connected to MongoDB appdb'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Create a new blog post and insert it into the database
const newBlog = await Blog.create({
  title: "My First Blog Post",
  slug: "my-first-blog-post",
  published: true,
  author: "John Doe",
  content: "This is the content of my first blog post.",
  tags: ["JavaScript", "Node.js", "MongoDB"],
  comments: [
    {
      user: "Jane Smith",
      content: "Great post!",
      votes: 5,
    },
  ],
});

// await newBlog.save();
console.log("Blog post created and saved to the database");


// Update the blog post
newBlog.title = "Updated Blog Post Title";
await newBlog.save();
console.log("Blog post updated and saved to the database");



// Find the blog post by slug
const blogFound = await Blog.findOne({ slug: "my-first-blog-post" });
console.log("Found blog post:", blogFound);


// Finds the article by its ID. Replace <object id> with the objectId of the article.
// const articleFound = await Blog.findById("<object id>").exec();
// console.log('Found Article by ID:', articleFound);


// Delete the blog post
const deleteResult = await Blog.deleteOne({ slug: "my-first-blog-post" });
console.log("Blog post deleted:", deleteResult.deletedCount > 0);



// Disconnect from MongoDB
// mongoose.connection.close();
// console.log("Disconnected from MongoDB appdb");



