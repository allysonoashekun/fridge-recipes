/** Calls our own API and throws an Error with a displayable message on failure. */
export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error("Couldn't reach the server. Check your connection.");
  }

  if (response.status === 401) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- lib code has no router
    window.location.assign("/login");
    throw new Error("Please sign in again.");
  }

  // Platform errors such as a timeout or body limit may not be JSON.
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? "Something went wrong. Try again.");
  }
  return body as T;
}

export function jsonRequest(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
