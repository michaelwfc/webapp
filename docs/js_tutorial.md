# resource
- [Udemy排名第一的JavaScript课程](https://www.bilibili.com/video/BV1vA4y197C7?p=7&spm_id_from=pageDriver&vd_source=b3d4057adb36b9b243dc8d7a6fc41295)
- [jonasschmedtmann-git](https://github.com/jonasschmedtmann/complete-javascript-course)
- https://www.tutorialspoint.com/nodejs/nodejs_first_application.htm
- [阮一峰 js es5](https://javascript.ruanyifeng.com/)
- [es6](https://es6.ruanyifeng.com/)

ctrl+shift+j: open chrom javacript console

web app:  html+css + js
js framework: react\anglar\vue
web app on brower(frontend apps)
web app on web server(backend apps): nodejs
native mobile apps: js + react/ionic
native desktop apps: js + electron 

ES5 -> ES6(ES2015) -> ...

git
basics:
alert("hello world!")
let js=='amazing'
if (js==='amazing') alert("JavaScript is fun!")


# JavaScript development

[JavaScript in Visual Studio Code](https://code.visualstudio.com/docs/languages/javascript)


Setting up a JavaScript development environment with Visual Studio Code (VSCode) is straightforward and involves installing a few essential tools and extensions. Here's a step-by-step guide:

- Install Visual Studio Code (VSCode):

- Install Node.js
Node.js is a JavaScript runtime that allows you to run JavaScript code outside of a web browser. It also includes npm, the Node.js package manager, which you'll use to install libraries and tools.
Download and install Node.js from the official website.
Verify that Node.js and npm are installed by running the following commands in your terminal or command prompt:
```csharp
node -v
npm -v
```

- Initialize Your Project:
Create a new folder for your project.
Open VSCode and navigate to the project folder.
Open a new terminal in VSCode (Ctrl+` or View > Terminal) and run the following command to initialize a new Node.js project:

```csharp
npm init -y
```

This command creates a package.json file, which stores information about your project and its dependencies.

- Install ESLint (Optional):
ESLint is a tool for identifying and reporting on patterns found in JavaScript code. It helps you maintain code quality and adhere to coding standards.
- Install ESLint globally (optional) and locally in your project by running the following commands:
css
```csharp
npm install -g eslint
npm install eslint --save-dev
```

After installing ESLint, you can configure it for your project using the .eslintrc configuration file. You can generate a basic ESLint configuration by running:
```csharp
eslint --init
```

- Install VSCode Extensions (Optional but recommended):

Open VSCode and navigate to the Extensions view (Ctrl+Shift+X).
Search for and install extensions that enhance your JavaScript development experience. Some popular extensions include:
    - ESLint: Integrates ESLint into VSCode for linting JavaScript code.
    - Prettier: Code formatter for JavaScript, TypeScript, CSS, and more.
    - Debugger for Chrome: Allows debugging JavaScript code in the Chrome browser from VSCode.
    - Live Server: Launches a local development server for testing web applications.
    - Bracket Pair Colorizer: Helps differentiate between matching brackets with colors.
    
- Create Your JavaScript Files:
Create your JavaScript files (e.g., index.js) in your project folder.
Write your JavaScript code using VSCode's features such as syntax highlighting, IntelliSense, and code snippets.

- Run Your Code:

You can run your JavaScript code directly in VSCode using the integrated terminal.
Use the following command to run your JavaScript file:

```csharp
node index.js
```

Start Coding!:

With your development environment set up, you're ready to start coding in JavaScript using Visual Studio Code.
By following these steps, you'll have a fully functional JavaScript development environment set up with Visual Studio Code. You can customize it further based on your specific requirements and preferences.


# Debug JavaScript

