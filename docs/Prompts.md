# create a good prompt to build a html tutorial based on markdown/PDF file

```
You are an expert technical writer and frontend developer.
First, Convert the following PDF into a comprehensive, well-structured ,beautiful, self-contained HTML tutorial page.
Then, convert HTML tutorial page into markdown.

This is for junior developers who know JavaScript but are new to Web appliaction development and backend concepts


## Content goals
- Start with a brief intro paragraph explaining what this tutorial covers and why it matters
- Preserve all technical accuracy from the source material
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
- Start with a brief intro paragraph explaining what this section covers and why it matters


## Writing style

- Write in clear, direct prose ，Transform the raw notes into flowing, readable prose — no bullet dumps
- Explain the "why" behind every concept, not just the "what"
- Use analogies to make abstract ideas concrete (e.g. cookies as ticket stubs)
- When introducing a term for the first time, define it immediately in plain language


## Code blocks
- Include all code examples from the source, properly fenced with the language tag
- Add a small label above each block (e.g. "Setting up express-session")
- After each block, write 1–2 sentences in itatic explaining what the code does
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
