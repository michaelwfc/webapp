import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; //React’s library to talk to web browsers (React DOM)
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
