/**
 * Problem 2: Template Processor (5 points)
In your project2 directory, make a new file named cs142-template-processor.js. The code for your Template Processor will go in this file.

Create a template processor class (Cs142TemplateProcessor) that is constructed with a string parameter template and has a method fillIn. 
When invoked with an argument of a dictionary object, fillIn returns a string with the template filled in with values from the dictionary object. 
Cs142TemplateProcessor should be written using the standard JavaScript constructor and prototype structure.

The fillIn method returns the template string with any text of the form {{property}} replaced with the corresponding property of the dictionary object passed to the function.

If the template specifies a property that is not defined in the dictionary object, the property should be replaced with an empty string. 
If the property is between two words, you'll notice that replacing the property with an empty string will result in two consecutive whitespaces. 
Example: "This {{undefinedProperty}} is cool" → "This  is cool". 
This is fine. You do not have to worry about getting rid of the extra whitespace.

Your system need only handle properly formatted properties. Its behavior can be left undefined in the following cases as we will not be checking explicitly for them.

nested properties - {{foo {{bar}}}} or {{{{bar}}}} or {{{bar}}}
unbalanced brackets - {{bar}}}
stray brackets in any property string - da{y or da}y

 */


/**
Regex explanation: /\{\{([^}]+)\}\}/g
      \{\{   — match literal {{
      ([^}]+) — capture group: one or more characters that are NOT }
                this captures the property name between {{ and }}
      \}\}   — match literal }}
      /g     — global flag: replace ALL occurrences, not just the first

How the Regex Works
  \{\{      →  matches literal  {{
  (         →  start capture group
    [^}]+   →  one or more characters that are NOT '}'
              this grabs the property name: "name", "age", "city" etc.
  )         →  end capture group
  \}\}      →  matches literal  }}
  g         →  global — find ALL matches in the string, not just first


When you pass a function to .replace(), JavaScript calls that function for every match it finds, and uses the return value as the replacement:


The Arguments JavaScript Passes to Your Replace Function
For a regex with a capture group ( ), JavaScript passes:

str.replace(/\{\{([^}]+)\}\}/g, function(match, group1, offset, original) {
//                                         ↑      ↑       ↑       ↑
//                              full match  │      │       │       │
//                              "{{name}}"  │      │       │       └─ original string
//                                          │      │       └─ position of match
//                                          │      └─ captured group 1
//                                          │        "name"
//                                          └─ same as match
});
 */




/**

// Define the regex — NOTE: no quotes! A regex literal uses / /, not " "
const regex = /\{\{([^}]+)\}\}/g;

class Cs142TemplateProcessor { 
    constructor(template) {
        this.template = template;
    }


    fillIn(dictionary){
        let result = this.template;
        function replace_match_group(match, property_name) {
            if (dictionary[property_name]!== undefined){
                return dictionary[property_name];
            }else{
                return "";
            }

        }

        // Wire them together — pass replace_match as the callback
        result =  this.template.replace(regex, replace_match_group);
        //                            ↑          ↑
        //                         the regex   your function
        //                                     called for each match
        return result;
    }
}

 * 
 */


/**
 * Cs142TemplateProcessor
 * Constructor function (prototype-based, not class keyword)
 * @param {string} template - the template string containing {{property}} placeholders
 */
function Cs142TemplateProcessor(template) { 
    this.template = template;
}

/**
 * fillIn
 * Replaces all {{property}} placeholders in the template
 * with values from the dictionary object.
 * If a property is not in the dictionary, replaces with "".
 * @param {object} dictionary - key/value pairs to fill into template
 * @returns {string} - the filled-in string
 */
Cs142TemplateProcessor.prototype.fillIn = function (dictionary) { 
    const regex = /\{\{([^}]+)\}\}/g;

    function replace_match_group(match, property_name) {
            if (dictionary[property_name]!== undefined){
                return dictionary[property_name];
            }else{
                return "";
            }

        }

    let result = this.template.replace(regex, replace_match_group);
    return result;
};


/**

// The following code shows how one might make use of the functions you define in this problem:
var template = "My favorite month is {{month}} but not the day {{day}} or the year {{year}}";
var dateTemplate = new Cs142TemplateProcessor(template);

var dictionary = {month: "July", day: "1", year: "2016"};
var str = dateTemplate.fillIn(dictionary);

console.log(str);
assert(str === "My favorite month is July but not the day 1 or the year 2016");
console.log("Test Case1 passed");
// Case: property doesn't exist in dictionary
var dictionary2 = {day: "1", year: "2016"};
var str = dateTemplate.fillIn(dictionary2);

console.log(str);
assert(str === "My favorite month is  but not the day 1 or the year 2016");
*/