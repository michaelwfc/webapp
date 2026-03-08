# References

- [csdiy-CS自学指南Stanford CS142: Web Applications](https://csdiy.wiki/Web%E5%BC%80%E5%8F%91/CS142/#_1)
- [cs142-website](https://web.stanford.edu/class/cs142/index.html)
- [cs142-slides](https://web.stanford.edu/class/cs142/lectures.html)
- [cs142-projects](https://web.stanford.edu/class/cs142/projects.html)
- [w3schools](https://www.w3schools.com/)

# Introduction
Technologies used to build modern web applications


## Learning Goal: 
Learn how a web application is built and run How to build a web application - learn by doing: 
- Use MERN stack (React.js, Node.js, Express.js, MongoDB) 
- Learning Goal: Build a photo sharing web app and understand how it works!

## Full stack:  Browser ⇔ Web server ⇔ Storage system 
![image](../../images/Full%20Stack%20Web%20Application%20Architecture.png)

It consists of four primary components:

- `MongoDB`: A NoSQL database that serves as the **storage system**.
- `Express.js`: A back-end web application framework that runs on `Node.js`.
- `React.js`: A front-end library used for building user interfaces in the **browser**.
- `Node.js`: A JavaScript runtime environment that acts as the **web server**.

This stack supports the full-stack architecture mentioned in your context: `Browser ⇔ Web server ⇔ Storage system`. In the CS142 course, it is used to build a photo sharing web application.


Here is the rewritten content from the selected code formatted as a Markdown list:

## Technologies and Concepts
- **Browser environment**
  - `HTML`/`CSS`/`JavaScript` - Markup, separation of content & style, reuse, scripting
  - `Document object Model (DOM)` - Document structure
- **Browser software**
  - `Model View Controller`, `Single page applications`, `Responsive design` - `React.js`
- **Backend communication**
  - `API design` - `HTTP`/`AJAX`/`REST`/`GraphQL`
  - `Cookies`/`Sessions`/`State management` - `Storage`/`Trust`
- **Backend implementation**
  - `Web Server` - `HTTP request processing` - `Node.js`
  - `DBMS` - `Schema`, `Objects`, `CRUD`, `indexes`, `transactions` - `MongoDB`
- **End-to-End**
  - `Scale and Security`


## Project details 
1. HTML & CSS 
2. JavaScript 
3. Browser Document Object Model (DOM) 
4. Learn React.js - Single page application 
5. Photo Sharing App 
6. Backend server - Node.js and MongoDB 
7. Sessions state and validation 
8. Photo App Scrumboard 


## Class software requirements

- A modern web browser Chrome is strongly suggested 
- Node.js Installs fairly easily on modern OS environment (Linux, MacOS, Windows) npm (in Node.js install) is used for fetching assignments and dependencies - 
- MongoDB Easy to install (for a DBMS) on modern OS environments


# Additional Materials
There is no required textbook for this class, and I am not aware of a book that is a perfect match to the lecture material. The content of the course is defined by the lectures. You will need additional reference material to complete the programming projects, but this material is available on the Web. 

## Mozilla Developer Network 
One good online source for reference documentation on HTML, CSS, and the DOM is [Mozilla Developer Network](https://developer.mozilla.org/en-US/). 

## HTML Book
A comprehensive book is [Dynamic HTML: The Definitive Reference, Third Edition](http://www.amazon.com/Dynamic-HTML-Definitive-Danny-Goodman/dp/0596527403/ref=sr_1_1?ie=UTF8&s=books&qid=1251152927&sr=1-1), by Danny Goodman (O'Reilly Media), but this describes the Web as of a few years ago, so it doesn't include newer features such as HTML5. It is freely available to Stanford students.

## The MERN stack 
- [MERN install](https://web.stanford.edu/class/cs142/install.html)

The web application we build in the course's projects will use what is known as the [MERN stack](https://en.wikipedia.org/wiki/MEAN_(solution_stack)#Angular_and_alternatives). 


The class project assignments, lectures and sections will cover what you need to know about the MERN stack. For additional material, we recommend starting at the web sites of the different components:

- [MongoDB](https://www.mongodb.com/) with [Mongoose.js](http://mongoosejs.com/)
- [ReactJS](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)


## JavaScript
The MERN stack uses the JavaScript language in both the browser and the server-side. The lectures will provide an introduction to JavaScript, but more complete information can be found on the web and in some books freely available to Stanford students through [O'Reilly](https://go.oreilly.com/stanford-university).

- JavaScript: The Good Parts by Douglas Crockford (O'Reilly Media). As the book's title suggests, JavaScript is not a simple language and it is easy to hurt yourself with some of its features. This book recommends a somewhat more safe subset of the language to use.
- JavaScript Patterns by Stoyan Stefanov (O'Reilly Media). JavaScript programmers have discovered ways around issues in the language by doing things in certain ways (i.e. patterns). These patterns are commonly used in JavaScript programs but some of them use strange features of the language so it is not clear what is going on if you don't recognize them as a common pattern.

- JavaScript: The Definitive Guide, 6th Edition by David Flanagan (O'Reilly Media). As the title suggests this is a comprehensive description of JavaScript.
- Eloquent JavaScript: A Modern Introduction to Programming, 3nd Edition by Marijn Haverbeke. A free e-book, it introduces a more modern flavor of JavaScript than the O'Reilly books (which are limited to pre-ES2015 developments).
- ECMAScript® Language Specification, the comprehensive JavaScript standard document.


## Valiate

- [Valiate your HTML](http://validator.w3.org) 
Your HTML file must be a valid XHTML 1.0 document that passes validation at http://validator.w3.org. In addition, your HTML and CSS must be clean, readable, properly indented, and well-structured.

- [Valiate your CSS](http://jigsaw.w3.org/css-validator/)



