export type ApiErrorPayload = unknown;

export class ApiTransportError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ApiTransportError';
  }
}

export class ApiResponseError extends Error {
  readonly payload: ApiErrorPayload;
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, payload: ApiErrorPayload) {
    super(statusText || `API request failed with status ${String(status)}`);
    this.name = 'ApiResponseError';
    this.payload = payload;
    this.status = status;
    this.statusText = statusText;
  }
}

export class ApiValidationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ApiValidationError';
  }
}
