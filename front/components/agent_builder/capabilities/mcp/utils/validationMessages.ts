/**
 * Field-specific validation error messages for better UX
 * Centralized message management for consistency across forms
 */
export const VALIDATION_MESSAGES = {
  childAgent: {
    required: "Child agent selection is required",
    invalid: "Please select a valid child agent",
  },
  rubyApp: {
    required: "Please select a Ruby app",
    invalid: "Selected Ruby app is not valid",
  },
  name: {
    empty: "The name cannot be empty.",
    format:
      "The name can only contain lowercase letters, numbers, and underscores (no spaces).",
  },
  description: {
    required: "Description is required",
    tooLong: "Description too long",
  },
  secret: {
    required: "Secret selection is required",
    invalid: "Please select a valid secret",
  },
  rubyProject: {
    required: "Please select one Pod",
    invalid: "Selected Pod is not valid",
  },
} as const;
