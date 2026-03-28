import React from "react";
import ReactAppView from "./App";

import ReactDOM from "react-dom/client"; // ← note: /client subpath

let appView = React.createElement(ReactAppView, null);
const app = document.getElementById("reactapp");
const root = ReactDOM.createRoot(app);

root.render(appView);
