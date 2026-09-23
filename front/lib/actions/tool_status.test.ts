import { extractArgRequiringApprovalValues } from "@app/lib/actions/tool_status";
import { describe, expect, it } from "vitest";

describe("extractArgRequiringApprovalValues", () => {
  it("keeps existing behavior for primitive and single-element array values", () => {
    const values = extractArgRequiringApprovalValues(
      ["recipient", "retries", "dryRun", "email"],
      {
        recipient: "team@ruby.ad",
        retries: 3,
        dryRun: false,
        email: ["adrien@ruby.ad"],
      }
    );

    expect(values).toEqual({
      recipient: "team@ruby.ad",
      retries: "3",
      dryRun: "false",
      email: "adrien@ruby.ad",
    });
  });

  it("serializes multi-element arrays", () => {
    const values = extractArgRequiringApprovalValues(["emails", "ids"], {
      emails: ["first@ruby.ad", "second@ruby.ad"],
      ids: [2, 1],
    });

    expect(values).toEqual({
      emails: '["first@ruby.ad","second@ruby.ad"]',
      ids: "[2,1]",
    });
  });

  it("serializes objects with stable key ordering, including nested objects", () => {
    const values = extractArgRequiringApprovalValues(["payload"], {
      payload: {
        z: 1,
        nested: {
          b: "two",
          a: "one",
        },
        a: true,
      },
    });

    expect(values).toEqual({
      payload: '{"a":true,"nested":{"a":"one","b":"two"},"z":1}',
    });
  });

  it("returns identical strings for equivalent objects with different key order", () => {
    const first = extractArgRequiringApprovalValues(["payload"], {
      payload: {
        z: 1,
        nested: {
          c: [3, 2, 1],
          b: "two",
          a: "one",
        },
        a: true,
      },
    });

    const second = extractArgRequiringApprovalValues(["payload"], {
      payload: {
        a: true,
        nested: {
          a: "one",
          c: [3, 2, 1],
          b: "two",
        },
        z: 1,
      },
    });

    expect(first.payload).toEqual(second.payload);
  });
});
