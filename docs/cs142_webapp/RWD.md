# Responsive Web Design
*CS142 Lecture Notes — Mendel Rosenblum*

---

## 1. Web App Challenges: Screen Real Estate

Do we need to build N versions of each web application?

| Device | Resolution |
|--------|------------|
| Cell Phones (portrait) | 320×640 |
| Cell Phones (landscape) | 640×320 |
| Tablets (portrait) | 768×1024 |
| Tablets (landscape) | 1024×768 |
| Desktops | 1920×1028 |

### Real-World Screen Resolution Distribution (Apr 2018 — StatCounter)

| Resolution | Market Share |
|------------|-------------|
| 360×640    | 22.14%      |
| 1366×768   | 12.23%      |
| 1920×1080  | 8.96%       |
| 375×667    | 4.21%       |
| 1440×900   | 3.07%       |
| 720×1280   | 2.52%       |
| 1600×900   | 2.47%       |
| 1280×800   | 2.28%       |
| 768×1024   | 2.23%       |
| Other      | 30.24%+     |

> The top two resolutions (360×640 mobile and 1366×768 laptop) are circled as the dominant use cases.

---

## 2. Responsive Web Design

**Content is like water!**
The web app should flow into and fill whatever device you have.

Responsive Web Design is made possible with CSS extensions:

### Fluid Grid Layout
- Add a grid layout system with **relative** (e.g., `50%`) rather than **absolute** (e.g., `50pt`) measures
- Specify element packing into columns and rows

### Media Queries
- Add `@media` rules based on screen sizes
- Switch layout based on screen size

### Flexible Images & Video
- Make images and videos support relative sizes
- Autoscale to fit in screen region

```css
img   { width: 100%; height: auto; }
video { width: 100%; height: auto; }
```

---

## 3. Example of Responsive Web Layout

### Wide Screen (Tablet / Desktop)

```
+-------------+-------------+-------------+-------------+
| Menu #1-25% | Menu #2-25% | Menu #3-25% | Menu #4-25% |
+----------+--+---------------------------+-------------+
| Nav#1-25%|                                            |
| Nav#2-25%|       View component - 75%                 |
| Nav#3-25%|                                            |
+----------+--------------------------------------------+
|                   Footer - 100%                       |
+-------------------------------------------------------+
```

### Narrow Screen (Phone)

```
+---------------------------+
|    Menu #1 - 100%         |
+---------------------------+
|    Menu #2 - 100%         |
+---------------------------+
|    Menu #3 - 100%         |
+---------------------------+
|    Menu #4 - 100%         |
+---------------------------+
| Nav#1-25%|Nav#2-25%|Nav#3 |
+---------------------------+
|   View component - 100%   |
+---------------------------+
|      Footer - 100%        |
+---------------------------+
```

---

## 4. CSS Breakpoints

CSS `@media` rules let you switch layout based on the screen size:

```css
/* Tablets and desktop layout */
@media only screen and (min-width: 768px) {
  /* styles here */
}

/* Phones */
@media only screen and (max-width: 767px) {
  /* styles here */
}

/* Portrait phones */
@media only screen and (max-width: 767px) and (orientation: portrait) {
  /* styles here */
}
```

---

## 5. Responsive Implementation

### Key Principles

- **Build components to operate at different screen sizes and densities**
  - Use relative rather than absolute measurements
  - Specify sizes in device-independent units

- **Use CSS breakpoints to control layout and functionality**
  - Layout alternatives
  - App functionality conditional on available screen real estate

- **Mobile First** (popular approach)
  - Expand a good mobile design to use more real estate on larger screens
  - Start with the smallest viewport and progressively enhance
