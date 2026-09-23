// Tailwind base globals
import "@ruby-ai/front/styles/global.css";
// Unified Tailwind build (ui + front + front-spa sources in one pass)
import "@spa/index.css";

import OAuthApp from "@spa/oauth/OAuthApp";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OAuthApp />
  </React.StrictMode>
);
