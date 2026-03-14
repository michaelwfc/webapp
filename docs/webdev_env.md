# Reference:
- [Installing MERN Software](https://web.stanford.edu/class/cs142/install.html)
- [NodeJS](https://nodejs.org/en/)
- [An intro to Webpack: what it is and how to use it](https://www.freecodecamp.org/news/an-intro-to-webpack-what-it-is-and-how-to-use-it-8304ecdc3c60/)
- [mobx-react之Provider和inject的原理与实现](https://juejin.cn/post/6913531148329025549)

# JS development

[JavaScript in Visual Studio Code](https://code.visualstudio.com/docs/languages/javascript)

##  Chrome javacript console 
ctrl+shift+j: open chrome javacript console


## JS Dev in VSCode
Setting up a JavaScript development environment with Visual Studio Code (VSCode) is straightforward and involves installing a few essential tools and extensions. Here's a step-by-step guide:

- Install Visual Studio Code (VSCode):

- Install Node.js
Node.js is a JavaScript runtime that allows you to run JavaScript code outside of a web browser. It also includes npm, the Node.js package manager, which you'll use to install libraries and tools.
Download and install Node.js from the official website.
Verify that Node.js and npm are installed by running the following commands in your terminal or command prompt:

```bash
node -v
npm -v
```

- Initialize Your Project:
Create a new folder for your project.
Open VSCode and navigate to the project folder.
Open a new terminal in VSCode (Ctrl+` or View > Terminal) and run the following command to initialize a new Node.js project:

```bash
npm init -y
```

This command creates a package.json file, which stores information about your project and its dependencies.

- Install ESLint (Optional):
ESLint is a tool for identifying and reporting on patterns found in JavaScript code. It helps you maintain code quality and adhere to coding standards.
- Install ESLint globally (optional) and locally in your project by running the following commands:

```bash
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
    - **ESLint**: Integrates ESLint into VSCode for linting JavaScript code.
    - **Prettier**: Code formatter for JavaScript, TypeScript, CSS, and more.
    - **Debugger for Chrome**: Allows debugging JavaScript code in the Chrome browser from VSCode.
    - **Live Server**: Launches a local development server for testing web applications.
    - **Bracket Pair Colorizer**: Helps differentiate between matching brackets with colors.
    
- Create Your JavaScript Files:
Create your JavaScript files (e.g., index.js) in your project folder.
Write your JavaScript code using VSCode's features such as syntax highlighting, IntelliSense, and code snippets.

- Run Your Code:

You can run your JavaScript code directly in VSCode using the integrated terminal.
Use the following command to run your JavaScript file:

```bash
node index.js
```

Start Coding!:

With your development environment set up, you're ready to start coding in JavaScript using Visual Studio Code.
By following these steps, you'll have a fully functional JavaScript development environment set up with Visual Studio Code. You can customize it further based on your specific requirements and preferences.


## Debug JavaScript




# Node.js
node is the JavaScript runtime engine — it only knows how to do one thing: execute a JavaScript file directly.

## Installing Node.js
Install the latest "Long Term Support (LTS)" version of Node.js (currently version 18.15.0). It can be downloaded from the URL https://nodejs.org/en/download. To verify you have Node.js and its package manager (npm), try running the commands:

```bash
node -v
npm -v
```

## Node.js Common Commands

| Command | Description | Example |
|---|---|---|
| `node -v` | Check Node.js version | `node -v` → `v20.11.0` |
| `node file.js` | Run a JavaScript file | `node app.js` |
| `node -e "code"` | Execute inline JS code directly from terminal | `node -e "console.log(1+1)"` |
| `node --inspect file.js` | Run with debugger enabled | `node --inspect app.js` |
| `node --watch file.js` | Auto-restart when file changes (Node 18+) | `node --watch app.js` |
| `node -p "code"` | Execute and **print** result | `node -p "process.version"` |
| `node --env-file=.env` | Load env file before running (Node 20+) | `node --env-file=.env app.js` |
| `node` | Open interactive REPL (Read-Eval-Print Loop) | type `node` then Enter |
| `.exit` or `Ctrl+C` | Exit the REPL | `.exit` |
| `node -h` | Show all available flags/help | `node -h` |


## Node.js dependency
- ReactJS is a UI library
- axios
- Webpack is a static module bundler
- HTMLWebpackPlugin to generate an HTML file to be used for serving bundled JavaScript file/files
- express
- babel




---


# npm

## npm setting
https://registry.npmjs.org/
```bash
npm -v
npm config set registry https://registry.npm.taobao.org
```

## npm Common Commands

### Project Setup

| Command | Description | Example |
|---|---|---|
| `npm init` | Create `package.json` interactively | `npm init` |
| `npm init -y` | Create `package.json` with all defaults | `npm init -y` |

---

### Installing Packages

| Command | Description | Example |
|---|---|---|
| `npm install` | Install all dependencies from `package.json` | `npm install` |
| `npm install <pkg>` | Install a package and save to `dependencies` | `npm install express` |
| `npm install <pkg> --save-dev` | Install and save to `devDependencies` | `npm install eslint --save-dev` |
| `npm install -g <pkg>` | Install package **globally** | `npm install -g nodemon` |
| `npm install <pkg>@<version>` | Install a specific version | `npm install react@18.0.0` |
| `npm install <pkg1> <pkg2>` | Install multiple packages at once | `npm install express lodash` |
| `npm ci` | Clean install — exactly matches `package-lock.json` | `npm ci` |

---

### Removing Packages

| Command | Description | Example |
|---|---|---|
| `npm uninstall <pkg>` | Remove a package from project | `npm uninstall express` |
| `npm uninstall -g <pkg>` | Remove a globally installed package | `npm uninstall -g nodemon` |

---

### Viewing Packages

| Command | Description | Example |
|---|---|---|
| `npm list` | List all installed packages in project | `npm list` |
| `npm list --depth=0` | List only top-level packages (no nested) | `npm list --depth=0` |
| `npm list -g --depth=0` | List all globally installed packages | `npm list -g --depth=0` |
| `npm show <pkg>` | Show details about a package | `npm show express` |
| `npm outdated` | Show which packages have newer versions | `npm outdated` |

---

### Updating Packages

| Command | Description | Example |
|---|---|---|
| `npm update` | Update all packages to latest allowed version | `npm update` |
| `npm update <pkg>` | Update a specific package | `npm update express` |
| `npm install <pkg>@latest` | Force install the absolute latest version | `npm install react@latest` |

---

### Running Scripts

| Command | Description | Example |
|---|---|---|
| `npm start` | Run the `start` script in `package.json` | `npm start` |
| `npm test` | Run the `test` script in `package.json` | `npm test` |
| `npm run <script>` | Run any custom script from `package.json` | `npm run build` |
| `npm run dev` | Common convention for development server | `npm run dev` |

These scripts are defined in `package.json` like this:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev":   "nodemon app.js",
    "test":  "jest",
    "build": "webpack --config webpack.config.js"
  }
}
```

`npm` is the **package manager** — it DOES know about `package.json` and its scripts section. When you type `npm run start`, npm:
```bash
1. Reads package.json
       ↓
2. Finds the "scripts" section
       ↓
3. Looks up the "start" key
       ↓
4. Executes whatever command is written there
```

#### npm run build
命令会执行一系列的构建步骤，如编译代码，压缩文件，混淆代码等，以便将项目打包成生产环境下可用的代码。
具体来说，npm run build 命令会执行 package.json 文件中 "scripts" 对象中 "build" 字段所对应的命令。
例如，如果 "build" 字段设置为 "webpack --config webpack.config.js"，那么执行 "npm run build" 命令就相当于在命令行中运行 "webpack --config webpack.config.js"。

---

### Publishing & Registry

| Command | Description | Example |
|---|---|---|
| `npm login` | Log in to your npm account | `npm login` |
| `npm publish` | Publish your package to npm registry | `npm publish` |
| `npm whoami` | Show currently logged-in npm user | `npm whoami` |
| `npm search <term>` | Search for packages on npm | `npm search express` |



---

### Misc

| Command | Description | Example |
|---|---|---|
| `npm -v` | Check npm version | `npm -v` → `10.2.4` |
| `npm cache clean --force` | Clear npm's local cache | `npm cache clean --force` |
| `npm audit` | Check for security vulnerabilities | `npm audit` |
| `npm audit fix` | Auto-fix vulnerabilities where possible | `npm audit fix` |
| `npm dedupe` | Remove duplicate packages | `npm dedupe` |
| `npm help <command>` | Show help for a specific command | `npm help install` |

---

### Key files npm creates/uses

| File | Purpose |
|---|---|
| `package.json` | Project metadata, scripts, and dependency list |
| `package-lock.json` | Exact locked versions of every installed package |
| `node_modules/` | Folder where all installed packages live |
| `.npmrc` | npm configuration file (registry settings, etc.) |

> **Quick tip:** Never commit `node_modules/` to git — add it to `.gitignore`. Always commit `package-lock.json` so teammates install the exact same versions with `npm ci`.









# MangoDB

## Install MangoDB
Install the MongoDB Community Edition from the website https://docs.mongodb.com/manual/administration/install-community/.

Once you start the MongoDB server using the command