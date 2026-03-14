"use strict";
/**
Declare a global function named cs142MakeMultiFilter that takes an array (originalArray) as a parameter and returns a function 
that can be used to filter the elements of this array. 
The returned function (arrayFilterer) internally keeps track of a notion called currentArray. 
Initially, currentArray is set to be identical to originalArray. 
The arrayFilterer function takes two functions as parameters. 

They are:
1. filterCriteria - A function that takes an array element as a parameter and returns a boolean. 
This function is called on every element of currentArray and currentArray is updated to reflect the results of the filterCriteria function. 
If the filterCriteria function returns false for an element, that element should be removed from currentArray. 
Otherwise, it is left in currentArray. 
If filterCriteria is not a function, the returned function (arrayFilterer) should immediately return the value of currentArray with no filtering performed.
2. callback - A function that will be called when the filtering is done. callback takes the value of currentArray as an argument. 
Accessing this inside the callback function should reference the value of originalArray. 
If callback is not a function, it should be ignored. callback does not have a return value.

The arrayFilterer function should return itself unless the filterCriteria parameter is not specified in which case it should return the currentArray. 
It must be possible to have multiple arrayFilterer functions operating at the same time.
*/

/**
 *
 * @param {
 * } originalArray
 */
function cs142MakeMultiFilter(originalArray) {
  // Closure variable — persists across all calls to arrayFilterer
  // Closure keeps currentArray alive
  //  ↑ lives in the closure backpack of arrayFilterer
  //    persists between calls — each call to arrayFilterer
  //    sees the UPDATED currentArray from the previous call

  // Start as a copy of originalArray (slice prevents shared reference)
  // makes an independent copy of originalArray
  let currentArray = originalArray.slice();
  function arrayFilterer(filterCriteria, callback) {
    // --- Handle filterCriteria ---
    if (typeof filterCriteria === "function") {
      // only filter if it's actually a function
      currentArray = currentArray.filter(filterCriteria);
    } else {
      return currentArray;
    }

    // --- Handle callback ---
    if (callback !== undefined) {
      callback.call(originalArray, currentArray);
      //       ↑               ↑
      //  binds 'this'    passes currentArray as argument
      //  to originalArray
      //  so inside callback:  this === originalArray
    }
    
    // Return itself to allow chaining
    // allows: filter(...).filter(...).filter(...)
    return arrayFilterer;
  }

  return arrayFilterer;
}



/**

// Invoking cs142MakeMultiFilter() with originalArray = [1, 2, 3] returns a
// function, saved in the variable arrayFilterer1, that can be used to
// repeatedly filter the input array
var arrayFilterer1 = cs142MakeMultiFilter([1, 2, 3]);

// Call arrayFilterer1 (with a callback function) to filter out all the numbers not equal to 2.
arrayFilterer1(
  function (elem) {
    return elem !== 2; // check if element is not equal to 2
  },
  function (currentArray) {
    // 'this' within the callback function should refer to originalArray which is [1, 2, 3]
    console.log(this); // prints [1, 2, 3]
    console.log(currentArray); // prints [1, 3]
  },
);


// Call arrayFilterer1 (without a callback function) to filter out all the
// elements not equal to 3.
arrayFilterer1(function (elem) {
  return elem !== 3; // check if element is not equal to 3
});

// Calling arrayFilterer1 with no filterCriteria should return the currentArray.
var currentArray = arrayFilterer1();
console.log("currentArray", currentArray); // prints [1] since we filtered out 2 and 3


// Since arrayFilterer returns itself, calls can be chained
function filterTwos(elem) { return elem !== 2; }
function filterThrees(elem) { return elem !== 3; }
var arrayFilterer2 = cs142MakeMultiFilter([1, 2, 3]);
var currentArray2 = arrayFilterer2(filterTwos)(filterThrees)();
console.log("currentArray2", currentArray2); // prints [1] since we filtered out 2 and 3

// Multiple active filters at the same time
var arrayFilterer3 = cs142MakeMultiFilter([1, 2, 3]);
var arrayFilterer4 = cs142MakeMultiFilter([4, 5, 6]);
console.log(arrayFilterer3(filterTwos)()); // prints [1, 3]
console.log(arrayFilterer4(filterThrees)()); // prints [4, 5, 6]


// // --- Test 3: Chaining in one line ---
// cs142MakeMultiFilter([1,2,3,4,5,6,7,8,9,10])
//     (n => n % 2 === 0,   result => console.log('evens:', result))   // [2,4,6,8,10]
//     (n => n > 4,         result => console.log('> 4:',  result))   // [6,8,10]
//     (n => n < 9,         result => console.log('< 9:',  result));  // [6,8]


// // --- Test 4: No filterCriteria → returns currentArray ---
// const result = arrayFilterer1();
// console.log('Current state:', result);   // [1]


*/