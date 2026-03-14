# JavaScript Resource
- [Udemy排名第一的JavaScript课程](https://www.bilibili.com/video/BV1vA4y197C7?p=7&spm_id_from=pageDriver&vd_source=b3d4057adb36b9b243dc8d7a6fc41295)
- [jonasschmedtmann-git](https://github.com/jonasschmedtmann/complete-javascript-course)
- https://www.tutorialspoint.com/nodejs/nodejs_first_application.htm
- [阮一峰 js es5](https://javascript.ruanyifeng.com/)
- [es6](https://es6.ruanyifeng.com/)
- [JS](https://www.jschallenger.com/javascript-practice/)



# JavaScript Basics 
## What is JavaScript?

- From Wikipedia:
  - ... high-level, dynamic, untyped, and interpreted programming language
  - ... is prototype-based with first-class functions,
  - ... supporting object-oriented, imperative, and functional programming
  - ... has an API for working with text, arrays, dates and regular expressions
- Not particularly similar to Java: More like C crossed with Self/Scheme
  C-like statements with everything objects, closures, garbage collection, etc.
- Also known as ECMAScript
- Originally programming conventions (i.e. patterns) rather than language features 
  - ECMAScript adding language features (e.g. class, => , etc.)

### Some thoughts about JavaScript

- Example of a scripting language
  - Interpreted, less declaring of things, just use them (popular today: e.g. python)
- Seems like it was designed in a rush
  - Some “Good Parts”, some not so good
  - Got a bad reputation
- Many programmers use a subset that avoids some common problems
  - "use strict" ; tweaks language to avoid some problematic parts
- Language being extended to enhance things: New ECMAScript every year!
  - ES5 -> ES6(ES2015) -> ...
  - Transpiling common so new features used: e.g ECMAScript Version N, TypeScript
- Code quality checkers (e.g. jslint,  jshint, eslint ) widely used

### Good news if you know C - JavaScript is similar



## JavaScript has dynamic typing

- Variables have the type of the last thing assigned to it
- Primitive types: undefined, number, string, boolean, function, object

```javascript
var i; // Need to define variable ('use strict';), note: untyped
typeof i == "undefined"; // It does have a type of ‘undefined’
i = 32; // Now: typeof i == typeof 32 == 'number'
i = "foobar"; // Now: typeof i == typeof 'foobar' == 'string'
i = true; // Now typeof i == 'boolean'
```

### Variable scoping with var: Lexical/static scoping

Two scopes: Global and function local

```javascript
var globalVar; 
function foo() {   
    var localVar;  
    if (globalVar > 0) {     
        var localVar2 = 2;  }  // localVar2 is valid here 
    }
```


All var statements hoisted to top of scope: 
```javaScript
function foo() {  
    var x;  
    x = 2; 
    }
    
    // Same as: 
function foo() {    
    x = 2;   
    var x;
}
```

### Var scope problems 

- Global variables are bad in browsers - Easy to get conflicts between modules 
- Hoisting can cause confusion in local scopes (e.g. access before value set) 
  
```javaScript
function() {   
    console.log('Val is:', val);  
    ...  
    for(var i = 0; i < 10; i++) { 
        var val = "different string"; // Hoisted to func start 
    }
    }
``` 
- Some JavaScript guides suggest always declaring all var at function start 
- ES6 introduced non-hoisting, scoped `let` and `const` with explicit scopes 
- Some coding environments ban `var` and use `let` or `const` instead



### Hoisting in JavaScript

#### The core idea

JavaScript, before executing any code, does a **"compilation pass"** where it scans the function and **moves (hoists) all `var` declarations to the top** of their function scope. Only the **declaration** is hoisted — not the assigned value.

So JavaScript secretly rewrites your code before running it:

```javascript
// What YOU write:
function example() {
    console.log('Val is:', val);       // You'd expect an error here
    for (var i = 0; i < 10; i++) {
        var val = "different string";  // declared inside a loop
    }
}

// What JavaScript ACTUALLY runs (after hoisting):
function example() {
    var val;                           // ← hoisted to top, value = undefined
    var i;                             // ← also hoisted
    console.log('Val is:', val);       // prints: "Val is: undefined" (no error!)
    for (i = 0; i < 10; i++) {
        val = "different string";      // only the assignment stays here
    }
}
```

The `console.log` doesn't crash — it silently prints `undefined`, which is often a **hidden bug** that's hard to track down.

---

#### Why `var` scope makes it worse

`var` is **function-scoped**, not block-scoped. This means `var` declared inside an `if`, `for`, or any `{}` block leaks out to the whole function:

```javascript
function example() {
    if (true) {
        var x = 10;       // you think x lives inside the if-block
    }
    console.log(x);       // prints: 10 — x leaked out!
}
```

Compare to `let`:
```javascript
function example() {
    if (true) {
        let x = 10;       // x lives only inside this block
    }
    console.log(x);       // ❌ ReferenceError: x is not defined
}
```

---

#### The 3 hoisting behaviors side by side

```javascript
// ---- var ----
console.log(a);   // undefined  (hoisted, no error)
var a = 5;
console.log(a);   // 5


// ---- let ----
console.log(b);   // ❌ ReferenceError (in "temporal dead zone")
let b = 5;


// ---- const ----
console.log(c);   // ❌ ReferenceError (in "temporal dead zone")
const c = 5;
```

`let` and `const` are technically also hoisted by JavaScript, but they are placed in a **"Temporal Dead Zone" (TDZ)** — accessing them before declaration throws an error instead of silently returning `undefined`. This is much safer behavior.

---

#### Function hoisting

Entire **function declarations** are also hoisted (not just the name):

```javascript
// You can call a function BEFORE it's defined:
sayHello();              // ✅ works! prints "Hello"

function sayHello() {
    console.log("Hello");
}
```

But **function expressions** assigned to variables are not:

```javascript
sayHello();              // ❌ TypeError: sayHello is not a function

var sayHello = function() {
    console.log("Hello");
};
// Only `var sayHello` is hoisted (as undefined), not the function body
```

---

#### Summary table

| | `var` | `let` | `const` |
|---|---|---|---|
| Hoisted? | ✅ Yes | ✅ Yes (TDZ) | ✅ Yes (TDZ) |
| Usable before declaration? | ✅ (returns `undefined`) | ❌ ReferenceError | ❌ ReferenceError |
| Scope | Function | Block `{}` | Block `{}` |
| Re-assignable? | ✅ | ✅ | ❌ |
| Re-declarable? | ✅ | ❌ | ❌ |

---

#### The practical rule

> **Never use `var`.** Always use `const` by default, and `let` when you need to reassign. This eliminates hoisting confusion entirely and keeps variables scoped to the block where they belong.

```javascript
// ❌ Old, confusing var style
function old() {
    for (var i = 0; i < 3; i++) {
        var msg = "hello";
    }
    console.log(i);    // 3  — leaked out!
    console.log(msg);  // "hello" — leaked out!
}

// ✅ Modern let/const style
function modern() {
    for (let i = 0; i < 3; i++) {
        const msg = "hello";
    }
    console.log(i);    // ❌ ReferenceError — safely contained
    console.log(msg);  // ❌ ReferenceError — safely contained
}
```


## Number type 
- number type is stored in floating point (i.e. double in C) 
`MAX_INT = (2^53 - 1) = 9007199254740991 `
- Some oddities: `NaN, Infinity are numbers `
`1/0 == Infinity`
`Math.sqrt(-1) == NaN`
Nerd joke:  typeof NaN returns 'number'

- Watch out: 
`(0.1 + 0.2) == 0.3 is false  // 0.30000000000000004`  
bitwise operators (e.g. ~,  &, |, ^ , >>, <<, >>> ) are `32bit`!


### Why `(0.1 + 0.2) == 0.3` is `false`

#### The root cause: binary floating point

Computers store numbers in **binary (base 2)**. Just like `1/3 = 0.3333...` cannot be written exactly in decimal (base 10), many simple decimal fractions **cannot be represented exactly in binary**.

`0.1` in binary is:
```
0.0001100110011001100110011001100110011001100110011...  (repeating forever)
```

Since memory is finite, the number gets **rounded** to the nearest representable 64-bit value. So what's actually stored is:

```javascript
0.1  →  0.1000000000000000055511151231257827021181583404541015625
0.2  →  0.2000000000000000111022302462515654042363166809082031250
```

When you add them:
```javascript
0.1 + 0.2  →  0.30000000000000004440892098500626...
```

And `0.3` itself is stored as:
```javascript
0.3  →  0.29999999999999998889776975374843459576368...
```

They are **two different binary values** — so `==` returns `false`.

```javascript
console.log(0.1 + 0.2);        // 0.30000000000000004
console.log(0.3);               // 0.3  (looks clean, but isn't exactly)
console.log(0.1 + 0.2 == 0.3); // false ❌
```

---

#### Visualizing the rounding error

```
What you think:    0.1    +    0.2    =    0.3
                    ↓            ↓            ↓
What's stored:   0.1000…04  + 0.2000…08  = 0.3000…04
                                                ↑
                                    NOT equal to stored 0.2999…98
```

This is **not a JavaScript bug** — it affects every language using IEEE 754 floating point: Python, Java, C, C++, etc.

```python
# Python has the same problem
>>> 0.1 + 0.2 == 0.3
False
```

---

#### How to correctly compare floating point numbers

##### Method 1 — Epsilon comparison (most common)
Compare whether the difference is **smaller than a tiny threshold** (epsilon):

```javascript
const a = 0.1 + 0.2;
const b = 0.3;

// Manually define a tolerance
Math.abs(a - b) < 0.000001;          // ✅ true

// Better: use JavaScript's built-in machine epsilon
Math.abs(a - b) < Number.EPSILON;    // ✅ true
// Number.EPSILON = 2.220446049250313e-16 (smallest meaningful difference)
```

##### Method 2 — Helper function (reusable)

```javascript
function areEqual(a, b, tolerance = Number.EPSILON) {
    return Math.abs(a - b) <= tolerance;
}

areEqual(0.1 + 0.2, 0.3);   // ✅ true
areEqual(0.1 + 0.2, 0.31);  // ❌ false
```

##### Method 3 — Scale to integers first
Multiply to work in integers (no floating point error), then divide:

```javascript
// Instead of: 0.1 + 0.2
// Do:         (1 + 2) / 10

(1 + 2) / 10 == 0.3    // ✅ true

// Useful for money: work in cents, not dollars
// ❌ Bad:   $1.10 + $2.20 == $3.30
// ✅ Good:  110 cents + 220 cents == 330 cents
```

##### Method 4 — `toFixed()` for display/comparison

```javascript
parseFloat((0.1 + 0.2).toFixed(10)) == 0.3   // ✅ true

// But be careful — toFixed() returns a STRING
(0.1 + 0.2).toFixed(1)          // "0.3" (string)
(0.1 + 0.2).toFixed(1) == 0.3   // ✅ true (type coercion helps here)
(0.1 + 0.2).toFixed(1) === 0.3  // ❌ false (strict: string ≠ number)
```

---

#### Summary — which method to use?

| Situation | Recommended method |
|---|---|
| General comparison | `Math.abs(a - b) < Number.EPSILON` |
| Money / currency | Scale to integers (work in cents) |
| Display to user | `toFixed(2)` |
| High-precision math | Use a library like `decimal.js` |

> **The golden rule:** Never use `==` or `===` to compare floating point numbers directly. Always compare the **difference against a tolerance**.


## String type 
- string type is variable length (no char type) 
- + is string concat
- Lots of useful methods: indexOf(), charAt(), match(), search(), replace(), toUpperCase(), toLowerCase(), slice(), substr(), … 

```javascript
let foo = 'This is a test';  // can use "This is a test" 
foo.length  // 14 

operator foo = foo + 'XXX'; // This is a testXXX 
'foo'.toUpperCase() // 'FOO'
```


## Boolean type 
- Either true or false 
- Language classifies values as either truthy or falsy 
  - Used when a value is converted to a boolean e.g. if (foo) { … ) 
- Falsy: false, 0, NaN, "", undefined, and null 
- Truthy: Not falsy (all objects, non-empty strings, non-zero/NaN numbers, functions, etc.)

## undefined and null 
- `undefined` - does not have a value assign 

```javascript
let x;   //  x has a value of undefined 
x = undefined;  // It can be explicitly store 
typeof x == 'undefined'
```

- `null` - a value that represents whatever the user wants it to 
  Use to return special condition (e.g. no value) 
  typeof null == ‘object’ 
- Both are falsy but not equal (null == undefined; null !== undefined)


## function type 

```javascript
function foobar(x) {     
    if (x <= 1) {        
        return 1;    
        }    
    return x*foobar(x-1); 
        } 
typeof foobar == ‘function’;  
foobar.name == 'foobar' 
```

- Function definitions are hoisted (i.e. can use before definition) 
- Can be called with a different number arguments than definition 
    - Array arguments variable (e.g. arguments[0] is first argument) 
    - Unspecified arguments have value undefined 
- All functions return a value (default is undefined)


### "First class" function example 

What does "First-Class" mean?
A language has first-class functions when functions are treated like any other value — just like a number, string, or object. 


```javascript
let aFuncVar = function (x) {                  
    console.log('Func called with', x);                  
    return x+1;               
    }; 

myFunc(aFuncVar); 

function myFunc(routine) {                 // passed as a param
    console.log('Called with', routine.toString());   
    let retVal = routine(10);   
    console.log('retVal', retVal);   
    return retVal; 
}
```

```bash
$ node js_functions.js 
Called with function (x) {
    console.log('Func called with', x);
    return x+1;
    }
Func called with 10
retVal 11
```


## JavaScript Object Type

- Object is an unordered collection of name-value pairs called properties
  ```javascript
  let foo = {}; 
  let bar = {name: "Alice", age: 23, state: "California"}; 
  ```
- Name can be any string:  
  `let x = { "": "empty", "---": "dashes"} `
- Referenced either like a structure or like a hash table with string keys: 
  ```javascript
  bar.name or bar["name"] 
  x["---"]   // have to use hash format for illegal names 
  foo.nonExistent == undefined 
  ```
- Global scope is an object in browser (i.e. window[prop])  


### What is an Object?

An object is an **unordered collection of key-value pairs** called **properties**. Think of it like a dictionary or hash table — you store data under named keys and look it up by name.

```javascript
// Empty object
let foo = {};

// Object with properties
let bar = {
    name:  "Alice",      // key: "name",  value: "Alice"
    age:   23,           // key: "age",   value: 23
    state: "California"  // key: "state", value: "California"
};
```

---

### Creating Objects

```javascript
// Method 1 — Object literal (most common)
let user = { name: "Alice", age: 23 };

// Method 2 — new Object()
let user = new Object();
user.name = "Alice";
user.age  = 23;

// Method 3 — Constructor function
function User(name, age) {
    this.name = name;
    this.age  = age;
}
let user = new User("Alice", 23);

// Method 4 — Object.create()
let user = Object.create({});
user.name = "Alice";
```

---

### Accessing Properties — 2 ways

```javascript
let bar = { name: "Alice", age: 23, state: "California" };

// --- Dot notation (like a struct) ---
bar.name      // "Alice"
bar.age       // 23

// --- Bracket notation (like a hash table) ---
bar["name"]   // "Alice"
bar["age"]    // 23

// Bracket notation is REQUIRED for:
// 1. Illegal/special character key names
let x = { "": "empty", "---": "dashes", "my-key": "hello" };
x["---"]      // "dashes"  ✅
x["my-key"]   // "hello"   ✅
x.---         // ❌ SyntaxError

// 2. Dynamic key names (variable as key)
let key = "name";
bar[key]      // "Alice" ✅ — looks up bar["name"]
bar.key       // undefined ❌ — looks for property literally named "key"
```

---

### Property Values can be Anything

```javascript
let person = {
    name:    "Alice",               // string
    age:     23,                    // number
    active:  true,                  // boolean
    scores:  [90, 85, 92],          // array
    address: {                      // nested object
        city:  "LA",
        zip:   "90001"
    },
    greet: function() {             // function (called a "method")
        return "Hi, I'm " + this.name;
    }
};

// Accessing nested object
person.address.city    // "LA"
person["address"]["zip"] // "90001"

// Calling a method
person.greet()         // "Hi, I'm Alice"
```

---

### Adding, Modifying, Deleting Properties

```javascript
let bar = { name: "Alice", age: 23 };

// Add a new property (just assign it — no declaration needed)
bar.email   = "alice@example.com";   // { name, age, email }
bar["city"] = "LA";                  // { name, age, email, city }

// Modify existing property
bar.age = 24;                        // age is now 24

// Delete a property
delete bar.email;                    // { name, age, city }

// Check if property exists
"name" in bar          // true  ✅
"email" in bar         // false (we deleted it)

// Access non-existent property → undefined (no error!)
bar.nonExistent        // undefined
bar.nonExistent.x      // ❌ TypeError: can't read property of undefined
```

---

### Iterating Over Properties

```javascript
let bar = { name: "Alice", age: 23, state: "California" };

// --- for...in loop (iterates over keys) ---
for (let key in bar) {
    console.log(key, ":", bar[key]);
}
// name : Alice
// age  : 23
// state: California

// --- Object.keys() — array of keys ---
Object.keys(bar)      // ["name", "age", "state"]

// --- Object.values() — array of values ---
Object.values(bar)    // ["Alice", 23, "California"]

// --- Object.entries() — array of [key, value] pairs ---
Object.entries(bar)   // [["name","Alice"], ["age",23], ["state","California"]]
```

---

### Destructuring (ES6)

A shorthand to extract properties into variables:

```javascript
let bar = { name: "Alice", age: 23, state: "California" };

// Instead of:
let name  = bar.name;
let age   = bar.age;

// You can write:
let { name, age } = bar;
console.log(name);   // "Alice"
console.log(age);    // 23

// Rename while destructuring
let { name: userName, age: userAge } = bar;
console.log(userName);  // "Alice"

// Default values
let { name, score = 100 } = bar;
console.log(score);  // 100 (bar.score doesn't exist, uses default)
```

---

### The Global Object (`window`)

As your notes mention — **the global scope in a browser is itself an object**: `window`. Every global variable you declare becomes a property on it:

```javascript
var x = 42;
console.log(window.x);        // 42 — x is a property of window
console.log(window["x"]);     // 42 — same thing

// Built-in globals are also window properties:
window.console.log("hi");     // same as console.log("hi")
window.setTimeout(() => {}, 0); // same as setTimeout()
```

---

### Summary

```
Object
├── Collection of key → value pairs (properties)
├── Keys are strings (or Symbols)
├── Values can be anything (number, string, array, function, object...)
├── Access via  dot notation  →  obj.key
│              bracket notation →  obj["key"]  (required for dynamic/special keys)
├── Non-existent property → undefined (no error)
├── Properties freely added, modified, deleted at runtime
└── The browser's global scope (window) is itself an object
```

> The object is the **most fundamental data structure** in JavaScript. Arrays, functions, and even `null` (historically) all relate back to the object type — which is why `typeof null === "object"` is one of JavaScript's famous quirks.
>

### Properties can be added, removed, enumerated 
- To add, just assign to the property: 
  ```javascript
  let foo = {}; 
  foo.name = "Fred";     // foo.name returns "Fred" 
  ```

- To remove use delete: 
  ```javascript
  let foo = {name: "Fred"}; 
  delete foo.name; // foo is now an empty object 
  ```
- To enumerate use Object.keys(): 
  ```javascript 
  Object.keys({name: "Alice", age: 23}) = ["name", "age"]
  ```

## Arrays 
`let anArr = [1,2,3]; `
- Are special objects: `typeof anArr == 'object'` 
- Indexed by non-negative integers: (`anArr[0] == 1`)
- Can be sparse and polymorphic: 
  `anArr[5]='FooBar'; //[1,2,3,,,'FooBar']` 
- Like strings, have many methods:  
  `anArr.length == 3 `
  push, pop, shift, unshift, sort, reverse, splice, … 
- Oddity: can store properties like objects (e.g. anArr.name = 'Foo') 
  - Some properties have implications: (e.g. anArr.length = 0;)

## Dates 
let date = new Date(); 
- Are special objects: typeof date == 'object' 
- The number of milliseconds since midnight January 1, 1970 UTC
 Timezone needed to convert.  Not good for fixed dates (e.g. birthdays) 

- Many methods for returning and setting the data object. For example:
  ```javaScript
  date.valueOf() = 1452359316314 
  date.toISOString() = '2016-01-09T17:08:36.314Z' 
  date.toLocaleString() = '1/9/2016, 9:08:36 AM'
  ```


## Regular Expressions 
let re = /ab+c/;     or     let re2 = new RegExp("ab+c"); 

- Defines a pattern that can be searched for in a string String:   
    search(), match(), replace(), and split() 
    RegExp: exec() and test() 

- Cool combination of CS Theory and Practice: CS143 
Uses: 
 - Searching:  Does this string have a pattern I’m interested in? 
 - Parsing: Interpret this string as a program and return its components

### Regular Expressions by example - search/test
```javascript
/HALT/.test(str);   //  Returns true if string str has the substr HALT 
/halt/i.test(str);  // Same but ignore case 
/[Hh]alt [A-Z]/.test(str); // Returns true if str either “Halt L” or “halt L” 
'XXX abbbbbbc'.search(/ab+c/);  // Returns 4 (position of ‘a’) 
'XXX ac'.search(/ab+c/);        // Returns -1, no match 
'XXX ac'.search(/ab*c/);        // Returns 4 
'12e34'.search(/[^\d]/);        // Returns 2 
'foo: bar;'.search(/...\s*:\s*...\s*;/);   // Returns 0

```


### Regular Expressions - exec/match/replace 
```javascript
let str = "This has 'quoted' words like 'this'"; 
let re = /'[^']*'/g; 
re.exec(str);  // Returns ["'quoted'", index: 9,  input: … 
re.exec(str);  // Returns ["'this'", index: 29,  input: … 
re.exec(str);  // Returns null 
str.match(/'[^']*'/g);  // Returns ["'quoted'", "'this'"] 
str.replace(/'[^']*'/g, 'XXX'); // Returns: 'This has XXX words with XXX.'
```

## Exceptions - try/catch 
- Error reporting frequently done with exceptions 
  - Example: nonExistentFunction(); 
  - Terminates execution with error: 
  - Uncaught ReferenceError: nonExistentFunction is not defined 
- Exception go up stack: Catch exceptions with try/catch 
  ```javaScript
  try {   
    nonExistentFunction(); 
    } catch (err) {   // typeof err 'object'  
      console.log("Error call func", err.name, err.message); 
      }
  ```

### Exceptions - throw/finally

- Raise exceptions with throw statement 
  ```javaScript
  try { 
    throw "Help!"; 
  } catch (errstr) {  // errstr === "Help!"   
  console.log('Got exception', errstr); } 
  finally { 
    // This block is executed after try/catch 
    }
  ```
- Conventions are to throw sub-classes of Error object 
  `console.log("Got Error:", err.stack || err.message || err);`


# Getting JavaScript into a web page 
- By including a separate file: 
  <script type="text/javascript" src="code.js"></script> 
- Inline in the HTML: 
  <script type="text/javascript"> 
  //<![CDATA[ 
    Javascript goes here... 
    //]]> 
  </script>

----------

# JavaScript vs TypeScript

### What is TypeScript?

TypeScript is a **superset of JavaScript** created by Microsoft in 2012. That means:

```
┌─────────────────────────────────────┐
│           TypeScript                │
│                                     │
│   ┌─────────────────────────────┐   │
│   │       JavaScript            │   │
│   │   (all valid JS is valid TS)│   │
│   └─────────────────────────────┘   │
│                                     │
│   + static types                    │
│   + interfaces                      │
│   + generics                        │
│   + enums                           │
│   + access modifiers                │
└─────────────────────────────────────┘
```

> Every valid JavaScript file is already a valid TypeScript file. TypeScript only **adds** things on top.

---

### The key difference: Static Typing

JavaScript is **dynamically typed** — types are checked at **runtime** (when code runs).
TypeScript is **statically typed** — types are checked at **compile time** (before code runs).

```javascript
// ---- JavaScript ----
function add(a, b) {
    return a + b;
}

add(1, 2);        // 3   ✅
add("1", 2);      // "12" ❌ silent bug! string + number = string concatenation
add(1, "hello");  // "1hello" ❌ no error thrown, wrong result
```

```typescript
// ---- TypeScript ----
function add(a: number, b: number): number {
    return a + b;
}

add(1, 2);        // 3   ✅
add("1", 2);      // ❌ ERROR at compile time: Argument of type 'string'
                  //    is not assignable to parameter of type 'number'
add(1, "hello");  // ❌ ERROR at compile time — caught before running!
```

The bug is caught **before the code ever runs**.

---

### How TypeScript works

TypeScript cannot run directly in browsers or Node.js. It must be **transpiled** (compiled) back to JavaScript first:

```
TypeScript (.ts)
      │
      │  tsc (TypeScript Compiler)
      │  or Babel, esbuild, vite...
      ▼
JavaScript (.js)
      │
      │  runs in
      ▼
Browser / Node.js
```

This is exactly the **"Transpiling"** mentioned in your lecture notes — you write TypeScript, the toolchain converts it to JavaScript for the browser.

---

### Feature comparison

| Feature | JavaScript | TypeScript |
|---|---|---|
| Type declarations | ❌ | ✅ `let x: number = 5` |
| Interfaces | ❌ | ✅ `interface User { name: string }` |
| Generics | ❌ | ✅ `function get<T>(arr: T[]): T` |
| Enums | ❌ | ✅ `enum Direction { Up, Down }` |
| Access modifiers | ❌ | ✅ `public`, `private`, `protected` |
| Compile-time errors | ❌ | ✅ caught before running |
| Runs in browser directly | ✅ | ❌ must transpile first |
| Learning curve | Lower | Higher |
| `"use strict"` needed | Optional | Always on |

---

### TypeScript syntax examples

```typescript
// --- Basic types ---
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let scores: number[] = [90, 85, 92];

// --- Interface (defines shape of an object) ---
interface User {
    name: string;
    age: number;
    email?: string;    // ? means optional
}

const user: User = { name: "Alice", age: 30 };  // ✅
const bad: User  = { name: "Alice" };            // ❌ missing 'age'

// --- Function with typed params and return type ---
function greet(user: User): string {
    return `Hello, ${user.name}`;
}

// --- Union types (can be one of several types) ---
let id: number | string;
id = 42;        // ✅
id = "abc123";  // ✅
id = true;      // ❌ ERROR

// --- Generics ---
function firstItem<T>(arr: T[]): T {
    return arr[0];
}
firstItem([1, 2, 3]);        // returns number
firstItem(["a", "b", "c"]); // returns string
```

---

### Why TypeScript was created

JavaScript's dynamic typing causes real problems at scale:

```javascript
// In a large JavaScript codebase...
function processOrder(order) {
    // Is order.price a number or string?
    // Is order.items an array or object?
    // Does order.user exist?
    // You have to READ ALL CALLING CODE to know — or just guess
}

// In TypeScript — everything is self-documenting:
interface Order {
    price: number;
    items: string[];
    user: User;
}

function processOrder(order: Order): void {
    // You know EXACTLY what you're working with
}
```

---

### When to use which

| Situation | Use |
|---|---|
| Small scripts, quick demos | JavaScript |
| Large codebases, teams | TypeScript |
| Learning web development | JavaScript first |
| Production apps (React, Node) | TypeScript strongly preferred |
| Working with existing JS libraries | TypeScript (has type definition files `.d.ts`) |

---

### The one-line summary

> **TypeScript = JavaScript + a type system.** It compiles away to plain JavaScript, so the browser never sees TypeScript — but you get all the safety benefits of catching type errors before your code ever runs.




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


