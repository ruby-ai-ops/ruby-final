import type { APIError } from "../types";

export interface BaseErrorOptions {
  requestId?: string;
  statusCode?: number;
  cause?: Error;
}

export abstract class RubyError extends Error {
  abstract readonly code: string;
  readonly requestId?: string;
  readonly statusCode?: number;
  readonly cause?: Error;

  constructor(message: string, options?: BaseErrorOptions) {
    super(message);
    this.name = this.constructor.name;
    this.requestId = options?.requestId;
    this.statusCode = options?.statusCode;
    this.cause = options?.cause;

    // Remove constructor call from stack trace so error points to throw site
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  get isRetryable(): boolean {
    return false;
  }

  toString(): string {
    let str = `${this.name} [${this.code}]: ${this.message}`;
    if (this.statusCode) {
      str += ` (status: ${this.statusCode})`;
    }
    if (this.requestId) {
      str += ` (requestId: ${this.requestId})`;
    }
    return str;
  }
}

export class RubyAuthenticationError extends RubyError {
  readonly code = "authentication_error";
}

export class RubyRateLimitError extends RubyError {
  readonly code = "rate_limit_error";
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    options?: BaseErrorOptions & { retryAfterMs?: number }
  ) {
    super(message, options);
    this.retryAfterMs = options?.retryAfterMs;
  }

  override get isRetryable(): boolean {
    return true;
  }
}

export class RubyValidationError extends RubyError {
  readonly code = "validation_error";
  readonly field?: string;

  constructor(
    message: string,
    options?: BaseErrorOptions & { field?: string }
  ) {
    super(message, options);
    this.field = options?.field;
  }
}

export class RubyAgentError extends RubyError {
  readonly code = "agent_error";
  readonly agentId?: string;

  constructor(
    message: string,
    options?: BaseErrorOptions & { agentId?: string }
  ) {
    super(message, options);
    this.agentId = options?.agentId;
  }
}

export class RubyNetworkError extends RubyError {
  readonly code = "network_error";
  private readonly _isRetryable: boolean;

  constructor(
    message: string,
    options?: BaseErrorOptions & { isRetryable?: boolean }
  ) {
    super(message, options);
    this._isRetryable = options?.isRetryable ?? true;
  }

  override get isRetryable(): boolean {
    return this._isRetryable;
  }
}

export class RubyCancelledError extends RubyError {
  readonly code = "cancelled";

  constructor(message = "Operation cancelled") {
    super(message);
  }
}

export class RubyTimeoutError extends RubyError {
  readonly code = "timeout";
  readonly timeoutMs?: number;

  constructor(
    message: string,
    options?: BaseErrorOptions & { timeoutMs?: number }
  ) {
    super(message, options);
    this.timeoutMs = options?.timeoutMs;
  }

  override get isRetryable(): boolean {
    return true;
  }
}

export class RubyNotFoundError extends RubyError {
  readonly code = "not_found";
  readonly resourceType?: string;
  readonly resourceId?: string;

  constructor(
    message: string,
    options?: BaseErrorOptions & { resourceType?: string; resourceId?: string }
  ) {
    super(message, options);
    this.resourceType = options?.resourceType;
    this.resourceId = options?.resourceId;
  }
}

export class RubyPermissionError extends RubyError {
  readonly code = "permission_denied";
}

export class RubyServerError extends RubyError {
  readonly code = "server_error";

  override get isRetryable(): boolean {
    return true;
  }
}

export class RubyContentTooLargeError extends RubyError {
  readonly code = "content_too_large";
}

export class RubyUnknownError extends RubyError {
  readonly code = "unknown_error";
  readonly originalError?: APIError;

  constructor(
    message: string,
    options?: BaseErrorOptions & { originalError?: APIError }
  ) {
    super(message, options);
    this.originalError = options?.originalError;
  }
}

export type RubyErrorType =
  | RubyAuthenticationError
  | RubyRateLimitError
  | RubyValidationError
  | RubyAgentError
  | RubyNetworkError
  | RubyCancelledError
  | RubyTimeoutError
  | RubyNotFoundError
  | RubyPermissionError
  | RubyServerError
  | RubyContentTooLargeError
  | RubyUnknownError;

export type RubyErrorCode = RubyErrorType["code"];

const errorTypeMapping: Record<
  string,
  new (
    message: string,
    options?: BaseErrorOptions
  ) => RubyError
> = {
  not_authenticated: RubyAuthenticationError,
  invalid_api_key_error: RubyAuthenticationError,
  malformed_authorization_header_error: RubyAuthenticationError,
  workspace_auth_error: RubyAuthenticationError,
  rate_limit_error: RubyRateLimitError,
  invalid_request_error: RubyValidationError,
  invalid_pagination_parameters: RubyValidationError,
  missing_required_parameters: RubyValidationError,
  file_type_not_supported: RubyValidationError,
  conversation_not_found: RubyNotFoundError,
  agent_configuration_not_found: RubyNotFoundError,
  data_source_not_found: RubyNotFoundError,
  file_not_found: RubyNotFoundError,
  message_not_found: RubyNotFoundError,
  workspace_not_found: RubyNotFoundError,
  space_not_found: RubyNotFoundError,
  user_not_found: RubyNotFoundError,
  not_found: RubyNotFoundError,
  subscription_payment_failed: RubyPermissionError,
  plan_limit_error: RubyPermissionError,
  plan_message_limit_exceeded: RubyPermissionError,
  credits_exhausted: RubyPermissionError,
  user_cap_reached: RubyPermissionError,
  subscription_required: RubyPermissionError,
  workspace_can_use_product_required_error: RubyPermissionError,
  content_too_large: RubyContentTooLargeError,
  internal_server_error: RubyServerError,
  unexpected_network_error: RubyNetworkError,
};

const statusCodeMapping: Record<
  number,
  new (
    message: string,
    options?: BaseErrorOptions
  ) => RubyError
> = {
  401: RubyAuthenticationError,
  403: RubyPermissionError,
  404: RubyNotFoundError,
  408: RubyTimeoutError,
  413: RubyContentTooLargeError,
  429: RubyRateLimitError,
};

export function apiErrorToRubyError(
  apiError: APIError,
  statusCode?: number
): RubyError {
  const ErrorClass = errorTypeMapping[apiError.type];
  if (ErrorClass) {
    return new ErrorClass(apiError.message, { statusCode });
  }

  if (statusCode) {
    const StatusErrorClass = statusCodeMapping[statusCode];
    if (StatusErrorClass) {
      return new StatusErrorClass(apiError.message, { statusCode });
    }
    if (statusCode >= 500) {
      return new RubyServerError(apiError.message, { statusCode });
    }
  }

  return new RubyUnknownError(apiError.message, {
    statusCode,
    originalError: apiError,
  });
}

export function isRubyError(error: unknown): error is RubyError {
  return error instanceof RubyError;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof RubyError) {
    return error.isRetryable;
  }
  return false;
}
