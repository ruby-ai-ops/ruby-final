import DemoWorkspace from "../../upstream/app/page";
import "../../upstream/app/globals.css";
import "../../upstream/app/artifacts/ledger/styles.css";
import "../../upstream/app/artifacts/harborview/styles.css";
import "../../upstream/app/artifacts/keyline/styles.css";
import "../../upstream/app/artifacts/cedarshield/styles.css";
import "../../upstream/app/artifacts/talentspring/styles.css";
import "../bundled-assets/fontawesome/css/all.min.css";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./embed.css";
import "./industry-widget-polish.css";
import "./industry-specialist-polish.css";
import { startWorkspaceDemoReadyHandshake } from "./ready-message";

function WorkspaceDemoApp() {
  useEffect(() => {
    return startWorkspaceDemoReadyHandshake();
  }, []);

  return <DemoWorkspace />;
}

const root = document.getElementById("workspace-demo-root");
if (!root) {
  throw new Error("Workspace demo root element is missing");
}

createRoot(root).render(<WorkspaceDemoApp />);
