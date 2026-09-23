// Tailwind base globals
import "@ruby-ai/front/styles/global.css";
// Unified Tailwind build (ui + front + front-spa sources in one pass)
import "@spa/index.css";

import EmailApp from "@spa/email/EmailApp";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EmailApp />
  </React.StrictMode>
);
