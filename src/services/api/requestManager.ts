/**
 * Request Manager
 * - Deduplicates in-flight requests
 * - Limits backend concurrency
 * - Supports cancellation
 * - React StrictMode safe
 */

interface PendingRequest {
  promise: Promise<{ buffer: ArrayBuffer; init: ResponseInit }>;
  abortController: AbortController;
}

const pendingRequests = new Map<string, PendingRequest>();

let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 50;

type QueuedRequest = {
  key: string;
  run: () => Promise<{ buffer: ArrayBuffer; init: ResponseInit }>;
  resolve: (res: { buffer: ArrayBuffer; init: ResponseInit }) => void;
  reject: (err: unknown) => void;
};

const requestQueue: QueuedRequest[] = [];

function safeStringify(input: unknown) {
  try {
    return JSON.stringify(input);
  } catch {
    return "[unstringifiable]";
  }
}

function getRequestKey(method: string, url: string, body?: unknown): string {
  return `${method}:${url}:${body ? safeStringify(body) : ""}`;
}

function processQueue() {
  while (activeRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length) {
    const queued = requestQueue.shift();
    if (!queued) return;

    activeRequests++;

    queued
      .run()
      .then(queued.resolve)
      .catch(queued.reject)
      .finally(() => {
        activeRequests--;
        processQueue();
      });
  }
}

function replayResponse(payload: { buffer: ArrayBuffer; init: ResponseInit }) {
  return new Response(payload.buffer.slice(0), payload.init);
}

export function makeManagedRequest(
  method: string,
  url: string,
  body?: unknown,
  headers: Record<string, string> = {},
  abortController?: AbortController
): Promise<Response> {
  const key = getRequestKey(method, url, body);

  const existing = pendingRequests.get(key);
  if (existing) {
    // if (import.meta.env.DEV) console.log(`[RequestManager] Deduplicated: ${method} ${url}`);
    return existing.promise.then(replayResponse);
  }

  const controller = abortController ?? new AbortController();

  const managedPromise = new Promise<{ buffer: ArrayBuffer; init: ResponseInit }>((resolve, reject) => {
    const run = async () => {
      const isFormData = body instanceof FormData;

      try {
        const res = await fetch(url, {
          method,
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
          },
          body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
          signal: controller.signal,
        });

        const buffer = await res.arrayBuffer();

        const init: ResponseInit = {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers, // Headers object is allowed here
        };

        return { buffer, init };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          throw new Error("Request cancelled");
        }
        throw err;
      }
    };

    const queued: QueuedRequest = { key, run, resolve, reject };
    requestQueue.push(queued);
    processQueue();

    // If aborted before it starts, remove from queue and reject early
    const onAbort = () => {
      pendingRequests.delete(key);
      const idx = requestQueue.findIndex(q => q.key === key);
      if (idx !== -1) requestQueue.splice(idx, 1);
      reject(new Error("Request cancelled"));
      if (import.meta.env.DEV) console.log(`[RequestManager] Cancelled: ${method} ${url}`);
    };

    controller.signal.addEventListener("abort", onAbort, { once: true });
  })
    .finally(() => {
      // ✅ delete only once, after the promise fully settles
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, { promise: managedPromise, abortController: controller });

  return managedPromise.then(replayResponse);
}

export function cancelAllRequests() {
  pendingRequests.forEach(req => req.abortController.abort());
  pendingRequests.clear();
  requestQueue.length = 0;
  activeRequests = 0;
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
