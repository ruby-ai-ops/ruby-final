// Tailwind base globals (preflight/theme/tokens/scrollbar; emits no utilities).
import "../../ui/css/global.css";
// Single unified Tailwind build: scans extension + front + ui/src in one
// pass. Replaces the old precompiled `@ruby-ai/ui/dist/ui.css` concat.
import "../../ui/css/components.css";
// Local custom styles (plain CSS; emits no utilities).
import "../../ui/css/custom.css";

import { initDatadogLogs } from "@app/logger/datadogLogger";
import logger from "@app/logger/logger";
import { datadogLogs } from "@datadog/browser-logs";
import { FrontApp } from "@extension/platforms/front/FrontApp";
import React from "react";
import ReactDOM from "react-dom/client";

if (process.env.DATADOG_CLIENT_TOKEN) {
  initDatadogLogs({
    clientToken: process.env.DATADOG_CLIENT_TOKEN,
    service: "ruby-front-extension",
    env: process.env.DATADOG_ENV,
    version: process.env.RUBY_EXTENSION_VERSION,
    forwardConsoleLogs: ["error"],
  });
  datadogLogs.setGlobalContext({
    extensionVersion: process.env.RUBY_EXTENSION_VERSION,
    commitHash: process.env.COMMIT_HASH,
  });
}

// Render the app.
const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <FrontApp />
      </React.StrictMode>
    );
  } catch (error) {
    logger.error({ err: error }, "Error rendering Ruby app.");
  }
} else {
  logger.error("Root element not found.");
}
