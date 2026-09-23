import type { JSONSchema7 as JSONSchema } from "json-schema";
import { describe, expect, it } from "vitest";

import type { RubyAppRunInputType } from "./agent";
import {
  rubyAppRunInputsToInputSchema,
  inputSchemaToRubyAppRunInputs,
} from "./agent";

describe("Agent Type Utilities", () => {
  describe("rubyAppRunInputsToInputSchema", () => {
    it("should convert basic inputs to schema", () => {
      const inputs: RubyAppRunInputType[] = [
        {
          name: "query",
          type: "string",
          description: "Search query",
        },
        {
          name: "count",
          type: "number",
          description: "Number of results",
        },
      ];

      const expected: JSONSchema = {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query",
          },
          count: {
            type: "number",
            description: "Number of results",
          },
        },
        required: ["query", "count"],
      };

      expect(rubyAppRunInputsToInputSchema(inputs)).toEqual(expected);
    });

    it("should handle array type inputs", () => {
      const inputs: RubyAppRunInputType[] = [
        {
          name: "tags",
          type: "array",
          description: "List of tags",
          items: {
            type: "string",
          },
        },
      ];

      const expected: JSONSchema = {
        type: "object",
        properties: {
          tags: {
            type: "array",
            description: "List of tags",
            items: {
              type: "string",
            },
          },
        },
        required: ["tags"],
      };

      expect(rubyAppRunInputsToInputSchema(inputs)).toEqual(expected);
    });
  });

  describe("inputSchemaToRubyAppRunInputs", () => {
    it("should convert schema to basic inputs", () => {
      const schema: JSONSchema = {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query",
          },
          count: {
            type: "number",
            description: "Number of results",
          },
        },
        required: ["query", "count"],
      };

      const expected: RubyAppRunInputType[] = [
        {
          name: "query",
          type: "string",
          description: "Search query",
        },
        {
          name: "count",
          type: "number",
          description: "Number of results",
        },
      ];

      expect(inputSchemaToRubyAppRunInputs(schema)).toEqual(expected);
    });

    it("should handle array type properties", () => {
      const schema: JSONSchema = {
        type: "object",
        properties: {
          tags: {
            type: "array",
            description: "List of tags",
            items: {
              type: "string",
            },
          },
        },
        required: ["tags"],
      };

      const expected: RubyAppRunInputType[] = [
        {
          name: "tags",
          type: "array",
          description: "List of tags",
        },
      ];

      expect(inputSchemaToRubyAppRunInputs(schema)).toEqual(expected);
    });

    it("should handle missing properties", () => {
      const schema: JSONSchema = {
        type: "object",
        properties: {
          valid: {
            type: "string",
            description: "Valid property",
          },
          missingType: {
            description: "Missing type",
          },
        },
        required: ["valid", "missingType"],
      };

      const expected: RubyAppRunInputType[] = [
        {
          name: "valid",
          type: "string",
          description: "Valid property",
        },
        {
          name: "missingType",
          type: "string",
          description: "Missing type",
        },
      ];

      expect(inputSchemaToRubyAppRunInputs(schema)).toEqual(expected);
    });

    it("should handle empty properties object", () => {
      const schema: JSONSchema = {
        type: "object",
        properties: {},
        required: [],
      };

      expect(inputSchemaToRubyAppRunInputs(schema)).toEqual([]);
    });
  });
});
