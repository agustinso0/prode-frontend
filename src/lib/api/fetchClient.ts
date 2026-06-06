import { env } from '../env/env';
import { ApiResponseError, ApiTransportError } from './errors';

export type AccessTokenProvider = (
  signal: AbortSignal,
) => Promise<string | null> | string | null;

export interface ApiRequestOptions {
  auth?: boolean;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  json?: unknown;
  keepalive?: boolean;
  method?: string;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
  timeoutMs?: number;
}

export interface ApiClientOptions {
  baseUrl?: string;
  defaultTimeoutMs?: number;
  fetchImpl?: typeof fetch;
  getAccessToken?: AccessTokenProvider;
}

export interface ApiClient {
  request: <TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ) => Promise<TResponse>;
}

interface RequestSignalState {
  cleanup: () => void;
  signal: AbortSignal;
}

const defaultClientOptions = {
  baseUrl: env.VITE_PRODE_API_BASE_URL,
  defaultTimeoutMs: 15_000,
} satisfies Pick<ApiClientOptions, 'baseUrl' | 'defaultTimeoutMs'>;

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = options.baseUrl ?? defaultClientOptions.baseUrl;
  const defaultTimeoutMs =
    options.defaultTimeoutMs ?? defaultClientOptions.defaultTimeoutMs;
  const fetchImpl = options.fetchImpl ?? fetch;

  async function request<TResponse>(
    path: string,
    requestOptions: ApiRequestOptions = {},
  ): Promise<TResponse> {
    const {
      auth = true,
      cache,
      credentials,
      headers: requestHeaders,
      json,
      keepalive,
      method,
      mode,
      redirect,
      referrerPolicy,
      signal,
      timeoutMs,
    } = requestOptions;
    const timeout = timeoutMs ?? defaultTimeoutMs;
    const signalState = createRequestSignal(signal, timeout);
    const headers = new Headers(requestHeaders);
    const hasJson = json !== undefined;

    if (hasJson && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    try {
      const token = auth
        ? await resolveAccessToken(options.getAccessToken, signalState.signal)
        : null;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetchImpl(joinUrl(baseUrl, path), {
        body: hasJson ? JSON.stringify(json) : undefined,
        cache,
        credentials,
        headers,
        keepalive,
        method,
        mode,
        redirect,
        referrerPolicy,
        signal: signalState.signal,
      });
      const payload = await parseResponseBody(response);

      if (!response.ok) {
        throw new ApiResponseError(
          response.status,
          response.statusText,
          payload,
        );
      }

      return payload as TResponse;
    } catch (error) {
      if (error instanceof ApiResponseError) {
        throw error;
      }

      if (isAbortLikeError(error)) {
        throw error;
      }

      throw new ApiTransportError('API request failed before a response.', {
        cause: error,
      });
    } finally {
      signalState.cleanup();
    }
  }

  return { request };
}

export const apiClient = createApiClient();

async function resolveAccessToken(
  getAccessToken: AccessTokenProvider | undefined,
  signal: AbortSignal,
) {
  throwIfAborted(signal);

  if (!getAccessToken) {
    return null;
  }

  let cleanup: (() => void) | undefined;
  const abortPromise = new Promise<never>((_, reject) => {
    const abort = () => {
      reject(getAbortReason(signal));
    };
    signal.addEventListener('abort', abort, { once: true });
    cleanup = () => {
      signal.removeEventListener('abort', abort);
    };
  });

  try {
    return await Promise.race([
      Promise.resolve(getAccessToken(signal)),
      abortPromise,
    ]);
  } finally {
    cleanup?.();
  }
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw getAbortReason(signal);
  }
}

function getAbortReason(signal: AbortSignal) {
  if (signal.reason instanceof DOMException) {
    return signal.reason;
  }

  return new DOMException('Request was aborted.', 'AbortError');
}

function isAbortLikeError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === 'AbortError' || error.name === 'TimeoutError')
  );
}

function joinUrl(baseUrl: string, path: string) {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (baseUrl === '') {
    return normalizedPath;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}${normalizedPath}`;
}

function isAbsoluteUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function createRequestSignal(
  signal: AbortSignal | null | undefined,
  timeoutMs: number,
): RequestSignalState {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort(new DOMException('Request timed out.', 'TimeoutError'));
  }, timeoutMs);
  const abort = () => {
    controller.abort();
  };

  if (signal?.aborted) {
    abort();
  } else {
    signal?.addEventListener('abort', abort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup() {
      globalThis.clearTimeout(timeoutId);
      signal?.removeEventListener('abort', abort);
    },
  };
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (text === '') {
    return undefined;
  }

  const contentType = response.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as unknown;
    } catch (error) {
      throw new ApiTransportError('API response contained invalid JSON.', {
        cause: error,
      });
    }
  }

  return text;
}
