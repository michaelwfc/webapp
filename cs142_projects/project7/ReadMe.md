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


## Development Workflow

### 1. Start the MongoDB instance and load data

```bash
mongod
```

load the data
```bash
node loadDatabase.js
```


```bash
mongsh

show dbs

```

### 2. Build the application

Run `npm run build:w` to auto-rebuild on changes


### 3. Run the application Web Server and UI

1. Edit source files in `components/`, `photoShare.jsx`, `webServer.js`
2. Run `node webServer.js` to start backend
3. Access app at `http://localhost:3000`

### 4. Debug

To debug the application, you can use the following command:

### 5. Test

### 6. Lint

Run `npm run lint` to check code style


