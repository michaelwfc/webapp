import React from "react";
import ReactAppView from "./components/ReactAppView";

// Old way (React 17 and below):
// import React from 'react';   // **ES6 Modules** — bring in React and web app React components
// import ReactDOM from 'react-dom';
// import ReactAppView from './components/ReactAppView';

// let viewTree = React.createElement(ReactAppView, null);
// let where = document.getElementById('reactapp');
// ReactDOM.render(viewTree, where); //Renders the tree of React elements into the browser's DOM at the `div` with `id="reactapp"`

// Modern React 18+ rendering
import ReactDOM from "react-dom/client"; // ← note: /client subpath
let appView = React.createElement(ReactAppView, null);
const app = document.getElementById("reactapp");
const root = ReactDOM.createRoot(app);
root.render(appView);

// import { createRoot } from "react-dom/client"; //In React 18+, createRoot is imported directly from react-dom/client, not from the main react-dom package.
// const root = createRoot(document.getElementById("reactapp"));
// root.render(
//   <React.StrictMode>
//     <ReactAppView />
//   </React.StrictMode>,
// );
