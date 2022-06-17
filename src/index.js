import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "jspreadsheet-alpha/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
