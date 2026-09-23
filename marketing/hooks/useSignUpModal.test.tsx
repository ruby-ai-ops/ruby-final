import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SignUpModalProvider, useSignUpModal } from "./useSignUpModal";

vi.mock("@marketing/lib/utils/utm", () => ({ appendUTMParams: (url: string) => url }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function SignupButton() {
  const { openSignUpModal } = useSignUpModal();
  return <button onClick={openSignUpModal}>Sign up</button>;
}

it("opens Ruby application signup directly without a regional choice", () => {
  const assign = vi.fn();
  const realWindow = window;
  vi.stubGlobal("window", new Proxy(realWindow, {
    get(target, property) {
      return property === "location" ? { assign } : Reflect.get(target, property, target);
    },
  }));
  render(<SignUpModalProvider><SignupButton /></SignUpModalProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
  expect(assign).toHaveBeenCalledWith("https://app.ruby.ad/api/workos/login?screenHint=sign-up");
});
