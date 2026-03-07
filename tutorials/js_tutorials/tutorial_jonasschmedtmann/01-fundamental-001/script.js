'use strict';
// 这是一个字符串，不支持strict模式的浏览器会把它当做一个字符串语句执行，支持strict模式的浏览器将开启strict模式运行JavaScript。
// strict模式:
// JavaScript在设计之初，为了方便初学者学习，并不强制要求用var申明变量。
// 这个设计错误带来了严重的后果：如果一个变量没有通过var申明就被使用，那么该变量就自动被申明为全局变量：
// 为了避免这一缺陷，所有的JavaScript代码都应该使用strict模式。我们在后面编写的JavaScript代码将全部采用strict模式。
var abc = 'Hello, world';
console.log(abc);

let js ="amazing";
// if (js=="amazing") alert ("Hello, JavaScript world");
console.log(40+13);
console.log("Hi there, I am Javascript");

// Variable
// 使用var申明的变量则不是全局变量，它的范围被限制在该变量被申明的函数体内（函数的概念将稍后讲解），
// 同名变量在不同的函数体内互不冲突

var x=2;
var y=null;
var z = null;

console.log("x="+x)

if (x>1){
    y = 2;
    z =3
}
console.log("z=" + z);


////////////////////////////////////
// Data Types
// 在JavaScript的世界里，一切都是对象。
// 但是某些对象还是和其他对象不太一样。为了区分对象的类型，我们用typeof操作符获取对象的类型，它总是返回一个字符串：
typeof 123; // 'number'
typeof NaN; // 'number'
typeof 'str'; // 'string'
typeof true; // 'boolean'
typeof undefined; // 'undefined'
typeof Math.abs; // 'function'
typeof null; // 'object'
typeof []; // 'object'
typeof {}; // 'object

// JavaScript不区分整数和浮点数，统一用Number表示, 也就是说，12.00 === 12
// JavaScript的整数最大范围不是±263，而是±253，因此，超过253的整数就可能无法精确表示：
console.log("type of x: "+ typeof x);
let javascriptIsFun = true;
console.log("type of javascriptIsFun: "+ typeof javascriptIsFun);

console.log(Number.MAX_SAFE_INTEGER);


// 数组
// array = new Array(1,2,3);
var array = [1,2,3]


// 对象 ： 
// JavaScript的对象是一组由键-值组成的无序集合，JavaScript对象的键都是字符串类型，值可以是任意数据类型。
var person = {
    name: 'Bob',
    age: 20,
    tags: ['js', 'web', 'mobile'],
    city: 'Beijing',
    hasCar: true,
    zipcode: null
};

console.log("type of person: " + typeof person);
console.log(person.name);

/////////////////////////////////////
// opeations
// 要特别注意相等运算符==。JavaScript在设计时，有两种比较运算符：
// 第一种是==比较，它会自动转换数据类型再比较，很多时候，会得到非常诡异的结果；
// 第二种是===比较，它不会自动转换数据类型，如果数据类型不一致，返回false，如果一致，再比较。



////////////////////////////////////
// function
// 如果没有return语句，函数执行完毕后也会返回结果，只是结果为undefined。
// 
// 
function fib(n){
    if (typeof n !=="number"){
        throw "Not a num";
    }
    if  (n <=2){
        return 1;
    }
    else{
        return fib(n-1)+ fib(n-2);
    }
}

console.log("fib(3)= " +fib(3))



/////////////////////////////////////
//class


// json

/*
在JSON中，一共就这么几种数据类型：
number：和JavaScript的number完全一致；
boolean：就是JavaScript的true或false；
string：就是JavaScript的string；
null：就是JavaScript的null；
array：就是JavaScript的Array表示方式——[]；
object：就是JavaScript的{ ... }表示方式。
以及上面的任意组合。
并且，JSON还定死了字符集必须是UTF-8，表示多语言就没有问题了。为了统一解析，JSON的字符串规定必须用双引号""，Object的键也必须用双引号""。

*/
var xiaoming = {
    name: '小明',
    age: 14,
    gender: true,
    height: 1.65,
    grade: null,
    'middle-school': '\"W3C\" Middle School',
    skills: ['JavaScript', 'Java', 'Python', 'Lisp']
};

// 序列化: 
// 让我们先把小明这个对象序列化成JSON格式的字符串：
// 第二个参数用于控制如何筛选对象的键值，如果我们只想输出指定的属性，可以传入Array：
var s= JSON.stringify(xiaoming,null,"  ");
console.log(s);

// 反序列化
// 拿到一个JSON格式的字符串，我们直接用JSON.parse()把它变成一个JavaScript对象：
JSON.parse('[1,2,3,true]'); // [1, 2, 3, true]
JSON.parse('{"name":"小明","age":14}'); // Object {name: '小明', age: 14}
JSON.parse('true'); // true
JSON.parse('123.45'); // 123.45


// OOP
// 在JavaScript中，这个概念需要改一改。JavaScript不区分类和实例的概念，
// 而是通过原型（prototype）来实现面向对象编程。
// 原型是指当我们想要创建xiaoming这个具体的学生时，我们并没有一个Student类型可用。
// JavaScript的原型链和Java的Class区别就在，它没有“Class”的概念，所有对象都是实例，
// 所谓继承关系不过是把一个对象的原型指向另一个对象而已。
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    }
};

var Bird = {
    fly: function () {
        console.log(this.name + ' is flying...');
    }
};


var xiaoming = {
    name: '小明'
};
// 把xiaoming的原型指向了对象Student
// 在编写JavaScript代码时，不要直接用obj.__proto__去改变一个对象的原型，并且，低版本的IE也无法使用__proto__。
xiaoming.__proto__ = Student;
console.log(xiaoming);


function createStudent(name) {
    // 基于Student原型创建一个新对象:
    var s = Object.create(Student);
    // 初始化新对象:
    s.name = name;
    return s;
}

var xiaoming = createStudent('小明');
xiaoming.run(); // 小明 is running...
xiaoming.__proto__ === Student; // true


////////////////////////////
// Browser
// 可以调整浏览器窗口大小试试:
// navigator
// navigator对象表示浏览器的信息，最常用的属性包括：
// navigator.appName：浏览器名称；
// navigator.appVersion：浏览器版本；
// navigator.language：浏览器设置的语言；
// navigator.platform：操作系统类型；
// navigator.userAgent：浏览器设定的User-Agent字符串。

console.log('window inner size: ' + window.innerWidth + ' x ' + window.innerHeight);
console.log('appName = ' + navigator.appName);
console.log('appVersion = ' + navigator.appVersion);
console.log('language = ' + navigator.language);
console.log('platform = ' + navigator.platform);
console.log('userAgent = ' + navigator.userAgent);

// location
// location对象表示当前页面的URL信息
location.protocol; // 'http'
location.host; // 'www.example.com'
location.port; // '8080'
location.pathname; // '/path/index.html'
location.search; // '?a=1&b=2'
location.hash; // 'TOP'


// document
// document对象表示当前页面。由于HTML在浏览器中以DOM形式表示为树形结构，document对象就是整个DOM树的根节点。
// document的title属性是从HTML文档中的<title>xxx</title>读取的，但是可以动态改变：
// 用document对象提供的getElementById()和getElementsByTagName()可以按ID获得一个DOM节点和按Tag名称获得一组DOM节点：
// document对象还有一个cookie属性，可以获取当前页面的Cookie。
