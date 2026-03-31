# AGENTS.md - CS142 Project 5: Single Page Applications

## Project Overview

This is a React-based single page application project using Material-UI (MUI), Express.js backend, and Webpack for bundling. The project implements a photo sharing application with routing, component-based architecture, and a REST API backend.

## Build/Lint/Test Commands

```bash
# Build the application (development mode with source maps)
npm run build

# Build with file watching for development
npm run build:w

# Run the web server (backend on port 3000)
node webServer.js

# Run linting
npm run lint
```

**Note:** There are no test scripts configured in this project. Linting uses ESLint with Airbnb configuration.

## Code Style Guidelines

### General Conventions

- **Language:** JavaScript (ES6+) with JSX syntax
- **React Version:** 17.x
- **UI Framework:** Material-UI (MUI) v5
- **Backend:** Express.js
- **Module System:** CommonJS for backend (`require`), ES6 modules (`import/export`) for frontend

### File Naming and Structure

| Type | Convention | Example |
|------|------------|---------|
| Components | `index.jsx` in named folder | `components/UserList/index.jsx` |
| Styles | `styles.css` in component folder | `components/UserList/styles.css` |
| Main styles | `styles/main.css` | Global styles with `cs142-main-` prefix |
| Entry point | `photoShare.jsx` | Main React application |
| Server | `webServer.js` | Express backend server |

### Import Conventions

```javascript
// React core imports first
import React from "react";

// Third-party imports (MUI, React Router)
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";

// Local imports (relative paths)
import "./styles/main.css";
import TopBar from "./components/TopBar";
```

### React Component Patterns

**Class Components (preferred in this codebase):**
```javascript
class UserList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/* JSX here */}
      </div>
    );
  }
}

export default UserList;
```

**Functional Components (also acceptable):**
```javascript
function TopBar() {
  return <div>...</div>;
}

export default TopBar;
```

### JSX/HTML Guidelines

- Use `className` instead of `class` for CSS classes
- Use `htmlFor` instead of `for` for label elements
- Self-close tags when no children: `<Component />`
- Use double quotes for JSX attributes: `<div className="my-class">`
- MUI Grid uses `spacing` prop (not `gap`) with container

### CSS Conventions

- Prefix global CSS classes with `cs142-` to avoid namespace collisions
- Component-specific styles in `styles.css` files within component folders
- Use `calc()` for responsive sizing: `height: calc(100vh - 85px)`

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `UserDetail`, `TopBar` |
| Functions | camelCase | `fetchModel`, `handleClick` |
| CSS classes | kebab-case | `cs142-main-grid-item` |
| Constants | UPPER_SNAKE_CASE | `portno = 3000` |
| Variables | camelCase | `userId`, `photoList` |

### Express.js Backend Patterns

```javascript
// Route handler pattern
app.get("/user/:id", function (request, response) {
  const id = request.params.id;
  const user = cs142models.userModel(id);
  if (user === null) {
    response.status(400).send("Not found");
    return;
  }
  response.status(200).send(user);
});
```

- Use explicit status codes (200, 400, 500)
- Always return after sending error responses
- Use `console.log` for general logging, `console.error` for errors
- JSDoc comments for route handlers

### State Management

- Use React class component state (`this.state`, `this.setState`)
- For async data fetching, consider lifecycle methods (`componentDidMount`)
- Avoid direct state mutation; always use `setState`

### Error Handling

- Use `try/catch` blocks for async operations
- Express routes should check for null/undefined and return appropriate status codes
- Use Promises with `.then()`/`.catch()` or async/await patterns

### ESLint Configuration

The project uses ESLint with Airbnb rules but relaxed formatting rules:
- Indentation, quotes, semicolons: **not enforced** (project doesn't enforce)
- Console logging: **allowed** (`no-console: 0`)
- Prop types: **not enforced** (`react/prop-types: "off"`)
- Max line length: **not enforced** (`max-len: "off"`)
- Most spacing/formatting rules are **disabled**

**Key rules enforced:**
- No `with` statements
- Empty catch blocks must exist (`no-empty: ["error", { "allowEmptyCatch": true }]`)
- No constant conditions in loops

### MUI (Material-UI) Usage

```javascript
import { Grid, Typography, Paper, Button } from "@mui/material";

// Grid layout
<Grid container spacing={2}>
  <Grid item xs={12} sm={3}>
    <Paper>Content</Paper>
  </Grid>
</Grid>

// Typography variants
<Typography variant="h6">Heading</Typography>
<Typography variant="body1">Body text</Typography>
```

### Routing (React Router v5)

```javascript
import { HashRouter, Route, Switch } from "react-router-dom";

<HashRouter>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/users/:userId" component={UserDetail} />
    <Route path="/photos/:userId" render={(props) => <UserPhotos {...props} />} />
  </Switch>
</HashRouter>
```

**Note:** Use `HashRouter` (not `BrowserRouter`) for static file server deployment.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/list` | GET | Returns all users |
| `/user/:id` | GET | Returns single user |
| `/photosOfUser/:id` | GET | Returns user's photos |

### Development Workflow

1. Edit source files in `components/`, `photoShare.jsx`, `webServer.js`
2. Run `npm run build:w` to auto-rebuild on changes
3. Run `node webServer.js` to start backend
4. Access app at `http://localhost:3000`
5. Run `npm run lint` to check code style

### Troubleshooting

- **Changes not appearing:** Rebuild with `npm run build`
- **Module resolution issues:** Check `webpack.config.js` extensions
- **CORS issues:** Backend serves static files from same origin
