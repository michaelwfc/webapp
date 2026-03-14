"use strict";


let aFuncVar = function (x) {                  
    console.log('Func called with', x);                  
    return x+1;               
    }; 
    
// myFunc(aFuncVar); 

function myFunc(routine) {                 // passed as a param
    console.log('Called with', routine.toString());   
    let retVal = routine(10);   
    console.log('retVal', retVal);   
    return retVal; 
}

// ---- FUNCTION methods ----
// console.log(aFuncVar.toString());


// ---- METHOD — belongs to an object ----
const user = {
    name: "Alice",
    greet: function() {          // greet is a METHOD of user
        return "Hi, I'm " + this.name; // this = user
    }
};
console.log(user.greet());    // "Hi, I'm Alice"
//   ↑ called ON the object with dot notation


// ---- NON-METHOD — standalone function ----
function greet(name) {           // greet belongs to NO object
    return "Hi, I'm " + name;
}
console.log(greet("Alice"));  // "Hi, I'm Alice"
// ↑ called directly, not through any object



// In a NON-METHOD — 'this' is window (or undefined in strict mode)
function describe() {
    return this;             // ⚠️ 'this' = window (browser global)
}
console.log(describe());       // Window object  (or undefined in "use strict")


// Functions are Objects: Have Methods
function func(arg) { console.log(this, arg); }
func.call({t: 1}, 2)
