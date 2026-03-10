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