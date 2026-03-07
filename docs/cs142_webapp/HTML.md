# Introduction of HTML: HyperText Markup Language 


Concept: Markup Language - Include directives with content 
- Directives can dictate presentation or describe content 
- Idea from the 1960s:  RUNOFF 
- Examples:  <i>italics word</i>,   <title>Title words</title> 
- Example of a declarative language 
  
Approach 
1. Start with content to be displayed 
2. Annotate it with tags HTML uses < > to denote tags





# HTML tags 

Tags can provide: 
- Meaning of text: 
  - <h1> means top-level heading</h1>
  - <p> means paragraph 
  - <ul><li> for unordered (bulleted) list 

- Formatting information (<i> for italic) 
- Additional information to display (e.g., <img>)

Tags can have tags inside (nesting supported) - Document forms a tree



## Basic Syntax rules for XHTML 
Document: hierarchical collection of elements, starting with <html> 
- Element: start tag, contents, end tag  
- Elements may be **nested** 
- Every element must have an **explicit start and end** 
  - Can use <foo /> as shorthand for <foo></foo> 
- Start tags can contain **attributes**:
  - <img src="face.jpg"> 
  - <input type="text" value="94301" name="zip"> 
  - <div class="header">


## Need to handle markup characters in content 

To display a literal < or > in a document, use entities: 
| Entity | Meaning |
| ---    | ---- |
| &lt; | Displays < |
| &gt; | Displays >   |
| &amp; | Displays & |
| &quot; | Displays " |
| &nbsp; | Nonbreaking space  (won’t insert a line break at this space)  |


Many other entities are defined for special characters. 

Whitespace is not significant except in a few cases (e.g. textarea, pre tags)



Here is the rewritten content formatted as a Markdown list:

## Common Usage XHTML Tags

- `<p>`: New paragraph
- `<br>`: Force a line break within the same paragraph
- `<h1>`, `<h2>`, ...: Headings
- `<b>`, `<i>`: Boldface and italic
- `<pre>`: Typically used for code: indented with a fixed-width font, spaces are significant (e.g., newlines are preserved)
- `<img>`: Images
- `<a href="...">`: Hyperlink to another Web page
- `<!-- comments -->`: Comment tags
- `<table>`, `<tr>`, `<td>`: Tables
- `<ul>`, `<li>`: Unordered list (with bullets)
- `<ol>`, `<li>`: Ordered list (numbered)
- `<div>`: Used for grouping related elements, where the group occupies entire lines (forces a line break before and after)
- `<span>`: Used for grouping related elements, where the group is within a single line (no forced line breaks)
- `<form>`, `<input>`, `<textarea>`, `<select>`, ...: Used to create forms where users can input data

### Commonly used tags: `<head>` section
- `<title>`  : Specify a title for the page, which will appear in the title bar for the browser window. 
- `<link>` : Include CSS stylesheets
`<script>` : Used to add Javascript to a page (can be used in body as well)


# `HTML`,`HTML5`, `XHTML`, `XML`, and `Markdown`

`HTML`, `XHTML`, `XML`, `HTML5`, and `Markdown` are markup languages with distinct roles, syntax rules, and evolution paths.

- **Purpose**
  - `HTML`/`HTML5`: Designed for **displaying** content in web browsers.
  - `XML`: Designed for **storing and transporting** data with custom structures.
  - `XHTML`: A reformulation of `HTML` to comply with `XML` rules.
  - `Markdown`: A lightweight text-to-`HTML` conversion tool for writing formatted text.

- **Versioning and Evolution**
  - `HTML`: General term, often refers to legacy versions (e.g., `HTML4`).
  - `HTML5`: The **current standard** version of `HTML`. It combines flexibility with stricter parsing rules and adds semantic tags, multimedia support, and APIs.

  - `XHTML`: Legacy strict standard, largely superseded by `HTML5`.

- **Syntax Strictness**
  - `HTML`/`HTML5`: Lenient; browsers render pages even with syntax errors.
  - `XML`/`XHTML`: Strict; documents must be **well-formed** (e.g., all tags closed, case-sensitive).
  - `Markdown`: Uses plain text symbols (e.g., `#` for headers) instead of tags.


- **Usage Scenarios**
  - `HTML5`: Modern web development (frontend).
  - `XML`: Data configuration, APIs, document storage (e.g., `SOAP`).
  - `XHTML`: Legacy web standards.
  - `Markdown`: Documentation, README files, content writing (e.g., `GitHub`).

In summary, `HTML5` is the modern evolution of `HTML`, `XML` focuses on data structure, `XHTML` was a strict bridge between them, and `Markdown` prioritizes writing simplicity.


## `HTML` differences from `XHTML`:
HTML supports the same tags, same features, but allows quirkier syntax:

- Can skip some end tags, such as `</br>, </p>` 
- Not all attributes have to have values: `<select multiple>` - - Elements can overlap: `<p><b>first</p><p>second</b> third</p>`

Early browsers tried to "do the right thing" even in the face of incorrect HTML: 
- Ignore unknown tags 
- Carry on even with obvious syntax errors such as missing `<body>` or `</html> `
- Infer the position of missing close tags 
- Guess that some < characters are literal, as in "What if x < 0?" 
- Not obvious how to interpret some documents (and browsers differed)


## HTML5
**HTML5** is the current standard and combines the flexibility of HTML with some stricter parsing rules, making XHTML less commonly used in modern web development.

- Additions tags to allow content definition 
  - `<article>, <section>, <header>, <footer>, <summary>, <aside>, <details>`
  - `<mark>, <figcaption>, <figure>`
  - `<nav>, <menuitem>`
- Drawing  
  - `<svg>` - Scalable Vector Graphics - Draw shapes 
  - `<canvas>` - Draw from JavaScript - 3D with WebGL
- Timed media playback: `<video>` and `<audio>`
  

## Markdown

Example from https://en.wikipedia.org/wiki/Markdown

```
# Heading 

## Sub-heading 

### Another deeper heading 

Paragraphs are separated by a blank line. 

Two spaces at the end of a line leave a  line break. 

Text attributes _italic_, *italic*, __bold__, **bold**, `monospace`. 

Horizontal rule:
---

Bullet list:  
* apples  
* oranges  
* pears 

Numbered list:  
1. apples  
2. oranges  
3. pears 

A [link](http://example.com).

```