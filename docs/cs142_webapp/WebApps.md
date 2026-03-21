# Building Web Applications
**CS142 Lecture Notes — Mendel Rosenblum**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Layout with Material-UI Grid](#layout-with-material-ui-grid)
3. [Material UI Components](#material-ui-components)
4. [Deep Linking with React Router](#deep-linking-with-react-router)
5. [Responsive Design](#responsive-design)
6. [Material UI Breakpoints](#material-ui-breakpoints)
7. [Material UI Responsive Support](#material-ui-responsive-support)
8. [Accessibility (ARIA)](#accessibility-aria)
9. [Internationalization (I18N)](#internationalization-i18n)
10. [Testing Web Apps](#testing-web-apps)
11. [Good Web App Design Principles](#good-web-app-design-principles)
12. [Guiding Design Principles](#guiding-design-principles)
13. [Consistency: Style Guides & Design Templates](#consistency-style-guides--design-templates)
14. [Style Guide Example: Material Design](#style-guide-example-material-design)
15. [Material Design Foundations](#material-design-foundations)
16. [Front-End Web Frameworks](#front-end-web-frameworks)
17. [Example: Photo App with Material Design](#example-photo-app-with-material-design)
18. [Material-UI Grid Layout Example](#material-ui-grid-layout-example)

---

## Introduction

**CS142 Lecture Notes - Building Web Applications**

This lecture covers the key principles and tools for building modern, well-structured web applications using React and Material-UI.

---

## Layout with Material-UI Grid

Use a grid to lay out your app structure:

```jsx
<Grid container spacing={8}>
  <Grid item xs={12}>
    <TopBar />
  </Grid>
  <Grid item xs={4}>
    <UserList ... />
  </Grid>
  <Grid item xs={8}>
    <UserDetail ... />
    {/* or */}
    <UserPhotos ... />
  </Grid>
</Grid>
```

---

## Material UI Components

Much useful functionality is available for your app:

- **Modals:** Menu, Popover, Dialogs, Selects, SnackBars
- **Navigation:** Tabs, Bottom Navigation, Drawers
- **Context Tracking:** AppBar, Stepper, Progress
- **Other:** Paper, Autocomplete, Tooltips, Badges

---

## Deep Linking with React Router

To support bookmarking and sharing, use **React Router** to load views.

The content div can be the React Router `Switch`:

```jsx
<Switch>
  <Route path="/users/:userId" component={UserDetail} />
  <Route path="/photos/:userId" component={UserPhotos} />
  <Route path="/users" component={UserList} />
</Switch>
```

The `UserList` sidebar can use links to navigate:

```jsx
<Link to="/photos/57231f1a30e4351f4e9f4bd8">
  Photos of User Ellen Ripley
</Link>
```

---

## Responsive Design

- Uses **CSS flexbox** — relative sizing handles changes (`flex` attribute)
- Grid with smaller widths will have smaller content areas
- Use **CSS breakpoints** to handle big layout differences

---

## Material UI Breakpoints

Material UI uses a simplified model based on screen width:

| Breakpoint | Size | Min Width |
|---|---|---|
| `xs` | extra-small | 0px or larger |
| `sm` | small | 600px or larger |
| `md` | medium | 960px or larger |
| `lg` | large | 1280px or larger |
| `xl` | extra-large | 1920px or larger |

---

## Material UI Responsive Support

### Grid Component

Grid takes `xs`/`sm`/`md`/`lg`/`xl` column properties:

```jsx
<Grid item xs={12} md={6} xl={3}> ...
```

### Hidden Component

Conditional rendering using `xsUp`, `lgDown`, etc.:

```jsx
<Hidden mdUp>
  <Paper>This is a paper component except on md and bigger display</Paper>
</Hidden>
```

### useMediaQuery Hook

React interface to CSS `@media` queries:

```jsx
const theme = useTheme();
const matches = useMediaQuery(theme.breakpoints.up('md'));
if (matches) { ... }
```

---

## Accessibility (ARIA)

**Accessible Rich Internet Applications (ARIA)**

- **Provide text alternatives** for any non-text content:
  ```html
  <a aria-label="Photo of user {{user.name}}" href=...>
  <img aria-label="{{photo.description}}">
  ```
- **Provide alternatives** for time-based media (transcripts, subtitles, etc.)
- Work properly when zoomed in
- Avoid quick timeouts
- Use **high contrast** for foreground/background
- Work with all keyboard and without keyboard
- Compatibility with **assistive technologies**
- Use simple sentences

---

## Internationalization (I18N)

Users want different: **text, dates, numbers, currencies, and graphics**.

Ultimately a level of indirection is needed. Consider: `<h1>Getting Started</h1>`

### Example: `react-i18next`

Look up translation by key:

```jsx
// Original:
Hello <strong title="this is your name">{name}</strong>, you have {count} unread message(s).

// With i18n:
<Trans i18nKey="userMessagesUnread" count={count}>
  Hello <strong title={t('nameTitle')}>{{name}}</strong>, you have {{count}}
  unread message.
</Trans>
```

> **Note:** Skip applying i18n to user-generated content.

---

## Testing Web Apps

### Unit Testing

- Each test targets a **particular component** and verifies it does what it claims
- Requires **mock components** for pieces that component interacts with
- Example: Load a React component and run tests against it
  - Need to mock everything these touch (model data fetches, services, etc.)

### End-to-End (E2E) Testing

- Run tests against the **real web application**
- Scripting interface into browser used to drive the web app
- Example: Fire up app in a browser and programmatically interact with it
  - **WebDriver** interface in browsers is useful for this

### Test Coverage Metric

> Does every line of code have a test?

---

## Good Web App Design Principles

Good web applications require both **Design + Implementation**.

### Design Goals

- **Intuitive to use** — Don't need to take a course or read a user manual
- **Accomplish task accurately and rapidly** — Provide needed information and functionality
- **Users like the experience** — Joy rather than pain when using the app

> The hardest part of good web applications is the **design**.
> Good user interface principles are encoded in toolkits and style guides.

---

## Guiding Design Principles

- **Be consistent** — Cognitive load less for the user
- **Provide context** — User shouldn't get lost in the app
- **Be fast** — Don't make the user wait

---

## Consistency: Style Guides & Design Templates

Web apps should have a **style guide** covering the look and feel:

- **Style** — Color schemes, animation, icons, images, typography, writing
- **User interactions** — Menu, buttons, pickers, dialog boxes, tables, lists, …
- **Layout** — Structure, toolbars, content, responsiveness

### Patterns

If you do something in multiple places, do it the **same way**:
- Aided by reusable implementation components
- Error handling, navigation, notifications, etc.

### Design Templates

Follow a familiar structure. Example: **Master-detail template**

---

## Style Guide Example: Material Design

**Material Design from Google** — Used in Google apps (e.g., Android, web apps):

- Influenced by publishing (paper and ink), enhanced with technology (3D look)
- Focus on traditional print issues: grids, space, typography, scale, color, imagery
- Heavy use of **animation** to convey action

### Dictates Many Aspects of Design

- Structure and layouts
- User interface
- Common patterns

---

## Material Design Foundations

| Foundation | Description |
|---|---|
| **Environment** | Surfaces (e.g. paper), depth, and shadows |
| **Layout** | Responsive layout grid, breakpoints, white space |
| **Navigation** | Changing views: Lateral, Forward, Backward |
| **Color** | Recommendations for colors that work well together |
| **Typography** | Recommendations for point size, weight, spacing |
| **Iconography** | Visual expressions (language independent) |
| **Shape** | Use different shapes to direct attention, identify, communicate |
| **Motion** | Show information (e.g. relationships), focus attention, fun |
| **Interaction** | Map touch to actions |
| **Communication** | Writing, formats, imagery, launch screen, onboarding |

---

## Front-End Web Frameworks

### Bootstrap (Popular Example)

- **CSS style sheets**
  - Design templates
  - Grid layout system with responsive support (breakpoints, etc.)
  - Element styling
- **HTML components** — Buttons, menus, toolbars, lists, tables, forms, etc.
- **JavaScript** — Modals, transitions, dropdowns, etc. (originally jQuery-based)

### Material-UI for React

- ReactJS has no opinion on UI; the popular choice is **Material-UI**
- CSS style sheets and components for implementing the **Material Design spec**

---

## Example: Photo App with Material Design

Use a **Master-Detail template** layout:

- Users → Photos → Comments

### Classic Layout

```
┌─────────────────────────────────┐
│        App Header               │
│      (app context)              │
├──────────────┬──────────────────┤
│  Side Nav    │                  │
│  User List   │     Content      │
│              │   User Detail    │
│              │ Photos+Comments  │
└──────────────┴──────────────────┘
```

---

## Material-UI Grid Layout Example

Full annotated example for the Photo App:

```jsx
<Grid container spacing={8}>
  <Grid item xs={12}>  {/* Top bar across the top (all 12 col on xsmall or bigger) */}
    <TopBar />
  </Grid>
  <Grid item xs={4}>  {/* Row with List (4 col) & either Detail or Photo (8 col) */}
    <UserList />
  </Grid>
  <Grid item sm={8}>
    <UserDetail ... />  {/* 8 columns wide */}
    {/* or */}
    <UserPhotos ... />  {/* 8 columns wide */}
  </Grid>
</Grid>
```

---

*CS142 Lecture Notes — Building Web Applications — Mendel Rosenblum*
