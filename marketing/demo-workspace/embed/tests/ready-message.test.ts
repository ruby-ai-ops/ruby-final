import { describe, expect, it, vi } from "vitest";
import {
  WORKSPACE_DEMO_READY_REQUEST,
  WORKSPACE_DEMO_READY_MESSAGE,
  notifyWorkspaceDemoReady,
  startWorkspaceDemoReadyHandshake,
} from "../src/ready-message";

describe("notifyWorkspaceDemoReady", () => {
  it("posts the readiness message only to the current origin", () => {
    const postMessage = vi.fn();

    notifyWorkspaceDemoReady({ postMessage });

    expect(postMessage).toHaveBeenCalledWith(
      { type: WORKSPACE_DEMO_READY_MESSAGE },
      window.location.origin
    );
  });

  it("responds to valid parent readiness requests", () => {
    const postMessage = vi
      .spyOn(window.parent, "postMessage")
      .mockImplementation(() => undefined);
    const stop = startWorkspaceDemoReadyHandshake();

    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: WORKSPACE_DEMO_READY_REQUEST },
        origin: window.location.origin,
        source: window.parent,
      })
    );

    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: WORKSPACE_DEMO_READY_MESSAGE },
      window.location.origin
    );
    stop();
  });
});
