export const WORKSPACE_DEMO_READY_MESSAGE = "workspace-demo:ready";
export const WORKSPACE_DEMO_READY_REQUEST = "workspace-demo:ping";

interface MessageTarget {
  postMessage(message: unknown, targetOrigin: string): void;
}

interface MessageReceiver {
  location: { origin: string };
  addEventListener(
    type: "message",
    listener: (event: MessageEvent) => void
  ): void;
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent) => void
  ): void;
}

export function notifyWorkspaceDemoReady(
  parentWindow: MessageTarget = window.parent,
  targetOrigin = window.location.origin
) {
  parentWindow.postMessage(
    { type: WORKSPACE_DEMO_READY_MESSAGE },
    targetOrigin
  );
}

export function startWorkspaceDemoReadyHandshake(
  childWindow: MessageReceiver = window,
  parentWindow: MessageTarget = window.parent
) {
  const handleMessage = (event: MessageEvent) => {
    if (
      event.origin !== childWindow.location.origin ||
      event.source !== parentWindow ||
      event.data?.type !== WORKSPACE_DEMO_READY_REQUEST
    ) {
      return;
    }
    notifyWorkspaceDemoReady(parentWindow, childWindow.location.origin);
  };

  childWindow.addEventListener("message", handleMessage);
  notifyWorkspaceDemoReady(parentWindow, childWindow.location.origin);
  return () => childWindow.removeEventListener("message", handleMessage);
}
