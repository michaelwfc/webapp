# create a good prompt to build a html tutorial based on markdown/PDF file

```
You are an expert technical writer and frontend developer. Convert the following 
PDF lecture notes into Markdown and a beautiful, self-contained HTML tutorial page.

This is for junior developers who know JavaScript but are new to Web appliaction development and backend concepts

## Content goals
- Transform the raw notes into flowing, readable prose — no bullet dumps
- Explain the "why" behind every concept, not just the "what"
- Use analogies to make abstract ideas concrete
- When introducing a term for the first time, define it immediately in plain language
- End each major section with a "Key Takeaway" callout block
- End the page with a Summary section recapping the 3–5 most important points
- Do not write the Summary section until all other sections are complete

## HTML structure
- One self-contained .html file — all CSS and JS inline, no external dependencies
  except Google Fonts
- A sticky top navigation bar with anchor links to each section
- A hero header with the tutorial title and a one-paragraph introduction
- Sections use <section id="..."> so anchor links work
- Each section has a small eyebrow label (e.g. "Section 01"), an h2 heading,
  and prose paragraphs

## Code blocks
- Wrap every code example in a styled <pre><code> block with a dark background
- Add a small label above each block (e.g. "Setting up express-session")
- After each block, write 1–2 sentences in italic explaining what the code does
- Use <span> classes for syntax highlighting: .kw (keywords), .str (strings),
  .fn (functions), .cmt (comments)

## Design requirements
- Use a deep teal (#1e8a6e) as the accent color
- Light background, dark ink — clean editorial feel
- A distinctive display font from Google Fonts for headings (not Inter or Roboto)
- A serif or high-quality sans body font for readable prose
- A monospace font (e.g. JetBrains Mono) for all code
- One strong accent color used consistently for labels, highlights, and borders
- Key Takeaway blocks styled as a left-bordered blockquote with a background tint
- Fully responsive down to mobile (max-width: 600px)
- No frameworks, no external CSS libraries — pure HTML/CSS/JS only

## Source material
[PASTE YOUR MARKDOWN HERE]
```



# Build a makrdown tutorial prompt
```
You are an expert technical writer and educator. Convert the following lecture 

slides/notes into a comprehensive, well-structured makrdown tutorial.

## Your goals

- Transform raw slide content into flowing, readable prose

- Make concepts accessible to someone encountering them for the first time

- Preserve all technical accuracy from the source material

## Structure requirements

- Start with a brief intro paragraph explaining what this tutorial covers and why it matters

- Use ## for major sections, ### for subsections

- End each major section with a "Key Takeaway" callout using a blockquote (>)

- End the whole tutorial with a ## Summary section that recaps the 3–5 most important points

## Writing style

- Write in clear, direct prose — no bullet dumps

- Explain the "why" behind every concept, not just the "what"

- Use analogies to make abstract ideas concrete (e.g. cookies as ticket stubs)

- When introducing a term for the first time, define it immediately in plain language

## Code blocks

- Include all code examples from the source, properly fenced with the language tag

- Add a one-line comment at the top of each block explaining what it demonstrates

- After each code block, write 1–2 sentences explaining what the code does

## Source material

[PASTE YOUR SLIDE TEXT OR NOTES HERE]

```