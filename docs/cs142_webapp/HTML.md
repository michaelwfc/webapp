# Introduction of HTML: HyperText Markup Language

Concept: Markup Language - Include directives with content

- Directives can dictate presentation or describe content
- Idea from the 1960s: RUNOFF
- Examples: <i>italics word</i>, <title>Title words</title>
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
| --- | ---- |
| &lt; | Displays < |
| &gt; | Displays > |
| &amp; | Displays & |
| &quot; | Displays " |
| &nbsp; | Nonbreaking space (won’t insert a line break at this space) |

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

- `<title>` : Specify a title for the page, which will appear in the title bar for the browser window.
- `<link>` : Include CSS stylesheets
  `<script>` : Used to add Javascript to a page (can be used in body as well)

---

# HTML Table Tags

Great question! Let me cover all the table tags and explain how they fit together.

---

## The Full Set of HTML Table Tags

```html
<table>                     ← the whole table
  <caption>Parts List</caption>  ← optional title above the table

  <thead>                   ← groups the header rows
    <tr>                    ← one row
      <th>Part Number</th>  ← header cell (bold + centered by default)
      <th>Length</th>
    </tr>
  </thead>

  <tbody>                   ← groups the body rows (browser inserts this automatically)
    <tr>
      <td>14926</td>        ← data cell (normal text)
      <td>47</td>
    </tr>
    <tr>
      <td>773</td>
      <td>3.5</td>
    </tr>
  </tbody>

  <tfoot>                   ← groups the footer rows (optional)
    <tr>
      <td>Total</td>
      <td>50.5</td>
    </tr>
  </tfoot>

</table>
```

---

## What Each Tag Does

| Tag | Purpose | Default style |
|---|---|---|
| `<table>` | The container for the whole table | Block element |
| `<caption>` | Title/description shown above the table | Centered above |
| `<thead>` | Groups header rows — semantic only | None |
| `<tbody>` | Groups body rows — browser inserts automatically | None |
| `<tfoot>` | Groups footer rows (totals, summaries) | None |
| `<tr>` | One horizontal row | None |
| `<th>` | A **header** cell | **Bold + centered** |
| `<td>` | A **data** cell | Normal text, left-aligned |

---

## `<th>` vs `<td>` — The Key Difference

Both are cells inside a `<tr>`, but they carry different meaning:

```html
<tr>
  <th>Part Number</th>   ← header cell: describes what the column means
  <th>Length</th>
</tr>
<tr>
  <td>14926</td>         ← data cell: the actual value
  <td>47</td>
</tr>
```

Visually in the browser:

```
| Part Number | Length |    ← <th>: bold, centered
|-------------|--------|
| 14926       | 47     |    ← <td>: normal weight, left-aligned
| 773         | 3.5    |
```

`<th>` also has a `scope` attribute that helps screen readers understand the table structure:

```html
<th scope="col">Part Number</th>   ← this header describes a column
<th scope="row">Total</th>         ← this header describes a row
```

---

## Two Special `<td>`/`<th>` Attributes

### `colspan` — cell spans multiple columns
```html
<tr>
  <td colspan="2">Spans both columns</td>
</tr>
```
```
|   Spans both columns   |
|-------------|----------|
| 14926       | 47       |
```

### `rowspan` — cell spans multiple rows
```html
<tr>
  <td rowspan="2">Spans 2 rows</td>
  <td>47</td>
</tr>
<tr>
  <!-- no first cell here — it's covered by rowspan above -->
  <td>3.5</td>
</tr>
```
```
| Spans 2 rows | 47  |
|              | 3.5 |
```

---

## How the Browser DOM Represents It

This is important for your `TableTemplate.js` — notice how `table.rows`, `row.cells`, `thead`, and `tbody` all map to the tags:

```javascript
const table = document.getElementById("myTable");

table.rows          // ALL <tr> elements (across thead, tbody, tfoot)
table.tHead         // the <thead> element
table.tBodies[0]    // the first <tbody> element
table.tFoot         // the <tfoot> element

const row = table.rows[0];
row.cells           // all <td> and <th> in that row
row.cells[0].textContent  // text inside the first cell

// <th> and <td> are both just "cells" in the DOM —
// you access them the same way
```

---

## Why Your CS142 Tables Use `<td>` for Headers

In your project HTML, the header row uses `<td>` instead of `<th>`:

```html
<!-- Your project's tables use <td> everywhere, even the header -->
<tr>
  <td>{{PartNumber}}</td>   ← <td>, not <th>
  <td>{{Length}}</td>
</tr>
```

This is technically valid but not best practice. Using `<th>` in the header row would be more semantic and accessible. The `TableTemplate.js` code handles both correctly because `row.cells` returns both `<td>` and `<th>` elements — it doesn't distinguish between them.

---


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
- Not all attributes have to have values: `<select multiple>`
- Elements can overlap: `<p><b>first</p><p>second</b> third</p>`

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
