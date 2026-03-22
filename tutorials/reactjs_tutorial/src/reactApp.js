import React from "react";
import { createRoot } from "react-dom/client"; //In React 18+, createRoot is imported directly from react-dom/client, not from the main react-dom package.
import ReactAppView from "./components/ReactAppView";

// let viewTree = React.createElement(ReactAppView, null);
// let where = document.getElementById("reactapp");
// // Rendering into the DOM
// ReactDOM.render(viewTree, where);

// Modern React 18+ rendering
const root = createRoot(document.getElementById("reactapp"));
root.render(
  <React.StrictMode>
    <ReactAppView />
  </React.StrictMode>,
);
