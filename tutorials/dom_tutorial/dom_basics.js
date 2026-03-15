// 1. In the Browser (the usual case)
// If you want to parse a separate HTML string into a DOM object, use DOMParser:
// const html = `<p>Sample <b>bold</b> display</p>`;
// const parser = new DOMParser();
// const doc = parser.parseFromString(html, "text/html");

// 2. In Node.js (server-side, no browser)
// Node.js has no built-in DOM — you need a library. The most popular is jsdom:
// npm install jsdom

import { JSDOM } from "jsdom";
import fs from "fs";

const html = fs.readFileSync("example.html", "utf8");
const dom = new JSDOM(html);
const document = dom.window.document;

// 1. Access the P element
const p = document.querySelector("p");

// 2. Walk the tree manually
const firstChild = p.firstChild; // #text "Sample "
const boldEl = firstChild.nextSibling; // <b>
const lastChild = p.lastChild; // #text " display"

// 3. Read node info
console.log(p.nodeName); // "P"
console.log(p.nodeType); // 1 (Element)
console.log(p.textContent); // "Sample bold display"
console.log(p.innerHTML); // "Sample <b>bold</b> display"

console.log(boldEl.nodeName); // "B"
console.log(boldEl.firstChild.nodeValue); // "bold"

// 4. Modify the tree
boldEl.firstChild.nodeValue = "italic"; // changes text inside <b>
p.innerHTML = "Sample <i>italic</i> display"; // replaces whole content
