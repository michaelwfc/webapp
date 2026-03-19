import React from "react";
import ReactDOM from "react-dom";
import ReactAppView from "./components/ReactAppView";

let viewTree = React.createElement(ReactAppView, null);
let where = document.getElementById("reactapp");
// Rendering into the DOM
ReactDOM.render(viewTree, where);
