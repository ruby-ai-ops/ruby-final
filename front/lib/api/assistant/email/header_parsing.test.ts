import {
  extractEmailAddressesFromHeader,
  extractSingleEmailAddressFromHeader,
  parseHeaderValue,
} from "@app/lib/api/assistant/email/header_parsing";
import { describe, expect, it } from "vitest";

describe("extractEmailAddressesFromHeader", () => {
  it("ignores malformed angle-bracket content that only partially looks like an email", () => {
    expect(
      extractEmailAddressesFromHeader(
        "Sender <mailto:sender@ruby.ad>, sender@ruby.ad"
      )
    ).toEqual(["sender@ruby.ad"]);
  });

  it("does not recover a mailbox from an unmatched opening angle bracket", () => {
    expect(extractEmailAddressesFromHeader("Sender <sender@ruby.ad")).toEqual(
      []
    );
  });
});

describe("extractSingleEmailAddressFromHeader", () => {
  it("extracts the single mailbox from a From header", () => {
    const result = extractSingleEmailAddressFromHeader(
      "From",
      "Sender Name <Sender@ruby.ad>"
    );

    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      throw result.error;
    }

    expect(result.value).toBe("sender@ruby.ad");
  });

  it("accepts punycode domains inside angle brackets", () => {
    const result = extractSingleEmailAddressFromHeader(
      "From",
      "Sender Name <sender@xn--e1afmkfd.xn--p1ai>"
    );

    expect(result.isOk()).toBe(true);
    if (result.isErr()) {
      throw result.error;
    }

    expect(result.value).toBe("sender@xn--e1afmkfd.xn--p1ai");
  });

  it("rejects a From header with multiple mailboxes", () => {
    const result = extractSingleEmailAddressFromHeader(
      "From",
      "Sender <sender@ruby.ad>, Other <other@ruby.ad>"
    );

    expect(result.isErr()).toBe(true);
    if (result.isOk()) {
      throw new Error("Expected multiple From mailboxes to be rejected");
    }

    expect(result.error.message).toBe(
      "Expected exactly one mailbox in From header"
    );
  });
});

describe("parseHeaderValue", () => {
  it("unfolds folded header values", () => {
    const rawHeaders = [
      "From: Sender Name",
      " <sender@ruby.ad>",
      "To: agent@ruby.team",
    ].join("\r\n");

    expect(parseHeaderValue(rawHeaders, "From")).toBe(
      "Sender Name <sender@ruby.ad>"
    );
  });
});
